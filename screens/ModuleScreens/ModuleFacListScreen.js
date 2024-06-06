import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

const ModuleFacListScreen = () => {
  const navigation = useNavigation();
  const [currentUser ,setCurrentUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const progressPercentage = (currentUser.module / 10 * 100) + '%';
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  const handleModuleRM = () => {
    navigation.navigate('ModuleRMScreen');
  };

  const handleModuleF1 = () => {
    navigation.navigate('ModuleF1Screen');
  };
  const handleModuleF2 = () => {
    navigation.navigate('ModuleF2Screen');
  };
  const handleModuleF3 = () => {
    navigation.navigate('ModuleF3Screen');
  };
  const handleModuleF4 = () => {
    navigation.navigate('ModuleF4Screen');
  };
  const handleModuleF5 = () => {
    navigation.navigate('ModuleF5Screen');
  };
  const handleModuleF6 = () => {
    navigation.navigate('ModuleF6Screen');
  };
  const handleModuleF7 = () => {
    navigation.navigate('ModuleF7Screen');
  };
  const handleModuleF8 = () => {
    navigation.navigate('ModuleF8Screen');
  };
  const handleModuleF9 = () => {
    navigation.navigate('ModuleF9Screen');
  };
  const handleModuleF10 = () => {
    navigation.navigate('ModuleF10Screen');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const currentUserUid = FIREBASE_AUTH.currentUser.uid;
    const userRef = doc(collection(FIREBASE_DB, 'users'), currentUserUid);

    const unsubscribe = onSnapshot(userRef, documentSnapshot => {
        if (documentSnapshot.exists()) {
            const userData = documentSnapshot.data(); // Get user data directly
            setCurrentUser(userData);
            setLoading(false);
        } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
        }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>10 Factors</Text>
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={handleModuleRM} >
                <FontAwesome name="map-o" size={20} color="black" />
            </TouchableOpacity>
      </View>

      <View style={styles.factorContainer}>
        <View style={styles.row} >
          <TouchableOpacity style={styles.factorBox} onPress={handleModuleF1}>
            <Text style={styles.factorTitle}>Factor 1</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental Education
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.factorBox, currentUser.module < 1 && styles.disabledFactorBox]} 
          onPress={handleModuleF2} disabled={currentUser.module < 1}>
            <Text style={styles.factorTitle}>Factor 2</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental Goal
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.factorBox, currentUser.module < 2 && styles.disabledFactorBox]}  
          onPress={handleModuleF3} disabled={currentUser.module < 2}>
            <Text style={styles.factorTitle}>Factor 3</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Personal Experience on Waste Management
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.factorBox, currentUser.module < 3 && styles.disabledFactorBox]}  
          onPress={handleModuleF4} disabled={currentUser.module < 3}>
            <Text style={styles.factorTitle}>Factor 4</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental{'\n'} Self-Awareness
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.factorBox, currentUser.module < 4 && styles.disabledFactorBox]} 
          onPress={handleModuleF5} disabled={currentUser.module < 4}>
            <Text style={styles.factorTitle}>Factor 5</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Social Responsibilities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.factorBox, currentUser.module < 5 && styles.disabledFactorBox]} 
          onPress={handleModuleF6} disabled={currentUser.module < 5}>
            <Text style={styles.factorTitle}>Factor 6</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental Policy
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.factorBox, currentUser.module < 6 && styles.disabledFactorBox]} 
          onPress={handleModuleF7} disabled={currentUser.module < 6}>
            <Text style={styles.factorTitle}>Factor 7</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Examplary Leadership
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.factorBox, currentUser.module < 7 && styles.disabledFactorBox]}  
          onPress={handleModuleF8} disabled={currentUser.module < 7}>
            <Text style={styles.factorTitle}>Factor 8</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Reinforcement Contigencies
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.factorBox, currentUser.module < 8 && styles.disabledFactorBox]} 
          onPress={handleModuleF9} disabled={currentUser.module < 8}>
            <Text style={styles.factorTitle}>Factor 9</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Community Engagement
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.factorBox, currentUser.module < 9 && styles.disabledFactorBox]}  
          onPress={handleModuleF10} disabled={currentUser.module < 9}>
            <Text style={styles.factorTitle}>Factor 10</Text>
            <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Social {'\n'}Technology
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressBar}>
          <Text style={styles.progressText}>
            YOUR PROGRESS : {progressPercentage}
          </Text>
        </View>
        

      </View>

    </SafeAreaView>
  )
}

export default ModuleFacListScreen

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
    backgroundColor: '#529C4E',
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
  disabledFactorBox: {
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
  progressBar:{
    marginTop: 20,
  },
  progressText:{
    fontSize: 18,
    fontWeight: 'bold',
  }

})