import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const ModuleFacSummScreen = () => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  const handleModuleRM = () => {
    navigation.navigate('ModuleRMScreen');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Summary</Text>
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={handleModuleRM}>
                <FontAwesome name="map-o" size={20} color="black" />
            </TouchableOpacity>
      </View>

      <View style={styles.factorContainer}>
        <View style={styles.row} >
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 1</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental Education
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 2</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental Goal
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 3</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Personal Experience on Waste Management
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 4</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental{'\n'} Self-Awareness
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 5</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Social Responsibilities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 6</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental Policy
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 7</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Examplary Leadership
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 8</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Reinforcement Contigencies
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 9</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Community Engagement
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox}>
            <Text style={styles.factorTitle}>Factor 10</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Social {'\n'}Technology
            </Text>
          </TouchableOpacity>
        </View>
        

      </View>

    </SafeAreaView>
  )
}

export default ModuleFacSummScreen

const styles = StyleSheet.create({
  container:{
      flex:1
  },
  header:{
      flexDirection:"row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderBottomWidth:1,
      borderBottomColor: "#D8D9DB"
    },
  titleContainer:{
      flex:1,
      justifyContent: "center",
      alignItems:"center",
      marginLeft: 45,
    },
  mapBtn:{
    backgroundColor: "#529C4E",
    width: 70,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset:{
        width: 0,
        height: 2,
    }
  },
  factorContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  row:{
    flexDirection: 'row',
    marginBottom: 10,
  },
  factorBox: {
    width: 150,
    // height: 100,
    backgroundColor: 'lightblue',
    marginHorizontal: 5,
    alignItems: 'center',
    padding: 15,
    borderRadius:10,
    borderWidth: 1,
      borderColor: 'white',
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowOffset:{
          width: 0,
          height: 2,
      }
  },
  factorTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
})