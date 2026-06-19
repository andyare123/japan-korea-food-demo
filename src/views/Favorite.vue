<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <Loading :active="isLoading" />

  <div class="favorite-page">
    <div class="container py-5">
      <div class="favorite-hero mb-5">
        <span class="hero-badge">MY FAVORITES</span>
        <h1 class="fw-bold mt-3 mb-3">我的最愛</h1>
        <p class="text-muted mb-0">
          收藏喜歡的日韓料理，下次快速回購，也會依照你的收藏推薦你可能喜歡的料理。
        </p>
      </div>

      <!-- 我的最愛 -->
      <section class="mb-5">
        <div class="section-title mb-4">
          <div>
            <span class="section-label">FAVORITE LIST</span>
            <h3 class="fw-bold mt-2 mb-1">已收藏料理</h3>
            <p class="text-muted mb-0">
              這些是你目前加入收藏的料理。
            </p>
          </div>
        </div>

        <div v-if="favorites.length" class="row g-4">
          <div
            v-for="item in favorites"
            :key="item.id"
            class="col-md-6 col-lg-4"
          >
            <div class="food-card favorite-card">
              <div
                class="food-img"
                :style="{ backgroundImage: `url(${item.imageUrl || defaultImage})` }"
              >
                <span class="card-tag">
                  已收藏
                </span>
              </div>

              <div class="p-4">
                <span class="badge bg-light text-dark mb-2">
                  {{ item.category || '精選料理' }}
                </span>

                <h5 class="fw-bold mb-2">
                  {{ item.title }}
                </h5>

                <p class="text-muted food-desc">
                  {{ item.description || item.content || '日韓人氣料理。' }}
                </p>

                <p class="text-danger fw-bold h5 mb-3">
                  NT$ {{ item.price }}
                </p>

                <div class="d-flex gap-2">
                  <router-link
                    :to="`/product/${item.id}`"
                    class="btn btn-outline-dark flex-fill"
                  >
                    查看
                  </router-link>

                  <button
                    type="button"
                    class="btn btn-outline-danger flex-fill"
                    @click="removeFavorite(item.id)"
                  >
                    移除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-box text-center">
          <div class="display-4 mb-3">🤍</div>
          <h4 class="fw-bold">目前沒有收藏料理</h4>
          <p class="text-muted">
            去日韓料理頁面看看，把喜歡的料理加入我的最愛吧。
          </p>
          <router-link to="/products" class="btn btn-danger">
            前往日韓料理
          </router-link>
        </div>
      </section>

      <!-- 你可能喜歡 -->
      <section class="recommend-section">
        <div class="recommend-header mb-4">
          <div>
            <span class="section-label">RECOMMENDED FOR YOU</span>
            <h3 class="fw-bold mt-2 mb-1">你可能喜歡的料理</h3>
            <p class="text-muted mb-0">
              {{ recommendDescription }}
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
            <div class="food-card recommend-card">
              <div
                class="food-img"
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

                <p class="text-muted food-desc">
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
                    @click="toggleFavorite(item)"
                  >
                    加入收藏
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-box text-center">
          <div class="display-4 mb-3">🍱</div>
          <h4 class="fw-bold">目前沒有推薦料理</h4>
          <p class="text-muted">
            你可能已經收藏所有料理，或目前尚未取得料理資料。
          </p>
          <router-link to="/products" class="btn btn-danger">
            前往日韓料理
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
const { VUE_APP_API, VUE_APP_PATH } = process.env;

export default {
  inject: ['emitter'],
  data() {
    return {
      favorites: JSON.parse(localStorage.getItem('favoriteFoods')) || [],
      products: [],
      isLoading: false,
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    };
  },
  computed: {
    favoriteCategoryList() {
      return [...new Set(
        this.favorites
          .map((item) => item.category)
          .filter((category) => category),
      )];
    },

    recommendedProducts() {
      const favoriteIds = this.favorites.map((item) => item.id);

      const notFavoritedProducts = this.products.filter(
        (item) => !favoriteIds.includes(item.id),
      );

      if (!notFavoritedProducts.length) {
        return [];
      }

      if (!this.favorites.length) {
        return [...notFavoritedProducts]
          .sort((a, b) => Number(b.num || 0) - Number(a.num || 0))
          .slice(0, 6);
      }

      return [...notFavoritedProducts]
        .sort((a, b) => {
          const aCategoryScore = this.favoriteCategoryList.includes(a.category) ? 1 : 0;
          const bCategoryScore = this.favoriteCategoryList.includes(b.category) ? 1 : 0;

          if (aCategoryScore !== bCategoryScore) {
            return bCategoryScore - aCategoryScore;
          }

          return Number(b.num || 0) - Number(a.num || 0);
        })
        .slice(0, 6);
    },

    recommendDescription() {
      if (this.favorites.length) {
        return '根據你收藏過的料理分類，推薦相近口味與人氣餐點。';
      }

      return '你目前還沒有收藏料理，先推薦目前較熱門的人氣餐點給你。';
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
        })
        .catch((error) => {
          console.error('取得推薦料理失敗:', error);

          this.pushToast(
            '取得推薦料理失敗',
            '請稍後再試，或重新整理頁面。',
            'danger',
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    syncFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favoriteFoods')) || [];
    },

    saveFavorites() {
      localStorage.setItem('favoriteFoods', JSON.stringify(this.favorites));
      window.dispatchEvent(new Event('favorites-updated'));
    },

    removeFavorite(id) {
      const target = this.favorites.find((item) => item.id === id);
      const title = target?.title || '料理';

      this.favorites = this.favorites.filter((item) => item.id !== id);
      this.saveFavorites();

      this.pushToast(
        '已移除我的最愛',
        `${title} 已從收藏清單移除。`,
        'warning',
      );
    },

    toggleFavorite(item) {
      const index = this.favorites.findIndex((food) => food.id === item.id);

      if (index === -1) {
        this.favorites.push(item);
        this.saveFavorites();

        this.pushToast(
          '已加入我的最愛',
          `${item.title || '料理'} 已加入收藏清單。`,
          'success',
        );
      } else {
        this.removeFavorite(item.id);
      }
    },

    isFavorite(id) {
      return this.favorites.some((item) => item.id === id);
    },

    getRecommendReason(item) {
      if (this.favoriteCategoryList.includes(item.category)) {
        return `你收藏過 ${item.category}，所以推薦這道料理。`;
      }

      if (Number(item.num || 0) > 0) {
        return '這是目前較受歡迎的人氣料理。';
      }

      return '這道料理適合加入你的下一次點餐清單。';
    },
  },
  mounted() {
    this.getProducts();
    window.addEventListener('favorites-updated', this.syncFavorites);
  },
  beforeUnmount() {
    window.removeEventListener('favorites-updated', this.syncFavorites);
  },
};
</script>

<style scoped>
.favorite-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(220, 53, 69, 0.1), transparent 30%),
    linear-gradient(180deg, #fff7ef 0%, #ffffff 44%, #fffaf5 100%);
}

.favorite-hero {
  padding: 40px;
  border-radius: 30px;
  background:
    linear-gradient(135deg, rgba(178, 58, 46, 0.14), rgba(255, 255, 255, 0.96)),
    #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.hero-badge,
.section-label {
  display: inline-block;
  color: #b23a2e;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.hero-badge {
  padding: 8px 14px;
  border-radius: 999px;
  background: #fff0e7;
}

.section-title,
.recommend-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 18px;
}

.food-card {
  height: 100%;
  overflow: hidden;
  border-radius: 26px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 16px 38px rgba(120, 54, 28, 0.09);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.food-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 22px 48px rgba(120, 54, 28, 0.14);
}

.food-img {
  position: relative;
  height: 220px;
  background-size: cover;
  background-position: center;
  background-color: #fff4ec;
}

.card-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 7px 12px;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(178, 58, 46, 0.94);
  font-size: 13px;
  font-weight: 900;
}

.favorite-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
}

.food-desc {
  min-height: 48px;
  line-height: 1.7;
}

.recommend-section {
  padding: 34px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.09);
}

.recommend-reason {
  min-height: 24px;
  color: #b23a2e;
  font-size: 14px;
  font-weight: 800;
}

.empty-box {
  padding: 80px 24px;
  border-radius: 28px;
  background: #fff8f3;
  border: 1px dashed #e5c9b8;
}

@media (max-width: 768px) {
  .favorite-hero {
    padding: 28px 22px;
    border-radius: 22px;
  }

  .section-title,
  .recommend-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .recommend-header .btn {
    width: 100%;
  }

  .recommend-section {
    padding: 24px 18px;
    border-radius: 22px;
  }
}
</style>