// Path: src/hooks/useNotifications.js

const useNotifications = () => {
  const showNotification = (title, options) => {
    // 1. Check if the browser supports the Notification API
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification.");
      alert("Sorry, your browser doesn't support notifications.");
      return;
    }

    // 2. Check the current permission status
    if (Notification.permission === "granted") {
      // If permission is already granted, create the notification
      new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      // If permission hasn't been denied, request it
      Notification.requestPermission().then((permission) => {
        // If the user accepts, create the notification
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
    // If permission is "denied", we do nothing. The user must manually
    // enable notifications in their browser settings.
  };

  // Return the function so components can use it
  return { showNotification };
};

export default useNotifications;