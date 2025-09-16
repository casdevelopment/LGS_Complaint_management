import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import Header from '../../components/Header';
import ClosedCard from '../../components/Closed/CloasedCard';
import HistoryModal from '../../components/Modals/HistoryModal';
import ForwardModal from '../../components/Modals/ForwardModal';
import { complainHistory } from '../../Network/apis';
import { useSelector } from 'react-redux';

const ImplementedComplain = () => {
  const [history, setHistory] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  console.log(history, 'state value');
  const filterModalRef = useRef(null);
  const adminHistortModalRef = useRef(null);
  const forwardModalRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const openComplaintSummary = useCallback(id => {
    filterModalRef.current?.openModal(id);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const body = {
        UserId: user?.id,
        Status: 'implemented',
      };
      const res = await complainHistory(body, user?.role);
      console.log(res, 'history');
      if (res?.result === 'success') {
        setHistory(res?.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const renderItem = ({ item }) => {
    switch (user?.role) {
      case 'parent':
        return (
          <ClosedCard
            id={item?.complaintId}
            date={item?.createdAt}
            assignedTo={item.assignedTo}
            department={item.department}
            text={item.complaintSubject}
            rating={item?.parentRating}
            thumb={item?.isThumbUp}
            complainStage={item?.complaintStageId}
            onPressSummary={() => openComplaintSummary(item?.complaintId)}
          />
        );
      default:
        return <Text>Unknown role</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Implemented" />

      <FlatList
        data={history}
        keyExtractor={item => item?.complaintId.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No implemented complaints found
            </Text>
          </View>
        )}
      />

      <HistoryModal ref={filterModalRef} complaintId={selectedComplaintId} />
    </SafeAreaView>
  );
};

export default ImplementedComplain;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
