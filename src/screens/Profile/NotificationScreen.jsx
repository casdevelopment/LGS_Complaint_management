import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Header from '../../components/Header';
import { COLORS } from '../../utils/colors';
import { getNotifications } from '../../Network/apis';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import { SwipeListView } from 'react-native-swipe-list-view';
import { deleteNotification } from '../../Network/apis';

const NotificationScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Today');
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const tabs = [
    { label: 'Today', duration: 'today' },
    { label: 'Last Week', duration: 'weekly' },
    { label: 'Last Month', duration: 'monthly' },
  ];

  useEffect(() => {
    const selected = tabs.find(tab => tab.label === activeTab);
    if (selected) {
      fetchNotifications(selected.duration);
    }
  }, [activeTab]);

  const fetchNotifications = async duration => {
    try {
      setLoading(true);
      const payload = {
        UserId: user?.id,
        Role: user?.role,
        Duration: duration,
      };

      const res = await getNotifications(payload);
      if (res.data) {
        setNotifications(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = id => {
  //   setNotifications(prev => prev.filter(item => item.notificationId !== id));
  // };
  const handleDelete = async id => {
    try {
      // Optimistic update: remove immediately from UI
      setNotifications(prev => prev.filter(item => item.notificationId !== id));

      // Call API
      const res = await deleteNotification({ NotificationId: id });

      if (res?.messageCode !== 200) {
        // ❌ Rollback if API fails
        setNotifications(prev => [...prev, { notificationId: id }]);
        console.warn('Failed to delete notification:', res?.message);
      }
    } catch (err) {
      console.error('Error deleting notification:', err.message);
      // ❌ Rollback if error
      fetchNotifications(tabs.find(tab => tab.label === activeTab)?.duration);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Status Dot */}
        <View
          style={[
            styles.dot,
            { backgroundColor: item.type === 'unread' ? '#0D1B2A' : '#ccc' },
          ]}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.body}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  const renderHiddenItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(item.notificationId)}
    >
      <Image source={require('../../assets/Images/delete.png')} />
      {/* <Text style={styles.deleteText}>Delete</Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Notifications" />

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.label}
            onPress={() => setActiveTab(tab.label)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.label && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.label && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List with Swipe-to-Delete */}
      <SwipeListView
        data={notifications}
        keyExtractor={item => item?.notificationId}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-80} // how far to swipe
        disableRightSwipe // only allow left swipe
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {loading && <Loader />}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabText: { fontSize: 16, color: '#999', textAlign: 'center' },
  activeTabText: { color: '#0D1B2A', fontWeight: '600' },
  activeLine: { height: 2, backgroundColor: '#0D1B2A', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  title: { fontSize: 15, fontWeight: '600', color: '#0D1B2A' },
  desc: { fontSize: 13, color: '#555', marginVertical: 2 },
  date: { fontSize: 12, color: '#999' },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%',
    borderRadius: 10,
    marginVertical: 7,
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  deleteText: { color: '#fff', fontWeight: '600' },
});

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
// } from 'react-native';
// import Header from '../../components/Header';
// import { COLORS } from '../../utils/colors';
// import { getNotifications } from '../../Network/apis';
// import { useSelector } from 'react-redux';
// import Loader from '../../components/Loader/Loader';
// import { Swipeable } from 'react-native-gesture-handler/ReanimatedSwipeable';

// // import Icon from 'react-native-vector-icons/Ionicons';

// const NotificationScreen = ({ navigation }) => {
//   const [activeTab, setActiveTab] = useState('Today');
//   const user = useSelector(state => state.auth.user);
//   const [loading, setLoading] = useState(false);
//   const [notifications, setNotifications] = useState([]);

//   const tabs = [
//     { label: 'Today', duration: 'today' },
//     { label: 'Last Week', duration: 'weekly' },
//     { label: 'Last Month', duration: 'monthly' },
//   ];
//   useEffect(() => {
//     const selected = tabs.find(tab => tab.label === activeTab);
//     if (selected) {
//       fetchNotifications(selected.duration);
//     }
//   }, [activeTab]);

//   // const notifications = [
//   //   {
//   //     id: '1',
//   //     title: 'OIC',
//   //     description: 'Congratulations on successfully registering an app account',
//   //     date: '10/07/2023',
//   //     type: 'unread',
//   //   },
//   //   {
//   //     id: '2',
//   //     title: 'OIC',
//   //     description: 'Congratulations on successfully registering an app account',
//   //     date: '10/07/2023',
//   //     type: 'unread',
//   //   },
//   //   {
//   //     id: '3',
//   //     title: 'Success & Prosperity',
//   //     description: 'Congratulations on successfully registering an app account',
//   //     date: '10/07/2023',
//   //     type: 'read',
//   //   },
//   // ];
//   const fetchNotifications = async duration => {
//     try {
//       setLoading(true);
//       const payload = {
//         UserId: user?.id,
//         Role: user?.role,
//         Duration: duration,
//       };

//       const res = await getNotifications(payload);
//       console.log(res, 'mmmmmm');

//       if (res.data) {
//         setNotifications(res.data || []); // adjust based on your API response
//       }
//     } catch (err) {
//       console.error('Error fetching notifications:', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleDelete = id => {
//     // Call delete API if needed
//     setNotifications(prev => prev.filter(item => item.notificationId !== id));
//   };

//   const renderRightActions = id => (
//     <TouchableOpacity
//       style={styles.deleteButton}
//       onPress={() => handleDelete(id)}
//     >
//       <Text style={styles.deleteText}>Delete</Text>
//     </TouchableOpacity>
//   );

//   const renderNotification = ({ item }) => (
//     <Swipeable
//       renderRightActions={() => renderRightActions(item.notificationId)}
//     >
//       <View style={styles.card}>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           {/* Status Dot */}
//           <View
//             style={[
//               styles.dot,
//               { backgroundColor: item.type === 'unread' ? '#0D1B2A' : '#ccc' },
//             ]}
//           />
//           <View style={{ flex: 1 }}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.desc}>{item.body}</Text>
//             <Text style={styles.date}>{item.date}</Text>
//           </View>

//           {/* Delete Icon (only for read notifications) */}
//           {item.type === 'read' && (
//             <TouchableOpacity>
//               {/* <Icon name="trash-outline" size={22} color="#0D1B2A" /> */}
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </Swipeable>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Header title="Notifications" />

//       {/* Tabs */}
//       <View style={styles.tabs}>
//         {tabs.map(tab => (
//           <TouchableOpacity
//             key={tab.label}
//             onPress={() => setActiveTab(tab.label)}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === tab.label && styles.activeTabText,
//               ]}
//             >
//               {tab.label}
//             </Text>
//             {activeTab === tab.label && <View style={styles.activeLine} />}
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Date Section */}
//       {/* <Text style={styles.sectionTitle}>Today, 11/12/2023</Text> */}

//       {/* Notifications List */}
//       <FlatList
//         data={notifications}
//         renderItem={renderNotification}
//         keyExtractor={item => item?.notificationId}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />

//       {/* Update Button */}
//       {/* <TouchableOpacity style={styles.updateButton}>
//         <Text style={styles.updateText}>Update</Text>
//       </TouchableOpacity> */}
//       {loading && <Loader />}
//     </View>
//   );
// };

// export default NotificationScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     justifyContent: 'space-between',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#0D1B2A',
//   },
//   tabs: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 10,
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#999',
//     textAlign: 'center',
//   },
//   activeTabText: {
//     color: '#0D1B2A',
//     fontWeight: '600',
//   },
//   activeLine: {
//     height: 2,
//     backgroundColor: '#0D1B2A',
//     marginTop: 4,
//   },
//   sectionTitle: {
//     marginTop: 15,
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 25,
//     marginBottom: 10,
//     color: '#0D1B2A',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 15,
//     marginHorizontal: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     marginHorizontal: 20,
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#0D1B2A',
//   },
//   desc: {
//     fontSize: 13,
//     color: '#555',
//     marginVertical: 2,
//   },
//   date: {
//     fontSize: 12,
//     color: '#999',
//   },
//   updateButton: {
//     backgroundColor: COLORS.primary,
//     padding: 15,
//     borderRadius: 8,
//     margin: 15,
//     alignItems: 'center',
//   },
//   updateText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   deleteButton: {
//     backgroundColor: 'red',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 80,
//     borderRadius: 10,
//     marginVertical: 5,
//   },
//   deleteText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });
