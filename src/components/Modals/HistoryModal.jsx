import React, {
  forwardRef,
  useRef,
  useMemo,
  useImperativeHandle,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { StyleSheet, Switch, Text, View, Image } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetHandle,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../utils/colors';

const HistoryModal = forwardRef((props, ref) => {
  const modalRef = useRef(null);
  const snapPoints = useMemo(() => ['90%', '100%'], []);
  //   const topInsets = useSafeAreaInsets()?.top;
  const { data, filterData, onSelectFilters, onSelectCategory, onModalClose } =
    props;
  const [priceRange, setPriceRange] = useState([1, 100]);
  const [isAvailableOnly, setIsAvailableOnly] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState({}); // To store selected levels for each category

  const handleSheetChanges = index => {
    setIsModalOpen(index >= 0);
  };

  const [collapsedSections, setCollapsedSections] = useState({});

  const handleSelectCategory = useCallback(
    ({ categoryId, parentIds }) => {
      if (onSelectCategory) {
        onSelectCategory({ categoryId, parentIds });
      }
      modalRef.current?.dismiss();
    },
    [onSelectCategory],
  );

  // Now define your render functions that depend on state:
  const renderLevels = useCallback(
    (data, filterKey) => {
      return <Text></Text>;
    },
    [selectedLevels],
  );

  const renderPrice = useCallback(() => {
    return (
      <View style={styles.priceContainer}>
        <Text></Text>

        <View style={styles.priceLabelsContainer}>
          <View style={styles.priceLabel}>
            <Text style={styles.priceLabelTitle}>Minimum</Text>
            <Text style={styles.priceText}>€ {priceRange[0]}</Text>
          </View>
          <View style={styles.priceLabel}>
            <Text style={styles.priceLabelTitle}>Maximum</Text>
            <Text style={styles.priceText}>€ {priceRange[1]}</Text>
          </View>
        </View>
      </View>
    );
  }, [priceRange]);

  const renderCategories = useCallback(() => {
    if (!data) {
      return null;
    }
    return (
      <View style={{ marginBottom: moderateScale(10) }}>
        <Text></Text>
      </View>
    );
  }, [data, collapsedSections, handleSelectCategory]);

  const formatTitle = str => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const sections = useMemo(() => {
    if (!filterData?.filters) return [];

    const dynamicSections = filterData.filters.map((filter, index) => ({
      id: index,
      title: formatTitle(filter.key),
      content: renderLevels(filter.unique_values, filter.key),
    }));

    return [
      ...dynamicSections,
      {
        id: dynamicSections.length, // continue the id sequence
        title: 'Price',
        content: renderPrice(),
      },
    ];
  }, [filterData, renderCategories, renderLevels, renderPrice]);

  // Expose imperative handle functions
  useImperativeHandle(ref, () => ({
    openModal() {
      modalRef.current.present();
    },
    closeModal() {
      modalRef.current.dismiss();
    },
  }));

  // Render handle for the bottom sheet
  const renderHandle = useCallback(props => {
    return (
      <BottomSheetHandle
        {...props}
        indicatorStyle={styles.indicatorStyle}
        style={styles.handleStyle}
      >
        <View style={CommonStyles.flexrowJustifySpaceBetweenAlignCenter}>
          <Text style={styles.title}>Filters</Text>
        </View>
      </BottomSheetHandle>
    );
  }, []);

  // Render backdrop for the bottom sheet
  const renderBackDrop = useCallback(props => {
    return (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.2}
      />
    );
  }, []);

  // Reset state when the modal is dismissed
  const resetState = () => {
    // Call onSelectFilters with selected filters when closing
    if (onSelectFilters) {
      onSelectFilters({
        selectedLevels,
        priceRange,
        isAvailableOnly,
      });
    }
    if (onModalClose) {
      setPriceRange([1, 100]);
      setSelectedLevels({});
      onModalClose(); // e.g., refetch products
    }
    if (filterData?.filters) {
      const collapsedState = {};
      filterData.filters.forEach(filter => {
        collapsedState[formatTitle(filter.key)] = true;
      });
      setCollapsedSections(collapsedState);
    }
  };

  const applyFilters = () => {
    if (onSelectFilters) {
      onSelectFilters({
        selectedLevels,
        priceRange,
        isAvailableOnly,
      });
    }

    modalRef.current?.dismiss(); // Close modal
  };
  const resetFilters = () => {
    const initialRange = [1, 100];

    setPriceRange(initialRange);
    setIsAvailableOnly(false);
    setSelectedLevels({});

    if (filterData?.filters) {
      const collapsedState = {};
      filterData.filters.forEach(filter => {
        collapsedState[formatTitle(filter.key)] = true;
      });
      collapsedState['Price'] = true;
      setCollapsedSections(collapsedState);
    }

    // Call the callback
    if (onSelectFilters) {
      onSelectFilters({
        selectedLevels: {},
        priceRange: initialRange,
        isAvailableOnly: false,
      });
    }

    modalRef.current?.dismiss(); // Close modal
  };
  return (
    <BottomSheetModal
      ref={modalRef}
      // onDismiss={resetState}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      //   topInset={topInsets}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      enableOverDrag={false}
      backdropComponent={renderBackDrop}
      style={styles.BottomSheetModalStyle}
      //  handleComponent={renderHandle}
      enableContentPanningGesture={false}
      stackBehavior={'push'}
      backgroundStyle={styles.bgStyle}
    >
      <BottomSheetScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View style={styles.sheetContent}>
          {true ? (
            <>
              <Text style={styles.sheetHeader}>Complaint Summary</Text>
              <Text style={styles.sectionTitle}>Complaint</Text>
              <Text style={styles.boldText}>
                {' '}
                It is a long established fact that a reader will be
              </Text>
              <Text style={styles.paragraph}>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../../assets/Images/pdfFile.png')} />
                <Image source={require('../../assets/Images/pdfFile.png')} />
              </View>
              <Text style={styles.sectionTitle}>Track Record</Text>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../../assets/Images/sort.png')}
                  style={{ marginRight: 10 }}
                />
                <View>
                  <Text style={styles.timelineDate}>25 Dec 2025 09:10 AM</Text>
                  <Text style={styles.boldText}>
                    It is a long established fact that a reader will be
                  </Text>
                </View>
              </View>
              <View style={styles.trackItem}>
                <Text style={styles.boldText}>OIC/Admin → Fazil Khan</Text>
                <Text style={styles.timelineDate}>25 Dec 2025 09:10 AM</Text>
                <Text style={styles.paragraph}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking.
                </Text>
              </View>
              <View style={styles.trackItem}>
                <Text style={styles.boldText}>OIC/Admin → Fazil Khan</Text>
                <Text style={styles.timelineDate}>25 Dec 2025 09:10 AM</Text>
                <Text style={styles.paragraph}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking.
                </Text>
              </View>
              <Text style={styles.sectionTitle}>Closing Remarks</Text>
              <Text style={styles.row}>
                <Text style={styles.boldText}>Closed By: </Text> Fazil Khan
              </Text>
              <Text style={styles.row}>
                <Text style={styles.boldText}>Closed Date: </Text> 25 Dec 2025
                09:10 AM
              </Text>
              <Text style={styles.boldText}>Remarks</Text>
              <Text style={styles.paragraph}>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking.
              </Text>
            </>
          ) : (
            <Text style={styles.paragraph}>
              Select a complaint to view summary
            </Text>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default HistoryModal;

const styles = StyleSheet.create({
  bgStyle: {
    backgroundColor: 'rgba(253, 252, 252, 1)',
  },
  indicatorStyle: {
    backgroundColor: 'red',
  },
  handleStyle: {
    paddingHorizontal: 20,
  },
  title: {
    color: 'red',
  },
  numberOfItems: {
    color: 'red',
    textDecorationLine: 'underline',
    textDecorationColor: 'red',
    lineHeight: 17,
    fontWeight: '500',
  },
  BottomSheetModalStyle: {
    overflow: 'hidden',
  },
  mainContainer: {
    flex: 1,
  },
  priceContainer: {
    width: '100%',
  },
  priceLabelsContainer: {},
  priceLabel: {
    borderWidth: 1,
    borderColor: 'rgba(40, 32, 24, 0.6)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
  },
  priceLabelTitle: {
    color: 'rgba(40, 32, 24, 0.6)',
    fontWeight: '400',
    lineHeight: 12,
  },
  priceText: {
    color: 'rgba(40, 32, 24, 0.6)',
    fontWeight: '500',
    lineHeight: 18,
  },
  contentContainerStyle: {
    paddingBottom: 150,
    paddingHorizontal: 20,
  },
  ShowAvailableItemContainer: {},
  OtherText: {
    color: 'rgba(40, 32, 24, 1)',
    fontWeight: '500',
    lineHeight: 36,
  },
  thumbStyle: {
    borderWidth: 1,
    borderColor: 'rgba(40, 32, 24, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  bottomButtonsContainer: {
    // marginLeft: 50,
    width: '100%',
  },
  CancelText: {
    fontSize: 17,
    fontFamily: 'TT Chocolates Bold',
    fontWeight: '600',
    color: 'black',
    width: '40%',
    textAlign: 'center',
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
