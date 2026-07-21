<template>
  <Loading :active="isLoading" />

  <div class="admin-products-page">
    <div class="container py-5">
      <div class="admin-hero mb-4">
        <div>
          <span class="admin-badge">PRODUCT MANAGEMENT</span>
          <h1 class="fw-bold mt-3 mb-2">料理商品管理</h1>
          <p class="text-muted mb-0">
            管理前台顯示的日式料理與韓式料理商品，可新增、編輯、刪除與啟用商品。
          </p>
        </div>

        <button type="button" class="btn btn-brand btn-lg create-product-btn" @click="openModal(true)">
          <i class="bi bi-plus-circle me-1"></i>
          新增料理
        </button>
      </div>

      <div class="admin-products-card">
        <div class="products-card-header">
          <div>
            <h4 class="fw-bold mb-1">商品列表</h4>
            <p class="text-muted mb-0 small">
              目前共 {{ productCount }} 筆商品，每頁顯示 {{ perPage }} 筆。
            </p>
          </div>
        </div>

        <div v-if="paginatedProducts.length" class="table-responsive">
          <table class="table align-middle admin-product-table mb-0">
            <thead>
              <tr>
                <th>圖片</th>
                <th>分類</th>
                <th>料理名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th class="text-end">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in paginatedProducts" :key="item.id">
                <td>
                  <div class="admin-img">
                    <img
                      :src="item.imageUrl || defaultImage"
                      :alt="item.title || '料理圖片'"
                      class="admin-img-tag"
                    />
                  </div>
                </td>

                <td>
                  <span class="category-pill">
                    {{ item.category || '未分類' }}
                  </span>
                </td>

                <td>
                  <strong class="product-title">
                    {{ item.title || '未命名料理' }}
                  </strong>
                  <p class="text-muted small mb-0 product-desc">
                    {{ item.description || item.content || '尚未填寫商品描述。' }}
                  </p>
                </td>

                <td>
                  <span class="text-muted">
                    NT$ {{ item.origin_price || 0 }}
                  </span>
                </td>

                <td>
                  <strong class="price-text">
                    NT$ {{ item.price || 0 }}
                  </strong>
                </td>

                <td>
                  <span class="status-pill" :class="item.is_enabled ? 'enabled' : 'disabled'">
                    {{ item.is_enabled ? '啟用' : '未啟用' }}
                  </span>
                </td>

                <td class="text-end">
                  <div class="btn-group action-group">
                    <button
                      type="button"
                      class="btn btn-outline-brand btn-sm"
                      @click="openModal(false, item)"
                    >
                      <i class="bi bi-pencil-square me-1"></i>
                      編輯
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="openDelModal(item)"
                    >
                      <i class="bi bi-trash me-1"></i>
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty-products text-center">
          <div class="display-5 mb-3">🍱</div>
          <h5 class="fw-bold">目前沒有料理商品</h5>
          <p class="text-muted mb-4">
            可以先新增一筆日式料理或韓式料理，讓前台開始顯示商品。
          </p>

          <button type="button" class="btn btn-brand" @click="openModal(true)">
            新增第一筆料理
          </button>
        </div>

        <div v-if="productCount > perPage" class="pagination-wrap">
          <Pagination :pages="pagination" @emit-pages="changePage" />
        </div>
      </div>

      <!-- Modal -->
      <div ref="productModal" class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content product-modal border-0">
            <div class="modal-header product-modal-header">
              <div>
                <span class="modal-kicker">PRODUCT FORM</span>
                <h5 class="modal-title fw-bold mt-2">
                  {{ isNew ? '新增料理' : '編輯料理' }}
                </h5>
              </div>

              <button type="button" class="btn-close btn-close-white" @click="hideModal"></button>
            </div>

            <div class="modal-body p-4">
              <div class="row g-4">
                <div class="col-lg-4">
                  <div class="image-panel">
                    <h6 class="fw-bold mb-3">料理圖片</h6>

                    <label class="form-label fw-bold" for="imageUrl">圖片網址</label>
                    <input
                      id="imageUrl"
                      v-model="tempProduct.imageUrl"
                      type="text"
                      class="form-control mb-3"
                      placeholder="請輸入圖片網址"
                    />

                    <div class="preview-img">
                      <img
                        v-if="tempProduct.imageUrl"
                        :src="tempProduct.imageUrl"
                        :alt="tempProduct.title || '料理預覽圖片'"
                        class="preview-img-tag"
                      />

                      <div v-else class="preview-placeholder">
                        <i class="bi bi-image"></i>
                        <span>尚未設定圖片</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-8">
                  <div class="form-panel">
                    <h6 class="fw-bold mb-3">料理基本資料</h6>

                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label fw-bold" for="title">料理名稱</label>
                        <input
                          id="title"
                          v-model="tempProduct.title"
                          type="text"
                          class="form-control"
                          placeholder="例如：炙燒鮭魚握壽司套餐"
                        />
                      </div>

                      <div class="col-md-6">
                        <label class="form-label fw-bold" for="category">分類</label>
                        <select id="category" v-model="tempProduct.category" class="form-select">
                          <option value="日式料理">日式料理</option>
                          <option value="韓式料理">韓式料理</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label fw-bold" for="unit">單位</label>
                        <input
                          id="unit"
                          v-model="tempProduct.unit"
                          type="text"
                          class="form-control"
                          placeholder="份 / 套 / 鍋"
                        />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label fw-bold" for="originPrice">原價</label>
                        <input
                          id="originPrice"
                          v-model.number="tempProduct.origin_price"
                          type="number"
                          class="form-control"
                        />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label fw-bold" for="price">售價</label>
                        <input
                          id="price"
                          v-model.number="tempProduct.price"
                          type="number"
                          class="form-control"
                        />
                      </div>

                      <div class="col-12">
                        <label class="form-label fw-bold" for="description">短文案</label>
                        <input
                          id="description"
                          v-model="tempProduct.description"
                          type="text"
                          class="form-control"
                          placeholder="例如：入口即化的炙燒鮭魚，搭配醋飯與特製醬汁。"
                        />
                      </div>

                      <div class="col-12">
                        <label class="form-label fw-bold" for="content">詳細介紹</label>
                        <textarea
                          id="content"
                          v-model="tempProduct.content"
                          class="form-control"
                          rows="5"
                          placeholder="請輸入吸引用戶購買的商品介紹"
                        ></textarea>
                      </div>

                      <div class="col-12">
                        <div class="enabled-box">
                          <div>
                            <strong>商品啟用狀態</strong>
                            <p class="text-muted small mb-0">
                              啟用後會顯示在前台日韓料理列表。
                            </p>
                          </div>

                          <div class="form-check form-switch">
                            <input
                              id="isEnabled"
                              v-model="tempProduct.is_enabled"
                              class="form-check-input"
                              type="checkbox"
                              :true-value="1"
                              :false-value="0"
                            />
                            <label class="form-check-label fw-bold" for="isEnabled">
                              {{ tempProduct.is_enabled ? '啟用' : '停用' }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer product-modal-footer">
              <button type="button" class="btn btn-outline-secondary" @click="hideModal">
                取消
              </button>

              <button type="button" class="btn btn-brand" @click="updateProduct">
                儲存料理
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DelModal
    ref="delModal"
    :item="tempProduct"
    @del-item="deleteProduct"
  />
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';
import Pagination from '@/components/Pagination.vue';
import DelModal from '@/components/DelModal.vue';

const { VUE_APP_API, VUE_APP_PATH } = process.env;

export default {
  name: 'AdminProducts',
  components: {
    Pagination,
    DelModal,
  },
  data() {
    return {
      products: [],
      tempProduct: {},
      isNew: false,
      isLoading: false,
      productModal: null,
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    productCount() {
      const productList = Array.isArray(this.products)
        ? this.products
        : Object.values(this.products || {});

      return productList.length;
    },
    totalPages() {
      const productList = Array.isArray(this.products)
        ? this.products
        : Object.values(this.products || {});

      return Math.ceil(productList.length / this.perPage) || 1;
    },

    paginatedProducts() {
      const productList = Array.isArray(this.products)
        ? this.products
        : Object.values(this.products || {});

      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;

      return productList.slice(start, end);
    },

    pagination() {
      return {
        total_pages: this.totalPages,
        current_page: this.currentPage,
        has_pre: this.currentPage > 1,
        has_next: this.currentPage < this.totalPages,
      };
    },
  },
  methods: {
    getProducts() {
      this.isLoading = true;

      this.$http
        .get(`${VUE_APP_API}/api/${VUE_APP_PATH}/admin/products/all`)
        .then((res) => {
          const products = res.data.products || [];

          this.products = Array.isArray(products)
            ? products
            : Object.values(products);

          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
        })
        .catch(() => {
          this.pushToast('取得商品失敗', '請確認是否已登入後台，或稍後再試。', 'danger');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return;
      }

      this.currentPage = page;

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },

    openModal(isNew, item = null) {
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
          imageUrl: '',
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
      this.$refs.delModal.showModal();
    },
    updateProduct() {
      let url = `${VUE_APP_API}/api/${VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';

      if (!this.isNew) {
        url = `${VUE_APP_API}/api/${VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }

      this.isLoading = true;

      this.$http[httpMethod](url, { data: this.tempProduct })
        .then((res) => {
          if (res.data.success) {
            this.pushToast(
              this.isNew ? '新增料理成功' : '更新料理成功',
              res.data.message || '商品資料已成功儲存。',
              'success',
            );

            this.hideModal();
            this.getProducts();
          } else {
            this.pushToast('儲存料理失敗', res.data.message || '請稍後再試。', 'danger');
          }
        })
        .catch(() => {
          this.pushToast('儲存料理失敗', '請確認資料格式或登入狀態。', 'danger');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    deleteProduct() {
      const item = this.tempProduct;

      if (!item || !item.id) {
        this.pushToast('刪除料理失敗', '找不到料理資料，無法刪除。', 'warning');
        return;
      }

      this.isLoading = true;

      this.$http
        .delete(`${VUE_APP_API}/api/${VUE_APP_PATH}/admin/product/${item.id}`)
        .then((res) => {
          if (res.data.success) {
            this.pushToast('刪除料理成功', `${item.title || '料理'} 已刪除。`, 'success');

            this.$refs.delModal.hideModal();
            this.getProducts();
          } else {
            this.pushToast('刪除料理失敗', res.data.message || '請稍後再試。', 'danger');
          }
        })
        .catch(() => {
          this.pushToast('刪除料理失敗', '請確認登入狀態或稍後再試。', 'danger');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.productModal = new Modal(this.$refs.productModal);
    this.getProducts();
  },
};
</script>

<style scoped>
.admin-products-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(178, 58, 46, 0.12), transparent 32%),
    linear-gradient(180deg, var(--brand-bg) 0%, #ffffff 44%, var(--brand-bg-soft) 100%);
}

.admin-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 34px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.admin-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.create-product-btn {
  min-height: 50px;
  border-radius: 16px;
  font-weight: 900;
  white-space: nowrap;
}

.admin-products-card {
  overflow: hidden;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.products-card-header {
  padding: 26px 30px;
  background: var(--brand-bg-soft);
  border-bottom: 1px solid var(--brand-border);
}

.admin-product-table thead th {
  padding: 16px 18px;
  color: #6c5b50;
  background: var(--brand-primary-light);
  border-bottom: 1px solid var(--brand-border);
  font-size: 14px;
  white-space: nowrap;
}

.admin-product-table tbody td {
  padding: 18px;
  border-bottom: 1px solid #f1e4dc;
  vertical-align: middle;
}

.admin-product-table tbody tr:last-child td {
  border-bottom: 0;
}

.admin-img {
  width: 92px;
  height: 68px;
  overflow: hidden;
  border-radius: 16px;
  background: #fff4ec;
  border: 1px solid var(--brand-border);
}

.admin-img-tag {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.category-pill {
  display: inline-flex;
  padding: 6px 11px;
  border-radius: 999px;
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  font-size: 13px;
  font-weight: 900;
}

.product-title {
  color: var(--brand-text);
}

.product-desc {
  max-width: 360px;
  line-height: 1.6;
}

.price-text {
  color: var(--brand-primary);
}

.status-pill {
  display: inline-flex;
  min-width: 72px;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
}

.status-pill.enabled {
  color: var(--state-success);
  background: #e9f8ef;
}

.status-pill.disabled {
  color: var(--brand-muted);
  background: #f1e4dc;
}

.action-group {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 8px;
}

.action-group .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 68px;
  white-space: nowrap;
  font-weight: 800;
}

.empty-products {
  padding: 80px 24px;
  color: var(--brand-muted);
  background: #fffaf6;
}

.pagination-wrap {
  padding: 22px 24px 26px;
  border-top: 1px solid var(--brand-border);
  background: #fffaf6;
}

.product-modal {
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid var(--brand-border);
  box-shadow: 0 24px 64px rgba(80, 40, 20, 0.22);
}

.product-modal-header {
  color: #ffffff;
  background:
    linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  border-bottom: 0;
  padding: 24px 28px;
}

.modal-kicker {
  display: inline-block;
  padding: 6px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1px;
}

.image-panel,
.form-panel {
  height: 100%;
  padding: 22px;
  border-radius: 22px;
  background: #fffaf6;
  border: 1px solid var(--brand-border);
}

.form-control,
.form-select {
  min-height: 44px;
  border-color: var(--brand-border);
  border-radius: 12px;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 0.25rem rgba(178, 58, 46, 0.16);
}

.preview-img {
  overflow: hidden;
  min-height: 260px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px dashed var(--brand-border);
}

.preview-img-tag {
  width: 100%;
  height: 260px;
  display: block;
  object-fit: cover;
}

.preview-placeholder {
  min-height: 260px;
  display: grid;
  place-items: center;
  color: var(--brand-muted);
}

.preview-placeholder i {
  display: block;
  margin-bottom: 8px;
  color: var(--brand-primary);
  font-size: 40px;
  opacity: 0.55;
}

.enabled-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 18px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
}

.form-check-input:checked {
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.product-modal-footer {
  padding: 18px 28px;
  background: #fffaf6;
  border-top: 1px solid var(--brand-border);
}

.product-modal-footer .btn {
  min-width: 110px;
  border-radius: 12px;
  font-weight: 800;
}
.category-pill {
  white-space: nowrap;
}

.action-group {
  flex-wrap: nowrap;
}

.action-group .btn {
  white-space: nowrap;
  min-width: 64px;
}

.admin-product-table th,
.admin-product-table td {
  white-space: nowrap;
}

.product-title,
.product-desc {
  white-space: normal;
}

.product-desc {
  min-width: 220px;
}
@media (max-width: 768px) {
  .admin-hero {
    flex-direction: column;
    align-items: stretch;
    padding: 28px 22px;
    border-radius: 24px;
  }

  .create-product-btn {
    width: 100%;
  }

  .admin-products-card {
    border-radius: 24px;
  }

  .products-card-header {
    padding: 22px;
  }

  .action-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .action-group .btn {
    border-radius: 10px !important;
  }

  .image-panel,
  .form-panel {
    padding: 18px;
    border-radius: 18px;
  }

  .enabled-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>