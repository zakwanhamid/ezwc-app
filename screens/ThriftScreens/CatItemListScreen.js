import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const CatItemListScreen = ({route}) => {
    const {categoryData} = route.params;
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen\
    };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>{categoryData.name}</Text>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default CatItemListScreen

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
})