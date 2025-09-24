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
  Alert,
  BackHandler,
  Modal,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../utils/colors';
import { complainHistorySummary } from '../../Network/apis';
import { useSelector } from 'react-redux';
import { parentReview } from '../../Network/apis';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { viewDocument } from '@react-native-documents/viewer';
import RNFS from 'react-native-fs';
import DocIcon from '../../assets/Images/doc.png';
import VideoIcon from '../../assets/Images/video.png';
import AudioIcon from '../../assets/Images/audio.png';
import ImageIcon from '../../assets/Images/image.png';
import Loader from '../Loader/Loader';

const HistoryModal = forwardRef((props, ref) => {
  const { onDismiss } = props;
  const modalRef = useRef(null);
  const snapPoints = useMemo(() => ['90%', '100%'], []);
  const user = useSelector(state => state.auth.user);
  const [complaintId, setComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0); // 1–5 stars
  const [submitting, setSubmitting] = useState(false);
  // track whether modal is open
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);

  // handle back press
  const handleBackPress = useCallback(() => {
    if (isOpen) {
      modalRef.current?.dismiss();
      return true; // prevent default navigation back
    }
    return false;
  }, [isOpen]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => subscription.remove();
    }, [handleBackPress]),
  );

  useImperativeHandle(ref, () => ({
    // Add `id` as a parameter to the `openModal` function.
    openModal: async id => {
      modalRef.current?.present();
      setIsOpen(true);
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
  const handleSubmitReview = async () => {
    if (!rating || !reviewText.trim()) {
      Alert.alert(
        'Validation',
        'Please add a rating and review before submitting.',
      );
      return;
    }

    const body = {
      UserId: user?.id,
      ComplaintId: complaintId,
      Rating: rating,
      Comments: reviewText.trim(),
    };

    try {
      setSubmitting(true);
      await parentReview(body); // <-- your API call
      Alert.alert('Success', 'Review submitted successfully!');
      setReviewText('');
      setRating(0);
      ref?.current?.closeModal(); // close bottomsheet
    } catch (error) {
      console.log('Error submitting review:', error);
      Alert.alert(
        'Error',
        'Something went wrong while submitting your review.',
      );
    } finally {
      setSubmitting(false);
    }
  };
  const renderFiles = () => {
    const fileUrls = [
      summary?.urlOne,
      summary?.urlTwo,
      summary?.urlThree,
      summary?.urlFour,
      summary?.urlFive,
    ].filter(Boolean);

    if (fileUrls.length === 0) return null;

    const getFileType = url => {
      const ext = url.split('.').pop()?.toLowerCase();
      if (!ext) return 'other';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
      if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
      if (['mp3', 'wav', 'aac', 'ogg'].includes(ext)) return 'audio';
      if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext))
        return 'document';
      return 'other';
    };

    return (
      <View
        style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}
      >
        {fileUrls.map((url, index) => {
          const type = getFileType(url);

          if (type === 'image') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.fileBox}
                onPress={() => {
                  setPreviewUrl(url);
                  setIsImage(true);
                }}
              >
                <Image source={ImageIcon} style={styles.iconImage} />
                {/* <Image
                  source={{ uri: url }}
                  style={{ width: 70, height: 70, margin: 6, borderRadius: 6 }}
                /> */}
              </TouchableOpacity>
            );
          }

          if (type === 'document') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.fileBox}
                onPress={() => openRemoteDocument(url)}
              >
                <Image source={DocIcon} style={styles.iconImage} />
              </TouchableOpacity>
            );
          }
          if (type === 'video') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.fileBox}
                onPress={() => {
                  setPreviewUrl(url);
                  setIsImage(false);
                }}
              >
                <Image source={VideoIcon} style={styles.iconImage} />
              </TouchableOpacity>
            );
          }

          if (type === 'audio') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.fileBox}
                onPress={() => {
                  setPreviewUrl(url);
                  setIsImage(false);
                }}
              >
                <Image source={AudioIcon} style={styles.iconImage} />
              </TouchableOpacity>
            );
          }

          // fallback → video/audio/other in WebView
          return (
            <TouchableOpacity
              key={index}
              style={styles.fileBox}
              onPress={() => {
                setPreviewUrl(url);
                setIsImage(false);
              }}
            >
              <Text style={{ fontSize: 12, color: '#444' }}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // const renderFiles = () => {
  //   const fileUrls = [
  //     summary?.urlOne,
  //     summary?.urlTwo,
  //     summary?.urlThree,
  //     summary?.urlFour,
  //     summary?.urlFive,
  //   ].filter(Boolean); // remove nulls

  //   if (fileUrls.length === 0) return null;

  //   return (
  //     <View
  //       style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}
  //     >
  //       {fileUrls.map((url, index) => (
  //         <Image
  //           key={index}
  //           source={{ uri: url }}
  //           style={{ width: 60, height: 60, marginRight: 10, borderRadius: 4 }}
  //         />
  //       ))}
  //     </View>
  //   );
  // };

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

        {/* ⭐ Review UI Section */}
        {(!summary?.rating ||
          (summary?.rating.length === 0 && user?.role === 'parent')) && (
          <View style={styles.reviewBox}>
            <TextInput
              placeholder="Write Your Reviews"
              placeholderTextColor="#bbb"
              style={styles.reviewInput}
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />

            {/* Rating Stars */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text
                    style={[
                      styles.star,
                      { color: rating >= star ? '#FFD700' : '#ccc' },
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => handleSubmitReview()}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit And Close</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };
  const closePreview = () => {
    setPreviewUrl(null);
    setIsImage(false);
  };
  const resetState = () => {
    setComplaintId(null);
    setSummary(null);
    setReviewText('');
    setRating(0);
    setLoading(false);
    setSubmitting(false);
    setIsOpen(false);
  };
  const openRemoteDocument = async url => {
    setDocLoading(true); // start loader
    try {
      const fileExt = url.split('.').pop();
      const fileName = `temp_document_${new Date().getTime()}.${fileExt}`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Check if the file already exists to avoid re-downloading
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        console.log('File already exists, viewing it directly.');
        await viewDocument({ uri: filePath });
        return;
      }

      // Download the file
      const options = {
        fromUrl: url,
        toFile: filePath,
      };

      const response = RNFS.downloadFile(options);

      // Await the download completion
      await response.promise;

      // Open the local file with the viewer
      // On Android, file paths need to be prefixed with 'file://'
      const uriToView = `file://${filePath}`;
      await viewDocument({ uri: uriToView });
    } catch (err) {
      console.log('Error opening remote document:', err);
    } finally {
      setDocLoading(false); // stop loader
    }
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
        resetState(); // clear modal states
        onDismiss?.(); // tell parent to refetch
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
      {docLoading && <Loader />}
      <Modal visible={!!previewUrl} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
          {/* Close Button */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 10,
              backgroundColor: '#fff',
              padding: 8,
              borderRadius: 20,
            }}
            onPress={closePreview}
          >
            <Text style={{ fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
          {isImage ? (
            <Image
              source={{ uri: previewUrl || '' }}
              style={{ flex: 1, resizeMode: 'contain' }}
            />
          ) : (
            <>
              <WebView
                source={{ uri: previewUrl || '' }}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                onLoadStart={() => setWebViewLoading(true)}
                onLoadEnd={() => setWebViewLoading(false)}
              />
              {webViewLoading && (
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginLeft: -15,
                    marginTop: -15,
                  }}
                />
              )}
            </>
          )}
        </View>
      </Modal>
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
    paddingBottom: 50,
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
  reviewBox: {
    marginTop: 20,

    borderRadius: 8,
    backgroundColor: '#fff',
  },
  reviewInput: {
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
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  star: {
    fontSize: 28,
    color: '#ccc', // later you can toggle yellow on press
    marginHorizontal: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontFamily: 'Asap-SemiBold',
    fontSize: 16,
  },
  fileBox: {
    height: 70,
    margin: 6,
    borderRadius: 6,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
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
