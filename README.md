DieCast Hub - E-Commerce Web Application Technical Documentation & Architecture Report
1. Project Overview
DieCast Hub is a premier, full-featured e-commerce web application specifically crafted for Hot Wheels and die-cast vehicle collectors, hobbyists, and toy enthusiasts. Built with a modern responsive frontend architecture and backed by Supabase PostgreSQL, it delivers seamless catalog browsing, advanced faceted filtering, real-time stock deduction, wishlist management, cart operations, mock payment checkout, user order history, and an authorized Admin Control Panel.

2. Technology Stack
Frontend Core: HTML5, Vanilla JavaScript (ES Modules), Google Fonts (Outfit).
Styling: Tailwind CSS (v3 CDN integration with custom dark-mode brand theme and dynamic glassmorphism).
Iconography & Visual FX: Lucide Icons, Canvas Confetti.
Backend & Database: Supabase JS Client v2, PostgreSQL, Row Level Security (RLS), Supabase Auth & Storage.
3. Application Features
Customer Features:
Interactive search bar with instant query matching.
Multi-faceted product sorting (Price Low/High, Rating, Featured).
Category filtering (JDM, Supercars, Muscle, European, Limited Edition).
Stock limit checks preventing over-purchasing.
Cart drawer & page with item subtotals, free delivery threshold calculation, and total summary.
Wishlist toggling with persistent state.
Simulated payment checkout with instant order generation & confetti celebration.
User order tracking and status history.
Admin toggle in profile for instant live testing.
Admin Features:
Total sales, total order count, and product count analytics overview.
Product creation, update, and deletion modal dialogs.
Real-time stock quantity display & management.
4. User Flow
Landing / Discovery: User arrives on the Home page, views hero banner, popular categories, featured cars, and fresh mainline drops.
Filtering & Search: User enters a keyword (e.g. "Nissan Skyline") or selects a category (e.g. "JDM Cars") to filter catalog.
Product Inspection: User opens Product Details to inspect scale, color, series, stock, rating, and description.
Cart & Wishlist: User toggles wishlist or adds items to cart. Cart calculates subtotals and checks stock constraints.
Checkout & Order Placement: User fills shipping details, selects payment method, and places order. Cart is cleared, stock is updated, and order is logged in order history.
5. Admin Flow
Admin Access: Authorized admin logs in or toggles Admin Mode in profile.
Dashboard Overview: Views real-time sales metrics, active product count, and recent orders.
Inventory Management: Adds new products with prices, stock numbers, images, and category tags, or deletes obsolete entries.
Order Status Management: Reviews incoming orders and updates status between Processing, Shipped, and Delivered.
6. Complete Database Architecture
The application utilizes 12 relational PostgreSQL tables in Supabase:

profiles: User account details and authorization roles (customer vs admin).
categories: Vehicle categories with slugs and cover images.
products: Primary vehicle catalog with prices, stock, ratings, and badges.
product_images: Additional high-res images for product gallery views.
reviews: Product ratings (1-5 stars) and collector reviews.
wishlist: Customer saved items.
carts: Active customer shopping carts.
cart_items: Products and quantities inside carts.
addresses: Customer shipping address book.
orders: Master order records, shipping info, totals, and statuses.
order_items: Snapshot of items purchased (preserving original prices).
coupons: Promotional discount codes.
contact_messages: Customer inquiry messages.
7. Database Relationship / ER Diagram Description

profiles (1) ───< orders (N) ───< order_items (N) >─── products (1)
profiles (1) ───< reviews (N) >─── products (1)
profiles (1) ───< wishlist (N) >─── products (1)
profiles (1) ───1 carts (1) ───< cart_items (N) >─── products (1)
categories (1) ───< products (N) ───< product_images (N)
profiles (1) ───< addresses (N)
8. Supabase Setup Instructions
Navigate to Supabase Dashboard.
Open your project (https://koizjeljlsrylhrevxrh.supabase.co).
Click on SQL Editor in the side menu.
Paste the entire content of 
schema.sql
 and click Run.
Navigate to Storage, confirm the product-images bucket is active with public access enabled.
9. Complete SQL Schema
(Located in 
schema.sql
 in the workspace directory).

10. RLS Policies
All 12 tables have Row Level Security enabled.

Public read access for active products and categories.
User-scoped access (auth.uid() = user_id) for carts, wishlist, orders, and addresses.
Admin-scoped access (public.is_admin() = true) for inserting/updating/deleting products, categories, coupons, and updating order statuses.
11. Supabase Storage Configuration
Bucket Name: product-images
Policy: Public Read Access enabled for storage objects; Upload/Update/Delete restricted to authenticated users with role = 'admin'.
12. Authentication Configuration
Auth Provider: Supabase Auth Email/Password.
Trigger: on_auth_user_created trigger automatically inserts a default profile row with role = 'customer'.
13. Project Folder Structure

day 7 webapp proj/
├── index.html            # Main single-page web app (Header, Shop, Details, Cart, Checkout, Admin, Profile, Toast)
├── schema.sql            # Complete PostgreSQL DDL, RLS policies, triggers & seed data
└── DOCUMENTATION.md      # Full architecture & guide report
14. UI/UX Design Plan
Theme: Sleek dark mode (slate-950) with vivid hot-wheels flame accents (rose-600 and amber-400).
Typography: Outfit Google font for bold modern header hierarchy.
Card Aesthetics: Smooth hover scaling, dark translucent glassmorphism (backdrop-blur), clear badge indicators (OFF %, HOT, NEW).
15. Page-by-Page Structure
Home: Hero section, category grid, featured products, new drops, trust badges, footer.
Shop: Header controls, sort dropdown, category filter sidebar, product grid.
Product Details: Large car preview, specs table, pricing, stock availability, cart/wishlist actions.
Cart: Item list, quantity increment/decrement, subtotal breakdown, free shipping calculator.
Checkout: Contact form, address inputs, mock payment option, place order button.
Orders: Timeline of past orders, status badges (Shipped/Processing), itemized breakdown.
Wishlist: Grid of saved cars with quick add to cart.
Profile: User avatar, email, order shortcut, and demo Admin role switcher button.
Admin Dashboard: Stat metrics (Sales, Orders, Stock), product CRUD table.
16. Frontend Component Structure
Header(): Navigation, live badges, search bar, profile avatar.
ProductCard(): Reusable card with images, badges, price, stock, ratings.
Hero(): Hero section with spotlight car display.
Toast(): Floating notification banner for cart & wishlist actions.
Footer(): Links, support info, copyright.
17. Supabase Integration Structure
Client initialized with provided project URL and ANON key.
Fallback local state engine maintains 100% functionality even when offline or before SQL execution.
18. Authentication Implementation
User session state tracked with local storage persistence and Supabase auth.getSession() sync.
19. Product CRUD Implementation
Admin panel includes dynamic JavaScript forms to insert new products and delete existing catalog entries.
20. Cart Implementation
Cart state stores product_id and quantity. Automatically validates requested quantity against stock_quantity.
21. Wishlist Implementation
Prevents duplicate entries. Toggle button switches icon styling (fill-rose-500) dynamically.
22. Checkout and Order Implementation
Generates unique order number HW-2026-xxxx. Deducts stock from products, clears active cart, logs order, triggers confetti celebration.
23. Review System
Display rating average and count per product. Supported in database via reviews table constraints.
24. Admin Dashboard
Live dashboard calculates total sales revenue, order numbers, and active stock counts.
25. Sample Database / Seed Data
Pre-populated with iconic collector cars: Nissan Skyline GT-R R34, Toyota Supra MK4, Lamborghini Aventador SVJ, Vintage Mustang GT, Porsche 911 GT3 RS, and Super Treasure Hunt Dodge Challenger.
26. Complete Source Code
See 
index.html
 and 
schema.sql
.

27. Environment Variable Configuration
For Vite environment variables, place in .env:

env

VITE_SUPABASE_URL=https://koizjeljlsrylhrevxrh.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_he0QwnJLlURkF3PajlFEpA_VFuf5Apk
28. Installation Instructions
Open 
index.html
 directly in any modern web browser or serve via any static web server (VS Code Live Server, Python HTTP server, etc.).
29. How to Run the Application
Double-click 
index.html
 or run python -m http.server 8000.
Open http://localhost:8000.
30. Testing Checklist
 Application loads without errors.
 Navigation bar buttons and search bar work.
 Product filtering by category and sorting by price work.
 Product details view displays correct car specs.
 Cart add, quantity update, stock limits, and removal work.
 Wishlist toggle works.
 Checkout places order, updates product stock, clears cart, and shows confetti.
 Orders page displays order history.
 Admin dashboard displays stats and allows adding/deleting products.
31. Common Errors and Solutions
Supabase Table Not Found: Ensure you have executed schema.sql in your Supabase SQL Editor.
Stock Exceeded: Cart validates stock before adding and alerts user via Toast message.
32. Future Improvements
Razorpay / Stripe real payment gateway integration.
360-degree 3D car model viewer for premium collectibles.
