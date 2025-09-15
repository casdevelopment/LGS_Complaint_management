import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
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

const OpenedComplain = () => {
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
  const openAdminComplaintSummary = useCallback(id => {
    adminHistortModalRef.current?.openModal(id);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);
  const openForwardComplain = useCallback(id => {
    forwardModalRef.current?.openModal(id);
  }, []);
  const fetchHistory = async () => {
    try {
      const body = {
        UserId: user?.id,
        Role: user?.role,
        Status: 'open',
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
            rating={4}
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
            rating={4}
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
            rating={4}
            onPressSummary={() => openAdminComplaintSummary(item?.complaintId)}
            onPressAssignAgent={() => openForwardComplain(item?.complaintId)}
          />
        );
      default:
        return <Text>Unknown role</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Complaints Open" />

      <FlatList
        data={history}
        keyExtractor={item => item?.complaintId.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderItem}
      />

      <HistoryModal ref={filterModalRef} complaintId={selectedComplaintId} />
      <AdminHistoryModal
        ref={adminHistortModalRef}
        onOpenForwardModal={id => forwardModalRef.current?.openModal(id)}
        complaintId={selectedComplaintId}
      />
      <ForwardModal ref={forwardModalRef} />
    </SafeAreaView>
  );
};

export default OpenedComplain;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
