import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../../utils/colors';
// import { FontAwesome5 } from '@expo/vector-icons';

const ClosedCard = ({
  id,
  date,
  assignedTo,
  department,
  text,
  rating,
  thumb,
  complainStage,
  onPressSummary,
}) => {
  const renderStars = rating =>
    Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={styles.star}>
        {i < rating ? '★' : '☆'}
      </Text>
    ));

  // complaint stage dots
  const renderStageDots = stage => (
    <View style={styles.stageDotsContainer}>
      {[1, 2, 3].map(i => (
        <View
          key={i}
          style={[
            styles.stageDot,
            { backgroundColor: i <= stage ? '#FFC107' : COLORS.primary },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.idText}>ID #{id}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <TouchableOpacity style={styles.dotsButton}>
          {renderStageDots(complainStage)}
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={styles.mainText}>{text}</Text>
        {rating > 0 && (
          <Image
            style={styles.thumbsDownIcon}
            source={
              thumb
                ? require('../../assets/Images/thumbs-up.png')
                : require('../../assets/Images/thumbs-down.png')
            }
          />
        )}
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Assigned To</Text>
          <Text style={styles.detailValue}>
            {assignedTo && assignedTo.trim() !== ''
              ? assignedTo
              : '--------------'}
          </Text>
        </View>
        <Text style={{ marginHorizontal: 7 }}>|</Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Department</Text>
          <Text style={styles.detailValue}>
            {department && department.trim() !== ''
              ? department
              : '---------------'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={onPressSummary}>
          <Text style={styles.viewSummaryText}>View Summary</Text>
        </TouchableOpacity>
        <View style={styles.starsContainer}>{renderStars(rating)}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  idText: {
    fontSize: 10,
    fontFamily: 'Asap-Regular',
    marginRight: 10,
    color: COLORS.primary,
  },
  dateText: {
    fontSize: 8,
    color: COLORS.primary,
    fontFamily: 'Asap-Regular',
  },
  dotsButton: {
    // marginLeft: 'auto',
    marginRight: 8,
  },
  thumbsDownIcon: {},
  mainText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 15,
    fontFamily: 'Asap-Medium',
  },
  stageDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    // flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.black,
    fontFamily: 'Asap-SemiBold',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: 'Asap-Light',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewSummaryText: {
    color: '#5175B2',
    fontFamily: 'Asap-Medium',
    fontSize: 12,
    textDecorationLine: 'underline',
    textDecorationColor: '#5175B2',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    color: '#FFC107',
    marginHorizontal: 1,
  },
});

export default ClosedCard;
