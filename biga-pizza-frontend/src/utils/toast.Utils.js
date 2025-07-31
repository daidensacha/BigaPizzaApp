import toast from 'react-hot-toast';

export const showLoadingToast = (msg) => toast.loading(msg, { id });
export const showSuccessToast = (msg) => toast.loading(msg, { id });
export const showErrorToast = (msg) => toast.loading(msg, { id });

export const showToast = (msg) => toast(msg);
