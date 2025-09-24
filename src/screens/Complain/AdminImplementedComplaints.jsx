import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import Header from '../../components/Header';
import ClosedCard from '../../components/Closed/CloasedCard';
import HistoryModal from '../../components/Modals/HistoryModal';
import { complainHistory } from '../../Network/apis';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import AdminHistoryCard from '../../components/History/AdminHistoryCard';
import AdminHistoryModal from '../../components/Modals/AdminHistoryModal';
import DropModal from '../../components/Modals/DropModal';
import ForwardModal from '../../components/Modals/ForwardModal';

const AdminImplementedComplaints = ({ route }) => {
  const { complainStatus, campus, classes } = route.params;
  const [history, setHistory] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const filterModalRef = useRef(null);
  const dropModalRef = useRef(null);
  const adminHistortModalRef = useRef(null);
  const forwardModalRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const student = useSelector(state => state.auth.student);
  const openForwardComplain = useCallback(id => {
    forwardModalRef.current?.openModal(id, 'assign');
  }, []);

  const openAdminComplaintSummary = useCallback(id => {
    adminHistortModalRef.current?.openModal(id);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const body = {
        UserId: user?.id,
        Role: user?.role,
        CampusId: campus.schoolId,
        ClassId: classes.classId,
        Status: complainStatus.status,
      };
      const res = await complainHistory(body, user?.role);
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
            onPressDropComplaint={() => openDropComplain(item?.complaintId)}
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
            onPressDropComplaint={() => openDropComplain(item?.complaintId)}
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
  const openDropComplain = useCallback(id => {
    dropModalRef.current?.openModal(id);
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
            <Text style={styles.emptyText}>No complaints found</Text>
          </View>
        )}
      />

      <AdminHistoryModal
        ref={adminHistortModalRef}
        onOpenForwardModal={id => forwardModalRef.current?.openModal(id)}
        complaintId={selectedComplaintId}
      />
      <ForwardModal ref={forwardModalRef} onDismiss={fetchHistory} />
      <DropModal ref={dropModalRef} onDismiss={fetchHistory} />
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default AdminImplementedComplaints;

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
