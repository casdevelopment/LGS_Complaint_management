/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

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

  PushNotification.localNotification({
    channelId: '2',
    title,
    message: body,
    userInfo: data,
    playSound: true,
    soundName: 'default',
  });
});

AppRegistry.registerComponent(appName, () => App);
