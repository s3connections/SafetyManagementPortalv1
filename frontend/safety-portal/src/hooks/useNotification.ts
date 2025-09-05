import { useCallback } from 'react';
import { useAppDispatch } from '../store';
import { addNotification, removeNotification } from '../store/slices/notificationSlice';

export const useNotification = () => {
  const dispatch = useAppDispatch();

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      dispatch(addNotification({
        type: 'success',
        title,
        message,
        duration,
      }));
    },
    [dispatch]
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      dispatch(addNotification({
        type: 'error',
        title,
        message,
        duration: duration || 0, // Error notifications persist until manually dismissed
      }));
    },
    [dispatch]
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      dispatch(addNotification({
        type: 'warning',
        title,
        message,
        duration,
      }));
    },
    [dispatch]
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      dispatch(addNotification({
        type: 'info',
        title,
        message,
        duration,
      }));
    },
    [dispatch]
  );

  const dismiss = useCallback(
    (id: string) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismiss,
  };
};