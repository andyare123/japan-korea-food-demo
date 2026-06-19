<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <Loading :active="isLoading" />

  <div class="container py-5">
    <div class="page-header mb-4">
      <span class="badge bg-danger mb-3">人氣日韓料理訂購</span>
      <h1 class="fw-bold">今天想吃日式還是韓式？</h1>
      <p class="text-muted mb-0">
        精選主廚推薦料理，支援收藏、加入購物車與優惠券折抵。
      </p>
    </div>

    <div class="coupon-box mb-4">
      <div>
        <h5 class="fw-bold mb-1">限時優惠券</h5>
        <p class="mb-0 text-muted">
          輸入優惠碼 <strong>JPKR100</strong>，滿 699 現折 100 元。
        </p>
      </div>

      <router-link to="/user/cart" class="btn btn-danger">
        前往購物車使用
      </router-link>
    </div>

    <div class="category-tabs mb-4">
      <button
        class="btn"
        :class="selectedCategory === '全部' ? 'btn-dark' : 'btn-outline-dark'"
        @click="changeCategory('全部')"
      >
        全部
      </button>

      <button
        class="btn"
        :class="selectedCategory === '日式料理' ? 'btn-danger' : 'btn-outline-danger'"
        @click="changeCategory('日式料理')"
      >
        日式料理
      </button>

      <button
        class="btn"
        :class="selectedCategory === '韓式料理' ? 'btn-warning' : 'btn-outline-warning'"
        @click="changeCategory('韓式料理')"
      >
        韓式料理
      </button>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <p class="text-muted mb-0">
        共 {{ filteredProducts.length }} 道料理，
        目前第 {{ currentPage }} / {{ totalPages }} 頁
      </p>

      <p class="text-muted mb-0">
        每頁顯示 {{ perPage }} 道
      </p>
    </div>

    <div class="row g-4">
      <div
        v-for="item in pagedProducts"
        :key="item.id"
        class="col-md-6 col-lg-4"
      >
        <div class="food-card">
          <div
            class="food-img"
            :style="{ backgroundImage: `url(${item.imageUrl || defaultImage})` }"
          >
            <button class="favorite-btn" @click="toggleFavorite(item)">
              {{ isFavorite(item.id) ? '❤️' : '🤍' }}
            </button>
          </div>

          <div class="p-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-light text-dark">
                {{ item.category }}
              </span>
              <small class="text-muted">已售出 {{ item.num || 0 }} 份</small>
            </div>

            <h5 class="fw-bold mb-2">
              {{ item.title }}
            </h5>

            <p class="text-muted food-desc">
              {{ item.description || item.content }}
            </p>

            <div class="mb-3">
              <del class="text-muted me-2">
                NT$ {{ item.origin_price }}
              </del>
              <span class="h5 text-danger fw-bold">
                NT$ {{ item.price }}
              </span>
            </div>

           <div class="input-group input-group-sm mb-3">
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="decreaseQty(item.id)"
              >
                -
              </button>

              <input
                type="number"
                class="form-control text-center"
                min="1"
                v-model.number="cartQty[item.id]"
              >

              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="increaseQty(item.id)"
              >
                +
              </button>

              <span class="input-group-text">
                {{ item.unit || '份' }}
              </span>
            </div>

            <div class="d-flex gap-2">
              <router-link
                :to="`/product/${item.id}`"
                class="btn btn-outline-dark flex-fill"
              >
                查看詳情
              </router-link>

              <button
                type="button"
                class="btn btn-danger flex-fill"
                @click="addToCart(item.id)"
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!filteredProducts.length" class="text-center py-5 text-muted">
      目前沒有符合的料理。
    </div>

    <!-- 頁碼 -->
    <nav
      v-if="totalPages > 1"
      class="mt-5 d-flex justify-content-center"
      aria-label="料理頁碼"
    >
      <ul class="pagination pagination-lg">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button
            class="page-link"
            type="button"
            @click="changePage(currentPage - 1)"
          >
            上一頁
          </button>
        </li>

        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button
            class="page-link"
            type="button"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            type="button"
            @click="changePage(currentPage + 1)"
          >
            下一頁
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
const { VUE_APP_API, VUE_APP_PATH } = process.env;

export default {
  inject: ['emitter'],
  data() {
    return {
      products: [],
      favorites: JSON.parse(localStorage.getItem('favoriteFoods')) || [],
      selectedCategory: '全部',
      isLoading: false,
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',

      // 數量設定
      cartQty: {},

      // 分頁設定
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    filteredProducts() {
      if (this.selectedCategory === '全部') {
        return this.products;
      }

      return this.products.filter((item) => item.category === this.selectedCategory);
    },

    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.perPage) || 1;
    },

    pagedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;

      return this.filteredProducts.slice(start, end);
    },
  },
  methods: {
    pushToast(title, content = '', style = 'danger') {
      this.emitter.emit('push-message', {
        style,
        title,
        content,
      });
    },

    getProducts() {
      this.isLoading = true;

      this.$http
        .get(`${VUE_APP_API}/api/${VUE_APP_PATH}/products/all`)
        .then((res) => {
          this.products = res.data.products || [];
          this.currentPage = 1;

          this.products.forEach((item) => {
            if (!this.cartQty[item.id]) {
              this.cartQty[item.id] = 1;
            }
          });
        })
        .catch((error) => {
          console.error('取得料理列表失敗:', error);

          this.pushToast(
            '取得料理列表失敗',
            '請稍後再試，或重新整理頁面。',
            'danger',
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    changeCategory(category) {
      this.selectedCategory = category;
      this.currentPage = 1;
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) {
        return;
      }

      this.currentPage = page;

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },

    addToCart(id) {
      const qty = Number(this.cartQty[id]) || 1;

      if (qty < 1) {
        this.cartQty[id] = 1;

        this.pushToast(
          '數量錯誤',
          '餐點數量至少需要 1 份。',
          'warning',
        );
        return;
      }

      const product = this.products.find((item) => item.id === id);

      const data = {
        product_id: id,
        qty,
      };

      this.isLoading = true;

      this.$http
        .post(`${VUE_APP_API}/api/${VUE_APP_PATH}/cart`, { data })
        .then((res) => {
          this.$httpMessageState(res, '加入購物車');

          if (res.data.success) {
            window.dispatchEvent(new Event('cart-updated'));

            this.pushToast(
              '已加入購物車',
              `已成功加入 ${qty} ${product?.unit || '份'} ${product?.title || '餐點'}。`,
              'success',
            );
          } else {
            this.pushToast(
              '加入購物車失敗',
              res.data.message || '請稍後再試。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('加入購物車失敗:', error);

          this.pushToast(
            '加入購物車失敗',
            '請確認網路連線或稍後再試。',
            'danger',
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    increaseQty(id) {
      if (!this.cartQty[id]) {
        this.cartQty[id] = 1;
      }

      this.cartQty[id] += 1;
    },

    decreaseQty(id) {
      if (!this.cartQty[id] || this.cartQty[id] <= 1) {
        this.cartQty[id] = 1;
        return;
      }

      this.cartQty[id] -= 1;
    },

    toggleFavorite(item) {
      const index = this.favorites.findIndex((food) => food.id === item.id);

      if (index === -1) {
        this.favorites.push(item);

        this.pushToast(
          '已加入我的最愛',
          `${item.title || '料理'} 已加入收藏清單。`,
          'success',
        );
      } else {
        this.favorites.splice(index, 1);

        this.pushToast(
          '已移除我的最愛',
          `${item.title || '料理'} 已從收藏清單移除。`,
          'warning',
        );
      }

      localStorage.setItem('favoriteFoods', JSON.stringify(this.favorites));
      window.dispatchEvent(new Event('favorites-updated'));
    },

    isFavorite(id) {
      return this.favorites.some((item) => item.id === id);
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>

<style scoped>
.page-header {
  padding: 36px;
  border-radius: 28px;
  background: linear-gradient(135deg, #fff4ec, #ffffff);
  border: 1px solid #f2dfd0;
}

.coupon-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 22px;
  background: #fff8e8;
  border: 1px dashed #d39b37;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.food-card {
  height: 100%;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.food-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 46px rgba(0, 0, 0, 0.12);
}

.food-img {
  position: relative;
  height: 230px;
  background-size: cover;
  background-position: center;
}

.favorite-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
}

.food-desc {
  min-height: 48px;
}

.pagination .page-link {
  color: #b23a2e;
  font-weight: 700;
}

.pagination .active .page-link {
  color: #fff;
  background-color: #b23a2e;
  border-color: #b23a2e;
}

.pagination .page-link:focus {
  box-shadow: 0 0 0 0.2rem rgba(178, 58, 46, 0.18);
}

@media (max-width: 768px) {
  .coupon-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .coupon-box .btn {
    width: 100%;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>