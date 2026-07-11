<template>
  <div
    id="couponModal"
    ref="modal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="couponModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content coupon-modal border-0">
        <div class="modal-header coupon-modal-header">
          <div>
            <span class="modal-kicker">COUPON FORM</span>
            <h5 id="couponModalLabel" class="modal-title fw-bold mt-2">
              優惠券資料
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
          <div class="mb-3">
            <label for="title" class="form-label fw-bold">標題</label>
            <input
              id="title"
              v-model="tempCoupon.title"
              type="text"
              class="form-control form-control-lg"
              placeholder="請輸入優惠券標題"
            />
          </div>

          <div class="mb-3">
            <label for="coupon_code" class="form-label fw-bold">優惠碼</label>
            <input
              id="coupon_code"
              v-model="tempCoupon.code"
              type="text"
              class="form-control form-control-lg"
              placeholder="例如：JPKR100"
            />
          </div>

          <div class="row gx-3">
            <div class="mb-3 col-md-6">
              <label for="due_date" class="form-label fw-bold">到期日</label>
              <input
                id="due_date"
                v-model="due_date"
                type="date"
                class="form-control form-control-lg"
              />
            </div>

            <div class="mb-3 col-md-6">
              <label for="percent" class="form-label fw-bold">折扣百分比</label>
              <div class="input-group input-group-lg">
                <input
                  id="percent"
                  v-model.number="tempCoupon.percent"
                  type="number"
                  class="form-control"
                  placeholder="請輸入折扣"
                />
                <span class="input-group-text">%</span>
              </div>
            </div>
          </div>

          <div class="coupon-enabled-box">
            <div>
              <strong>優惠券啟用狀態</strong>
              <p class="text-muted mb-0 small">
                啟用後，前台購物車即可套用此優惠碼。
              </p>
            </div>

            <div class="form-check form-switch">
              <input
                id="is_enabled"
                v-model="tempCoupon.is_enabled"
                class="form-check-input"
                type="checkbox"
                :true-value="1"
                :false-value="0"
              />
              <label class="form-check-label fw-bold" for="is_enabled">
                {{ tempCoupon.is_enabled ? '啟用' : '停用' }}
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer coupon-modal-footer">
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
            @click="$emit('update-coupon', tempCoupon)"
          >
            儲存優惠券
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixins';

export default {
  name: 'CouponModal',
  props: {
    coupon: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['update-coupon'],
  data() {
    return {
      tempCoupon: {},
      due_date: '',
    };
  },
  watch: {
    coupon() {
      this.tempCoupon = { ...this.coupon };

      if (!this.tempCoupon.due_date) {
        this.due_date = new Date().toISOString().split('T')[0];
        this.tempCoupon.due_date = Math.floor(new Date(this.due_date).getTime() / 1000);
        return;
      }

      const dateAndTime = new Date(this.tempCoupon.due_date * 1000)
        .toISOString()
        .split('T');

      [this.due_date] = dateAndTime;
    },

    due_date() {
      this.tempCoupon.due_date = Math.floor(new Date(this.due_date).getTime() / 1000);
    },
  },
  mixins: [modalMixin],
};
</script>

<style scoped>
.coupon-modal {
  overflow: hidden;
  border-radius: 26px;
  border: 1px solid var(--brand-border);
  box-shadow: 0 24px 64px rgba(80, 40, 20, 0.2);
}

.coupon-modal-header {
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

.form-control,
.input-group-text {
  border-color: var(--brand-border);
  border-radius: 14px;
}

.form-control:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 0.25rem rgba(178, 58, 46, 0.16);
}

.input-group .form-control {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group .input-group-text {
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  font-weight: 900;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.coupon-enabled-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 18px;
  border-radius: 18px;
  background: #fffaf6;
  border: 1px solid var(--brand-border);
}

.form-check-input:checked {
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.coupon-modal-footer {
  padding: 18px 28px;
  background: #fffaf6;
  border-top: 1px solid var(--brand-border);
}

.coupon-modal-footer .btn {
  min-width: 110px;
  border-radius: 12px;
  font-weight: 800;
}

@media (max-width: 576px) {
  .coupon-enabled-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>