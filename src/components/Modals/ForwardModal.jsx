import React, {
  forwardRef,
  useRef,
  useMemo,
  useImperativeHandle,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../utils/colors';
import { useSelector } from 'react-redux';
import {
  getDepartments,
  getDepatmentEmployees,
  forwardComplaint,
} from '../../Network/apis';
import { useFocusEffect } from '@react-navigation/native';

import CustomDropdown from '../Form/CustomDropdown'; // 👈 use your dropdown component

const ForwardModal = forwardRef((props, ref) => {
  const { onDismiss } = props;
  const [mode, setMode] = useState('forward');
  const modalRef = useRef(null);
  const snapPoints = useMemo(() => ['70%', '90%'], []);
  const user = useSelector(state => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedDept, setSelectedDept] = useState('');
  console.log(selectedDept, 'tttttttttt');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [review, setReview] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // 👈 track modal state

  // --- BackHandler support ---
  const handleBackPress = useCallback(() => {
    if (isOpen) {
      modalRef.current?.dismiss();
      return true; // prevent navigation
    }
    return false;
  }, [isOpen]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => sub.remove();
    }, [handleBackPress]),
  );

  // open/close handlers
  useImperativeHandle(ref, () => ({
    openModal: (complaintId, newMode = 'forward') => {
      setSelectedComplaintId(complaintId); // store in state
      setMode(newMode);
      modalRef.current?.present();
      setIsOpen(true);
    },
    closeModal: () => {
      modalRef.current?.dismiss();
      setIsOpen(false);
    },
  }));

  const renderBackDrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.2}
      />
    ),
    [],
  );

  // fetch departments when modal opens
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();

      setDepartments(data?.data || []);
    } catch (err) {
      console.log('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  // fetch employees when department changes
  const fetchEmployees = async deptId => {
    if (!deptId) return;
    try {
      setLoading(true);
      const data = await getDepatmentEmployees({
        DepartmentId: deptId,
        UserId: user?.id,
      });
      setEmployees(data?.data || []);
    } catch (err) {
      console.log('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalRef.current) {
      fetchDepartments();
    }
  }, []);

  const handleForward = async () => {
    if (
      !selectedDept ||
      !selectedEmp ||
      (mode === 'forward' && !review.trim())
    ) {
      Alert.alert('Error', 'Please fill all fields before submitting.');
      return;
    }
    const body = {
      departmentId: selectedDept,
      userId: user?.id,
      toUserId: selectedEmp,
      complaintId: selectedComplaintId,
      remarks: review,
    };

    console.log(body);

    try {
      setLoading(true);
      await forwardComplaint(body);
      Alert.alert('Success', 'Complaint forwarded successfully.');
      modalRef.current?.dismiss();
    } catch (err) {
      console.log('Error forwarding complaint:', err);
      Alert.alert('Error', 'Failed to forward complaint.');
    } finally {
      setLoading(false);
    }
  };
  const resetState = () => {
    setSelectedDept('');
    setSelectedEmp(null);
    setReview('');
    setSelectedComplaintId(null);
    setEmployees([]);
    setDepartments([]);
    setIsOpen(false);
  };

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackDrop}
      enablePanDownToClose
      enableOverDrag={false}
      stackBehavior="push"
      backgroundStyle={styles.bgStyle}
      onChange={index => {
        if (index === 0) fetchDepartments(); // refetch when opened
      }}
      onDismiss={() => {
        resetState();
        onDismiss?.(); // 👈 notify parent
      }}
    >
      <BottomSheetScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Text style={styles.sheetHeader}>
          {mode === 'assign' ? 'Assign Agent' : 'Forward Complaint'}
        </Text>

        {/* Department Dropdown */}
        <CustomDropdown
          placeholder={'Select Department'}
          data={departments.map(d => ({
            label: d.department,
            value: d.departmentId,
          }))}
          value={selectedDept}
          onChange={val => {
            setSelectedDept(val);
            setSelectedEmp(null);
            fetchEmployees(val);
          }}
        />

        {/* Employee Dropdown */}
        <CustomDropdown
          placeholder="Select Employee"
          data={employees.map(e => ({ label: e.userName, value: e.userId }))}
          value={selectedEmp}
          onChange={val => setSelectedEmp(val)}
          disabled={!selectedDept}
        />

        {/* Review */}

        <TextInput
          style={styles.input}
          placeholder="Write your review..."
          value={review}
          onChangeText={setReview}
          multiline
        />

        {/* Forward Button */}
        <TouchableOpacity
          style={styles.forwardBtn}
          onPress={handleForward}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Forward</Text>
          )}
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default ForwardModal;

const styles = StyleSheet.create({
  bgStyle: {
    backgroundColor: 'rgba(253, 252, 252, 1)',
  },
  mainContainer: { flex: 1 },
  contentContainerStyle: { paddingBottom: 50, paddingHorizontal: 20 },
  sheetHeader: {
    fontSize: 24,
    fontFamily: 'Asap-SemiBold',
    marginTop: 10,
    marginBottom: 26,
    textAlign: 'center',
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginVertical: 12,
    fontSize: 14,
    color: COLORS.black,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  forwardBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#fff', fontSize: 16, fontFamily: 'Asap-SemiBold' },
});
