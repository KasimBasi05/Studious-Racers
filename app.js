// ==============================================================================
// DIECAST HUB - APP STATE & DATA STORE (app.js)
// ==============================================================================
import { CATEGORIES_DATA, PRODUCTS_50 } from './productsData.js';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = "https://koizjeljlsrylhrevxrh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_he0QwnJLlURkF3PajlFEpA_VFuf5Apk";

export let supabase = null;
try {
  if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn("Supabase init fallback to local state mode", e);
}

// --- GLOBAL STORE MANAGEMENT ---
export class Store {
  constructor() {
    // Check if stored products is empty or needs refresh to 50 items
    const storedProds = JSON.parse(localStorage.getItem('diecast_products_v2'));
    this.products = (storedProds && storedProds.length >= 20) ? storedProds : PRODUCTS_50;
    this.categories = JSON.parse(localStorage.getItem('diecast_categories_v2')) || CATEGORIES_DATA;
    this.cart = JSON.parse(localStorage.getItem('diecast_cart')) || [];
    this.wishlist = JSON.parse(localStorage.getItem('diecast_wishlist')) || [];
    this.user = JSON.parse(localStorage.getItem('diecast_user')) || {
      id: 'u1',
      full_name: 'Collector User',
      email: 'collector@diecasthub.com',
      role: 'customer',
      phone: '+91 9876543210',
      address: '42 Speed Way, Sector 5',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postal_code: '600001',
      country: 'India',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    };
    this.orders = JSON.parse(localStorage.getItem('diecast_orders')) || [
      {
        id: 'ord-1001',
        order_number: 'HW-2026-0001',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        total_amount: 438,
        subtotal: 398,
        delivery_charge: 40,
        discount: 0,
        order_status: 'Shipped',
        payment_method: 'UPI / Card (Simulated)',
        items: [
          { product_id: 'a1111111-1111-1111-1111-111111111111', product_name: 'Hot Wheels Nissan Skyline GT-R (R34)', product_price: 199, quantity: 2, subtotal: 398 }
        ],
        shipping_name: 'Collector User',
        shipping_phone: '+91 9876543210',
        shipping_address: '42 Speed Way, Sector 5',
        shipping_city: 'Chennai',
        shipping_state: 'Tamil Nadu',
        shipping_postal_code: '600001',
        shipping_country: 'India'
      }
    ];
    this.currentView = 'home';
    this.currentProductId = null;
    this.searchQuery = '';
    this.activeCategoryFilter = 'all';
    this.sortBy = 'featured';
    this.toastMessage = null;

    this.save();
    this.initSupabaseSync();
  }

  save() {
    localStorage.setItem('diecast_products_v2', JSON.stringify(this.products));
    localStorage.setItem('diecast_categories_v2', JSON.stringify(this.categories));
    localStorage.setItem('diecast_cart', JSON.stringify(this.cart));
    localStorage.setItem('diecast_wishlist', JSON.stringify(this.wishlist));
    localStorage.setItem('diecast_user', JSON.stringify(this.user));
    localStorage.setItem('diecast_orders', JSON.stringify(this.orders));
    if (window.renderApp) window.renderApp();
  }

  async initSupabaseSync() {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) this.user = profile;
      }
      const { data: dbProducts } = await supabase.from('products').select('*');
      if (dbProducts && dbProducts.length > 5) {
        this.products = dbProducts;
      }
      const { data: dbCategories } = await supabase.from('categories').select('*');
      if (dbCategories && dbCategories.length > 0) {
        this.categories = dbCategories;
      }
      if (window.renderApp) window.renderApp();
    } catch (err) {
      console.warn("Supabase fetch sync notice, using active state", err);
    }
  }

  showToast(msg, type = 'success') {
    this.toastMessage = { text: msg, type };
    if (window.renderApp) window.renderApp();
    setTimeout(() => {
      this.toastMessage = null;
      if (window.renderApp) window.renderApp();
    }, 3000);
  }

  addToCart(productId, qty = 1) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;
    if (product.stock_quantity < qty) {
      this.showToast(`Sorry, only ${product.stock_quantity} units in stock!`, 'error');
      return;
    }
    const existing = this.cart.find(item => item.product_id === productId);
    if (existing) {
      if (existing.quantity + qty > product.stock_quantity) {
        this.showToast(`Cannot add more than available stock (${product.stock_quantity})`, 'error');
        return;
      }
      existing.quantity += qty;
    } else {
      this.cart.push({ product_id: productId, quantity: qty });
    }
    this.showToast(`Added "${product.name}" to Cart!`);
    this.save();
  }

  updateCartQty(productId, delta) {
    const item = this.cart.find(i => i.product_id === productId);
    const product = this.products.find(p => p.id === productId);
    if (!item || !product) return;
    
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      this.cart = this.cart.filter(i => i.product_id !== productId);
    } else if (newQty > product.stock_quantity) {
      this.showToast(`Max stock reached (${product.stock_quantity})`, 'error');
      return;
    } else {
      item.quantity = newQty;
    }
    this.save();
  }

  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    const product = this.products.find(p => p.id === productId);
    if (idx >= 0) {
      this.wishlist.splice(idx, 1);
      this.showToast(`Removed from wishlist`);
    } else {
      this.wishlist.push(productId);
      this.showToast(`Added "${product?.name}" to Wishlist!`);
    }
    this.save();
  }

  async placeOrder(formData) {
    if (this.cart.length === 0) return;
    
    let subtotal = 0;
    const items = this.cart.map(c => {
      const p = this.products.find(prod => prod.id === c.product_id);
      const itemSub = p.price * c.quantity;
      subtotal += itemSub;
      p.stock_quantity = Math.max(0, p.stock_quantity - c.quantity);
      return {
        product_id: p.id,
        product_name: p.name,
        product_price: p.price,
        quantity: c.quantity,
        subtotal: itemSub
      };
    });

    const delivery_charge = subtotal > 999 ? 0 : 50;
    const total_amount = subtotal + delivery_charge;
    const order_number = 'HW-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));

    const newOrder = {
      id: 'ord-' + Date.now(),
      user_id: this.user ? this.user.id : null,
      order_number,
      subtotal,
      discount: 0,
      delivery_charge,
      total_amount,
      payment_method: formData.payment_method || 'UPI / Credit Card (Simulated)',
      payment_status: 'Paid',
      order_status: 'Processing',
      shipping_name: formData.full_name,
      shipping_phone: formData.phone,
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_state: formData.state,
      shipping_postal_code: formData.postal_code,
      shipping_country: formData.country || 'India',
      created_at: new Date().toISOString(),
      items
    };

    if (supabase && this.user?.id) {
      try {
        const { data: dbOrd } = await supabase.from('orders').insert({
          user_id: this.user.id,
          order_number,
          subtotal,
          discount: 0,
          delivery_charge,
          total_amount,
          payment_method: newOrder.payment_method,
          shipping_name: formData.full_name,
          shipping_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_state: formData.state,
          shipping_postal_code: formData.postal_code,
          shipping_country: formData.country || 'India'
        }).select().single();

        if (dbOrd) {
          const orderItemsPayload = items.map(it => ({ ...it, order_id: dbOrd.id }));
          await supabase.from('order_items').insert(orderItemsPayload);
        }
      } catch(e) { console.warn("Supabase Order save notice", e); }
    }

    this.orders.unshift(newOrder);
    this.cart = [];
    if (window.confetti) window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    this.showToast(`Order #${order_number} placed successfully!`);
    this.currentView = 'orders';
    this.save();
  }

  saveProduct(prodData) {
    if (prodData.id) {
      const index = this.products.findIndex(p => p.id === prodData.id);
      if (index >= 0) this.products[index] = { ...this.products[index], ...prodData };
    } else {
      const newP = {
        ...prodData,
        id: 'a-' + Date.now(),
        slug: prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        rating: 5.0,
        reviews_count: 1,
        is_active: true,
        is_featured: false,
        is_new: true,
        is_bestseller: false
      };
      this.products.unshift(newP);
    }
    this.showToast('Product saved successfully!');
    this.save();
  }

  deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.products = this.products.filter(p => p.id !== productId);
      this.showToast('Product deleted');
      this.save();
    }
  }

  updateOrderStatus(orderId, newStatus) {
    const ord = this.orders.find(o => o.id === orderId);
    if (ord) {
      ord.order_status = newStatus;
      this.showToast(`Order status updated to ${newStatus}`);
      this.save();
    }
  }
}

export const store = new Store();
window.store = store;
