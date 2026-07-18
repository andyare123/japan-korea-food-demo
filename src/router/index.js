import { createRouter, createWebHashHistory } from 'vue-router';
import axios from 'axios';

import FrontLayout from '@/layouts/FrontLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Home from '@/views/HomeView.vue';

function getToken() {
  const tokenItem = document.cookie
    .split('; ')
    .find((row) => row.startsWith('hexToken='));

  return tokenItem ? tokenItem.replace('hexToken=', '') : '';
}

const routes = [
  {
    path: '/',
    component: FrontLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/AboutView.vue'),
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/UserProduct.vue'),
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/ProductDetail.vue'),
      },
      {
        path: 'user/cart',
        alias: '/cart',
        name: 'Cart',
        component: () => import('@/views/UserCart.vue'),
      },
      {
        path: 'checkout-process',
        name: 'CheckoutProcess',
        component: () => import('@/views/CheckoutProcess.vue'),
      },
      {
        path: 'checkout/:orderId',
        name: 'Checkout',
        component: () => import('@/views/UserCheckout.vue'),
      },
      {
        path: 'checkout',
        redirect: '/user/cart',
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: () => import('@/views/Favorite.vue'),
      },
      {
        path: 'orders/:orderId',
        name: 'UserOrderDetail',
        component: () => import('@/views/UserOrderDetail.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: '/admin/products',
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/AdminProducts.vue'),
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/AdminOrders.vue'),
      },
      {
        path: 'coupons',
        name: 'AdminCoupons',
        component: () => import('@/views/AdminCoupons.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const needAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!needAuth) {
    next();
    return;
  }

  const token = getToken();

  if (!token) {
    next('/login');
    return;
  }

  axios.defaults.headers.common.Authorization = token;

  const url = `${process.env.VUE_APP_API}/api/user/check`;

  axios
    .post(url)
    .then((res) => {
      if (res.data.success) {
        next();
      } else {
        document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        next('/login');
      }
    })
    .catch(() => {
      document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      next('/login');
    });
});

export default router;