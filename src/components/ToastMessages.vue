<template>
  <div class="toast-message-container">
    <Toast
      v-for="message in messages"
      :key="message.id"
      :message="message"
      @remove-message="removeMessage"
    />
  </div>
</template>

<script>
import Toast from "./Toast.vue";

import emitter from "../methods/emitter";

export default {
  components: {
    Toast,
  },
  data() {
    return {
      messages: [],
    };
  },
  methods: {
    pushMessage(message) {
      const id = new Date().getTime();

      this.messages.push({
        id,
        style: message.style || "success",
        title: message.title || "",
        content: message.content || "",
      });

      setTimeout(() => {
        this.removeMessage(id);
      }, 3000);
    },

    removeMessage(id) {
      this.messages = this.messages.filter((message) => message.id !== id);
    },
  },
  mounted() {
    emitter.on("push-message", this.pushMessage);
  },
  beforeUnmount() {
    emitter.off("push-message", this.pushMessage);
  },
};
</script>

<style scoped>
.toast-message-container {
  position: fixed;
  top: 86px;
  right: 24px;
  z-index: 99999;
  width: 360px;
  max-width: calc(100vw - 32px);
  pointer-events: none;
}
</style>
