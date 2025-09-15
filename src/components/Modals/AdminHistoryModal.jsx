import React, {
  forwardRef,
  useRef,
  useMemo,
  useImperativeHandle,
  useCallback,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../utils/colors';
import { complainHistorySummary } from '../../Network/apis';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import { closeComplaint } from '../../Network/apis';
import Loader from '../Loader/Loader';

const AdminHistoryModal = forwardRef(
  ({ onOpenForwardModal, onDismiss }, ref) => {
    const modalRef = useRef(null);
    const snapPoints = useMemo(() => ['90%', '100%'], []);
    const user = useSelector(state => state.auth.user);

    const [loading, setLoading] = useState(false);
    const [loader, setLoader] = useState(false);
    const [summary, setSummary] = useState(null);
    const [review, setReview] = useState('');
    const [complaintId, setComplaintId] = useState(null);
    const [status, setStatus] = useState(null);

    const statusOptions = [
      { label: 'Closed', value: 'Closed' },
      { label: 'Implemented', value: 'Implemented' },
      { label: 'Acknowledged', value: 'Acknowledged' },
    ];

    useImperativeHandle(ref, () => ({
      // Add `id` as a parameter to the `openModal` function.
      openModal: async id => {
        modalRef.current?.present();

        if (id) {
          setComplaintId(id);
          setLoading(true);
          setSummary(null); // reset before fetch

          const body = {
            UserId: user?.id,
            ComplaintId: id, // Use the ID passed as a parameter.
          };

          try {
            const { data } = await complainHistorySummary(body, user?.role);
            setSummary(data || null);
          } catch (err) {
            console.log('Error fetching summary:', err);
            setSummary(null);
          } finally {
            setLoading(false);
          }
        }
      },
      closeModal: () => modalRef.current?.dismiss(),
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
    const handleSubmitAndClose = async () => {
      if (!review.trim() || !status) {
        Alert.alert(
          'Error',
          'Please enter your review and select status before closing.',
        );
        return;
      }

      try {
        setLoader(true);
        const body = {
          userId: user?.id,
          complaintId: complaintId,
          remarks: review,
          status: status,
        };
        console.log(body, 'vcvcvcv');

        const data = await closeComplaint(body);

        if (data?.result === 'success') {
          Alert.alert('Success', 'Complaint closed successfully');
          setReview('');
          ref.current?.closeModal();
        }
      } catch (err) {
        console.log('Close complaint error:', err);
        Alert.alert('Error', 'Failed to close complaint');
      } finally {
        setLoader(false);
      }
    };
    const handleForward = () => {
      ref.current?.closeModal();
      if (onOpenForwardModal) {
        onOpenForwardModal(complaintId); // 👈 pass complaintId to forward modal
      }
    };

    const renderFiles = () => {
      const fileUrls = [
        summary?.urlOne,
        summary?.urlTwo,
        summary?.urlThree,
        summary?.urlFour,
        summary?.urlFive,
      ].filter(Boolean); // remove nulls

      if (fileUrls.length === 0) return null;

      return (
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}
        >
          {fileUrls.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={{
                width: 60,
                height: 60,
                marginRight: 10,
                borderRadius: 4,
              }}
            />
          ))}
        </View>
      );
    };

    const renderTrackRecords = () => {
      if (!summary?.trackRecord?.length) return null;

      return summary.trackRecord.map((item, index) => (
        <View key={index} style={styles.trackItem}>
          <Text style={styles.boldText}>
            {item?.fromName} → {item?.toName}
          </Text>
          <Text style={styles.timelineDate}>{item?.changedAt}</Text>
          <Text style={styles.paragraph}>{item?.remarks}</Text>
        </View>
      ));
    };

    const renderClosedRemarks = () => {
      if (!summary?.closedRemarks?.length) {
        // Show textarea + buttons
        return (
          <View style={{ marginTop: 20 }}>
            <Dropdown
              style={styles.dropdown}
              placeholder="Select Status"
              data={statusOptions}
              labelField="label"
              valueField="value"
              value={status}
              onChange={item => setStatus(item.value)}
            />
            <TextInput
              style={styles.textArea}
              placeholder="Write Your Reviews"
              placeholderTextColor="#aaa"
              value={review}
              onChangeText={setReview}
              multiline
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSubmitAndClose}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>Submit And Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleForward}
                style={styles.forwardButton}
              >
                <Text style={styles.forwardText}>Forward</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }

      // Else show existing closed remarks
      const { closedBy, closedDate, remarks } = summary.closedRemarks[0];
      return (
        <>
          <Text style={styles.sectionTitle}>Closing Remarks</Text>
          <Text style={styles.row}>
            <Text style={styles.boldText}>Closed By: </Text> {closedBy}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.boldText}>Closed Date: </Text> {closedDate}
          </Text>
          <Text style={styles.boldText}>Remarks:</Text>
          <Text style={styles.paragraph}>{remarks}</Text>
        </>
      );
    };
    const resetState = () => {
      setSummary(null);
      setReview('');
      setComplaintId(null);
      setStatus(null);
      setLoading(false);
      setLoader(false);
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
        onDismiss={() => {
          resetState();
          onDismiss?.();
        }}
      >
        <BottomSheetScrollView
          style={styles.mainContainer}
          contentContainerStyle={styles.contentContainerStyle}
        >
          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          ) : summary ? (
            <View style={styles.sheetContent}>
              <Text style={styles.sheetHeader}>Complaint Summary</Text>

              <Text style={styles.sectionTitle}>Complaint</Text>
              <Text style={styles.boldText}>{summary?.complaintSubject}</Text>
              <Text style={styles.paragraph}>{summary?.description}</Text>

              {renderFiles()}

              {summary?.trackRecord?.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Track Record</Text>
                  {renderTrackRecords()}
                </>
              )}

              {renderClosedRemarks()}
            </View>
          ) : (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                color: COLORS.primary,
              }}
            >
              No data found
            </Text>
          )}
        </BottomSheetScrollView>

        {loading && <Loader />}
      </BottomSheetModal>
    );
  },
);

export default AdminHistoryModal;

const styles = StyleSheet.create({
  bgStyle: {
    backgroundColor: 'rgba(253, 252, 252, 1)',
  },
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: 150,
    paddingHorizontal: 20,
  },
  sheetContent: { flex: 1, padding: 5 },
  sheetHeader: {
    fontSize: 24,
    fontFamily: 'Asap-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Asap-SemiBold',
    marginTop: 20,
    marginBottom: 8,
    color: COLORS.primary,
  },
  boldText: {
    fontSize: 14,
    fontFamily: 'Asap-SemiBold',
    marginBottom: 6,
    color: COLORS.primary,
  },
  paragraph: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: 'Asap-Light',
    marginBottom: 10,
    lineHeight: 20,
  },
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
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    fontFamily: 'Asap-Light',
    minHeight: 120,
    textAlignVertical: 'top',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#FFC107',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  forwardButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#0A2342',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  submitText: {
    color: '#fff',
    fontFamily: 'Asap-SemiBold',
    fontSize: 16,
  },
  forwardText: {
    color: '#fff',
    fontFamily: 'Asap-SemiBold',
    fontSize: 14,
  },
});

// import React, {
//   forwardRef,
//   useRef,
//   useMemo,
//   useImperativeHandle,
//   useCallback,
//   useState,
// } from 'react';
// import { StyleSheet, Text, View, Image } from 'react-native';
// import {
//   BottomSheetBackdrop,
//   BottomSheetModal,
//   BottomSheetScrollView,
// } from '@gorhom/bottom-sheet';
// import { COLORS } from '../../utils/colors';
// import { complainHistorySummary } from '../../Network/apis';
// import { useSelector } from 'react-redux';

// const HistoryModal = forwardRef(({ complaintId }, ref) => {
//   console.log(complaintId, 'mmmmm');
//   const modalRef = useRef(null);
//   const snapPoints = useMemo(() => ['90%', '100%'], []);
//   const user = useSelector(state => state.auth.user);
//   const [loading, setLoading] = useState(false);
//   const [summary, setSummary] = useState(null);
//   useImperativeHandle(ref, () => ({
//     // openModal: () => modalRef.current?.present(),
//     openModal: async () => {
//       modalRef.current?.present();
//       if (complaintId) {
//         setLoading(true);
//         const body = {
//           UserId: user?.id,
//           ComplaintId: complaintId,
//         };
//         const data = await complainHistorySummary(body);

//         setSummary(data?.data);
//         setLoading(false);
//       }
//     },
//     closeModal: () => modalRef.current?.dismiss(),
//   }));

//   const renderBackDrop = useCallback(
//     props => (
//       <BottomSheetBackdrop
//         {...props}
//         appearsOnIndex={0}
//         disappearsOnIndex={-1}
//         opacity={0.2}
//       />
//     ),
//     [],
//   );

//   return (
//     <BottomSheetModal
//       ref={modalRef}
//       snapPoints={snapPoints}
//       backdropComponent={renderBackDrop}
//       enablePanDownToClose
//       enableOverDrag={false}
//       stackBehavior="push"
//       backgroundStyle={styles.bgStyle}
//     >
//       <BottomSheetScrollView
//         style={styles.mainContainer}
//         contentContainerStyle={styles.contentContainerStyle}
//       >
//         <View style={styles.sheetContent}>
//           <Text style={styles.sheetHeader}>Complaint Summary</Text>

//           <Text style={styles.sectionTitle}>Complaint</Text>
//           <Text style={styles.boldText}>
//             It is a long established fact that a reader will be
//           </Text>
//           <Text style={styles.paragraph}>
//             It is a long established fact that a reader will be distracted by
//             the readable content of a page when looking at its layout.
//           </Text>

//           <View style={{ flexDirection: 'row', marginVertical: 10 }}>
//             <Image source={require('../../assets/Images/pdfFile.png')} />
//             <Image source={require('../../assets/Images/pdfFile.png')} />
//           </View>

//           <Text style={styles.sectionTitle}>Track Record</Text>
//           <View style={{ flexDirection: 'row', marginBottom: 10 }}>
//             <Image
//               source={require('../../assets/Images/sort.png')}
//               style={{ marginRight: 10 }}
//             />
//             <View>
//               <Text style={styles.timelineDate}>25 Dec 2025 09:10 AM</Text>
//               <Text style={styles.boldText}>
//                 It is a long established fact that a reader will be
//               </Text>
//             </View>
//           </View>

//           <View style={styles.trackItem}>
//             <Text style={styles.boldText}>OIC/Admin → Fazil Khan</Text>
//             <Text style={styles.timelineDate}>25 Dec 2025 09:10 AM</Text>
//             <Text style={styles.paragraph}>
//               It is a long established fact that a reader will be distracted by
//               the readable content of a page when looking.
//             </Text>
//           </View>

//           <Text style={styles.sectionTitle}>Closing Remarks</Text>
//           <Text style={styles.row}>
//             <Text style={styles.boldText}>Closed By: </Text> Fazil Khan
//           </Text>
//           <Text style={styles.row}>
//             <Text style={styles.boldText}>Closed Date: </Text> 25 Dec 2025 09:10
//             AM
//           </Text>
//           <Text style={styles.boldText}>Remarks</Text>
//           <Text style={styles.paragraph}>
//             It is a long established fact that a reader will be distracted by
//             the readable content of a page when looking.
//           </Text>
//         </View>
//       </BottomSheetScrollView>
//     </BottomSheetModal>
//   );
// });

// export default HistoryModal;

// const styles = StyleSheet.create({
//   bgStyle: {
//     backgroundColor: 'rgba(253, 252, 252, 1)',
//   },
//   mainContainer: {
//     flex: 1,
//   },
//   contentContainerStyle: {
//     paddingBottom: 150,
//     paddingHorizontal: 20,
//   },
//   sheetContent: { flex: 1, padding: 5 },
//   sheetHeader: {
//     fontSize: 24,
//     fontFamily: 'Asap-SemiBold',
//     marginBottom: 12,
//     textAlign: 'center',
//     color: COLORS.primary,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontFamily: 'Asap-SemiBold',
//     marginTop: 20,
//     marginBottom: 8,
//     color: COLORS.primary,
//   },
//   boldText: {
//     fontSize: 14,
//     fontFamily: 'Asap-SemiBold',
//     marginBottom: 6,
//     color: COLORS.primary,
//   },
//   paragraph: {
//     fontSize: 14,
//     color: COLORS.black,
//     fontFamily: 'Asap-Light',
//     marginBottom: 10,
//     lineHeight: 20,
//   },
//   trackItem: {
//     marginVertical: 10,
//     padding: 10,
//     borderLeftWidth: 3,
//     borderColor: '#0A2342',
//     backgroundColor: '#f8f8f8',
//     borderRadius: 6,
//   },
//   timelineDate: { fontSize: 12, color: '#777', marginBottom: 4 },
//   row: { fontSize: 13, marginBottom: 4 },
// });
