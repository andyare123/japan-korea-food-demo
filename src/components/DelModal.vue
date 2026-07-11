<template>
  <div
    id="delModal"
    ref="modal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="delModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content del-modal border-0">
        <div class="modal-header del-modal-header">
          <div>
            <span class="modal-kicker">DELETE CONFIRM</span>
            <h5 id="delModalLabel" class="modal-title fw-bold mt-2">
              確認刪除
            </h5>
          </div>

          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body text-center p-4">
          <div class="delete-icon mb-3">
            <i class="bi bi-trash3"></i>
          </div>

          <h5 class="fw-bold mb-3">
            是否刪除這筆資料？
          </h5>

          <p class="text-muted mb-0">
            你即將刪除
            <strong class="text-danger">
              {{ item.title || '此項目' }}
            </strong>
            ，刪除後將無法恢復。
          </p>
        </div>

        <div class="modal-footer del-modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>

          <button
            type="button"
            class="btn btn-danger"
            @click="$emit('del-item')"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixins';

export default {
  name: 'DelModal',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['del-item'],
  data() {
    return {
      modal: '',
    };
  },
  mixins: [modalMixin],
};
</script>

<style scoped>
.del-modal {
  overflow: hidden;
  border-radius: 26px;
  border: 1px solid var(--brand-border);
  box-shadow: 0 24px 64px rgba(80, 40, 20, 0.2);
}

.del-modal-header {
  color: #ffffff;
  background: linear-gradient(135deg, #b23a2e, #dc3545);
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

.delete-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto;
  border-radius: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #dc3545;
  background: #fff0e7;
  font-size: 34px;
}

.del-modal-footer {
  justify-content: center;
  gap: 10px;
  padding: 18px 28px;
  background: #fffaf6;
  border-top: 1px solid var(--brand-border);
}

.del-modal-footer .btn {
  min-width: 120px;
  border-radius: 12px;
  font-weight: 800;
}
</style>