import React, { useRef, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Header from '../../components/Header';
import ClosedCard from '../../components/Closed/CloasedCard';
import HistoryModal from '../../components/Modals/HistoryModal';

const DATA = [
  {
    id: '58964-1',
    date: '25 Dec 2025',
    assignedTo: 'John Doe',
    department: 'Marketing',
    text: 'It is a long established fact that a reader ',
    rating: 4,
  },
  {
    id: '58964-2',
    date: '25 Dec 2025',
    assignedTo: 'Jane Smith',
    department: 'Sales',
    text: 'The point of using Lorem Ipsum is that ',
    rating: 5,
  },
  {
    id: '58964-3',
    date: '24 Dec 2025',
    assignedTo: 'Peter Jones',
    department: 'Finance',
    text: 'Many desktop publishing packages and',
    rating: 3,
  },
];

const HistoryScreen = () => {
  const filterModalRef = useRef(null);
  const categoryModalRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['60%', '90%'], []);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const openSummary = useCallback(complaint => {
    setSelectedComplaint(complaint);
    bottomSheetRef.current?.expand();
  }, []);

  const openFilterModal = useCallback(() => {
    console.log('open filter modal');
    filterModalRef.current?.openModal();
  }, []);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header title="History" />

        <FlatList
          data={DATA}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ClosedCard
              id={item.id.split('-')[0]} // Assuming the ID is part of a larger unique key
              date={item.date}
              assignedTo={item.assignedTo}
              department={item.department}
              text={item.text}
              rating={item.rating}
              onPressSummary={() => openFilterModal()}
            />
          )}
        />
      </View>
      {/* <HistoryModal
        ref={filterModalRef}
        data={[1, 2, 3]}
        filterData={[1, 2, 3]}
        // onSelectFilters={setSelectedFilters}
        // onSelectCategory={setSelectedCategory}
      /> */}
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#0A2342',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    marginHorizontal: 20,
  },
  complaintId: { fontSize: 12, color: '#888', marginBottom: 5 },
  complaintTitle: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  assigned: { fontSize: 13, marginBottom: 8 },
  bold: { fontWeight: '600' },
  link: { fontSize: 14, fontWeight: '600', color: '#0A2342' },
  sheetContent: { flex: 1, padding: 16 },
  sheetHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#0A2342',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  boldText: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  paragraph: { fontSize: 13, color: '#444', marginBottom: 10, lineHeight: 20 },
  trackItem: {
    marginVertical: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderColor: '#0A2342',
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
  },
  timelineDate: { fontSize: 12, color: '#777', marginBottom: 4 },
  row: { fontSize: 13, marginBottom: 4 },
});
