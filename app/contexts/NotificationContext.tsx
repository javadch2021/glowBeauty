import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newNotification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const showSuccess = (message: string, duration?: number) => {
    addNotification({ message, type: "success", duration });
  };

  const showError = (message: string, duration?: number) => {
    addNotification({ message, type: "error", duration });
  };

  const showWarning = (message: string, duration?: number) => {
    addNotification({ message, type: "warning", duration });
  };

  const showInfo = (message: string, duration?: number) => {
    addNotification({ message, type: "info", duration });
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
