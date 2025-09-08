import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

const data = [
  {
    title: 'School Admission Open',
    subtitle: 'Ensure your voice makes a real impact.',
  },
  {
    title: 'Modern Learning',
    subtitle: 'Innovative methods for a brighter future.',
  },
  {
    title: 'Join Us Today',
    subtitle: 'Shape your tomorrow with us.',
  },
];

const AdmissionCarousel = () => {
  const carouselRef = useRef(null);
  const progress = useSharedValue(0);

  return (
    <Carousel
      ref={carouselRef}
      width={width - 40}
      height={220}
      //   autoPlay
      loop
      data={data}
      scrollAnimationDuration={1000}
      onProgressChange={(_, absoluteProgress) => {
        progress.value = absoluteProgress;
      }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>School</Text>
            <Text style={styles.title}>Admission Open</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <Image
            source={require('../../assets/Images/crousalImage.png')}
            style={styles.image}
          />

          {/* Dots */}
          <View style={styles.dotsContainer}>
            {data.map((_, index) => {
              const animatedDotStyle = useAnimatedStyle(() => {
                const opacity = interpolate(
                  progress.value,
                  [index - 1, index, index + 1],
                  [0.4, 1, 0.4], // fades in/out
                  'clamp',
                );
                const scale = interpolate(
                  progress.value,
                  [index - 1, index, index + 1],
                  [0.8, 1.2, 0.8], // active dot grows
                  'clamp',
                );
                return {
                  opacity,
                  transform: [{ scale }],
                };
              });

              return (
                <Animated.View
                  key={index}
                  style={[styles.dot, animatedDotStyle]}
                />
              );
            })}
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    // flex: 1,
    backgroundColor: '#0A2A47',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
  },
  textContainer: {
    height: hp('13%'),
    width: wp('55%'),
    //height: 100,

    // flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontFamily: 'Asap-SemiBold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 6,
    fontFamily: 'Asap-Regular',
  },
  image: {
    width: 100,
    height: 150,
    resizeMode: 'contain',
    position: 'absolute',

    right: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    backgroundColor: '#fff',
  },
});

export default AdmissionCarousel;

// import React, { useRef } from 'react';
// import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
// import Carousel from 'react-native-reanimated-carousel';
// import { Pagination } from 'react-native-reanimated-carousel';

// const { width } = Dimensions.get('window');

// const data = [
//   {
//     title: 'School Admission Open',
//     subtitle: 'Ensure your voice makes a real impact.',
//     image: 'https://i.ibb.co/3MywJ3P/student.png',
//   },
//   {
//     title: 'Modern Learning',
//     subtitle: 'Innovative methods for a brighter future.',
//     image: 'https://i.ibb.co/3MywJ3P/student.png',
//   },
//   {
//     title: 'Join Us Today',
//     subtitle: 'Shape your tomorrow with us.',
//     image: 'https://i.ibb.co/3MywJ3P/student.png',
//   },
// ];

// const AdmissionCarousel = () => {
//   const carouselRef = useRef(null);
//   const [activeIndex, setActiveIndex] = React.useState(0);

//   return (
//     <View style={styles.container}>
//       <Carousel
//         ref={carouselRef}
//         width={width - 40}
//         height={200}
//         autoPlay
//         loop
//         data={data}
//         scrollAnimationDuration={1000}
//         onSnapToItem={index => setActiveIndex(index)}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={styles.textContainer}>
//               <Text style={styles.title}>{item.title}</Text>
//               <Text style={styles.subtitle}>{item.subtitle}</Text>
//             </View>
//             <Image source={{ uri: item.image }} style={styles.image} />
//           </View>
//         )}
//       />

//       {/* Pagination inside carousel */}
//       <View style={styles.paginationContainer}>
//         <Pagination
//           data={data}
//           dotStyle={styles.dot}
//           inactiveDotStyle={styles.inactiveDot}
//           activeIndex={activeIndex}
//           carouselRef={carouselRef}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#0A2A47',
//     borderRadius: 12,
//     padding: 15,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   textContainer: {
//     flex: 1,
//     paddingRight: 10,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     color: '#fff',
//     fontSize: 14,
//     marginTop: 6,
//   },
//   image: {
//     width: 100,
//     height: 120,
//     resizeMode: 'contain',
//   },
//   paginationContainer: {
//     position: 'absolute',
//     bottom: 10,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#fff',
//     marginHorizontal: 4,
//   },
//   inactiveDot: {
//     backgroundColor: 'gray',
//   },
// });

// export default AdmissionCarousel;
