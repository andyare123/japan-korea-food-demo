<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top main-navbar">
    <div class="container">
      <router-link class="navbar-brand fw-bold brand-text" to="/" @click="closeMobileNavbar">
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
      <div id="mainNavbar" class="collapse navbar-collapse" :class="{ show: isNavbarOpen }">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/products" @click="closeMobileNavbar">
              日韓料理列表
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/about" @click="closeMobileNavbar">
              關於和韓食堂
            </router-link>
          </li>

          <!-- 我的最愛 -->
          <li
            class="nav-item preview-wrapper"
            @mouseenter="showFavoritePreview = true"
            @mouseleave="showFavoritePreview = false"
          >
            <router-link class="nav-link icon-link" to="/favorites" @click="closeMobileNavbar">
              <i class="bi bi-heart-fill me-1"></i>

              <span class="nav-text-with-badge">
                我的最愛
                <span v-if="favoriteCount > 0" class="nav-badge favorite-badge">
                  {{ favoriteCount }}
                </span>
              </span>
            </router-link>

            <div v-if="showFavoritePreview" class="preview-panel">
              <div class="preview-header">
                <strong>我的最愛</strong>
                <small>{{ favoriteCount }} 項</small>
              </div>

              <div v-if="favorites.length">
                <div v-for="item in favorites" :key="item.id" class="preview-item">
                  <div class="preview-img">
                    <img
                      :src="item.imageUrl || defaultImage"
                      :alt="item.title || '收藏料理圖片'"
                      class="preview-img-tag"
                    />
                  </div>

                  <div class="preview-info">
                    <router-link class="preview-title" :to="`/product/${item.id}`">
                      {{ item.title }}
                    </router-link>

                    <div class="text-danger fw-bold small">
                      {{ $filters.currency(item.price || item.origin_price) }}
                    </div>
                  </div>

                  <div class="d-flex flex-column gap-2">
                    <button
                      type="button"
                      class="btn btn-brand btn-sm"
                      @click.prevent="addFavoriteToCart(item)"
                    >
                      加購
                    </button>

                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click.prevent="removeFavorite(item.id)"
                    >
                      移除
                    </button>
                  </div>
                </div>

                <router-link
                  to="/favorites"
                  class="btn btn-danger w-100 mt-3"
                  @click="closeMobileNavbar"
                >
                  查看我的最愛
                </router-link>
              </div>

              <div v-else class="preview-empty">
                <i class="bi bi-heart"></i>
                <p class="mb-2">我的最愛暫無資料</p>
                <router-link
                  to="/products"
                  class="btn btn-outline-danger btn-sm"
                  @click="closeMobileNavbar"
                >
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
            <router-link class="nav-link icon-link" to="/user/cart" @click="closeMobileNavbar">
              <i class="bi bi-bag-heart-fill me-1"></i>

              <span class="nav-text-with-badge">
                購物車
                <span v-if="cartCount > 0" class="nav-badge">
                  {{ cartCount }}
                </span>
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
                  <div class="preview-img">
                    <img
                      :src="item.product.imageUrl || defaultImage"
                      :alt="item.product.title || '購物車餐點圖片'"
                      class="preview-img-tag"
                    />
                  </div>

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
                      />

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

                <router-link
                  to="/user/cart"
                  class="btn btn-danger w-100 mt-3"
                  @click="closeMobileNavbar"
                >
                  查看購物車內容
                </router-link>
              </div>

              <div v-else class="preview-empty">
                <i class="bi bi-bag-x"></i>
                <p class="mb-2">購物車暫無商品</p>
                <router-link
                  to="/products"
                  class="btn btn-outline-danger btn-sm"
                  @click="closeMobileNavbar"
                >
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
              <router-link
                class="nav-link icon-link"
                :to="latestPaidOrderId ? `/orders/${latestPaidOrderId}` : '/user/cart'"
                @click="closeMobileNavbar"
              >
              <i class="bi bi-receipt-cutoff me-1"></i>

              <span class="nav-text-with-badge">
                訂單明細
                <span v-if="orderCount > 0" class="nav-badge order-badge">
                  {{ orderCount }}
                </span>
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
                    <router-link class="preview-title" :to="`/orders/${item.id}`">
                      {{ item.user?.name || "未填寫姓名" }}
                    </router-link>

                    <div class="small text-muted">
                      {{ item.user?.email || "未填寫 Email" }}
                    </div>

                    <div class="small mt-1">
                      <span class="mini-status" :class="isOrderPaid(item) ? 'paid' : 'unpaid'">
                        {{ isOrderPaid(item) ? "已付款" : "未付款" }}
                      </span>

                      <strong class="text-danger ms-2">
                        {{ $filters.currency(item.total || 0) }}
                      </strong>
                    </div>
                  </div>

                  <router-link :to="`/orders/${item.id}`" class="btn btn-outline-brand btn-sm">
                    查看
                  </router-link>
                </div>
                <router-link
                  :to="latestPaidOrderId ? `/orders/${latestPaidOrderId}` : '/user/cart'"
                  class="btn btn-danger w-100 mt-3"
                  @click="closeMobileNavbar"
                >
                  查看訂單明細
                </router-link>
              </div>

              <div v-else class="preview-empty">
                <i class="bi bi-receipt"></i>
                <p class="mb-2">目前沒有訂單資料</p>
                <router-link
                  to="/products"
                  class="btn btn-outline-danger btn-sm"
                  @click="closeMobileNavbar"
                >
                  前往點餐
                </router-link>
              </div>
            </div>
          </li>
         <li v-if="!isAdminLogin" class="nav-item">
            <router-link class="nav-link" to="/login" @click="closeMobileNavbar">
              後台登入
            </router-link>
          </li>

          <li v-if="isAdminLogin" class="nav-item">
            <router-link class="nav-link" to="/admin/products" @click="closeMobileNavbar">
              商品管理
            </router-link>
          </li>

          <li v-if="isAdminLogin" class="nav-item">
            <router-link class="nav-link" to="/admin/coupons" @click="closeMobileNavbar">
              優惠券管理
            </router-link>
          </li>
          <li v-if="isAdminLogin" class="nav-item">
            <router-link class="nav-link" to="/admin/orders" @click="closeMobileNavbar">
              訂單檢視
            </router-link>
          </li>
          <li v-if="isAdminLogin" class="nav-item">
            <button type="button" class="nav-link logout-link" @click="adminLogout">
              後台登出
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import emitter from '../methods/emitter';

const { VUE_APP_API, VUE_APP_PATH } = process.env;

export default {
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
      isAdminLogin: false,
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
    checkAdminLogin() {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('hexToken='));

      this.isAdminLogin = !!token;
    },

    adminLogout() {
      document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      this.isAdminLogin = false;

      this.pushToast('已登出後台', '期待您下次回來管理和韓食堂。', 'warning');

      this.closeMobileNavbar();

      if (this.$route.path.startsWith('/admin')) {
        this.$router.push('/login');
      }
    },
    pushToast(title, content = '', style = 'danger') {
      emitter.emit('push-message', {
        style,
        title,
        content,
      });
    },

    addFavoriteToCart(item) {
      if (!item || !item.id) {
        this.pushToast(
          '加入購物車失敗',
          '找不到料理資料，請稍後再試。',
          'danger',
        );
        return;
      }

      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/cart`;

      const data = {
        product_id: item.id,
        qty: 1,
      };

      this.$http
        .post(url, { data })
        .then((res) => {
          if (res.data.success) {
            this.pushToast(
              '已加入購物車',
              `已成功加入 1 ${item.unit || '份'} ${item.title || '餐點'}。`,
              'success',
            );

            this.getCart();
            emitter.emit('cart-updated');
          } else {
            this.pushToast(
              '加入購物車失敗',
              res.data.message || '請稍後再試。',
              'danger',
            );
          }
        })
        .catch(() => {
          this.pushToast(
            '加入購物車失敗',
            '請確認網路連線或稍後再試。',
            'danger',
          );
        });
    },

    getCart() {
      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/cart`;

      this.$http
        .get(url)
        .then((response) => {
          this.cart = response.data.data || {
            carts: [],
            total: 0,
            final_total: 0,
          };
        })
        .catch(() => {
          this.pushToast('取得購物車失敗', '請稍後再試，或重新整理頁面。', 'danger');
        });
    },

    getFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favoriteFoods')) || [];
    },

    increaseCartQty(item) {
      const newQty = Number(item.qty || 1) + 1;

      this.updateCart({
        ...item,
        qty: newQty,
      });
    },

    decreaseCartQty(item) {
      const qty = Number(item.qty || 1);

      if (qty <= 1) {
        this.removeCartItem(item.id);
        return;
      }

      this.updateCart({
        ...item,
        qty: qty - 1,
      });
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

      this.$http
        .get(url)
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

      emitter.emit('orders-cleared');
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

      this.$http
        .put(url, { data: cart })
        .then((res) => {
          if (res.data.success) {
            this.pushToast(
              '購物車已更新',
              `${item.product?.title || '餐點'} 數量已更新。`,
              'success',
            );

            this.getCart();
            emitter.emit('cart-updated');
          } else {
            this.pushToast('更新購物車失敗', res.data.message || '請稍後再試。', 'danger');
          }
        })
        .catch(() => {
          this.pushToast('更新購物車失敗', '請確認網路連線或稍後再試。', 'danger');
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

      this.$http
        .delete(url)
        .then((response) => {
          if (response.data.success) {
            this.pushToast('已移除購物車餐點', `${title} 已從購物車移除。`, 'warning');

            this.getCart();
            emitter.emit('cart-updated');
          } else {
            this.pushToast('移除購物車餐點失敗', response.data.message || '請稍後再試。', 'danger');
          }
        })
        .catch(() => {
          this.pushToast('移除購物車餐點失敗', '請確認網路連線或稍後再試。', 'danger');
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

      this.pushToast('已移除我的最愛', `${title} 已從收藏清單移除。`, 'warning');

      emitter.emit('favorites-updated');
    },

    openOrderPreview() {
      this.showOrderPreview = true;
      this.getOrders();
    },

    isOrderPaid(order) {
      return (
        order.is_paid === true
        || order.is_paid === 1
        || order.is_paid === '1'
        || order.is_paid === 'true'
      );
    },

    handleOrdersDisplayReset(payload = {}) {
      const paidOrderId = payload.orderId || localStorage.getItem('latestPaidOrderId') || '';

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
    this.getCart();
    this.getFavorites();
    this.checkAdminLogin();
    if (!this.isOrderDisplayCleared && this.latestPaidOrderId) {
      this.getOnlyPaidOrder(this.latestPaidOrderId);
    } else {
      this.orders = {};
    }

    emitter.on('cart-updated', this.getCart);
    emitter.on('favorites-updated', this.getFavorites);
    emitter.on('orders-updated', this.getOrders);
    emitter.on('orders-display-reset', this.handleOrdersDisplayReset);
    emitter.on('orders-cleared', this.handleOrdersCleared);
    emitter.on('admin-login-updated', this.checkAdminLogin);
  },
  beforeUnmount() {
    emitter.off('cart-updated', this.getCart);
    emitter.off('favorites-updated', this.getFavorites);
    emitter.off('orders-updated', this.getOrders);
    emitter.off('orders-display-reset', this.handleOrdersDisplayReset);
    emitter.off('orders-cleared', this.handleOrdersCleared);
    emitter.off('admin-login-updated', this.checkAdminLogin);
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
  color: var(--brand-primary);
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
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
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
  color: var(--brand-text);
  font-weight: 700;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--brand-primary) !important;
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
.nav-text-with-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
.nav-badge {
  position: absolute;
  top: -10px;
  right: -18px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--brand-primary);
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
  background: var(--brand-primary);
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
  border: 1px solid var(--brand-border);
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
  color: var(--brand-primary);
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
  overflow: hidden;
  background: #fff4ec;
}

.preview-img-tag {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
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
  background: var(--brand-bg-soft);
  color: var(--brand-muted);
  border: 1px dashed var(--brand-border);
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
  color: var(--brand-primary);
  background: var(--brand-primary-light);
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
  color: var(--state-success);
  background: #e9f8ef;
}

.mini-status.unpaid {
  color: var(--brand-primary);
  background: var(--brand-primary-light);
}
.clear-order-btn {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.hero-section {
  padding-top: 16px;
}
.logout-link {
  border: 0;
  background: transparent;
  color: var(--brand-text);
  font-weight: 700;
}

.logout-link:hover {
  color: var(--brand-primary) !important;
}
@media (max-width: 991px) {
  .main-navbar {
    position: sticky;
    top: 0;
    z-index: 5000;
  }

  #mainNavbar {
    position: absolute;
    top: 100%;
    left: 12px;
    right: 12px;
    z-index: 4999;
    padding: 14px;
    border-radius: 20px;
    background: #ffffff;
    border: 1px solid var(--brand-border);
    box-shadow: 0 18px 45px rgba(80, 40, 20, 0.18);
  }

  #mainNavbar:not(.show) {
    display: none;
  }

  #mainNavbar.show {
    display: block;
  }

  .navbar-nav {
    align-items: stretch !important;
    padding-top: 0;
  }

  .navbar-nav .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 12px 14px;
    border-radius: 14px;
  }

  .navbar-nav .nav-link:hover,
  .navbar-nav .nav-link.router-link-active {
    background: var(--brand-primary-light);
  }

  .order-btn {
    width: 100%;
    margin-top: 8px;
  }

  .preview-panel,
  .cart-preview-panel,
  .order-preview-panel {
    position: static;
    width: 100%;
    max-height: none;
    margin-top: 8px;
    box-shadow: none;
  }
   .icon-link {
    justify-content: flex-start;
    gap: 6px;
  }

  .nav-text-with-badge {
    width: auto;
  }
  .logout-link {
    width: 100%;
    justify-content: flex-start;
    padding: 12px 14px;
    border-radius: 14px;
    text-align: left;
  }

  .logout-link:hover {
    background: var(--brand-primary-light);
  }
  .nav-badge {
    top: -9px;
    right: -20px;
  }
}
@media (max-width: 768px) {
  .hero-section {
    padding-top: 24px;
  }
}
</style>
