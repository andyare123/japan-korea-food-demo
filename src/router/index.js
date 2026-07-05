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
  // 後台訂單管理
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: () => import('../views/AdminOrders.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
