import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/UserProduct.vue'),
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
  },
  {
    path: '/user/cart',
    alias: '/cart',
    name: 'Cart',
    component: () => import('../views/UserCart.vue'),
  },
  {
    path: '/checkout-process',
    name: 'CheckoutProcess',
    component: () => import('../views/CheckoutProcess.vue'),
  },
  {
    path: '/checkout/:orderId',
    name: 'Checkout',
    component: () => import('../views/UserCheckout.vue'),
  },
  {
    path: '/checkout',
    redirect: '/user/cart',
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorite.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue'),
  },

  // 後台商品管理
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: () => import('../views/Products.vue'),
  },
  // 後台訂單管理
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: () => import('../views/AdminOrders.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;