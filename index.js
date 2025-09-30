/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// Background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
});

// Foreground handler
messaging().onMessage(async remoteMessage => {
  console.log('Foreground message:', remoteMessage);
  const { data, notification } = remoteMessage;
  const title = data?.title || notification?.title || 'Notification';
  const body = data?.body || notification?.body || 'You have a new message';
  onDisplayNotification(title, body);
});
const onDisplayNotification = async (title, body) => {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      // smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
  });
};

AppRegistry.registerComponent(appName, () => App);
