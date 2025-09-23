import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getConplainSubCategories } from '../../Network/apis';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../../components/Loader/Loader';

export default function SubCategoryScreen({ navigation, route }) {
  const { category } = route.params;
  console.log(category, 'uuuuuuuuun');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getConplainSubCategories({
        ComplainCategoryId: category?.complainCategoryId,
      });
      if (res?.result === 'success') {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CampusScreen', { subcategory: item, category })
      }
    >
      <Image
        source={{ uri: item?.categoryIcon }} // assuming API gives image URL
        style={styles.cardImage}
        resizeMode="contain"
      />
      <Text style={styles.cardText}>{item?.complainSubCategory}</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#fff' }}
      edges={['left', 'right', 'bottom']}
    >
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
        <Text style={styles.subtitle}>Select a Subcategory</Text>

        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={item => item?.complainSubCategoryId.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No subcategory found</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        {loading && <Loader />}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    //  flex: 1,
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
    top: 45,
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
    fontSize: 16,
    fontFamily: 'Asap-SemiBold',
    color: '#07294D',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('5%'),
  },

  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
