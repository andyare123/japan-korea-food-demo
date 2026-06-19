<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <Loading :active="isLoading"></Loading>

  <main class="create-course-page">
    <div class="container py-5">
      <!-- 頁面標題 -->
      <div class="page-header mb-4">
        <div>
          <span class="page-badge">後台管理</span>
          <h1 class="fw-bold mt-3 mb-2">新增課程</h1>
          <p class="text-muted mb-0">
            建立一門可在前台銷售的程式設計課程，包含課程圖片、價格、描述與完整內容。
          </p>
        </div>

        <router-link to="/dashboard/products" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-1"></i>
          返回課程管理
        </router-link>
      </div>

      <div class="row g-4">
        <!-- 左側表單 -->
        <div class="col-lg-8">
          <div class="form-card">
            <h4 class="fw-bold mb-4">課程基本資料</h4>

            <div class="row g-3">
              <div class="col-md-8">
                <label class="form-label">課程名稱</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="例如：Vue 3 前端實戰入門"
                  v-model="course.title"
                >
              </div>

              <div class="col-md-4">
                <label class="form-label">課程分類</label>
                <select class="form-select" v-model="course.category">
                  <option value="" disabled>請選擇分類</option>
                  <option value="程式設計">程式設計</option>
                  <option value="前端開發">前端開發</option>
                  <option value="API 串接">API 串接</option>
                  <option value="網頁設計">網頁設計</option>
                  <option value="作品集實戰">作品集實戰</option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label">原價</label>
                <input
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="3200"
                  v-model.number="course.origin_price"
                >
              </div>

              <div class="col-md-4">
                <label class="form-label">售價</label>
                <input
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="2200"
                  v-model.number="course.price"
                >
              </div>

              <div class="col-md-4">
                <label class="form-label">單位</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="堂"
                  v-model="course.unit"
                >
              </div>

              <div class="col-12">
                <label class="form-label">課程圖片網址</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="請輸入圖片網址"
                  v-model="course.imageUrl"
                >
              </div>

              <div class="col-12">
                <label class="form-label">課程短描述</label>
                <textarea
                  class="form-control"
                  rows="3"
                  placeholder="顯示在課程卡片上的簡短介紹，建議 40~80 字。"
                  v-model="course.description"
                ></textarea>
              </div>

              <div class="col-12">
                <label class="form-label">課程完整內容</label>
                <textarea
                  class="form-control"
                  rows="6"
                  placeholder="請描述課程適合對象、學習內容、可以完成的作品或技能。"
                  v-model="course.content"
                ></textarea>
              </div>

              <div class="col-12">
                <label class="form-label">課程賣點</label>

                <div
                  class="input-group mb-2"
                  v-for="(item, index) in course.imagesUrl"
                  :key="index"
                >
                  <span class="input-group-text">
                    賣點 {{ index + 1 }}
                  </span>

                  <input
                    type="text"
                    class="form-control"
                    placeholder="例如：完成可放入履歷的 Vue 電商作品"
                    v-model="course.imagesUrl[index]"
                  >

                  <button
                    class="btn btn-outline-danger"
                    type="button"
                    @click="removeFeature(index)"
                  >
                    刪除
                  </button>
                </div>

                <button
                  class="btn btn-outline-primary btn-sm"
                  type="button"
                  @click="addFeature"
                >
                  <i class="bi bi-plus-circle me-1"></i>
                  新增賣點
                </button>
              </div>

              <div class="col-12">
                <div class="form-check form-switch mt-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="isEnabled"
                    v-model="course.is_enabled"
                    :true-value="1"
                    :false-value="0"
                  >
                  <label class="form-check-label" for="isEnabled">
                    啟用課程，顯示於前台
                  </label>
                </div>
              </div>
            </div>

            <div class="form-actions mt-5">
              <button
                type="button"
                class="btn btn-outline-secondary btn-lg"
                @click="resetForm"
              >
                清空表單
              </button>

              <button
                type="button"
                class="btn btn-primary btn-lg"
                @click="createCourse"
              >
                <i class="bi bi-cloud-upload me-1"></i>
                新增課程
              </button>
            </div>
          </div>
        </div>

        <!-- 右側預覽 -->
        <div class="col-lg-4">
          <div class="preview-card sticky-lg-top">
            <div class="preview-label mb-3">前台預覽</div>

            <div
              class="preview-image"
              :style="{ backgroundImage: `url(${course.imageUrl || defaultImage})` }"
            >
              <span class="preview-category">
                {{ course.category || '課程分類' }}
              </span>
            </div>

            <div class="preview-body">
              <h5 class="fw-bold">
                {{ course.title || '課程名稱預覽' }}
              </h5>

              <p class="text-muted">
                {{ course.description || '這裡會顯示課程短描述，讓使用者快速了解這門課的特色。' }}
              </p>

              <div class="mb-3">
                <del
                  v-if="course.origin_price && course.origin_price !== course.price"
                  class="text-muted"
                >
                  NT$ {{ course.origin_price }}
                </del>

                <div class="text-danger fw-bold fs-4">
                  NT$ {{ course.price || 0 }}
                </div>
              </div>

              <div class="feature-preview" v-if="course.imagesUrl.length">
                <h6 class="fw-bold mb-2">課程賣點</h6>
                <ul class="mb-0">
                  <li
                    v-for="(feature, index) in course.imagesUrl"
                    :key="index"
                  >
                    {{ feature || '尚未填寫賣點' }}
                  </li>
                </ul>
              </div>

              <div class="d-grid mt-4">
                <button type="button" class="btn btn-primary" disabled>
                  加入購物車
                </button>
              </div>
            </div>
          </div>

          <div class="tips-card mt-4">
            <h6 class="fw-bold mb-2">
              <i class="bi bi-lightbulb me-1"></i>
              文案建議
            </h6>
            <p class="text-muted mb-0">
              課程描述建議強調「學完能完成什麼作品」、「適合誰」、「能放入履歷或作品集的成果」。
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'AdminCreateCourse',
  data() {
    return {
      isLoading: false,
      defaultImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      course: {
        title: '',
        category: '',
        origin_price: 0,
        price: 0,
        unit: '堂',
        imageUrl: '',
        description: '',
        content: '',
        is_enabled: 1,
        imagesUrl: [
          '完成可放入履歷的專案作品',
          '學會 API 串接與前台互動流程',
          '支援桌面版與行動版響應式設計',
        ],
      },
    };
  },
  methods: {
    addFeature() {
      this.course.imagesUrl.push('');
    },

    removeFeature(index) {
      this.course.imagesUrl.splice(index, 1);
    },

    validateCourse() {
      if (!this.course.title.trim()) {
        alert('請輸入課程名稱');
        return false;
      }

      if (!this.course.category) {
        alert('請選擇課程分類');
        return false;
      }

      if (!this.course.origin_price || this.course.origin_price <= 0) {
        alert('請輸入正確的原價');
        return false;
      }

      if (!this.course.price || this.course.price <= 0) {
        alert('請輸入正確的售價');
        return false;
      }

      if (!this.course.unit.trim()) {
        alert('請輸入課程單位');
        return false;
      }

      if (!this.course.description.trim()) {
        alert('請輸入課程短描述');
        return false;
      }

      return true;
    },

    createCourse() {
      if (!this.validateCourse()) {
        return;
      }

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`;

      const product = {
        ...this.course,
        imagesUrl: this.course.imagesUrl.filter((item) => item.trim()),
      };

      this.isLoading = true;

      this.$http.post(url, { data: product })
        .then((res) => {
          this.$httpMessageState(res, '新增課程');

          if (res.data.success) {
            this.$router.push('/admin/products');
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    resetForm() {
      this.course = {
        title: '',
        category: '',
        origin_price: 0,
        price: 0,
        unit: '堂',
        imageUrl: '',
        description: '',
        content: '',
        is_enabled: 1,
        imagesUrl: [
          '完成可放入履歷的專案作品',
          '學會 API 串接與前台互動流程',
          '支援桌面版與行動版響應式設計',
        ],
      };
    },
  },
};
</script>

<style scoped>
.create-course-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f8ff 0%, #ffffff 44%, #f8f9fa 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 36px;
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(13, 110, 253, 0.12), rgba(255, 255, 255, 0.96)),
    #ffffff;
  box-shadow: 0 18px 45px rgba(30, 60, 120, 0.1);
}

.page-header h1 {
  font-size: 40px;
}

.page-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  color: #0d6efd;
  background: #eaf2ff;
  font-weight: 700;
}

.form-card,
.preview-card,
.tips-card {
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(30, 60, 120, 0.1);
}

.form-card {
  padding: 32px;
}

.form-label {
  font-weight: 700;
  color: #344054;
}

.form-control,
.form-select {
  min-height: 46px;
  border-radius: 12px;
}

textarea.form-control {
  border-radius: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.preview-card {
  top: 24px;
  overflow: hidden;
}

.preview-label {
  display: inline-block;
  margin: 24px 24px 0;
  padding: 7px 12px;
  border-radius: 999px;
  background: #eaf2ff;
  color: #0d6efd;
  font-size: 14px;
  font-weight: 700;
}

.preview-image {
  position: relative;
  height: 220px;
  margin: 16px 24px 0;
  border-radius: 22px;
  background-size: cover;
  background-position: center;
  background-color: #f1f3f5;
}

.preview-category {
  position: absolute;
  left: 16px;
  bottom: 16px;
  padding: 7px 12px;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(13, 110, 253, 0.92);
  font-size: 14px;
  font-weight: 700;
}

.preview-body {
  padding: 24px;
}

.preview-body p {
  line-height: 1.7;
}

.feature-preview {
  padding: 16px;
  border-radius: 18px;
  background: #f8fbff;
  border: 1px solid #e5efff;
}

.feature-preview ul {
  padding-left: 18px;
  color: #6c757d;
  line-height: 1.8;
}

.tips-card {
  padding: 22px;
}

.tips-card p {
  line-height: 1.7;
}

@media (max-width: 991px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header .btn {
    width: 100%;
  }

  .preview-card {
    position: static !important;
  }
}

@media (max-width: 768px) {
  .container {
    padding-left: 18px;
    padding-right: 18px;
  }

  .page-header {
    padding: 28px 22px;
    border-radius: 24px;
  }

  .page-header h1 {
    font-size: 30px;
  }

  .form-card {
    padding: 24px 18px;
    border-radius: 24px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }

  .preview-image {
    height: 190px;
  }
}
</style>