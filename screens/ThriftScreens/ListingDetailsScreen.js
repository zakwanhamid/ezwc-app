import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Linking } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function ListingDetailsScreen() {
    const {params} = useRoute();
    const navigation = useNavigation();
    const [product, setProduct] = useState([]);

    useEffect(() => {
        params&&setProduct(params.product);
    },[params])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen\
    };

    const handleOpenLink = async () => {
        if (!product.userPH) {
            console.error('User phone number not available.');
            return;
        }

        const whatsappLink = 'https://www.wasap.my/6' + product.userPH;
        console.log('whatsppLink:',whatsappLink)
        const supported = await Linking.canOpenURL(whatsappLink);
        if (supported) {
            await Linking.openURL(whatsappLink);
        } else {
            console.error('Unable to open WhatsApp link:', whatsappLink);
        }
    };


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>Item Details</Text>
            </View>
        </View>
        <View>
            <ScrollView>
                <View>
                    <Image source={{uri:product.image}}
                        style={styles.productImg}/>
                        <View style={styles.detailsContainer}>
                            <Text style={styles.titleTxt}>{product.title}</Text>
                            <Text style={styles.catTxt}>{product.category}</Text>
                            <Text style={styles.descHeader}>Description</Text>
                            <Text style={styles.descTxt}>{product.desc}</Text>
                        </View>
                </View>

                <View style={styles.userContainer}>
                    <Image
                        source={require("../../assets/profilePic.jpeg")}
                        style={styles.postAvatar}
                    />
                    <View style={styles.userInfo}>
                        <View>
                            <Text style={styles.nameTxt}>{product.userName}</Text>
                            <Text style={styles.emailTxt}>{product.userEmail}</Text>
                        </View>
                        <TouchableOpacity onPress={handleOpenLink}>
                            <FontAwesome5 style={{marginRight: 20}} name="whatsapp" size={40} color="#529C4E" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -18,
    },
    productImg:{
        height: 300,
        width: '100%',
    },
    detailsContainer:{
        padding: 20,
    },
    titleTxt:{
        fontSize: 24,
        fontWeight: '600'
    },
    catTxt:{
        marginBottom: 10,
        marginTop:5
    },
    descHeader:{
        marginTop:5,
        fontWeight: '600',
        fontSize: 18
    },
    descTxt:{
        fontSize: 17,
        color: 'gray',
    },
    postAvatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderColor: "white",
        borderWidth: 2,
    },
    userContainer:{
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        marginHorizontal:20,
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: 'white'
    },
    userInfo: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameTxt:{
        fontSize: 18,
        fontWeight: '500'
    },
    emailTxt:{
        color: 'gray'
    },
})