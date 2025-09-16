import { useEffect } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';

const NotificationService = () => {
  // ---------------- HANDLE NOTIFICATION ----------------
  const handleNotification = (remoteMessage, appState) => {
    if (!remoteMessage) return;

    const { notification, data } = remoteMessage;

    // Firebase sometimes puts title/body in notification, sometimes in data
    const title = data?.title || notification?.title || 'Notification';
    const message =
      data?.body || notification?.body || 'You have a new message';

    console.log(`Payload received in ${appState} state:`, remoteMessage);

    displayLocalNotification(title, message, data);
  };

  // ---------------- SHOW LOCAL NOTIFICATION ----------------
  const displayLocalNotification = (title, message, data) => {
    if (Platform.OS === 'ios') {
      // iOS handled via APNS
    } else {
      PushNotification.localNotification({
        channelId: '2',
        title,
        message,
        userInfo: data, // 👈 includes complaintId, role, userId
        playSound: true,
        soundName: 'default',
        largeIcon: '',
        bigPictureUrl: '',
      });
    }
  };

  // ---------------- USE EFFECT ----------------
  useEffect(() => {
    // Configure PushNotification
    PushNotification.configure({
      permissions: { alert: true, badge: true, sound: true },
      popInitialNotification: true,
      requestPermissions: true,

      // 👇 Handle notification taps
      onNotification: function (notification) {
        console.log('NOTIFICATION tapped:', notification);
      },
    });

    // Android channel setup
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: '2',
          channelName: '2',
          channelDescription: 'A channel to categorise your notifications',
          playSound: true,
          soundName: 'default',
          importance: Importance.HIGH,
          vibrate: true,
        },
        created => console.log(`createChannel returned '${created}'`),
      );
    }

    // -------- FOREGROUND STATE --------
    // const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    //   handleNotification(remoteMessage, 'foreground');
    // });

    // -------- BACKGROUND STATE --------
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('Notification opened from background:', remoteMessage);

        const { complaintId, role, userId } = remoteMessage.data || {};
        if (complaintId) {
          NavigationService.navigate('ComplaintDetailScreen', {
            complaintId,
            role,
            userId,
          });
        }
      },
    );

    // -------- QUIT STATE --------
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Opened from quit state:', remoteMessage);

          const { complaintId, role, userId } = remoteMessage.data || {};
          if (complaintId) {
            NavigationService.navigate('ComplaintDetailScreen', {
              complaintId,
              role,
              userId,
            });
          }
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeNotificationOpened();
    };
  }, []);

  return null;
};

export default NotificationService;

// import { useCallback, useEffect } from 'react';
// import { Platform } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import PushNotification, { Importance } from 'react-native-push-notification';

// import { useDispatch, useSelector } from 'react-redux';

// const NotificationService = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     PushNotification.configure({
//       permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//       },
//       popInitialNotification: true,
//       requestPermissions: true,
//     });
//     // For Android, create the channel
//     if (Platform.OS === 'android') {
//       PushNotification.createChannel(
//         {
//           channelId: '2',
//           channelName: '2',
//           channelDescription: 'A channel to categorise your notifications',
//           playSound: true,
//           soundName: 'default',
//           importance: Importance.HIGH,
//           vibrate: true,
//         },
//         created => console.log(`createChannel returned '${created}'`),
//       );
//     }

//     // -------- FOREGROUND STATE --------
//     const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
//       console.log(remoteMessage);
//       handleNotification(remoteMessage, 'foreground');
//     });

//     // -------- OPEN NOTIFICATION FROM QUIT/BACKGROUND STATE --------
//     const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
//       remoteMessage => {
//         console.log(
//           'Notification opened from background state:',
//           remoteMessage,
//         );
//         // handleNotification(remoteMessage, 'foreground');
//       },
//     );

//     // -------- QUIT STATE --------
//     messaging()
//       .getInitialNotification()
//       .then(async remoteMessage => {
//         if (remoteMessage) {
//           console.log(
//             'Notification caused app to open from quit state:',
//             remoteMessage,
//           );
//         }
//       });

//     return () => {
//       unsubscribeOnMessage();
//       unsubscribeNotificationOpened();
//     };
//   }, [dispatch, handleNotification]);

//   const handleNotification = useCallback((remoteMessage, appState) => {
//     if (!remoteMessage) {
//       return;
//     }

//     const { notification, data, messageId, channelId } = remoteMessage;
//     const title = notification?.title || data?.title || 'Notification';
//     const message =
//       notification?.body || data?.body || 'You have a new message';

//     if (notification && data) {
//       console.log(messageId, '===99999');
//       console.log(`Combined payload received in ${appState} state.`);
//     } else if (notification) {
//       console.log(`Notification-only payload received in ${appState} state.`);
//     } else if (data) {
//       console.log(`Data-only payload received in ${appState} state.`);
//     }

//     displayLocalNotification(title, message, data, messageId, channelId);
//   }, []);

//   const displayLocalNotification = (
//     title,
//     message,
//     data,
//     messageId,
//     channelId,
//   ) => {
//     if (Platform.OS === 'ios') {
//     } else {
//       PushNotification.localNotification({
//         channelId: '2',
//         title,
//         message,
//         userInfo: data,
//         playSound: true,
//         soundName: 'default',
//         largeIcon: '', // removes large icon
//         bigPictureUrl: '', // removes big picture
//       });
//     }
//   };

//   return null;
// };

// export default NotificationService;
