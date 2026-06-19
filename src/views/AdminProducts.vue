<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <Loading :active="isLoading" />

  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4 admin-header">
      <div>
        <h2 class="fw-bold mb-1">料理商品管理</h2>
        <p class="text-muted mb-0">
          管理前台顯示的日式料理與韓式料理商品。
        </p>
      </div>

      <button class="btn btn-danger" @click="openModal(true)">
        新增料理
      </button>
    </div>

    <div class="table-responsive">
      <table class="table align-middle">
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
          <tr v-for="item in products" :key="item.id">
            <td>
              <div
                class="admin-img"
                :style="{ backgroundImage: `url(${item.imageUrl || defaultImage})` }"
              ></div>
            </td>

            <td>
              <span class="badge bg-light text-dark">
                {{ item.category }}
              </span>
            </td>

            <td>
              <strong>{{ item.title }}</strong>
              <p class="text-muted small mb-0">
                {{ item.description || item.content }}
              </p>
            </td>

            <td>NT$ {{ item.origin_price }}</td>
            <td class="text-danger fw-bold">NT$ {{ item.price }}</td>

            <td>
              <span v-if="item.is_enabled" class="text-success">啟用</span>
              <span v-else class="text-muted">未啟用</span>
            </td>

            <td class="text-end">
              <button class="btn btn-outline-dark btn-sm me-2" @click="openModal(false, item)">
                編輯
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="deleteProduct(item)">
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      ref="productModal"
      class="modal fade"
      tabindex="-1"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              {{ isNew ? '新增料理' : '編輯料理' }}
            </h5>
            <button type="button" class="btn-close" @click="hideModal"></button>
          </div>

          <div class="modal-body">
            <div class="row g-4">
              <div class="col-md-4">
                <label class="form-label">圖片網址</label>
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
              </div>

              <div class="col-md-8">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">料理名稱</label>
                    <input
                      v-model="tempProduct.title"
                      type="text"
                      class="form-control"
                      placeholder="例如：炙燒鮭魚握壽司套餐"
                    >
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">分類</label>
                    <select v-model="tempProduct.category" class="form-select">
                      <option value="日式料理">日式料理</option>
                      <option value="韓式料理">韓式料理</option>
                    </select>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label">單位</label>
                    <input
                      v-model="tempProduct.unit"
                      type="text"
                      class="form-control"
                      placeholder="份 / 套 / 鍋"
                    >
                  </div>

                  <div class="col-md-4">
                    <label class="form-label">原價</label>
                    <input
                      v-model.number="tempProduct.origin_price"
                      type="number"
                      class="form-control"
                    >
                  </div>

                  <div class="col-md-4">
                    <label class="form-label">售價</label>
                    <input
                      v-model.number="tempProduct.price"
                      type="number"
                      class="form-control"
                    >
                  </div>

                  <div class="col-12">
                    <label class="form-label">短文案</label>
                    <input
                      v-model="tempProduct.description"
                      type="text"
                      class="form-control"
                      placeholder="例如：入口即化的炙燒鮭魚，搭配醋飯與特製醬汁。"
                    >
                  </div>

                  <div class="col-12">
                    <label class="form-label">詳細介紹</label>
                    <textarea
                      v-model="tempProduct.content"
                      class="form-control"
                      rows="5"
                      placeholder="請輸入吸引用戶購買的商品介紹"
                    ></textarea>
                  </div>

                  <div class="col-12">
                    <div class="form-check">
                      <input
                        id="isEnabled"
                        v-model="tempProduct.is_enabled"
                        class="form-check-input"
                        type="checkbox"
                        :true-value="1"
                        :false-value="0"
                      >
                      <label class="form-check-label" for="isEnabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="hideModal">
              取消
            </button>
            <button class="btn btn-danger" @click="updateProduct">
              儲存
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
  data() {
    return {
      products: [],
      tempProduct: {},
      isNew: false,
      isLoading: false,
      productModal: null,
    };
  },
  methods: {
    getProducts() {
      this.isLoading = true;

      this.$http
        .get(`${VUE_APP_API}/api/${VUE_APP_PATH}/admin/products/all`)
        .then((res) => {
          this.products = res.data.products || [];
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

    updateProduct() {
      let url = `${VUE_APP_API}/api/${VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';

      if (!this.isNew) {
        url = `${VUE_APP_API}/api/${VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }

      this.isLoading = true;

      this.$http[httpMethod](url, { data: this.tempProduct })
        .then(() => {
          alert(this.isNew ? '新增成功' : '更新成功');
          this.hideModal();
          this.getProducts();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    deleteProduct(item) {
      const confirmDelete = window.confirm(`確定要刪除「${item.title}」嗎？`);

      if (!confirmDelete) return;

      this.isLoading = true;

      this.$http
        .delete(`${VUE_APP_API}/api/${VUE_APP_PATH}/admin/product/${item.id}`)
        .then(() => {
          alert('刪除成功');
          this.getProducts();
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
.admin-img {
  width: 90px;
  height: 64px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
}

.preview-img {
  height: 260px;
  border-radius: 18px;
  background-size: cover;
  background-position: center;
  border: 1px solid #eee;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 16px;
  }

  .admin-header .btn {
    width: 100%;
  }
}
</style>