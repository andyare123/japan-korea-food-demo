<template>
  <div
    id="productModal"
    ref="modal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="orderModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
      <div class="modal-content order-modal border-0">
        <!-- Header -->
        <div class="modal-header order-modal-header">
          <div>
            <span class="modal-kicker">ORDER DETAIL</span>
            <h5 id="orderModalLabel" class="modal-title fw-bold mt-1">
              訂單細節
            </h5>
          </div>

          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <!-- Body -->
        <div class="modal-body p-4 p-lg-5">
          <div class="order-top-card mb-4">
            <div>
              <span class="text-muted small">訂單編號</span>
              <h6 class="fw-bold mb-0 order-id">
                {{ tempOrder.id || '未取得訂單編號' }}
              </h6>
            </div>

            <div class="text-lg-end">
              <span
                class="pay-status"
                :class="tempOrder.is_paid ? 'paid' : 'unpaid'"
              >
                {{ tempOrder.is_paid ? '已付款' : '尚未付款' }}
              </span>
            </div>
          </div>

          <div class="row g-4">
            <!-- 用戶資料 -->
            <div class="col-lg-4">
              <section class="info-card h-100">
                <div class="section-title mb-4">
                  <span class="section-icon">
                    <i class="bi bi-person-lines-fill"></i>
                  </span>
                  <div>
                    <h5 class="fw-bold mb-1">用戶資料</h5>
                    <p class="text-muted mb-0 small">
                      訂購者聯絡資訊
                    </p>
                  </div>
                </div>

                <div class="info-list" v-if="tempOrder.user">
                  <div class="info-row">
                    <span>姓名</span>
                    <strong>{{ tempOrder.user.name || '未填寫' }}</strong>
                  </div>

                  <div class="info-row">
                    <span>Email</span>
                    <strong>{{ tempOrder.user.email || '未填寫' }}</strong>
                  </div>

                  <div class="info-row">
                    <span>電話</span>
                    <strong>{{ tempOrder.user.tel || '未填寫' }}</strong>
                  </div>

                  <div class="info-row">
                    <span>地址</span>
                    <strong>{{ tempOrder.user.address || '未填寫' }}</strong>
                  </div>
                </div>

                <div v-else class="empty-box">
                  尚無用戶資料
                </div>
              </section>
            </div>

            <!-- 訂單資訊 + 商品 -->
            <div class="col-lg-8">
              <section class="info-card mb-4">
                <div class="section-title mb-4">
                  <span class="section-icon">
                    <i class="bi bi-receipt"></i>
                  </span>
                  <div>
                    <h5 class="fw-bold mb-1">訂單資訊</h5>
                    <p class="text-muted mb-0 small">
                      訂單時間、付款狀態與總金額
                    </p>
                  </div>
                </div>

                <div class="order-info-grid">
                  <div class="order-info-item">
                    <span>下單時間</span>
                    <strong>
                      {{ tempOrder.create_at ? $filters.date(tempOrder.create_at) : '未取得時間' }}
                    </strong>
                  </div>

                  <div class="order-info-item">
                    <span>付款時間</span>
                    <strong>
                      <template v-if="tempOrder.paid_date">
                        {{ $filters.date(tempOrder.paid_date) }}
                      </template>
                      <template v-else>
                        尚未付款
                      </template>
                    </strong>
                  </div>

                  <div class="order-info-item">
                    <span>付款狀態</span>
                    <strong :class="tempOrder.is_paid ? 'text-success' : 'text-muted'">
                      {{ tempOrder.is_paid ? '已付款' : '尚未付款' }}
                    </strong>
                  </div>

                  <div class="order-info-item total">
                    <span>總金額</span>
                    <strong>{{ $filters.currency(tempOrder.total || 0) }}</strong>
                  </div>
                </div>
              </section>

              <section class="info-card">
                <div class="section-title mb-4">
                  <span class="section-icon">
                    <i class="bi bi-bag-check"></i>
                  </span>
                  <div>
                    <h5 class="fw-bold mb-1">選購商品</h5>
                    <p class="text-muted mb-0 small">
                      本次訂單的餐點明細
                    </p>
                  </div>
                </div>

                <div v-if="orderProducts.length" class="table-responsive">
                  <table class="table align-middle order-table">
                    <thead>
                      <tr>
                        <th>商品名稱</th>
                        <th class="text-center">數量</th>
                        <th class="text-end">小計</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="item in orderProducts" :key="item.id">
                        <td>
                          <div class="product-name">
                            <span class="product-dot"></span>
                            <div>
                              <strong>
                                {{ item.product?.title || '未命名商品' }}
                              </strong>
                              <small class="text-muted d-block">
                                {{ item.product?.category || '精選料理' }}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td class="text-center">
                          <span class="qty-pill">
                            {{ item.qty || 0 }} {{ item.product?.unit || '份' }}
                          </span>
                        </td>

                        <td class="text-end fw-bold text-danger">
                          {{ $filters.currency(item.final_total || 0) }}
                        </td>
                      </tr>
                    </tbody>

                    <tfoot>
                      <tr>
                        <td colspan="2" class="text-end fw-bold">
                          訂單總計
                        </td>
                        <td class="text-end total-price">
                          {{ $filters.currency(tempOrder.total || 0) }}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div v-else class="empty-box">
                  此訂單尚無商品資料
                </div>
              </section>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer order-modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            關閉
          </button>

          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('update-order', tempOrder)"
          >
            確認更新
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import modalMixin from '@/mixins/modalMixins';

export default {
  name: 'OrderModal',
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['update-order'],
  mixins: [modalMixin],
  inject: ['emitter'],
  data() {
    return {
      status: {},
      modal: '',
      tempOrder: {
        products: [],
        user: {},
        total: 0,
        is_paid: false,
      },
      isPaid: false,
    };
  },
  computed: {
    orderProducts() {
      if (Array.isArray(this.tempOrder.products)) {
        return this.tempOrder.products;
      }

      if (this.tempOrder.products && typeof this.tempOrder.products === 'object') {
        return Object.values(this.tempOrder.products);
      }

      return [];
    },
  },
  watch: {
    order: {
      immediate: true,
      deep: true,
      handler() {
        this.tempOrder = {
          products: [],
          user: {},
          total: 0,
          is_paid: false,
          ...this.order,
        };

        this.isPaid = this.tempOrder.is_paid;
      },
    },
  },
};
</script>

<style scoped>
.order-modal {
  overflow: hidden;
  border-radius: 28px;
  background: #fffaf6;
  box-shadow: 0 28px 80px rgba(40, 24, 12, 0.24);
}

.order-modal-header {
  padding: 26px 32px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(178, 58, 46, 0.98), rgba(55, 38, 31, 0.98)),
    #2b211e;
  border-bottom: 0;
}

.modal-kicker {
  display: inline-block;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.5px;
  opacity: 0.85;
}

.order-top-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 22px 24px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 12px 32px rgba(120, 54, 28, 0.08);
}

.order-id {
  word-break: break-all;
  color: #3b2a22;
}

.pay-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 92px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 900;
}

.pay-status.paid {
  color: #198754;
  background: #e9f8ef;
}

.pay-status.unpaid {
  color: #b23a2e;
  background: #fff0e7;
}

.info-card {
  padding: 26px;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 14px 36px rgba(120, 54, 28, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #b23a2e;
  background: #fff0e7;
  font-size: 20px;
  flex-shrink: 0;
}

.info-list {
  display: grid;
  gap: 12px;
}

.info-row {
  padding: 14px 16px;
  border-radius: 16px;
  background: #fffaf6;
  border: 1px solid #f1e4dc;
}

.info-row span,
.order-info-item span {
  display: block;
  margin-bottom: 6px;
  color: #8a7a70;
  font-size: 13px;
  font-weight: 700;
}

.info-row strong,
.order-info-item strong {
  display: block;
  color: #33251f;
  line-height: 1.6;
  word-break: break-word;
}

.order-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.order-info-item {
  padding: 16px;
  border-radius: 18px;
  background: #fffaf6;
  border: 1px solid #f1e4dc;
}

.order-info-item.total strong {
  color: #b23a2e;
  font-size: 22px;
}

.order-table {
  overflow: hidden;
  border-radius: 18px;
}

.order-table thead th {
  color: #6c5b50;
  background: #fff3ea;
  border-bottom: 1px solid #f1d8ca;
  font-size: 14px;
}

.order-table tbody td {
  padding: 16px 12px;
  border-bottom: 1px solid #f1e4dc;
}

.product-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #b23a2e;
  flex-shrink: 0;
}

.qty-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 6px 12px;
  border-radius: 999px;
  color: #6c4b3f;
  background: #fff0e7;
  font-weight: 800;
}

.total-price {
  color: #b23a2e;
  font-size: 20px;
  font-weight: 900;
}

.empty-box {
  padding: 30px 18px;
  border-radius: 18px;
  color: #8a7a70;
  text-align: center;
  background: #fff8f2;
  border: 1px dashed #e5c9b8;
}

.order-modal-footer {
  padding: 20px 32px;
  background: #ffffff;
  border-top: 1px solid #f1d8ca;
}

.order-modal-footer .btn {
  min-width: 108px;
  font-weight: 800;
}

@media (max-width: 768px) {
  .order-modal {
    border-radius: 18px;
  }

  .order-modal-header {
    padding: 22px;
  }

  .modal-body {
    padding: 22px !important;
  }

  .order-top-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-card {
    padding: 20px;
    border-radius: 20px;
  }

  .order-info-grid {
    grid-template-columns: 1fr;
  }

  .order-modal-footer {
    padding: 18px 22px;
  }

  .order-modal-footer .btn {
    width: 100%;
  }
}
</style>