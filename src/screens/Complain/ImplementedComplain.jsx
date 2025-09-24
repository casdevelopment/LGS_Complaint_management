import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import Header from '../../components/Header';
import ClosedCard from '../../components/Closed/CloasedCard';
import HistoryModal from '../../components/Modals/HistoryModal';
import { complainHistory } from '../../Network/apis';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';

const ImplementedComplain = () => {
  const [history, setHistory] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const filterModalRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const student = useSelector(state => state.auth.student);
  const openComplaintSummary = useCallback(id => {
    filterModalRef.current?.openModal(id);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const body = {
        UserId: user?.id,
        Status: 'implemented',
        Role: user?.role,
        StudentId: student?.studentId,
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
      setRefreshing(false);
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
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Implemented" />

      <FlatList
        data={history}
        keyExtractor={item => item?.complaintId.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderItem}
        refreshing={refreshing} // 👈 enable pull-to-refresh
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No implemented complaints found
            </Text>
          </View>
        )}
      />

      <HistoryModal ref={filterModalRef} complaintId={selectedComplaintId} />
      {loading && <Loader />}
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
