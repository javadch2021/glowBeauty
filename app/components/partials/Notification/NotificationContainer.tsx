import React from "react";
import { useNotification } from "~/contexts/NotificationContext";
import GlassNotification from "./GlassNotification";

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 left-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            transform: `translateY(${index * 80}px)`, // Stack notifications vertically
          }}
        >
          <GlassNotification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onAnimationComplete={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
