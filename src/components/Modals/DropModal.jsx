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
import { dropComplaint } from '../../Network/apis';
import { useFocusEffect } from '@react-navigation/native';

const DropModal = forwardRef((props, ref) => {
  const { onDismiss } = props;
  const [mode, setMode] = useState('forward');
  const modalRef = useRef(null);
  const snapPoints = useMemo(() => ['70%', '90%'], []);
  const user = useSelector(state => state.auth.user);

  const [loading, setLoading] = useState(false);

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

  const handleDropComplaint = async () => {
    if (!review.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your remarks before submitting.',
      );
      return;
    }
    const body = {
      userId: user?.id,
      complaintId: selectedComplaintId,
      remarks: review,
    };

    try {
      setLoading(true);
      const res = await dropComplaint(body);
      if (res?.result === 'success') {
        Alert.alert('Success', 'Complaint dropped successfully.', [
          {
            text: 'OK',
            onPress: () => {
              setReview('');
              modalRef.current?.dismiss();
            },
          },
        ]);
      }
    } catch (err) {
      console.log('Error drop complaint:', err);
      Alert.alert('Error', 'Failed to drop complaint.');
    } finally {
      setLoading(false);
    }
  };
  const resetState = () => {
    setReview('');
    setSelectedComplaintId(null);

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
      onChange={index => {}}
      onDismiss={() => {
        resetState();
        onDismiss?.(); // 👈 notify parent
      }}
    >
      <BottomSheetScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Text style={styles.sheetHeader}>Drop Complaint</Text>

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
          onPress={handleDropComplaint}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Submit</Text>
          )}
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default DropModal;

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
