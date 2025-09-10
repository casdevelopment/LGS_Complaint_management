import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Header from '../../components/Header';
import { COLORS } from '../../utils/colors';
// import Icon from 'react-native-vector-icons/Ionicons';

const NotificationScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Today');

  const tabs = ['Today', 'Last Week', 'Last Month'];

  const notifications = [
    {
      id: '1',
      title: 'OIC',
      description: 'Congratulations on successfully registering an app account',
      date: '10/07/2023',
      type: 'unread',
    },
    {
      id: '2',
      title: 'OIC',
      description: 'Congratulations on successfully registering an app account',
      date: '10/07/2023',
      type: 'unread',
    },
    {
      id: '3',
      title: 'Success & Prosperity',
      description: 'Congratulations on successfully registering an app account',
      date: '10/07/2023',
      type: 'read',
    },
  ];

  const renderNotification = ({ item }) => (
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
          <Text style={styles.desc}>{item.description}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>

        {/* Delete Icon (only for read notifications) */}
        {item.type === 'read' && (
          <TouchableOpacity>
            {/* <Icon name="trash-outline" size={22} color="#0D1B2A" /> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Notifications" />

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Section */}
      <Text style={styles.sectionTitle}>Today, 11/12/2023</Text>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#0D1B2A',
    fontWeight: '600',
  },
  activeLine: {
    height: 2,
    backgroundColor: '#0D1B2A',
    marginTop: 4,
  },
  sectionTitle: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 25,
    marginBottom: 10,
    color: '#0D1B2A',
  },
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
    marginHorizontal: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D1B2A',
  },
  desc: {
    fontSize: 13,
    color: '#555',
    marginVertical: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    margin: 15,
    alignItems: 'center',
  },
  updateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
