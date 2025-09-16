import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import Header from '../../components/Header';
import ClosedCard from '../../components/Closed/CloasedCard';
import HistoryModal from '../../components/Modals/HistoryModal';
import ForwardModal from '../../components/Modals/ForwardModal';
import { complainHistory } from '../../Network/apis';
import { useSelector } from 'react-redux';
import AdminHistoryCard from '../../components/History/AdminHistoryCard';
import AdminHistoryModal from '../../components/Modals/AdminHistoryModal';

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
  const [history, setHistory] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(false); // 👈 add loading state for refresh
  const [refreshing, setRefreshing] = useState(false);
  console.log(history, 'state value');
  const filterModalRef = useRef(null);
  const adminHistortModalRef = useRef(null);
  const forwardModalRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const openComplaintSummary = useCallback(id => {
    filterModalRef.current?.openModal(id);
  }, []);
  const openAdminComplaintSummary = useCallback(id => {
    adminHistortModalRef.current?.openModal(id);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);
  const openForwardComplain = useCallback(id => {
    forwardModalRef.current?.openModal(id, 'assign');
  }, []);
  const fetchHistory = async () => {
    try {
      const body = {
        UserId: user?.id,
        Role: user?.role,
        Status: '',
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
      case 'employee':
        return (
          <AdminHistoryCard
            id={item?.complaintId}
            date={item?.createdAt}
            assignedTo={item.assignedTo}
            department={item.department}
            text={item.complaintSubject}
            rating={item?.parentRating}
            thumb={item?.isThumbUp}
            complainStage={item?.complaintStageId}
            onPressSummary={() => openAdminComplaintSummary(item?.complaintId)}
            onPressAssignAgent={() => openForwardComplain(item?.complaintId)}
          />
        );
      case 'oic':
        return (
          <AdminHistoryCard
            id={item?.complaintId}
            date={item?.createdAt}
            assignedTo={item.assignedTo}
            department={item.department}
            text={item.complaintSubject}
            rating={item?.parentRating}
            thumb={item?.isThumbUp}
            complainStage={item?.complaintStageId}
            onPressSummary={() => openAdminComplaintSummary(item?.complaintId)}
            onPressAssignAgent={() => openForwardComplain(item?.complaintId)}
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
      <Header title="History" />

      <FlatList
        data={history}
        keyExtractor={item => item?.complaintId.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderItem}
        refreshing={refreshing} // 👈 enable pull-to-refresh
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No complaints found</Text>
          </View>
        )}
      />

      <HistoryModal
        ref={filterModalRef}
        complaintId={selectedComplaintId}
        onDismiss={fetchHistory}
      />
      <AdminHistoryModal
        ref={adminHistortModalRef}
        onOpenForwardModal={id => forwardModalRef.current?.openModal(id)}
        complaintId={selectedComplaintId}
        onDismiss={fetchHistory}
      />
      <ForwardModal ref={forwardModalRef} onDismiss={fetchHistory} />
    </SafeAreaView>
  );
};

export default HistoryScreen;

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
