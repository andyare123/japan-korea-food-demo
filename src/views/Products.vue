<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <Loading :active="isLoading"></Loading>

  <div class="admin-food-page">
    <div class="container py-5">
      <div class="admin-header mb-4">
        <div>
          <span class="badge bg-danger mb-3">後台管理</span>
          <h1 class="fw-bold mb-2">料理商品管理</h1>
          <p class="text-muted mb-0">
            管理日式料理與韓式料理商品，可新增、編輯、刪除與設定是否啟用。
          </p>
        </div>

        <button
          type="button"
          class="btn btn-danger btn-lg"
          @click="openModal(true)"
        >
          新增料理
        </button>
      </div>

      <div class="filter-card mb-4">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label fw-bold">分類篩選</label>
            <select v-model="selectedCategory" class="form-select">
              <option value="全部">全部料理</option>
              <option value="日式料理">日式料理</option>
              <option value="韓式料理">韓式料理</option>
            </select>
          </div>

          <div class="col-md-5">
            <label class="form-label fw-bold">搜尋料理</label>
            <input
              v-model.trim="keyword"
              type="text"
              class="form-control"
              placeholder="輸入料理名稱、分類或文案"
            >
          </div>

          <div class="col-md-3">
            <button
              type="button"
              class="btn btn-outline-secondary w-100"
              @click="resetFilter"
            >
              清除篩選
            </button>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th width="120">圖片</th>
                <th>料理資訊</th>
                <th width="120">分類</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="100">狀態</th>
                <th width="180" class="text-end">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in filteredProducts" :key="item.id">
                <td>
                  <div
                    class="food-thumb"
                    :style="{ backgroundImage: `url(${item.imageUrl || defaultImage})` }"
                  ></div>
                </td>

                <td>
                  <h6 class="fw-bold mb-1">
                    {{ item.title }}
                  </h6>
                  <p class="text-muted small mb-0 food-description">
                    {{ item.description || item.content || '尚未填寫料理文案' }}
                  </p>
                </td>

                <td>
                  <span
                    class="badge"
                    :class="item.category === '韓式料理' ? 'bg-warning text-dark' : 'bg-danger'"
                  >
                    {{ item.category || '未分類' }}
                  </span>
                </td>

                <td>
                  {{ $filters.currency(item.origin_price) }}
                </td>

                <td class="text-danger fw-bold">
                  {{ $filters.currency(item.price) }}
                </td>

                <td>
                  <span v-if="item.is_enabled" class="text-success fw-bold">
                    啟用
                  </span>
                  <span v-else class="text-muted">
                    未啟用
                  </span>
                </td>

                <td class="text-end">
                  <div class="btn-group">
                    <button
                      type="button"
                      class="btn btn-outline-dark btn-sm"
                      @click="openModal(false, item)"
                    >
                      編輯
                    </button>

                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="openDelModal(item)"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="!filteredProducts.length && !isLoading"
          class="empty-box text-center"
        >
          目前沒有符合條件的料理商品。
        </div>
      </div>
    </div>

    <!-- 新增 / 編輯 Modal -->
    <div
      ref="productModal"
      class="modal fade"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              {{ isNew ? '新增料理商品' : '編輯料理商品' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="hideModal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row g-4">
              <div class="col-md-4">
                <label class="form-label fw-bold">圖片網址</label>
                <input
                  v-model="tempProduct.imageUrl"
                  type="text"
                  class="form-control mb-3"
                  placeholder="請輸入圖片網址"
                >

                <div
                  v-if="tempProduct.imageUrl"
                  class="preview-img"
                  :style="{ backgroundImage: `url(${tempProduct.imageUrl})` }"
                ></div>

                <div v-else class="preview-empty">
                  尚未輸入圖片
                </div>
              </div>

              <div class="col-md-8">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">料理名稱</label>
                    <input
                      v-model="tempProduct.title"
                      type="text"
                      class="form-control"
                      placeholder="例如：炙燒鮭魚握壽司套餐"
                    >
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fw-bold">分類</label>
                    <select v-model="tempProduct.category" class="form-select">
                      <option value="日式料理">日式料理</option>
                      <option value="韓式料理">韓式料理</option>
                    </select>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-bold">單位</label>
                    <input
                      v-model="tempProduct.unit"
                      type="text"
                      class="form-control"
                      placeholder="份 / 套 / 鍋"
                    >
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-bold">原價</label>
                    <input
                      v-model.number="tempProduct.origin_price"
                      type="number"
                      class="form-control"
                    >
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-bold">售價</label>
                    <input
                      v-model.number="tempProduct.price"
                      type="number"
                      class="form-control"
                    >
                  </div>

                  <div class="col-12">
                    <label class="form-label fw-bold">短文案</label>
                    <input
                      v-model="tempProduct.description"
                      type="text"
                      class="form-control"
                      placeholder="例如：外酥內嫩韓式炸雞，裹上甜辣醬超涮嘴。"
                    >
                  </div>

                  <div class="col-12">
                    <label class="form-label fw-bold">料理介紹</label>
                    <textarea
                      v-model="tempProduct.content"
                      class="form-control"
                      rows="5"
                      placeholder="請輸入吸引用戶購買的料理介紹"
                    ></textarea>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input
                        id="isEnabled"
                        v-model="tempProduct.is_enabled"
                        class="form-check-input"
                        type="checkbox"
                        :true-value="1"
                        :false-value="0"
                      >
                      <label class="form-check-label fw-bold" for="isEnabled">
                        是否啟用於前台
                      </label>
                    </div>
                    <p class="text-muted small mt-1 mb-0">
                      若未啟用，前台可能會顯示找不到產品。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="hideModal"
            >
              取消
            </button>

            <button
              type="button"
              class="btn btn-danger"
              @click="updateProduct"
            >
              儲存料理
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 刪除 Modal -->
    <div
      ref="delModal"
      class="modal fade"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold text-danger">
              刪除料理商品
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="hideDelModal"
            ></button>
          </div>

          <div class="modal-body">
            確定要刪除
            <strong>{{ tempProduct.title }}</strong>
            嗎？刪除後將無法復原。
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="hideDelModal"
            >
              取消
            </button>

            <button
              type="button"
              class="btn btn-danger"
              @click="deleteProduct"
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';

const { VUE_APP_API, VUE_APP_PATH } = process.env;

export default {
  name: 'AdminProducts',
  inject: ['emitter'],
  data() {
    return {
      products: [],
      tempProduct: {},
      isNew: false,
      isLoading: false,
      productModal: null,
      delModal: null,
      selectedCategory: '全部',
      keyword: '',
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    };
  },
  computed: {
    filteredProducts() {
      let result = this.products;

      if (this.selectedCategory !== '全部') {
        result = result.filter((item) => item.category === this.selectedCategory);
      }

      if (this.keyword) {
        const keyword = this.keyword.toLowerCase();
        result = result.filter((item) => {
          const text = [
            item.title,
            item.category,
            item.description,
            item.content,
          ].join(' ').toLowerCase();

          return text.includes(keyword);
        });
      }

      return result;
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
      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/admin/products/all`;

      this.isLoading = true;

      this.$http.get(url)
        .then((res) => {
          this.products = res.data.products || [];
        })
        .catch((error) => {
          console.error('取得料理商品失敗:', error);
          this.pushToast('取得料理商品失敗', '請稍後再試。', 'danger');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    openModal(isNew, item) {
      this.isNew = isNew;

      if (isNew) {
        this.tempProduct = {
          title: '',
          category: '日式料理',
          origin_price: 0,
          price: 0,
          unit: '份',
          description: '',
          content: '',
          imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
          is_enabled: 1,
        };
      } else {
        this.tempProduct = { ...item };
      }

      this.productModal.show();
    },

    hideModal() {
      this.productModal.hide();
    },

    openDelModal(item) {
      this.tempProduct = { ...item };
      this.delModal.show();
    },

    hideDelModal() {
      this.delModal.hide();
    },

    updateProduct() {
      if (!this.tempProduct.title) {
        this.pushToast('請輸入料理名稱', '料理名稱不可空白。', 'warning');
        return;
      }

      const productData = {
        title: this.tempProduct.title,
        category: this.tempProduct.category || '日式料理',
        origin_price: Number(this.tempProduct.origin_price) || 0,
        price: Number(this.tempProduct.price) || 0,
        unit: this.tempProduct.unit || '份',
        description: this.tempProduct.description || '',
        content: this.tempProduct.content || '',
        imageUrl: this.tempProduct.imageUrl || '',
        is_enabled: Number(this.tempProduct.is_enabled) || 0,
      };

      let url = `${VUE_APP_API}/api/${VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';

      if (!this.isNew) {
        url = `${VUE_APP_API}/api/${VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }

      this.isLoading = true;

      this.$http[httpMethod](url, { data: productData })
        .then((res) => {
          this.$httpMessageState(res, this.isNew ? '新增料理' : '更新料理');

          if (res.data.success) {
            this.pushToast(
              this.isNew ? '新增料理成功' : '更新料理成功',
              `${productData.title} 已成功儲存。`,
              'success',
            );

            this.hideModal();
            this.getProducts();
          } else {
            this.pushToast(
              '儲存失敗',
              res.data.message || '請確認資料是否填寫正確。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('儲存料理失敗:', error);

          if (error.response) {
            this.pushToast(
              '儲存失敗',
              error.response.data.message || `狀態碼：${error.response.status}`,
              'danger',
            );
          } else {
            this.pushToast(
              '儲存失敗',
              '請查看 console 錯誤訊息。',
              'danger',
            );
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    deleteProduct() {
      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;

      this.isLoading = true;

      this.$http.delete(url)
        .then((res) => {
          this.$httpMessageState(res, '刪除料理');

          if (res.data.success) {
            this.pushToast(
              '刪除料理成功',
              `${this.tempProduct.title || '料理商品'} 已刪除。`,
              'success',
            );

            this.hideDelModal();
            this.getProducts();
          } else {
            this.pushToast(
              '刪除料理失敗',
              res.data.message || '請稍後再試。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('刪除料理失敗:', error);
          this.pushToast('刪除料理失敗', '請稍後再試。', 'danger');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    resetFilter() {
      this.selectedCategory = '全部';
      this.keyword = '';
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );

    if (!token) {
      this.pushToast('請先登入後台', '尚未取得登入權限，請重新登入。', 'warning');
      this.$router.push('/login');
      return;
    }

    this.$http.defaults.headers.common.Authorization = token;

    this.productModal = new Modal(this.$refs.productModal);
    this.delModal = new Modal(this.$refs.delModal);
    this.getProducts();
  },
};
</script>

<style scoped>
.admin-food-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(220, 53, 69, 0.1), transparent 32%),
    linear-gradient(180deg, #fff7ef 0%, #ffffff 42%, #fffaf5 100%);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 36px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.filter-card,
.table-card {
  padding: 24px;
  border-radius: 26px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 14px 34px rgba(120, 54, 28, 0.08);
}

.food-thumb {
  width: 96px;
  height: 72px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  background-color: #fff0e7;
  border: 1px solid #f1d8ca;
}

.food-description {
  max-width: 420px;
  line-height: 1.6;
}

.preview-img,
.preview-empty {
  height: 260px;
  border-radius: 22px;
  background-size: cover;
  background-position: center;
  background-color: #fff8f2;
  border: 1px solid #f1d8ca;
}

.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aa8c7a;
}

.empty-box {
  padding: 56px 20px;
  color: #777;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 26px 22px;
  }

  .admin-header .btn {
    width: 100%;
  }

  .table-card {
    padding: 16px;
  }
}
</style>