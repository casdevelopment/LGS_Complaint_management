import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const categories = [
  {
    id: 1,
    title: 'Garrison College For Boys',
    image: require('../../assets/Images/studentMale.png'),
  },
  {
    id: 2,
    title: 'Garrison College For Girls',
    image: require('../../assets/Images/studentFemale.png'),
  },
];

export default function CampusScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.topLeft}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../../assets/Images/turn-back.png')}
          resizeMode="stretch"
        />
      </TouchableOpacity>
      <Image
        source={require('../../assets/Images/topRightDarkCurve.png')}
        style={styles.topRight}
        resizeMode="stretch"
      />

      {/* Title */}
      <Text style={styles.title}>Complaint Form</Text>
      <Text style={styles.subtitle}>Select Campus</Text>

      {/* Grid */}
      <View style={styles.grid}>
        {categories.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('ComplainForm')}
          >
            <Image
              source={item.image}
              style={styles.cardImage}
              resizeMode="contain"
            />

            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: hp('13%'),
  },
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  topLeft: {
    position: 'absolute',
    top: 30,
    left: 25,
  },
  title: {
    fontSize: 32,
    color: '#07294D',
    fontFamily: 'Asap-SemiBold',
    marginBottom: hp('2.5%'),
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#07294D',
    marginBottom: hp('4%'),
    alignSelf: 'center',
    fontFamily: 'Asap-Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0a1a2f',
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#0a1a2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 30,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    marginTop: hp('4%'),
    width: wp('35%'),
    fontSize: 16,
    fontFamily: 'Asap-SemiBold',
    color: '#07294D',
    textAlign: 'center',
  },
});
