import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AdmissionCarousel from '../../components/Crousal/AdmissionCarousel';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const { role } = route.params || {};
  console.log(role, 'mmmmtttttt');

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Images/topRightDarkCurve.png')}
        style={styles.topRight}
        resizeMode="stretch"
      />
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={require('../../assets/Images/profile-picture.png')}
            style={styles.avatar}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('AccountScreen')}
          >
            <Text style={styles.userName}>Ahmed Hassan</Text>
            <Text style={styles.userClass}>Class VII B</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.notification}>
          <Image
            source={require('../../assets/Images/mail.png')}
            style={styles.bellIcon}
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>0</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.announcementCard}>
        <AdmissionCarousel />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {(!role || role === 'OIC') && (
          <>
            <View style={styles.card}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../../assets/Images/bad-review.png')}
                  style={{ marginRight: 10 }}
                />

                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>Assigned Complaints</Text>
                  <Text style={styles.cardValue}>1</Text>
                </View>
                <View style={{}}>
                  <Text style={styles.cardDate}>12/20/2025</Text>
                  <Text style={styles.cardId}>ID #25844</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',

                marginHorizontal: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={[styles.card2, { flex: 1, marginRight: 10 }]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ClosedComplain')}
                  style={{ flexDirection: 'row' }}
                >
                  <Image
                    source={require('../../assets/Images/attended.png')}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{}}>
                    <Text style={styles.cardTitle}>Attended</Text>
                    <Text style={styles.cardValue}>18</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.card2}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DroppedComplain')}
                  style={{ flexDirection: 'row' }}
                >
                  <Image
                    source={require('../../assets/Images/bad-feedback.png')}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{}}>
                    <Text style={styles.cardTitle}>Un Attended</Text>
                    <Text style={styles.cardValue}>18</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        {(!role || role === 'Admin') && (
          <>
            <View style={styles.card}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../../assets/Images/bad-review.png')}
                  style={{ marginRight: 10 }}
                />

                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>Total Complaints</Text>
                  <Text style={styles.cardValue}>1</Text>
                </View>
                <View style={{}}>
                  <Text style={styles.cardDate}>12/20/2025</Text>
                  <Text style={styles.cardId}>ID #25844</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',

                marginHorizontal: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={[styles.card2, { flex: 1, marginRight: 10 }]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ClosedComplain')}
                  style={{ flexDirection: 'row' }}
                >
                  <Image
                    source={require('../../assets/Images/attended.png')}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{}}>
                    <Text style={styles.cardTitle}>Attended</Text>
                    <Text style={styles.cardValue}>18</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.card2}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DroppedComplain')}
                  style={{ flexDirection: 'row' }}
                >
                  <Image
                    source={require('../../assets/Images/bad-feedback.png')}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{}}>
                    <Text style={styles.cardTitle}>Un Attended</Text>
                    <Text style={styles.cardValue}>18</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        {(!role || role === 'Parent') && (
          <>
            {/* Complaint Cards */}
            <View style={styles.card}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../../assets/Images/bad-review.png')}
                  style={{ marginRight: 10 }}
                />
                <View style={{}}>
                  <Text style={styles.cardTitle}>Total Complaints</Text>
                  <Text style={styles.cardValue}>18</Text>
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../../assets/Images/bad-review.png')}
                  style={{ marginRight: 10 }}
                />

                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>Complaints Open</Text>
                  <Text style={styles.cardValue}>1</Text>
                </View>
                <View style={{}}>
                  <Text style={styles.cardDate}>12/20/2025</Text>
                  <Text style={styles.cardId}>ID #25844</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',

                marginHorizontal: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={[styles.card2, { flex: 1, marginRight: 10 }]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ClosedComplain')}
                  style={{ flexDirection: 'row' }}
                >
                  <Image
                    source={require('../../assets/Images/attended.png')}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{}}>
                    <Text style={styles.cardTitle}>Closed</Text>
                    <Text style={styles.cardValue}>18</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.card2}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DroppedComplain')}
                  style={{ flexDirection: 'row' }}
                >
                  <Image
                    source={require('../../assets/Images/bad-feedback.png')}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{}}>
                    <Text style={styles.cardTitle}>Dropped</Text>
                    <Text style={styles.cardValue}>18</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 20,
                justifyContent: 'space-between',
              }}
            >
              <View style={[styles.card2, { flex: 1, marginRight: 10 }]}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('../../assets/Images/good-feedBack.png')}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flexShrink: 1 }}>
                    <Text
                      style={styles.cardTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Implemented
                    </Text>
                    <Text style={styles.cardValue}>18</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.card2, { flex: 1, marginLeft: 10 }]}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('../../assets/Images/acknowledge.png')}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flexShrink: 1 }}>
                    <Text
                      style={styles.cardTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Acknowledged
                    </Text>
                    <Text style={styles.cardValue}>18</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Grid Stats */}
            {/* <View style={styles.grid}>
          {[
            { title: 'Closed', value: 15 },
            { title: 'Dropped', value: 2 },
            { title: 'Implemented', value: 15 },
            { title: 'Acknowledged', value: 2 },
          ].map((item, index) => (
            <View key={index} style={styles.gridItem}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
            </View>
          ))}
        </View> */}

            {/* New Complaint Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CategoryScreen')}
              style={styles.newComplaintBtn}
            >
              <Image
                source={require('../../assets/Images/angry-customer.png')}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.newComplaintText}>New Complain</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  // Header
  header: {
    marginTop: hp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Asap-Medium',
    color: '#07294D',
  },
  userClass: {
    fontSize: 12,
    color: '#07294D',
    fontFamily: 'Asap-Light',
  },
  notification: {
    flexDirection: 'row',
    backgroundColor: '#07294D',
    width: wp('15%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.4%'),
    // position: 'relative',
  },
  bellIcon: {
    width: 20,
    height: 20,
  },
  badge: {
    // position: 'absolute',
    // top: -4,
    // right: -6,
    // backgroundColor: '#0D1B2A',
    // borderRadius: 8,
    // paddingHorizontal: 5,
    // paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Asap-Medium',
  },

  // Announcement
  announcementCard: {
    marginHorizontal: 20,

    alignItems: 'center',
  },
  announcementText: {
    flex: 1,
  },
  announcementTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  announcementDesc: {
    color: '#fff',
    fontSize: 13,
  },
  announcementImage: {
    width: 100,
    height: 100,
  },

  // Cards
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  card2: {
    backgroundColor: '#fff',
    // marginHorizontal: 10,
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Asap-SemiBold',
    color: '#07294D',
  },
  cardValue: {
    fontSize: 12,
    fontFamily: 'Asap-Regular',
    color: '#07294D',
    marginTop: 5,
  },
  rowBetween: {
    flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  cardDate: {
    fontSize: 13,
    color: '#07294D',
    fontFamily: 'Asap-Medium',
  },
  cardId: {
    fontSize: 10,
    color: '#07294D',
    fontFamily: 'Asap-Regualr',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginTop: 15,
  },
  gridItem: {
    backgroundColor: '#fff',
    width: (width - 60) / 2,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'flex-start',
  },

  // New Complaint
  newComplaintBtn: {
    flexDirection: 'row',
    backgroundColor: '#07294D',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newComplaintText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Asap-SemiBold',
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0D1B2A',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
