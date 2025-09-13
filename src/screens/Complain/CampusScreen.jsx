import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getConplainCategories } from '../../Network/apis';
import { getAllCampus } from '../../Network/apis';

export default function CampusScreen({ navigation, route }) {
  const { category } = route.params;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCampus();
      if (res?.result === 'success') {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleCategorySelect = campus => {
    // Combine campus + category and pass to ComplaintFormScreen
    navigation.navigate('ComplainForm', { campus, category });
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCategorySelect(item)}
    >
      <Image
        source={{ uri: item.schoolIcon }} // assuming API gives image URL
        style={styles.cardImage}
        resizeMode="contain"
      />
      <Text style={styles.cardText}>{item.school}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      {/* Back Button */}
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

      {/* Loader */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#07294D"
          style={{ marginTop: hp('10%') }}
        />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={item => item.schoolId.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
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
  cardImage: {
    width: 60,
    height: 60,
  },
  cardText: {
    marginTop: hp('4%'),
    width: wp('30%'),
    fontSize: 16,
    fontFamily: 'Asap-SemiBold',
    color: '#07294D',
    textAlign: 'center',
  },
});
