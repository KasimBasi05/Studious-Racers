Implementation Plan - DieCast Hub E-Commerce Web Application & Admin Dashboard
Build a complete, fully functional, responsive, and visually stunning e-commerce web application for Hot Wheels & die-cast collectibles ("DieCast Hub") powered by React + Vite + Tailwind CSS + Supabase backend.

User Review Required
IMPORTANT

Supabase Credentials: Using provided URL https://koizjeljlsrylhrevxrh.supabase.co and ANON KEY sb_publishable_he0QwnJLlURkF3PajlFEpA_VFuf5Apk (with client-side fallback/env support).
SQL Script & RLS: Complete PostgreSQL migration script schema.sql will be generated covering all 12 requested tables (profiles, categories, products, product_images, reviews, wishlist, carts, cart_items, addresses, orders, order_items, coupons, contact_messages), RLS policies, triggers, and sample seed data.
Mock & Live Dual-Engine: To guarantee instant full functionality out of the box (or when offline/if database tables are not yet created in Supabase SQL editor), the application will incorporate a full local state fallback engine alongside active Supabase client calls.
Key Features & Architecture
Frontend Architecture:
Framework: React (Vite) + Lucide Icons + Tailwind CSS styling + Canvas Confetti / Toast notifications.
Pages: Home, Shop, Product Details, Shopping Cart, Checkout, Login, Register, Forgot Password, User Profile, My Orders, Order Details, Wishlist, About Us, Contact Us, Admin Dashboard (Overview, Products, Categories, Orders, Users, Stock Management).
Database & Backend Architecture (Supabase):
Supabase JS Client integration (@supabase/supabase-js).
Authentication (Email/Password login, signup with profile creation, session context).
Database tables & foreign key constraints matching exact spec.
Supabase Storage bucket integration product-images.
Comprehensive Row Level Security (RLS) policies for user privacy and admin protection.
Documentation & Deliverables:
Complete markdown documentation adhering to all 32 required sections in the output format.
Production-ready runnable React codebase in workspace.

Proposed Steps
Step 1: Database Schema & SQL File Creation
Create 
schema.sql
 containing all table definitions, relationships, RLS policies, trigger functions for automatic user profile generation on sign up, and seed data.
Step 2: React Application Setup & Component Architecture
Create Vite + React workspace configuration (package.json, vite.config.js, tailwind.config.js, index.html, src/index.css).
Build Supabase client wrapper (src/lib/supabase.js) and Auth/State Context (src/context/AppContext.jsx).
Implement UI layout, Navigation Header with search bar, badges, footer, dynamic toast alerts, modal dialogs.
Implement main customer views (Home, Shop with multi-faceted filter sidebar, Product Details modal/page, Cart drawer/page, Wishlist, Checkout flow with simulated payment & stock deduction, Orders, User Profile, About, Contact).
Implement feature-rich Admin Dashboard with Product CRUD, Image upload, Category management, Order status updater, Stock manager, and Sales analytics.
Step 3: Detailed Technical Report Artifact
Generate DOCUMENTATION.md fulfilling all 32 structured output format sections requested by the prompt.
Verification Plan

Automated & Build Verification

Run npm install and npm run build using run_command to verify zero compilation errors and clean TypeScript/Vite bundle.
Manual & Functional Verification
Test registration, authentication state, cart persistence, quantity limits vs stock, wishlist toggling, checkout order creation, stock auto-deduction, and Admin dashboard product creation/deletion.
