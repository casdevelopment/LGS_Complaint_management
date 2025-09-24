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
import { getStudentList } from '../../Network/apis';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { setStudent } from '../../Redux/slices/AuthSlice';

export default function StudentScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getStudentList({ Role: user?.role, UserId: user?.id });
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
      onPress={() => {
        // store student in redux
        dispatch(setStudent({ student: item }));

        // navigate
        navigation.replace('HomeScreen');
      }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.studentName?.charAt(0)}</Text>
      </View>

      <Text style={styles.studentName}>{item.studentName}</Text>
      <Text style={styles.fatherName}>Father: {item.fatherName}</Text>
      <Text style={styles.classCampus}>
        {item.class} | {item.campus}
      </Text>
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
        <Text style={styles.title}>Select Student</Text>
        <Text style={styles.subtitle}>Choose a student to continue</Text>

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
            keyExtractor={item => item.studentId.toString()}
            // numColumns={1}
            // columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 150 }}
          />
        )}
      </View>
    </SafeAreaView>
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
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#07294D',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },

  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Asap-SemiBold',
  },

  studentName: {
    fontSize: 18,
    fontFamily: 'Asap-SemiBold',
    color: '#07294D',
    textAlign: 'center',
  },

  fatherName: {
    fontSize: 14,
    fontFamily: 'Asap-Regular',
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },

  classCampus: {
    fontSize: 13,
    fontFamily: 'Asap-Regular',
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
});
