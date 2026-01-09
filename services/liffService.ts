import { LIFF_ID } from '../constants';
import { UserProfile } from '../types';

// Declare window.liff manually since we are loading via script tag
declare global {
  interface Window {
    liff: any;
  }
}

export const initLiff = async (): Promise<boolean> => {
  try {
    if (!window.liff) {
      console.error('LIFF SDK not loaded');
      return false;
    }
    
    // Initialize LIFF
    await window.liff.init({ liffId: LIFF_ID });

    // Handle the case where user opens the app in an external browser but isn't logged in
    // Note: We don't auto-login here to allow the user to see the landing page first,
    // but if it's opened inside LINE app, isLoggedIn() will automatically be true.
    
    return true;
  } catch (error) {
    console.error('LIFF Initialization failed', error);
    return false;
  }
};

export const isLoggedIn = (): boolean => {
  return window.liff?.isLoggedIn() || false;
};

export const login = () => {
  if (window.liff) {
    // If not logged in, redirect to LINE Login
    if (!window.liff.isLoggedIn()) {
       window.liff.login();
    }
  }
};

export const logout = () => {
  if (window.liff) {
    if (window.liff.isLoggedIn()) {
      window.liff.logout();
    }
    window.location.reload();
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    if (!isLoggedIn()) return null;
    
    const profile = await window.liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage
    };
  } catch (error) {
    console.error('Failed to get profile', error);
    return null;
  }
};