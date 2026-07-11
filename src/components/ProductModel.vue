<template>
  <div
    id="productModal"
    ref="modal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content product-modal border-0">
        <div class="modal-header product-modal-header">
          <div>
            <span class="modal-kicker">PRODUCT FORM</span>
            <h5 id="productModalLabel" class="modal-title fw-bold mt-2">
              商品資料編輯
            </h5>
          </div>

          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body p-4">
          <div class="row g-4">
            <div class="col-lg-4">
              <div class="image-panel">
                <h6 class="fw-bold mb-3">商品圖片</h6>

                <div class="mb-3">
                  <label for="image" class="form-label fw-bold">
                    輸入圖片網址
                  </label>
                  <input
                    id="image"
                    v-model="tempProduct.imageUrl"
                    type="text"
                    class="form-control"
                    placeholder="請輸入圖片連結"
                  />
                </div>

                <div class="mb-3">
                  <label for="customFile" class="form-label fw-bold">
                    或上傳圖片
                  </label>
                  <input
                    id="customFile"
                    ref="fileInput"
                    type="file"
                    class="form-control"
                    @change="uploadFile"
                  />
                </div>

                <div class="image-preview">
                  <img
                    v-if="tempProduct.imageUrl"
                    :src="tempProduct.imageUrl"
                    :alt="tempProduct.title || '商品圖片'"
                  />
                  <div v-else class="image-placeholder">
                    <i class="bi bi-image"></i>
                    <span>尚未設定圖片</span>
                  </div>
                </div>

                <div v-if="tempProduct.images" class="mt-4">
                  <h6 class="fw-bold mb-3">更多圖片</h6>

                  <div
                    v-for="(image, key) in tempProduct.images"
                    :key="key"
                    class="mb-2 input-group"
                  >
                    <input
                      v-model="tempProduct.images[key]"
                      type="url"
                      class="form-control"
                      placeholder="請輸入圖片連結"
                    />

                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="tempProduct.images.splice(key, 1)"
                    >
                      移除
                    </button>
                  </div>

                  <button
                    v-if="tempProduct.images[tempProduct.images.length - 1] || !tempProduct.images.length"
                    type="button"
                    class="btn btn-outline-brand btn-sm w-100"
                    @click="tempProduct.images.push('')"
                  >
                    新增圖片
                  </button>
                </div>
              </div>
            </div>

            <div class="col-lg-8">
              <div class="form-panel">
                <h6 class="fw-bold mb-3">基本資料</h6>

                <div class="mb-3">
                  <label for="title" class="form-label fw-bold">標題</label>
                  <input
                    id="title"
                    v-model="tempProduct.title"
                    type="text"
                    class="form-control"
                    placeholder="請輸入標題"
                  />
                </div>

                <div class="row gx-3">
                  <div class="mb-3 col-md-6">
                    <label for="category" class="form-label fw-bold">分類</label>
                    <input
                      id="category"
                      v-model="tempProduct.category"
                      type="text"
                      class="form-control"
                      placeholder="例如：日式料理、韓式料理"
                    />
                  </div>

                  <div class="mb-3 col-md-6">
                    <label for="unit" class="form-label fw-bold">單位</label>
                    <input
                      id="unit"
                      v-model="tempProduct.unit"
                      type="text"
                      class="form-control"
                      placeholder="例如：份、組、碗"
                    />
                  </div>
                </div>

                <div class="row gx-3">
                  <div class="mb-3 col-md-6">
                    <label for="origin_price" class="form-label fw-bold">原價</label>
                    <input
                      id="origin_price"
                      v-model.number="tempProduct.origin_price"
                      type="number"
                      class="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>

                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label fw-bold">售價</label>
                    <input
                      id="price"
                      v-model.number="tempProduct.price"
                      type="number"
                      class="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label fw-bold">產品描述</label>
                  <textarea
                    id="description"
                    v-model="tempProduct.description"
                    class="form-control"
                    rows="3"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label for="content" class="form-label fw-bold">說明內容</label>
                  <textarea
                    id="content"
                    v-model="tempProduct.content"
                    class="form-control"
                    rows="4"
                    placeholder="請輸入產品說明內容"
                  ></textarea>
                </div>

                <div class="enabled-box">
                  <div>
                    <strong>商品啟用狀態</strong>
                    <p class="text-muted mb-0 small">
                      啟用後會顯示在前台日韓料理列表。
                    </p>
                  </div>

                  <div class="form-check form-switch">
                    <input
                      id="is_enabled"
                      v-model="tempProduct.is_enabled"
                      class="form-check-input"
                      type="checkbox"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label fw-bold" for="is_enabled">
                      {{ tempProduct.is_enabled ? '啟用' : '停用' }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer product-modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>

          <button
            type="button"
            class="btn btn-brand"
            @click="$emit('update-product', tempProduct)"
          >
            確認儲存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixins';

export default {
  name: 'ProductModal',
  props: {
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['update-product'],
  data() {
    return {
      modal: {},
      tempProduct: {},
    };
  },
  watch: {
    product() {
      this.tempProduct = { ...this.product };

      if (!this.tempProduct.images) {
        this.tempProduct.images = [];
      }
    },
  },
  methods: {
    uploadFile() {
      const uploadedFile = this.$refs.fileInput.files[0];

      if (!uploadedFile) {
        return;
      }

      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/upload`;

      this.$http.post(url, formData).then((response) => {
        if (response.data.success) {
          this.tempProduct.imageUrl = response.data.imageUrl;
        }
      });
    },
  },
  mixins: [modalMixin],
};
</script>

<style scoped>
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
  border-color: var(--brand-border);
  border-radius: 12px;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 0.25rem rgba(178, 58, 46, 0.16);
}

.image-preview {
  overflow: hidden;
  min-height: 240px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px dashed var(--brand-border);
}

.image-preview img {
  width: 100%;
  height: 260px;
  display: block;
  object-fit: cover;
}

.image-placeholder {
  min-height: 240px;
  display: grid;
  place-items: center;
  color: var(--brand-muted);
}

.image-placeholder i {
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

@media (max-width: 768px) {
  .product-modal {
    border-radius: 22px;
  }

  .product-modal-header {
    padding: 22px;
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