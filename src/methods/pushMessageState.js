import { pushToast } from '@/mixins/toastMixin';

export default function $httpMessageState(response, title = '更新') {
  if (response?.data?.success) {
    pushToast(
      `${title}成功`,
      response.data.message || '操作已完成。',
      'success',
    );
  } else {
    pushToast(
      `${title}失敗`,
      response?.data?.message || '操作失敗，請稍後再試。',
      'danger',
    );
  }
}