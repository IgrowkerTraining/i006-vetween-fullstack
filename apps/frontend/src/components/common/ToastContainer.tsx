import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const { notifications, hideNotification } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          message={notification.message}
          onClose={hideNotification}
        />
      ))}
    </div>
  );
};
