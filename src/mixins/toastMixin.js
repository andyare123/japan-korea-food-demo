import emitter from '@/methods/emitter';

export function pushToast(title, content = '', style = 'danger') {
  emitter.emit('push-message', {
    style,
    title,
    content,
  });
}

export default {
  methods: {
    pushToast(title, content = '', style = 'danger') {
      pushToast(title, content, style);
    },
  },
};