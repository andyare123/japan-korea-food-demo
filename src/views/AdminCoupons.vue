<template>
  <div class="admin-coupons-page">
    <Loading :active="isLoading"></Loading>

    <div class="container py-5">
      <div class="coupon-hero mb-4">
        <div>
          <span class="admin-badge">COUPON MANAGEMENT</span>
          <h1 class="fw-bold mt-3 mb-2">優惠券管理</h1>
          <p class="text-muted mb-0">
            管理平台優惠碼、折扣比例與啟用狀態，讓前台購物車可套用優惠券。
          </p>
        </div>

        <button
          type="button"
          class="btn btn-brand btn-lg create-coupon-btn"
          @click="openCouponModal(true)"
        >
          <i class="bi bi-plus-circle me-1"></i>
          建立新的優惠券
        </button>
      </div>

      <div class="coupon-card">
        <div class="coupon-card-header">
          <div>
            <h4 class="fw-bold mb-1">優惠券列表</h4>
            <p class="text-muted mb-0 small">
              可查看優惠券名稱、折扣百分比、到期日與啟用狀態。
            </p>
          </div>
        </div>

        <div v-if="Object.keys(coupons).length" class="table-responsive">
          <table class="table align-middle coupon-table mb-0">
            <thead>
              <tr>
                <th>名稱</th>
                <th>優惠碼</th>
                <th>折扣百分比</th>
                <th>到期日</th>
                <th>是否啟用</th>
                <th class="text-end">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, key) in coupons" :key="key">
                <td>
                  <div class="coupon-title">
                    {{ item.title || '未命名優惠券' }}
                  </div>
                </td>

                <td>
                  <span class="coupon-code">
                    {{ item.code || '未設定' }}
                  </span>
                </td>

                <td>
                  <strong class="discount-text">
                    {{ item.percent || 0 }}%
                  </strong>
                </td>

                <td>
                  <span class="text-muted">
                    {{ item.due_date ? $filters.date(item.due_date) : '未設定' }}
                  </span>
                </td>

                <td>
                  <span
                    class="status-pill"
                    :class="item.is_enabled === 1 ? 'enabled' : 'disabled'"
                  >
                    {{ item.is_enabled === 1 ? '啟用' : '未啟用' }}
                  </span>
                </td>

                <td class="text-end">
                  <div class="btn-group action-group">
                    <button
                      type="button"
                      class="btn btn-outline-brand btn-sm"
                      @click="openCouponModal(false, item)"
                    >
                      <i class="bi bi-pencil-square me-1"></i>
                      編輯
                    </button>

                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="openDelCouponModal(item)"
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

        <div v-else class="empty-coupon text-center">
          <div class="display-5 mb-3">🎟️</div>
          <h5 class="fw-bold">目前沒有優惠券</h5>
          <p class="text-muted mb-4">
            可以先建立一張優惠券，讓使用者在購物車套用折扣。
          </p>

          <button
            type="button"
            class="btn btn-brand"
            @click="openCouponModal(true)"
          >
            建立第一張優惠券
          </button>
        </div>
      </div>
    </div>

    <CouponModal
      ref="couponModal"
      :coupon="tempCoupon"
      @update-coupon="updateCoupon"
    />

    <DelModal
      ref="delModal"
      :item="tempCoupon"
      @del-item="delCoupon"
    />
  </div>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue';
import DelModal from '@/components/DelModal.vue';

export default {
  name: 'AdminCoupons',
  components: {
    CouponModal,
    DelModal,
  },
  props: {
    config: Object,
  },
  data() {
    return {
      coupons: {},
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        code: '',
      },
      isLoading: false,
      isNew: false,
    };
  },
  methods: {
    openCouponModal(isNew, item = null) {
      this.isNew = isNew;

      if (this.isNew) {
        this.tempCoupon = {
          title: '',
          code: '',
          percent: 100,
          is_enabled: 1,
          due_date: Math.floor(Date.now() / 1000),
        };
      } else {
        this.tempCoupon = { ...item };
      }

      this.$refs.couponModal.showModal();
    },

    openDelCouponModal(item) {
      this.tempCoupon = { ...item };
      this.$refs.delModal.showModal();
    },

    getCoupons() {
      this.isLoading = true;

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupons`;

      this.$http
        .get(url)
        .then((response) => {
          this.coupons = response.data.coupons || {};
        })
        .catch(() => {
          this.$httpMessageState(
            {
              data: {
                success: false,
                message: '取得優惠券失敗，請確認是否已登入後台。',
              },
            },
            '取得優惠券',
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    updateCoupon(tempCoupon) {
      this.isLoading = true;

      if (this.isNew) {
        const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon`;

        this.$http
          .post(url, { data: tempCoupon })
          .then((response) => {
            this.$httpMessageState(response, '新增優惠券');
            this.getCoupons();
            this.$refs.couponModal.hideModal();
          })
          .finally(() => {
            this.isLoading = false;
          });

        return;
      }

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;

      this.$http
        .put(url, { data: tempCoupon })
        .then((response) => {
          this.$httpMessageState(response, '更新優惠券');
          this.getCoupons();
          this.$refs.couponModal.hideModal();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    delCoupon() {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;

      this.isLoading = true;

      this.$http
        .delete(url)
        .then((response) => {
          this.$httpMessageState(response, '刪除優惠券');
          this.$refs.delModal.hideModal();
          this.getCoupons();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>

<style scoped>
.admin-coupons-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(178, 58, 46, 0.12), transparent 32%),
    linear-gradient(180deg, var(--brand-bg) 0%, #ffffff 44%, var(--brand-bg-soft) 100%);
}

.coupon-hero {
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

.create-coupon-btn {
  min-height: 50px;
  border-radius: 16px;
  font-weight: 900;
  white-space: nowrap;
}

.coupon-card {
  overflow: hidden;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.coupon-card-header {
  padding: 26px 30px;
  background: var(--brand-bg-soft);
  border-bottom: 1px solid var(--brand-border);
}

.coupon-table thead th {
  padding: 16px 18px;
  color: #6c5b50;
  background: var(--brand-primary-light);
  border-bottom: 1px solid var(--brand-border);
  font-size: 14px;
  white-space: nowrap;
}

.coupon-table tbody td {
  padding: 18px;
  border-bottom: 1px solid #f1e4dc;
}

.coupon-table tbody tr:last-child td {
  border-bottom: 0;
}

.coupon-title {
  color: var(--brand-text);
  font-weight: 900;
}

.coupon-code {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.discount-text {
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

.action-group .btn {
  font-weight: 800;
}

.empty-coupon {
  padding: 80px 24px;
  color: var(--brand-muted);
  background: #fffaf6;
}

@media (max-width: 768px) {
  .coupon-hero {
    flex-direction: column;
    align-items: stretch;
    padding: 28px 22px;
    border-radius: 24px;
  }

  .create-coupon-btn {
    width: 100%;
  }

  .coupon-card {
    border-radius: 24px;
  }

  .coupon-card-header {
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
}
</style>