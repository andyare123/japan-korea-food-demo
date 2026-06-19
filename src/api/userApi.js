import axios from 'axios';

const apiUrl = process.env.VUE_APP_API;
const apiPath = process.env.VUE_APP_PATH;

export default {
  getProducts(page = 1) {
    return axios.get(`${apiUrl}/api/${apiPath}/products?page=${page}`);
  },

  getProduct(id) {
    return axios.get(`${apiUrl}/api/${apiPath}/product/${id}`);
  },

  addToCart(productId, qty = 1) {
    return axios.post(`${apiUrl}/api/${apiPath}/cart`, {
      data: {
        product_id: productId,
        qty,
      },
    });
  },

  getCart() {
    return axios.get(`${apiUrl}/api/${apiPath}/cart`);
  },

  updateCartItem(cartId, productId, qty) {
    return axios.put(`${apiUrl}/api/${apiPath}/cart/${cartId}`, {
      data: {
        product_id: productId,
        qty,
      },
    });
  },

  deleteCartItem(cartId) {
    return axios.delete(`${apiUrl}/api/${apiPath}/cart/${cartId}`);
  },

  deleteAllCart() {
    return axios.delete(`${apiUrl}/api/${apiPath}/carts`);
  },

  applyCoupon(code) {
    return axios.post(`${apiUrl}/api/${apiPath}/coupon`, {
      data: {
        code,
      },
    });
  },

  createOrder(order) {
    return axios.post(`${apiUrl}/api/${apiPath}/order`, {
      data: order,
    });
  },

  getOrder(orderId) {
    return axios.get(`${apiUrl}/api/${apiPath}/order/${orderId}`);
  },

  payOrder(orderId) {
    return axios.post(`${apiUrl}/api/${apiPath}/pay/${orderId}`);
  },
};