
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (Capacitor.isNativePlatform()) {
        setIsNative(true);
        
        // Configure status bar
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
        
        // Hide splash screen
        await SplashScreen.hide();
        
        // Handle app state changes
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive);
        });
      }
    };

    initializeApp();
  }, []);

  return {
    isNative,
    platform: Capacitor.getPlatform()
  };
};
