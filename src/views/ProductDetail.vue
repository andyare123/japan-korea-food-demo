<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <div class="product-detail-root">
    <Loading :active="isLoading"></Loading>
    <div class="product-detail-page">
      <div class="container py-5">
        <div class="mb-4">
          <router-link to="/products" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i>
            返回日韓料理
          </router-link>
        </div>

        <div v-if="product.id" class="detail-card">
          <div class="row g-5 align-items-start">
            <div class="col-lg-6">
              <div
                class="detail-img"
                :style="{ backgroundImage: `url(${product.imageUrl || defaultImage})` }"
              >
                <span class="detail-category">
                  {{ product.category || '精選料理' }}
                </span>

                <button
                  type="button"
                  class="favorite-btn"
                  @click="toggleFavorite(product)"
                >
                  {{ isFavorite(product.id) ? '❤️' : '🤍' }}
                </button>
              </div>
            </div>

            <div class="col-lg-6">
              <span class="section-label">FOOD DETAIL</span>

              <h1 class="fw-bold mt-3 mb-3">
                {{ product.title }}
              </h1>

              <p class="text-muted detail-desc">
                {{ product.description || product.content || '日韓人氣料理。' }}
              </p>

              <div class="price-box my-4">
                <div>
                  <span class="text-muted d-block mb-1">料理售價</span>

                  <del
                    v-if="product.origin_price && product.origin_price !== product.price"
                    class="text-muted me-2"
                  >
                    NT$ {{ product.origin_price }}
                  </del>

                  <span class="detail-price">
                    NT$ {{ product.price }}
                  </span>
                </div>

                <div class="sold-box">
                  已售出 {{ product.num || 0 }} 份
                </div>
              </div>

              <div class="detail-info-grid mb-4">
                <div>
                  <span>料理分類</span>
                  <strong>{{ product.category || '未分類' }}</strong>
                </div>

                <div>
                  <span>單位</span>
                  <strong>{{ product.unit || '份' }}</strong>
                </div>
              </div>

              <div class="qty-card mb-4">
                <label class="form-label fw-bold">
                  選擇數量
                </label>

                <div class="input-group qty-control">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="decreaseQty"
                  >
                    -
                  </button>

                  <input
                    v-model.number="qty"
                    type="number"
                    min="1"
                    class="form-control text-center"
                  >

                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="increaseQty"
                  >
                    +
                  </button>

                  <span class="input-group-text">
                    {{ product.unit || '份' }}
                  </span>
                </div>
              </div>

              <div class="d-flex gap-3 detail-actions">
                <button
                  type="button"
                  class="btn btn-danger btn-lg flex-fill"
                  @click="addToCart(product.id)"
                >
                  <i class="bi bi-cart-plus me-1"></i>
                  加入購物車
                </button>

                <button
                  type="button"
                  class="btn btn-outline-danger btn-lg flex-fill"
                  @click="toggleFavorite(product)"
                >
                  {{ isFavorite(product.id) ? '移除收藏' : '加入收藏' }}
                </button>
              </div>

              <div class="notice-box mt-4">
                <h6 class="fw-bold mb-2">
                  <i class="bi bi-info-circle me-1"></i>
                  料理提醒
                </h6>

                <p class="mb-0">
                  餐點圖片僅供參考，實際內容依店家現場供應為主。若有口味、辣度或餐具需求，可於結帳備註填寫。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!isLoading" class="empty-box text-center">
          <div class="display-5 mb-3">🍱</div>
          <h4 class="fw-bold">找不到料理資料</h4>
          <p class="text-muted">
            可能是此料理尚未啟用，或商品資料不存在。
          </p>
          <router-link to="/products" class="btn btn-danger">
            返回日韓料理
          </router-link>
        </div>

        <!-- 你可能喜歡的料理 -->
        <section class="recommend-section mt-5">
          <div class="recommend-header mb-4">
            <div>
              <span class="section-label">RECOMMENDED FOR YOU</span>
              <h3 class="fw-bold mt-2 mb-1">你可能喜歡的料理</h3>
              <p class="text-muted mb-0">
                依照這道料理的分類、口味特色、價格區間與人氣程度，推薦相近的日韓料理。
              </p>
            </div>

            <router-link to="/products" class="btn btn-outline-danger">
              查看更多料理
            </router-link>
          </div>

          <div v-if="recommendedProducts.length" class="row g-4">
            <div
              v-for="item in recommendedProducts"
              :key="item.id"
              class="col-md-6 col-lg-4"
            >
              <div class="recommend-card">
                <div
                  class="recommend-img"
                  :style="{ backgroundImage: `url(${item.imageUrl || defaultImage})` }"
                >
                  <button
                    type="button"
                    class="favorite-btn"
                    @click="toggleFavorite(item)"
                  >
                    {{ isFavorite(item.id) ? '❤️' : '🤍' }}
                  </button>
                </div>

                <div class="p-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-light text-dark">
                      {{ item.category || '精選料理' }}
                    </span>

                    <small class="text-muted">
                      已售出 {{ item.num || 0 }} 份
                    </small>
                  </div>

                  <h5 class="fw-bold mb-2">
                    {{ item.title }}
                  </h5>

                  <p class="recommend-reason mb-2">
                    <i class="bi bi-stars me-1"></i>
                    {{ getRecommendReason(item) }}
                  </p>

                  <p class="text-muted recommend-desc">
                    {{ item.description || item.content || '日韓人氣料理。' }}
                  </p>

                  <div class="mb-3">
                    <del
                      v-if="item.origin_price && item.origin_price !== item.price"
                      class="text-muted me-2"
                    >
                      NT$ {{ item.origin_price }}
                    </del>

                    <span class="h5 text-danger fw-bold">
                      NT$ {{ item.price }}
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
                      @click="addRecommendedToCart(item)"
                    >
                      加入購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="recommend-empty text-center">
            <div class="display-5 mb-3">🍱</div>
            <h5 class="fw-bold">目前沒有其他推薦料理</h5>
            <p class="text-muted mb-0">
              你可以回到日韓料理頁面查看更多餐點。
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
const { VUE_APP_API, VUE_APP_PATH } = process.env;

export default {
  name: 'ProductDetail',
  inject: ['emitter'],
  data() {
    return {
      product: {},
      products: [],
      favorites: JSON.parse(localStorage.getItem('favoriteFoods')) || [],
      qty: 1,
      isLoading: false,
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    };
  },
  computed: {
    productId() {
      return this.$route.params.id;
    },

    recommendedProducts() {
      if (!this.product || !this.product.id) {
        return [];
      }

      return this.products
        .filter((item) => String(item.id) !== String(this.product.id))
        .map((item) => ({
          ...item,
          recommendScore: this.getRecommendScore(item),
        }))
        .sort((a, b) => b.recommendScore - a.recommendScore)
        .slice(0, 6);
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.qty = 1;
        this.getProduct();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      },
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

    getProduct() {
      if (!this.productId) {
        this.product = {};
        return;
      }

      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/product/${this.productId}`;

      this.isLoading = true;

      this.$http.get(url)
        .then((res) => {
          if (res.data.success && res.data.product) {
            this.product = res.data.product;
          } else {
            this.product = {};

            this.pushToast(
              '找不到料理資料',
              res.data.message || '此料理可能尚未啟用或不存在。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('取得料理詳情失敗:', error);

          this.product = {};

          this.pushToast(
            '取得料理詳情失敗',
            '請稍後再試，或返回料理列表重新選擇。',
            'danger',
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    getProducts() {
      this.$http
        .get(`${VUE_APP_API}/api/${VUE_APP_PATH}/products/all`)
        .then((res) => {
          this.products = res.data.products || [];
        })
        .catch((error) => {
          console.error('取得推薦料理失敗:', error);

          this.pushToast(
            '取得推薦料理失敗',
            '請稍後再試，或重新整理頁面。',
            'danger',
          );
        });
    },

    increaseQty() {
      this.qty += 1;
    },

    decreaseQty() {
      if (this.qty <= 1) {
        this.qty = 1;
        return;
      }

      this.qty -= 1;
    },

    addToCart(id) {
      const qty = Number(this.qty) || 1;

      if (qty < 1) {
        this.qty = 1;

        this.pushToast(
          '數量錯誤',
          '餐點數量至少需要 1 份。',
          'warning',
        );
        return;
      }

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
              `已成功加入 ${qty} ${this.product?.unit || '份'} ${this.product?.title || '餐點'}。`,
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

    addRecommendedToCart(item) {
      const data = {
        product_id: item.id,
        qty: 1,
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
              `已成功加入 1 ${item.unit || '份'} ${item.title || '餐點'}。`,
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
          console.error('加入推薦料理失敗:', error);

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

    toggleFavorite(item) {
      if (!item || !item.id) {
        return;
      }

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
      return this.favorites.some((item) => String(item.id) === String(id));
    },

    getRecommendScore(item) {
      let score = 0;

      const currentCategory = this.product.category || '';
      const itemCategory = item.category || '';

      const currentText = [
        this.product.title,
        this.product.category,
        this.product.description,
        this.product.content,
      ].join(' ').toLowerCase();

      const itemText = [
        item.title,
        item.category,
        item.description,
        item.content,
      ].join(' ').toLowerCase();

      if (currentCategory && currentCategory === itemCategory) {
        score += 60;
      }

      const keywords = this.extractKeywords(currentText);

      keywords.forEach((word) => {
        if (itemText.includes(word)) {
          score += 8;
        }
      });

      const currentPrice = Number(this.product.price || 0);
      const itemPrice = Number(item.price || 0);

      if (currentPrice > 0 && itemPrice > 0) {
        const priceDiff = Math.abs(currentPrice - itemPrice);

        if (priceDiff <= 50) {
          score += 20;
        } else if (priceDiff <= 100) {
          score += 12;
        } else if (priceDiff <= 200) {
          score += 6;
        }
      }

      score += Math.min(Number(item.num || 0), 50);

      return score;
    },

    extractKeywords(text) {
      const stopWords = [
        '日式料理',
        '韓式料理',
        '料理',
        '人氣',
        '精選',
        '套餐',
        '一份',
        '口味',
        '美味',
      ];

      return text
        .replace(/[，。！？、,.!?]/g, ' ')
        .split(/\s+/)
        .map((word) => word.trim())
        .filter((word) => word.length >= 2)
        .filter((word) => !stopWords.includes(word))
        .slice(0, 12);
    },

    getRecommendReason(item) {
      if (item.category === this.product.category) {
        return `同樣屬於 ${item.category}，性質與這道料理相近。`;
      }

      const currentPrice = Number(this.product.price || 0);
      const itemPrice = Number(item.price || 0);

      if (currentPrice > 0 && itemPrice > 0 && Math.abs(currentPrice - itemPrice) <= 100) {
        return '價格區間接近，適合一起比較選購。';
      }

      if (Number(item.num || 0) > 0) {
        return '這是目前較受歡迎的人氣料理。';
      }

      return '這道料理也適合加入你的下一次點餐清單。';
    },
  },
  mounted() {
    this.getProduct();
    this.getProducts();
  },
};
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(220, 53, 69, 0.1), transparent 30%),
    linear-gradient(180deg, #fff7ef 0%, #ffffff 44%, #fffaf5 100%);
}

.detail-card {
  padding: 34px;
  border-radius: 32px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.detail-img {
  position: relative;
  min-height: 480px;
  border-radius: 28px;
  background-size: cover;
  background-position: center;
  background-color: #fff4ec;
  border: 1px solid #f1d8ca;
  overflow: hidden;
}

.detail-category {
  position: absolute;
  top: 18px;
  left: 18px;
  padding: 8px 14px;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(178, 58, 46, 0.95);
  font-size: 14px;
  font-weight: 900;
}

.favorite-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
}

.section-label {
  display: inline-block;
  color: #b23a2e;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.detail-desc {
  font-size: 17px;
  line-height: 1.9;
}

.price-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 22px;
  border-radius: 22px;
  background: #fff8f2;
  border: 1px solid #f1d8ca;
}

.detail-price {
  color: #b23a2e;
  font-size: 34px;
  font-weight: 900;
}

.sold-box {
  flex: 0 0 auto;
  padding: 8px 14px;
  border-radius: 999px;
  color: #b23a2e;
  background: #fff0e7;
  font-weight: 900;
}

.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.detail-info-grid div {
  padding: 18px;
  border-radius: 18px;
  background: #fffaf6;
  border: 1px solid #f1e4dc;
}

.detail-info-grid span {
  display: block;
  margin-bottom: 6px;
  color: #888;
  font-size: 13px;
}

.detail-info-grid strong {
  color: #333;
}

.qty-card {
  padding: 20px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #f1e4dc;
}

.qty-control {
  max-width: 260px;
}

.qty-control .form-control {
  font-weight: 900;
}

.notice-box {
  padding: 18px;
  border-radius: 18px;
  color: #6c5b50;
  background: #fff8e1;
  border: 1px solid #ffe0a1;
  line-height: 1.8;
}

.empty-box {
  padding: 80px 24px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 16px 42px rgba(120, 54, 28, 0.1);
}

.recommend-section {
  padding: 34px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.09);
}

.recommend-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 18px;
}

.recommend-card {
  height: 100%;
  overflow: hidden;
  border-radius: 26px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 16px 38px rgba(120, 54, 28, 0.09);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.recommend-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 22px 48px rgba(120, 54, 28, 0.14);
}

.recommend-img {
  position: relative;
  height: 220px;
  background-size: cover;
  background-position: center;
  background-color: #fff4ec;
}

.recommend-desc {
  min-height: 48px;
  line-height: 1.7;
}

.recommend-reason {
  min-height: 24px;
  color: #b23a2e;
  font-size: 14px;
  font-weight: 800;
}

.recommend-empty {
  padding: 70px 24px;
  border-radius: 28px;
  background: #fff8f3;
  border: 1px dashed #e5c9b8;
}

@media (max-width: 991px) {
  .detail-img {
    min-height: 360px;
  }

  .price-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-actions {
    flex-direction: column;
  }

  .recommend-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .recommend-header .btn {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .detail-card,
  .recommend-section {
    padding: 24px 18px;
    border-radius: 22px;
  }

  .detail-img {
    min-height: 300px;
    border-radius: 22px;
  }

  .detail-info-grid {
    grid-template-columns: 1fr;
  }

  .detail-price {
    font-size: 28px;
  }

  .qty-control {
    max-width: 100%;
  }
}
</style>