import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import LatestItemList from '../../components/ThriftScreen/LatestItemList';
import { SafeAreaView } from 'react-native-safe-area-context';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const CatItemListScreen = ({ route }) => {
  const { categoryData } = route.params;
  const navigation = useNavigation();
  const [itemList, setItemList] = useState([]);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000.00]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 5000.00]);
  const [displayPriceRange, setDisplayPriceRange] = useState([0, 5000.00]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  useEffect(() => {
    getItemListByCategory();
  }, []);

  const getItemListByCategory = async () => {
    const listingsCollection = query(
      collection(FIREBASE_DB, 'listings'),
      where('category', '==', categoryData.name),
      orderBy('timestamp', 'desc')
    );
    const listingsSnapshot = await getDocs(listingsCollection);
    const listingsList = await Promise.all(
      listingsSnapshot.docs.map(async (listingDoc) => {
        const listingData = {
          id: listingDoc.id,
          ...listingDoc.data(),
        };
        const userDocRef = doc(FIREBASE_DB, 'users', listingData.userId);
        const userDocSnapshot = await getDoc(userDocRef);

        let userData = {};
        if (userDocSnapshot.exists()) {
          userData = {
            userId: userDocSnapshot.id,
            ...userDocSnapshot.data(),
          };
        } else {
          userData = {
            userId: listingData.userId,
            name: 'Unknown',
            email: 'Unknown',
            userHP: 'Unknown',
          };
        }

        return {
          id: listingData.id,
          image: listingData.image,
          title: listingData.title,
          price: listingData.price,
          category: listingData.category,
          desc: listingData.desc,
          time: listingData.timestamp,
          userId: userData.userId, // Include userId here
          userName: userData.name,
          userEmail: userData.email,
          userHP: userData.userHP,
          userProfileImage: userData.profileImage,
        };
      })
    );

    setItemList(listingsList);
    filterItemListByPrice(listingsList, priceRange);
  };

  const filterItemListByPrice = (items, range) => {
    const [minPrice, maxPrice] = range;
    const filteredItems = items.filter(item => item.price >= minPrice && item.price <= maxPrice);
    setFilteredItemList(filteredItems);
  };

  useEffect(() => {
    filterItemListByPrice(itemList, priceRange);
  }, [priceRange, itemList]);

  const openModal = () => {
    setTempPriceRange(priceRange);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const applyFilter = () => {
    setPriceRange(tempPriceRange);
    setDisplayPriceRange(tempPriceRange);
    closeModal();
  };

  const handleMinPriceChange = (text) => {
    const value = parseFloat(text);
    setTempPriceRange([isNaN(value) ? 0 : value, tempPriceRange[1]]);
  };

  const handleMaxPriceChange = (text) => {
    const value = parseFloat(text);
    setTempPriceRange([tempPriceRange[0], isNaN(value) ? 0 : value]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: "600" }}>{categoryData.name} Items</Text>
        </View>
        <TouchableOpacity onPress={openModal} style={styles.filterButton}>
          <Feather name="filter" size={24} color="#529C4E" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Price Range</Text>
            <View style={styles.priceRangeContainer}>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={String(tempPriceRange[0])}
                onChangeText={handleMinPriceChange}
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={String(tempPriceRange[1])}
                onChangeText={handleMaxPriceChange}
              />
            </View>
            <MultiSlider
              min={0}
              max={5000.00}
              step={50}
              values={tempPriceRange}
              onValuesChange={(values) => setTempPriceRange(values)}
              sliderLength={280}
              selectedStyle={{
                backgroundColor: "#529C4E",
              }}
              unselectedStyle={{
                backgroundColor: "#ECECEC",
              }}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.priceRangeDisplay}>
        <Text style={styles.priceRangeText}>Price Range: {displayPriceRange[0]} - {displayPriceRange[1]}</Text>
      </View>

      {filteredItemList.length ?
        <View style={{ paddingBottom: 190 }}>
          <LatestItemList latestItemList={filteredItemList} heading={''} />
        </View>
        : <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No item available for this category...</Text>
        </View>
      }
    </SafeAreaView>
  );
}

export default CatItemListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Adjusted for space-between
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    borderRadius: 5,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: 350,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    width: 80,
    textAlign: 'center',
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  applyButton: {
    backgroundColor: '#529C4E',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  priceRangeDisplay: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F1F1F1',
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
