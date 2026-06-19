import axios from 'axios';

const apiUrl = process.env.VUE_APP_API;
const apiPath = process.env.VUE_APP_PATH;

export default {
  login(user) {
    return axios.post(`${apiUrl}/admin/signin`, user);
  },

  logout() {
    return axios.post(`${apiUrl}/logout`);
  },

  checkLogin() {
    return axios.post(`${apiUrl}/api/user/check`);
  },

  getProducts(page = 1) {
    return axios.get(`${apiUrl}/api/${apiPath}/admin/products?page=${page}`);
  },

  createProduct(product) {
    return axios.post(`${apiUrl}/api/${apiPath}/admin/product`, {
      data: product,
    });
  },

  updateProduct(id, product) {
    return axios.put(`${apiUrl}/api/${apiPath}/admin/product/${id}`, {
      data: product,
    });
  },

  deleteProduct(id) {
    return axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${id}`);
  },

  getOrders(page = 1) {
    return axios.get(`${apiUrl}/api/${apiPath}/admin/orders?page=${page}`);
  },

  updateOrder(id, order) {
    return axios.put(`${apiUrl}/api/${apiPath}/admin/order/${id}`, {
      data: order,
    });
  },

  deleteOrder(id) {
    return axios.delete(`${apiUrl}/api/${apiPath}/admin/order/${id}`);
  },

  getCoupons(page = 1) {
    return axios.get(`${apiUrl}/api/${apiPath}/admin/coupons?page=${page}`);
  },

  createCoupon(coupon) {
    return axios.post(`${apiUrl}/api/${apiPath}/admin/coupon`, {
      data: coupon,
    });
  },

  updateCoupon(id, coupon) {
    return axios.put(`${apiUrl}/api/${apiPath}/admin/coupon/${id}`, {
      data: coupon,
    });
  },

  deleteCoupon(id) {
    return axios.delete(`${apiUrl}/api/${apiPath}/admin/coupon/${id}`);
  },
};