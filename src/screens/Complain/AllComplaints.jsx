import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import Header from '../../components/Header';
import AdminHistoryCard from '../../components/History/AdminHistoryCard';
import ClosedCard from '../../components/Closed/CloasedCard';
import AdminHistoryModal from '../../components/Modals/AdminHistoryModal';
import HistoryModal from '../../components/Modals/HistoryModal';
import DropModal from '../../components/Modals/DropModal';
import ForwardModal from '../../components/Modals/ForwardModal';
import {
  getAllComplaintsList,
  complainHistory,
} from '../../Network/apis';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';

const AllComplaints = ({ route }) => {
  const [history, setHistory] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const adminHistoryModalRef = useRef(null);
  const historyModalRef = useRef(null);
  const dropModalRef = useRef(null);
  const forwardModalRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const student = useSelector(state => state.auth.student);
  const isSuggestion = route?.params?.isSuggestion ?? false;
  const isEmployee = user?.role === 'employee';
  const title = isSuggestion
    ? isEmployee
      ? 'Assigned Suggestions'
      : 'All Suggestions'
    : isEmployee
      ? 'Assigned Complaints'
      : 'All Complaints';
  const emptyText = isSuggestion
    ? isEmployee
      ? 'No assigned suggestions found'
      : 'No suggestions found'
    : isEmployee
      ? 'No assigned complaints found'
      : 'No complaints found';
  const isParent = user?.role === 'parent' || user?.role === 'other';

  const openComplaintSummary = useCallback(id => {
    historyModalRef.current?.openModal(id);
  }, []);

  const openForwardComplain = useCallback(id => {
    forwardModalRef.current?.openModal(id, 'assign');
  }, []);

  const openAdminComplaintSummary = useCallback((id, canAssign) => {
    adminHistoryModalRef.current?.openModal(id, canAssign);
  }, []);

  const openDropComplain = useCallback(id => {
    dropModalRef.current?.openModal(id);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let res;
      if (isParent) {
        // For parent/other role, use complainHistory API
        const body = {
          UserId: user?.id,
          Role: user?.role,
          Status: '',
          StudentId: student?.studentId,
          IsSuggestion: isSuggestion,
        };
        res = await complainHistory(body, user?.role);
      } else if (isEmployee) {
        // For employee role, use complainHistory API (assigned complaints/suggestions)
        const body = {
          UserId: user?.id,
          Role: user?.role,
          Status: '',
          IsSuggestion: isSuggestion,
        };
        res = await getAllComplaintsList(body, user?.role);
      } else {
        // For oic/employee role, use getAllComplaintsList API
        const body = {
          UserId: user?.id,
          Role: user?.role,
          CampusId:
            route?.params?.campusId ??
            user?.campusid ??
            user?.campusId ??
            null,
          IsSuggestion: isSuggestion,
        };
        res = await getAllComplaintsList(body);
      }
      console.log('All complaints response:', res);
      if (res?.result === 'success') {
        setHistory(res?.data || []);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    if (isParent) {
      return (
        <ClosedCard
          id={item?.complaintId}
          date={item?.createdAt}
          data={item}
          assignedTo={item.assignedTo}
          department={item.department}
          text={item.complaintSubject}
          rating={item?.parentRating}
          thumb={item?.isThumbUp}
          complainStage={item?.complaintStageId}
          onPressSummary={() => openComplaintSummary(item?.complaintId)}
        />
      );
    }

    switch (user?.role) {
      case 'oic':
      case 'employee':
        return (
          <AdminHistoryCard
            id={item?.complaintId}
            date={item?.createdAt}
            data={item}
            assignedTo={item?.assignedTo}
            department={item?.department}
            text={item?.complaintSubject}
            rating={item?.parentRating}
            thumb={item?.isThumbUp}
            complainStage={item?.complaintStageId}
            onPressCard={() =>
              openAdminComplaintSummary(item?.complaintId, false)
            }
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} />

      <FlatList
        data={history}
        keyExtractor={item => item?.complaintId.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        )}
      />

      {isParent && (
        <HistoryModal
          ref={historyModalRef}
          complaintId={selectedComplaintId}
          onDismiss={fetchHistory}
        />
      )}
      {!isParent && (
        <>
          <AdminHistoryModal
            ref={adminHistoryModalRef}
            onOpenForwardModal={id => forwardModalRef.current?.openModal(id)}
            complaintId={selectedComplaintId}
            onDismiss={fetchHistory}
          />
          <ForwardModal ref={forwardModalRef} onDismiss={fetchHistory} />
          <DropModal ref={dropModalRef} onDismiss={fetchHistory} />
        </>
      )}
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default AllComplaints;

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