import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../../utils/colors';
import { WebView } from 'react-native-webview';
import { viewDocument } from '@react-native-documents/viewer';
import RNFS from 'react-native-fs';
import DocIcon from '../../assets/Images/doc.png';
import VideoIcon from '../../assets/Images/video.png';
import AudioIcon from '../../assets/Images/audio.png';
import ImageIcon from '../../assets/Images/image.png';
import Loader from '../Loader/Loader';

const AdminHistoryCard = ({
  id,
  date,
  data,
  assignedTo,
  department,
  text,
  rating,
  thumb,
  complainStage,
  onPressSummary,
  onPressAssignAgent,
  onPressDropComplaint,
  onPressCard, // 👈 new prop for card press
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const renderStars = rating =>
    Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={styles.star}>
        {i < rating ? '★' : '☆'}
      </Text>
    ));

  const renderStageDots = stage => (
    <View style={styles.stageDotsContainer}>
      {[1, 2, 3].map(i => (
        <View
          key={i}
          style={[
            styles.stageDot,
            { backgroundColor: i <= stage ? '#FFC107' : COLORS.primary },
          ]}
        />
      ))}
    </View>
  );
  const renderFiles = () => {
    const fileUrls = [data?.urlOne].filter(Boolean);
    console.log(fileUrls, 'sssssd');

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
  const closePreview = () => {
    setPreviewUrl(null);
    setIsImage(false);
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
      const result = await response.promise;
      // ✅ Check for download success
      if (result.statusCode !== 200) {
        throw new Error(`Failed to download file (HTTP ${result.statusCode})`);
      }

      // Open the local file with the viewer
      // On Android, file paths need to be prefixed with 'file://'
      const uriToView = `file://${filePath}`;
      await viewDocument({ uri: uriToView });
    } catch (err) {
      console.log('Error opening remote document:', err);
      Alert.alert(
        'File Error',
        'Unable to open this file. It may have been removed or the link is invalid.',
        [{ text: 'OK' }],
      );
    } finally {
      setDocLoading(false); // stop loader
    }
  };

  const CardContent = () => (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.idText}>ID #{id}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <TouchableOpacity style={styles.dotsButton}>
          {renderStageDots(complainStage)}
        </TouchableOpacity>
      </View>

      {/* Main text + thumbs */}
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.mainText}>{text}</Text>
          {/* Category → Subcategory */}
          {data?.category && data?.subCategory ? (
            <Text style={styles.mainText}>
              <Text
                style={{ fontFamily: 'Asap-SemiBold', color: COLORS.black }}
              >
                {data?.category}
              </Text>
              <Text style={{ color: COLORS.primary }}> → </Text>
              <Text style={{ fontFamily: 'Asap-Regular', color: COLORS.black }}>
                {data?.subCategory}
              </Text>
            </Text>
          ) : (
            <>
              {data?.category && (
                <Text style={styles.mainText}>{data?.category}</Text>
              )}
              {data?.subCategory && (
                <Text style={styles.mainText}>{data?.subCategory}</Text>
              )}
            </>
          )}

          {/* Complaint type & description */}
          {data?.complaintType && (
            <Text style={styles.mainText}>{data?.complaintType}</Text>
          )}
          {data?.complaintDescription && (
            <Text style={styles.mainText}>
              {' '}
              {data?.complaintDescription.split(' ').slice(0, 4).join(' ')}
              {data?.complaintDescription.split(' ').length > 4 ? '...' : ''}
            </Text>
          )}
        </View>
        <View>
          {data?.urlOne && renderFiles()}
          {rating > 0 && (
            <Image
              style={styles.thumbsDownIcon}
              source={
                thumb
                  ? require('../../assets/Images/thumbs-up.png')
                  : require('../../assets/Images/thumbs-down.png')
              }
            />
          )}
        </View>
      </View>

      {/* Details */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Assigned To</Text>
          <Text style={styles.detailValue}>
            {assignedTo && assignedTo.trim() !== ''
              ? assignedTo
              : '--------------'}
          </Text>
        </View>
        <Text style={{ marginHorizontal: 7 }}>|</Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Department</Text>
          <Text style={styles.detailValue}>
            {department && department.trim() !== ''
              ? department
              : '---------------'}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {assignedTo && assignedTo.trim() !== '' ? (
          <>
            <TouchableOpacity onPress={onPressSummary}>
              <Text style={styles.viewSummaryText}>View Summary</Text>
            </TouchableOpacity>
            <View style={styles.starsContainer}>{renderStars(rating)}</View>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={onPressAssignAgent}>
              <Text style={styles.assignAgentText}>Assign Agent</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressDropComplaint}>
              <Text style={styles.dropComplaintText}>Drop Complaint</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  // 👇 Wrap the card in TouchableOpacity if not assigned
  if (!assignedTo || assignedTo.trim() === '') {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPressCard}>
        <CardContent />
        {/* {docLoading && <Loader />} */}
        {docLoading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
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
              <>
                <Image
                  source={{ uri: previewUrl || '' }}
                  style={{ flex: 1, resizeMode: 'contain' }}
                  onLoadStart={() => setWebViewLoading(true)} // Reuse webViewLoading for image
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
      </TouchableOpacity>
    );
  }

  return (
    <>
      <CardContent />
      {/* {docLoading && <Loader />} */}
      {docLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
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
            <>
              <Image
                source={{ uri: previewUrl || '' }}
                style={{ flex: 1, resizeMode: 'contain' }}
                onLoadStart={() => setWebViewLoading(true)} // Reuse webViewLoading for image
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
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  idText: {
    fontSize: 10,
    fontFamily: 'Asap-Regular',
    marginRight: 10,
    color: COLORS.primary,
  },
  stageDotsContainer: { flexDirection: 'row', alignItems: 'center' },
  stageDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 2 },
  dateText: { fontSize: 8, color: COLORS.primary, fontFamily: 'Asap-Regular' },
  dotsButton: { marginRight: 8 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 15,
    fontFamily: 'Asap-Medium',
  },
  detailsRow: { flexDirection: 'row', marginBottom: 8 },
  detailLabel: {
    fontSize: 12,
    color: COLORS.black,
    fontFamily: 'Asap-SemiBold',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: 'Asap-Light',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewSummaryText: {
    color: '#5175B2',
    fontFamily: 'Asap-Medium',
    fontSize: 12,
    textDecorationLine: 'underline',
    textDecorationColor: '#5175B2',
  },
  starsContainer: { flexDirection: 'row' },
  star: { color: '#FFC107', marginHorizontal: 1 },
  assignAgentText: {
    color: '#5175B2',
    fontFamily: 'Asap-Medium',
    fontSize: 12,
    textDecorationLine: 'underline',
    textDecorationColor: '#5175B2',
  },
  dropComplaintText: {
    color: 'red',
    fontFamily: 'Asap-Medium',
    fontSize: 12,
    textDecorationLine: 'underline',
    textDecorationColor: 'red',
  },
  fileBox: {
    height: 70,

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
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15, // same as your card’s radius
    zIndex: 10,
  },
});

export default AdminHistoryCard;
