import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addDoc, collection } from 'firebase/firestore';

const ModuleFeedbackScreen = () => {
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState('');
  // const goBack = () => {
  //   navigation.goBack(); // Go back to the previous screen
  // };
  const handleModuleRM = () => {
    navigation.navigate('ModuleRMScreen');
  };

  const handleSendFeedback = async () => {
    const user = FIREBASE_AUTH.currentUser;
    const userId = user.uid;
    try {
      // Add the feedback to the 'feedbacks' collection in Firestore
      const docRef = await addDoc(collection(FIREBASE_DB, 'feedbacks'), {
        userId: userId,
        feedback: feedback,
        timestamp: new Date(),
      });
      console.log('Feedback added with ID: ', docRef.id);
      alert('Thank you for your feedback, we really appreciate it. We will try to improve this module so everyone else including you will get the best learning experience!')
      navigation.navigate('ModuleScreen');
    } catch (error) {
      console.error('Error adding feedback: ', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={goBack}>
            <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
        </TouchableOpacity> */}
        <View style={styles.titleContainer}>
            <Text style={{ fontSize: 20, fontWeight:"600"}}>Feedback</Text>
        </View>
      </View>

      <View style={styles.titleBox}>
        <Text style={styles.titleText}>
          Give us your feedback so we can improve this learning module. 
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
            autoFocus={true}
            multiline={true}
            numberOfLines={20}
            style={{ flex: 1}}
            placeholder='Share your feedback here...'
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
            maxLength={280}
        ></TextInput>
      </View>


      <View style={{alignItems:'center', justifyContent: 'center', marginTop: 20}}>
        <TouchableOpacity style={styles.NextBtn} onPress={handleSendFeedback}>
            <Text style={{
                fontSize: 15,
                fontWeight: 600,
            }}>
                Send 
            </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ModuleFeedbackScreen

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
    titleBox:{
      marginHorizontal:30,
      marginTop:20,
    },

    inputContainer:{
      marginHorizontal: 25,
      marginTop: 25,
      paddingBottom: 40,
      flexDirection: "row",
      borderBottomWidth:1,
      borderBottomColor: "#D8D9DB",
    },
    NextBtn:{
        backgroundColor: "#529C4E",
        width: 100,
        height: 40,
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
})