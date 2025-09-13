import React, {
  forwardRef,
  useRef,
  useMemo,
  useImperativeHandle,
  useCallback,
  useState,
} from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../utils/colors';
import { complainHistorySummary } from '../../Network/apis';
import { useSelector } from 'react-redux';

const HistoryModal = forwardRef((props, ref) => {
  const modalRef = useRef(null);
  const snapPoints = useMemo(() => ['90%', '100%'], []);
  const user = useSelector(state => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  useImperativeHandle(ref, () => ({
    // Add `id` as a parameter to the `openModal` function.
    openModal: async id => {
      modalRef.current?.present();

      if (id) {
        setLoading(true);
        setSummary(null); // reset before fetch

        const body = {
          UserId: user?.id,
          ComplaintId: id, // Use the ID passed as a parameter.
        };

        try {
          const { data } = await complainHistorySummary(body);
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
            style={{ width: 60, height: 60, marginRight: 10, borderRadius: 4 }}
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
          {item?.assignedFrom} → {item?.assignedTo}
        </Text>
        <Text style={styles.timelineDate}>{item?.dateTime}</Text>
        <Text style={styles.paragraph}>{item?.remarks}</Text>
      </View>
    ));
  };

  const renderClosedRemarks = () => {
    if (!summary?.closedRemarks?.length) return null;

    const { closedBy, closedDate, remarks } = summary.closedRemarks[0]; // assuming one remark
    return (
      <>
        <Text style={styles.sectionTitle}>Closing Remarks</Text>
        <Text style={styles.row}>
          <Text style={styles.boldText}>Closed By: </Text> {closedBy}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.boldText}>Closed Date: </Text> {closedDate}
        </Text>
        <Text style={styles.boldText}>Remarks</Text>
        <Text style={styles.paragraph}>{remarks}</Text>
      </>
    );
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
    </BottomSheetModal>
  );
});

export default HistoryModal;

const styles = StyleSheet.create({
  bgStyle: {
    backgroundColor: 'rgba(253, 252, 252, 1)',
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
