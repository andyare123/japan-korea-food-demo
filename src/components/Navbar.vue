<!-- eslint-disable max-len -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top main-navbar">
    <div class="container">
      <router-link
        class="navbar-brand fw-bold brand-text"
        to="/"
        @click="closeMobileNavbar"
      >
        <span class="brand-icon">
          <i class="bi bi-shop-window"></i>
        </span>
        <span>和韓食堂</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        :aria-expanded="isNavbarOpen ? 'true' : 'false'"
        aria-controls="mainNavbar"
        aria-label="Toggle navigation"
        @click="toggleMobileNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="mainNavbar" class="collapse navbar-collapse" :class="{ show: isNavbarOpen }" >
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/products"
              @click="closeMobileNavbar"
            >
              日韓料理列表
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/about"
              @click="closeMobileNavbar"
            >
              關於和韓食堂
            </router-link>
          </li>

          <!-- 我的最愛 -->
          <li
            class="nav-item preview-wrapper"
            @mouseenter="showFavoritePreview = true"
            @mouseleave="showFavoritePreview = false"
          >
            <router-link class="nav-link icon-link" to="/favorites" @click="closeMobileNavbar" >
              <i class="bi bi-heart-fill me-1"></i> 我的最愛
              <span v-if="favoriteCount > 0" class="nav-badge favorite-badge">
                {{ favoriteCount }}
              </span>
            </router-link>

            <div v-if="showFavoritePreview" class="preview-panel">
              <div class="preview-header">
                <strong>我的最愛</strong>
                <small>{{ favoriteCount }} 項</small>
              </div>

              <div v-if="favorites.length">
                <div
                  v-for="item in favorites"
                  :key="item.id"
                  class="preview-item"
                >
                  <div
                    class="preview-img"
                    :style="{ backgroundImage: `url(${item.imageUrl || defaultImage})` }"
                  ></div>

                  <div class="preview-info">
                    <router-link
                      class="preview-title"
                      :to="`/product/${item.id}`"
                    >
                      {{ item.title }}
                    </router-link>

                    <div class="text-danger fw-bold small">
                      {{ $filters.currency(item.price || item.origin_price) }}
                    </div>
                  </div>

                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click.prevent="removeFavorite(item.id)"
                  >
                    移除
                  </button>
                </div>

                <router-link to="/favorites" class="btn btn-danger w-100 mt-3" @click="closeMobileNavbar">
                  查看我的最愛
                </router-link>
              </div>

              <div v-else class="preview-empty">
                <i class="bi bi-heart"></i>
                <p class="mb-2">我的最愛暫無資料</p>
                <router-link to="/products" class="btn btn-outline-danger btn-sm" @click="closeMobileNavbar">
                  去收藏料理
                </router-link>
              </div>
            </div>
          </li>

          <!-- 購物車 -->
          <li
            class="nav-item preview-wrapper"
            @mouseenter="showCartPreview = true"
            @mouseleave="showCartPreview = false"
          >
            <router-link class="nav-link icon-link" to="/user/cart" @click="closeMobileNavbar" >
              <i class="bi bi-bag-heart-fill me-1"></i>
              購物車
              <span v-if="cartCount > 0" class="nav-badge">
                {{ cartCount }}
              </span>
            </router-link>

            <div v-if="showCartPreview" class="preview-panel cart-preview-panel">
              <div class="preview-header">
                <strong>購物車</strong>
                <small>{{ cartCount }} 份</small>
              </div>

              <div v-if="cart.carts && cart.carts.length">
                <div
                  v-for="item in cart.carts"
                  :key="item.id"
                  class="preview-item cart-preview-item"
                >
                  <div
                    class="preview-img"
                    :style="{ backgroundImage: `url(${item.product.imageUrl || defaultImage})` }"
                  ></div>

                  <div class="preview-info">
                    <router-link
                      class="preview-title"
                      :to="`/product/${item.product.id || item.product_id}`"
                    >
                      {{ item.product.title }}
                    </router-link>

                    <div class="text-danger fw-bold small">
                      {{ $filters.currency(item.final_total) }}
                    </div>

                    <div class="input-group input-group-sm qty-mini mt-2">
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        :disabled="status.loadingItem === item.id"
                        @click.prevent="decreaseCartQty(item)"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="1"
                        class="form-control text-center"
                        v-model.number="item.qty"
                        :disabled="status.loadingItem === item.id"
                        @change="updateCart(item)"
                      >

                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        :disabled="status.loadingItem === item.id"
                        @click.prevent="increaseCartQty(item)"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    :disabled="status.loadingItem === item.id"
                    @click.prevent="removeCartItem(item.id)"
                  >
                    移除
                  </button>
                </div>

                <div class="preview-total">
                  <span>應付金額</span>
                  <strong>{{ $filters.currency(cart.final_total || cart.total) }}</strong>
                </div>

                <router-link to="/user/cart" class="btn btn-danger w-100 mt-3" @click="closeMobileNavbar">
                  查看購物車內容
                </router-link>
              </div>

              <div v-else class="preview-empty">
                <i class="bi bi-bag-x"></i>
                <p class="mb-2">購物車暫無商品</p>
                <router-link to="/products" class="btn btn-outline-danger btn-sm" @click="closeMobileNavbar">
                  去挑選料理
                </router-link>
              </div>
            </div>
          </li>

          <!-- 訂單查詢 -->
          <li
            class="nav-item preview-wrapper"
            @mouseenter="openOrderPreview"
            @mouseleave="showOrderPreview = false"
          >
            <router-link class="nav-link icon-link" to="/admin/orders" @click="closeMobileNavbar" >
              <i class="bi bi-receipt-cutoff me-1"></i>
              訂單查詢
              <span v-if="orderCount > 0" class="nav-badge order-badge">
                {{ orderCount }}
              </span>
            </router-link>

            <div v-if="showOrderPreview" class="preview-panel order-preview-panel">
              <div class="preview-header">
                <strong>訂單查詢</strong>

                <div class="d-flex align-items-center gap-2">
                  <small>{{ orderCount }} 筆</small>

                  <button
                    v-if="orderCount > 0"
                    type="button"
                    class="btn btn-outline-danger btn-sm clear-order-btn"
                    @click.prevent="clearOrderPreview"
                  >
                    清空顯示
                  </button>
                </div>
              </div>

              <div v-if="orderList.length">
                <div
                  v-for="item in orderList.slice(0, 5)"
                  :key="item.id"
                  class="preview-item order-preview-item"
                >
                  <div class="order-icon-box">
                    <i class="bi bi-receipt"></i>
                  </div>

                  <div class="preview-info">
                    <router-link
                      class="preview-title"
                      to="/admin/orders"
                    >
                      {{ item.user?.name || '未填寫姓名' }}
                    </router-link>

                    <div class="small text-muted">
                      {{ item.user?.email || '未填寫 Email' }}
                    </div>

                    <div class="small mt-1">
                      <span
                        class="mini-status"
                        :class="isOrderPaid(item) ? 'paid' : 'unpaid'"
                      >
                        {{ isOrderPaid(item) ? '已付款' : '未付款' }}
                      </span>

                      <strong class="text-danger ms-2">
                        {{ $filters.currency(item.total || 0) }}
                      </strong>
                    </div>
                  </div>

                  <router-link
                    to="/admin/orders"
                    class="btn btn-outline-primary btn-sm"
                  >
                    查看
                  </router-link>
                </div>
               <router-link to="/admin/orders" class="btn btn-danger w-100 mt-3" @click="closeMobileNavbar">
                  查看全部訂單
                </router-link>
              </div>

              <div v-else class="preview-empty">
                <i class="bi bi-receipt"></i>
                <p class="mb-2">目前沒有訂單資料</p>
                <router-link to="/products" class="btn btn-outline-danger btn-sm" @click="closeMobileNavbar">
                  前往點餐
                </router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { Collapse } from 'bootstrap';

const { VUE_APP_API, VUE_APP_PATH } = process.env;

export default {
  inject: ['emitter'],
  data() {
    return {
      cart: {
        carts: [],
        total: 0,
        final_total: 0,
      },
      favorites: [],
      orders: {},
      showCartPreview: false,
      showFavoritePreview: false,
      showOrderPreview: false,
      latestPaidOrderId: localStorage.getItem('latestPaidOrderId') || '',
      isOrderDisplayCleared: localStorage.getItem('orderDisplayCleared') === '1',
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      isNavbarOpen: false,
      status: {
        loadingItem: '',
      },
    };
  },
  computed: {
    cartCount() {
      if (!this.cart.carts) {
        return 0;
      }

      return this.cart.carts.reduce((total, item) => total + Number(item.qty || 0), 0);
    },

    favoriteCount() {
      return this.favorites.length;
    },

    orderList() {
      if (this.isOrderDisplayCleared) {
        return [];
      }

      if (Array.isArray(this.orders)) {
        return this.orders;
      }

      if (this.orders && typeof this.orders === 'object') {
        return Object.values(this.orders);
      }

      return [];
    },

    orderCount() {
      return this.orderList.length;
    },
  },
  methods: {
    toggleMobileNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;

      if (!this.isNavbarOpen) {
        this.showCartPreview = false;
        this.showFavoritePreview = false;
        this.showOrderPreview = false;
      }
    },

    closeMobileNavbar() {
      this.isNavbarOpen = false;

      this.showCartPreview = false;
      this.showFavoritePreview = false;
      this.showOrderPreview = false;
    },

    pushToast(title, content = '', style = 'danger') {
      this.emitter.emit('push-message', {
        style,
        title,
        content,
      });
    },

    getCart() {
      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/cart`;

      this.$http.get(url)
        .then((response) => {
          this.cart = response.data.data || {
            carts: [],
            total: 0,
            final_total: 0,
          };
        })
        .catch(() => {
          this.pushToast(
            '取得購物車失敗',
            '請稍後再試，或重新整理頁面。',
            'danger',
          );
        });
    },

    getFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favoriteFoods')) || [];
    },

    increaseCartQty(item) {
      // eslint-disable-next-line no-param-reassign
      item.qty = Number(item.qty || 1) + 1;
      this.updateCart(item);
    },

    decreaseCartQty(item) {
      const qty = Number(item.qty || 1);

      if (qty <= 1) {
        this.removeCartItem(item.id);
        return;
      }

      // eslint-disable-next-line no-param-reassign
      item.qty = qty - 1;
      this.updateCart(item);
    },

    getOrders() {
      if (this.isOrderDisplayCleared) {
        this.orders = {};
        return;
      }

      this.latestPaidOrderId = localStorage.getItem('latestPaidOrderId') || '';

      if (!this.latestPaidOrderId) {
        this.orders = {};
        return;
      }

      this.getOnlyPaidOrder(this.latestPaidOrderId);
    },

    getOnlyPaidOrder(orderId) {
      if (!orderId) {
        this.orders = {};
        return;
      }

      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/order/${orderId}`;

      this.$http.get(url)
        .then((response) => {
          if (response.data.success && response.data.order) {
            const order = {
              id: orderId,
              ...response.data.order,
            };

            this.orders = {
              [orderId]: order,
            };

            return;
          }

          this.orders = {};
        })
        .catch(() => {
          this.orders = {};
        });
    },

    clearOrderPreview() {
      this.orders = {};
      this.latestPaidOrderId = '';
      this.isOrderDisplayCleared = true;

      localStorage.removeItem('latestPaidOrderId');
      localStorage.setItem('orderDisplayCleared', '1');

      window.dispatchEvent(new Event('orders-cleared'));
    },

    updateCart(item) {
      if (!item.id) {
        return;
      }

      if (Number(item.qty) < 1) {
        this.removeCartItem(item.id);
        return;
      }

      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/cart/${item.id}`;

      const cart = {
        product_id: item.product_id,
        qty: Number(item.qty),
      };

      this.status.loadingItem = item.id;

      this.$http.put(url, { data: cart })
        .then((res) => {
          this.$httpMessageState(res, '更新購物車');

          if (res.data.success) {
            this.pushToast(
              '購物車已更新',
              `${item.product?.title || '餐點'} 數量已更新。`,
              'success',
            );

            this.getCart();
            window.dispatchEvent(new Event('cart-updated'));
          } else {
            this.pushToast(
              '更新購物車失敗',
              res.data.message || '請稍後再試。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('Navbar 更新購物車失敗:', error);

          this.pushToast(
            '更新購物車失敗',
            '請確認網路連線或稍後再試。',
            'danger',
          );
        })
        .finally(() => {
          this.status.loadingItem = '';
        });
    },

    removeCartItem(id) {
      const target = this.cart.carts.find((item) => item.id === id);
      const title = target?.product?.title || '餐點';

      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/cart/${id}`;

      this.status.loadingItem = id;

      this.$http.delete(url)
        .then((response) => {
          this.$httpMessageState(response, '移除購物車品項');

          if (response.data.success) {
            this.pushToast(
              '已移除購物車餐點',
              `${title} 已從購物車移除。`,
              'warning',
            );

            this.getCart();
            window.dispatchEvent(new Event('cart-updated'));
          } else {
            this.pushToast(
              '移除購物車餐點失敗',
              response.data.message || '請稍後再試。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('Navbar 移除購物車品項失敗:', error);

          this.pushToast(
            '移除購物車餐點失敗',
            '請確認網路連線或稍後再試。',
            'danger',
          );
        })
        .finally(() => {
          this.status.loadingItem = '';
        });
    },

    removeFavorite(id) {
      const target = this.favorites.find((item) => item.id === id);
      const title = target?.title || '料理';

      this.favorites = this.favorites.filter((item) => item.id !== id);
      localStorage.setItem('favoriteFoods', JSON.stringify(this.favorites));

      this.pushToast(
        '已移除我的最愛',
        `${title} 已從收藏清單移除。`,
        'warning',
      );

      window.dispatchEvent(new Event('favorites-updated'));
    },

    openOrderPreview() {
      this.showOrderPreview = true;
      this.getOrders();
    },

    isOrderPaid(order) {
      return order.is_paid === true
        || order.is_paid === 1
        || order.is_paid === '1'
        || order.is_paid === 'true';
    },

    handleOrdersDisplayReset(event) {
      const paidOrderId = event?.detail?.orderId || localStorage.getItem('latestPaidOrderId') || '';

      this.isOrderDisplayCleared = false;
      this.latestPaidOrderId = paidOrderId;

      localStorage.removeItem('orderDisplayCleared');

      if (!paidOrderId) {
        this.orders = {};
        return;
      }

      localStorage.setItem('latestPaidOrderId', paidOrderId);
      this.getOnlyPaidOrder(paidOrderId);
    },

    handleOrdersCleared() {
      this.orders = {};
      this.latestPaidOrderId = '';
      this.isOrderDisplayCleared = true;

      localStorage.removeItem('latestPaidOrderId');
      localStorage.setItem('orderDisplayCleared', '1');
    },
  },
  mounted() {
    this.getCart();
    this.getFavorites();

    if (!this.isOrderDisplayCleared && this.latestPaidOrderId) {
      this.getOnlyPaidOrder(this.latestPaidOrderId);
    } else {
      this.orders = {};
    }

    window.addEventListener('cart-updated', this.getCart);
    window.addEventListener('favorites-updated', this.getFavorites);
    window.addEventListener('orders-updated', this.getOrders);
    window.addEventListener('orders-display-reset', this.handleOrdersDisplayReset);
    window.addEventListener('orders-cleared', this.handleOrdersCleared);
  },
  beforeUnmount() {
    window.removeEventListener('cart-updated', this.getCart);
    window.removeEventListener('favorites-updated', this.getFavorites);
    window.removeEventListener('orders-updated', this.getOrders);
    window.removeEventListener('orders-display-reset', this.handleOrdersDisplayReset);
    window.removeEventListener('orders-cleared', this.handleOrdersCleared);
  },
};
</script>

<style scoped>
.main-navbar {
  z-index: 3000;
}

.brand-text {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #b23a2e;
  letter-spacing: 2px;
  font-size: 24px;
  text-decoration: none;
}

.brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(135deg, #b23a2e, #df6b4f);
  box-shadow: 0 8px 18px rgba(178, 58, 46, 0.22);
}

.brand-icon i {
  display: block;
  font-size: 19px;
  line-height: 1;
  width: 19px;
  height: 19px;
  text-align: center;
  transform: translateY(-1px);
}

.nav-link {
  color: #333;
  font-weight: 700;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #b23a2e !important;
}

.order-btn {
  border-radius: 999px;
  padding: 8px 18px;
  font-weight: 800;
  box-shadow: 0 10px 22px rgba(178, 58, 46, 0.22);
}

.icon-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  line-height: 1;
}

.icon-link i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-size: 16px;
  transform: translateY(1px);
}

.nav-badge {
  position: absolute;
  top: -7px;
  right: -14px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #dc3545;
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid #fff;
}

.navbar-nav .nav-link {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
}

.favorite-badge {
  background: #e83e8c;
}

.preview-wrapper {
  position: relative;
}

.preview-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 390px;
  max-height: 520px;
  overflow-y: auto;
  padding: 18px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 45px rgba(80, 40, 20, 0.16);
  z-index: 5000;
}

.cart-preview-panel {
  width: 460px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-header strong {
  color: #b23a2e;
  font-size: 18px;
}

.preview-header small {
  color: #777;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f2e4dc;
}

.preview-img {
  flex: 0 0 auto;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  background-color: #fff4ec;
}

.preview-info {
  flex: 1;
  min-width: 0;
}

.preview-title {
  display: block;
  color: #333;
  font-weight: 800;
  text-decoration: none;
  line-height: 1.4;
}

.preview-title:hover {
  color: #b23a2e;
}

.qty-mini {
  max-width: 150px;
}

.qty-mini .form-control {
  font-weight: 800;
}

.preview-total {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 14px;
  border-radius: 16px;
  background: #fff8f2;
  color: #b23a2e;
}

.preview-empty {
  padding: 34px 16px;
  border-radius: 18px;
  text-align: center;
  background: #fff8f2;
  color: #777;
  border: 1px dashed #e5c9b8;
}

.preview-empty i {
  display: block;
  margin-bottom: 8px;
  font-size: 36px;
  color: #c9a18b;
}

.dropdown-item {
  font-weight: 600;
}

.dropdown-item.router-link-active {
  color: #b23a2e;
  background: #fff0e7;
}
.order-badge {
  background: #0d6efd;
}

.order-preview-panel {
  width: 430px;
}

.order-icon-box {
  flex: 0 0 auto;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #b23a2e;
  background: #fff0e7;
  font-size: 24px;
}

.mini-status {
  display: inline-flex;
  align-items: center;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.mini-status.paid {
  color: #198754;
  background: #e9f8ef;
}

.mini-status.unpaid {
  color: #b23a2e;
  background: #fff0e7;
}
.clear-order-btn {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}
@media (max-width: 991px) {
  .navbar-nav {
    padding-top: 16px;
  }

  .order-btn {
    width: 100%;
    margin-top: 8px;
  }

  .preview-panel,
  .cart-preview-panel {
    position: static;
    width: 100%;
    max-height: none;
    margin-top: 8px;
    box-shadow: none;
  }
  .order-preview-panel {
    width: 100%;
  }
}
</style>