import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import Loader from '../../components/Loader/Loader';
import { getWebNotifications } from '../../Network/apis';

const WebNotificationScreen = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const payload = {
        UserId: user?.id,
      };

      const res = await getWebNotifications(payload);
      if (res?.data) {
        setNotifications(res.data || []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching web notifications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('WebNotificationDetailScreen', { notification: item })}
    >
      <Text style={styles.title} numberOfLines={1}>
        {item?.notificationTitle}
      </Text>
      <Text style={styles.desc} numberOfLines={2}>
        {item?.notificationText}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Notifications" />
      <FlatList
        data={notifications}
        keyExtractor={item => String(item?.notificationId)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No notifications found.</Text> : null}
        showsVerticalScrollIndicator={false}
      />
      {loading && <Loader />}
    </View>
  );
};

export default WebNotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B2A',
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
  },
});