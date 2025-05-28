
import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const useNotifications = () => {
  useEffect(() => {
    const initNotifications = async () => {
      if (Capacitor.isNativePlatform()) {
        // Request permission for notifications
        const permission = await LocalNotifications.requestPermissions();
        console.log('Notification permission:', permission);
      }
    };

    initNotifications();
  }, []);

  const scheduleNotification = async (
    title: string,
    body: string,
    scheduleAt: Date,
    id?: number
  ) => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Notifications only work on native platforms');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: id || Math.floor(Math.random() * 10000),
            schedule: { at: scheduleAt },
            sound: 'default',
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelNotification = async (id: number) => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  return {
    scheduleNotification,
    cancelNotification
  };
};
