import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../components/Header';
import ClosedCard from '../../components/Closed/CloasedCard';
import HistoryModal from '../../components/Modals/HistoryModal';
import ForwardModal from '../../components/Modals/ForwardModal';
import { complainHistory } from '../../Network/apis';
import { useSelector } from 'react-redux';
import AdminHistoryCard from '../../components/History/AdminHistoryCard';
import AdminHistoryModal from '../../components/Modals/AdminHistoryModal';
import { COLORS } from '../../utils/colors';
import DropModal from '../../components/Modals/DropModal';
import Loader from '../../components/Loader/Loader';


const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const filterModalRef = useRef(null);
  const adminHistortModalRef = useRef(null);
  const [suggestion, setSuggestion] = useState(false);
  const forwardModalRef = useRef(null);
  const dropModalRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const student = useSelector(state => state.auth.student);
   const isFocused = useIsFocused();
  
    useEffect(() => {
      if (isFocused) {
        fetchHistory(suggestion);
      }
    }, [isFocused]);
  const openComplaintSummary = useCallback(id => {
    filterModalRef.current?.openModal(id);
  }, []);
  const openAdminComplaintSummary = useCallback(id => {
    adminHistortModalRef.current?.openModal(id);
  }, []);

  const openForwardComplain = useCallback(id => {
    forwardModalRef.current?.openModal(id, 'assign');
  }, []);
  const openDropComplain = useCallback(id => {
    dropModalRef.current?.openModal(id);
  }, []);
  const fetchHistory = async (value) => {
    try {
      setLoading(true);
      const body = {
        UserId: user?.id,
        Role: user?.role,
        Status: user?.role === 'parent' ? '' : activeFilter, // 👈 parent always empty
        StudentId: student?.studentId,
        IsSuggestion: value !== undefined ? value : suggestion
      };
      console.log(body, 'mmmmm');
      const res = await complainHistory(body, user?.role);
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
    switch (user?.role) {
      case 'parent':
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
      case 'other':
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
      case 'employee':
        return (
          <AdminHistoryCard
            id={item?.complaintId}
            date={item?.createdAt}
            data={item}
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
            data={item}
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
      case 'poc':
        return (
          <AdminHistoryCard
            id={item?.complaintId}
            date={item?.createdAt}
            data={item}
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
    fetchHistory(suggestion);
  }, [activeFilter, user?.role, suggestion]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="History" 
       suggestion={suggestion} setSuggestions={() => {
        fetchHistory(!suggestion);
        setSuggestion(!suggestion);
      }}  />
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
      <DropModal ref={dropModalRef} onDismiss={fetchHistory} />
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'Asap-Medium',
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  activeFilterText: { color: '#fff', fontFamily: 'Asap-Medium' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
