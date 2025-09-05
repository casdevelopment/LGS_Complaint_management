import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import ImagesSection from '../../components/Onboarding/ImagesSection';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'LGES',
    subtitle: 'Complaint Cell',
    description:
      'Submit complaints instantly with easy forms, track progress, and get real-time resolutions.',
    image: require('../../assets/Images/Group1.png'),
  },
  {
    id: '2',
    title: 'LGES',
    subtitle: 'Complaint Cell',
    description:
      'Stay informed with instant notifications and ensure your voice makes a real impact.',
    image: require('../../assets/Images/Group2.png'),
  },
  {
    id: '3',
    title: 'LGES',
    subtitle: 'Complaint Cell',
    description:
      'Stay informed with instant notifications and ensure your voice makes a real impact.',
    image: require('../../assets/Images/Group3.png'),
  },
];

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login'); // move to login after last screen
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {/* Top-right curve (your PNG asset) */}
      <Image
        source={require('../../assets/Images/topRightDarkCurve.png')}
        style={styles.topRight}
      />

      {/* Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.title}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Illustration */}
      <ImagesSection illustration={item.image} />
      {/* <Image source={item.image} style={styles.image} resizeMode="contain" /> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {/* Top row: Skip + Button */}
        <View style={styles.footerRow}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Login' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom row: Dots */}
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingTop: 50,
  },
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.4,
    height: height * 0.2,
    resizeMode: 'stretch',
  },
  textContainer: {
    //  backgroundColor: 'red',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    color: '#07294D',
    fontFamily: 'Asap-SemiBold',
    // marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Asap-Regular',
    // textAlign: 'center',
    color: '#07294D',
  },
  image: {
    marginTop: 30,
    width: width * 0.8,
    height: height * 0.35,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  skip: {
    color: '#3A3A3A',
    fontSize: 14,
  },

  button: {
    backgroundColor: '#07294D',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    fontFamily: 'Asap-SemiBold',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    marginBottom: 15, // space between buttons and dots
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#07294D',
    width: 35,
    height: 8,
  },
});
