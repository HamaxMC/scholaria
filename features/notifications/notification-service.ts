import { app } from "@/lib/firebase";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

let messaging: any = null;

export const notificationService = {
  async init() {
    try {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        messaging = getMessaging(app);
        return true;
      }
      return false;
    } catch (error) {
      console.log("Notifications are not supported in this browser");
      return false;
    }
  },

  async requestPermission() {
    try {
      if (!messaging) {
        const initialized = await this.init();
        if (!initialized) return false;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        return token;
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  },

  onMessage(callback: (payload: any) => void) {
    if (messaging) {
      return onMessage(messaging, callback);
    }
    return () => {}; // Return empty cleanup function if messaging is not available
  },
};
