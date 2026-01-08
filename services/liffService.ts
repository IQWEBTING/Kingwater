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
    await window.liff.init({ liffId: LIFF_ID });
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
    window.liff.login();
  }
};

export const logout = () => {
  if (window.liff) {
    window.liff.logout();
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

// For development without a real LIFF ID
export const getMockProfile = (): UserProfile => ({
  userId: 'mock-user-123',
  displayName: 'Test Customer',
  pictureUrl: 'https://picsum.photos/200',
  statusMessage: 'Ready to order'
});