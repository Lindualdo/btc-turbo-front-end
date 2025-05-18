// Utility functions for PWA functionality

// Check if the app can be installed (if it's not already installed)
export const checkInstallable = async () => {
  if (window.deferredPrompt) {
    return true;
  }
  return false;
};

// Install the PWA
export const installPWA = async () => {
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    return false;
  }
  
  // Show the install prompt
  promptEvent.prompt();
  
  // Wait for the user to respond to the prompt
  const result = await promptEvent.userChoice;
  
  // Reset the deferred prompt variable
  window.deferredPrompt = null;
  
  return result.outcome === 'accepted';
};

// Check if the app is running in standalone mode (installed)
export const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Check if the user is offline
export const isOffline = () => {
  return !navigator.onLine;
};

// Register event listeners for online/offline status
export const registerConnectivityListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};