import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Header from '../../components/Header';

const WebNotificationDetailScreen = ({ route }) => {
  const notification = route?.params?.notification || {};
  const files = notification?.notificationFiles || [];

  const openFile = async url => {
    if (!url) {
      return;
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Notification" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>{notification?.notificationTitle}</Text>
          <Text style={styles.desc}>{notification?.notificationText}</Text>
        </View>

        <View style={styles.filesSection}>
          <Text style={styles.sectionTitle}>Files</Text>
          {files.length > 0 ? (
            files.map((file, index) => (
              <TouchableOpacity
                key={`${file?.systemFileName || index}`}
                style={styles.fileItem}
                onPress={() => openFile(file?.systemFileName)}
              >
                <Text style={styles.fileName} numberOfLines={1}>
                  {file?.userFileName || file?.systemFileName}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No files attached.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default WebNotificationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D1B2A',
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  filesSection: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B2A',
    marginBottom: 10,
  },
  fileItem: {
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5EAF2',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D1B2A',
    marginBottom: 4,
  },
  emptyText: {
    color: '#777',
  },
});