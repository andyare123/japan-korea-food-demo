<template>
  <div
    class="custom-toast mb-3"
    :class="toastClass"
  >
    <div class="toast-icon">
      {{ icon }}
    </div>

    <div class="toast-content">
      <h6 class="fw-bold mb-1">
        {{ message.title }}
      </h6>

      <p class="mb-0" v-if="message.content">
        {{ message.content }}
      </p>
    </div>

    <button
      type="button"
      class="toast-close"
      @click="$emit('remove-message', message.id)"
    >
      ×
    </button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  emits: ['remove-message'],
  computed: {
    toastClass() {
      return `toast-${this.message.style || 'success'}`;
    },

    icon() {
      if (this.message.style === 'danger') {
        return '!';
      }

      if (this.message.style === 'warning') {
        return '!';
      }

      return '✓';
    },
  },
};
</script>

<style scoped>
.custom-toast {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #eadfd8;
  box-shadow: 0 16px 40px rgba(50, 30, 20, 0.18);
  animation: toastSlideIn 0.25s ease;
}

.toast-icon {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 900;
}

.toast-success .toast-icon {
  background: #198754;
}

.toast-danger .toast-icon {
  background: #dc3545;
}

.toast-warning .toast-icon {
  background: #ffc107;
  color: #3a2b00;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-content h6 {
  color: #2d201a;
}

.toast-content p {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.6;
}

.toast-close {
  border: 0;
  background: transparent;
  color: #999;
  font-size: 22px;
  line-height: 1;
  padding: 0;
}

.toast-close:hover {
  color: #333;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(16px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>