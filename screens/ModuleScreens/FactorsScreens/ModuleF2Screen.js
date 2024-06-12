import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebase';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const ModuleF2Screen = () => {
  const navigation = useNavigation();
  const [currentUser ,setCurrentUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isModalVisibleCP, setIsModalVisibleCP] = useState(false);
  const [isModalVisibleNotCorrect, setIsModalVisibleNotCorrect] = useState(false);

  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  const handleModuleFacList = () => {
    navigation.navigate('ModuleFacListScreen');
  };

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

  const questions = [
    {
      question: 'The SMART Goal to promote zero waste is important. The goal must be spcific, measurable, achievable _______ and timely.',
      options: [
        'Simple', 
        'Complex', 
        'Realistic-', 
        'Big'],
      correctAnswer: 'Realistic-',
    },]

  const handleAnswerSelection = (questionIndex, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
  };
  
  const handleCheckAnswers = () => {
    let currentScore = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        currentScore++;
        console.log(currentScore)
      }
        if (currentScore > 0) {
          handleModuleF3();
          console.log('answer is correct')
        } else {
          setIsModalVisibleNotCorrect(true);
          console.log('answer is not correct')

        }
    });
  };

  const handleModuleF3 = async () => {
    console.log(currentUser.module)

    if (currentUser.module === 1) {
      try {
        const userRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
        await updateDoc(userRef, {
            module: currentUser.module + 1 // Increment module by 1
        });
        navigation.navigate('ModuleF3Screen');
      } catch (error) {
          console.error('Error updating module counter:', error);
      }
      console.log(currentUser.module)
    }else {
      console.log('Module counter is already 2');
      navigation.navigate('ModuleF3Screen');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Factor 2</Text>
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={handleModuleFacList}>
                <Entypo name="list" size={20} color="black"/>
            </TouchableOpacity>
        </View>

        <ScrollView >
        <View style={{paddingBottom: 120}}>
        <Text style={{textAlign:'center', fontSize: 20, fontWeight: 'bold', marginTop: 20}}>Evironmental Goal</Text>
        <Text style={{fontSize: 14, marginTop: 10, margin:20}}> 
        The Environmental Goal of the Sustainable Development Goals (SDGs), specifically SDG 13, 
        is about taking urgent action to combat climate change and its impacts.
        This goal emphasizes the need to reduce greenhouse gas emissions, promote renewable energy, 
        and enhance resilience to climate-related disasters.
        </Text>
        <View style={{alignItems: 'center'}}>
            <Image source={require('../../../assets/F2Img1.png')}
            style={{height: 180, width: '80%', borderRadius: 10}}
        />
        </View>
        <Text style={{fontSize: 14, margin:20}}>Additionally, SDG 13 highlights the importance of financial support for
        developing countries to help them mitigate and adapt to climate change. This includes 
        providing resources for sustainable practices and technologies, and strengthening
        institutional capacity to address climate challenges.
        </Text>

        <View style={{alignItems:'center', justifyContent: 'center', marginTop: 0}}>
          <TouchableOpacity style={styles.NextBtn} onPress={() => setIsModalVisibleCP(true)}>
              <Text style={{
                  fontSize: 15,
                  fontWeight: 600,
              }}>
                  Next Factor
              </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>

        <Modal
          visible={isModalVisibleCP} 
          onRequestClose={() => setIsModalVisibleCP(false)}
          animationType='fade'
          transparent={true}
        >
          <View style={styles.modalBg}>
            <View style = {styles.modalContainer}>
              <Text style={styles.titleText}>
                Checkpoint Question
              </Text>
              <Text style={{textAlign:'center', marginTop:10}}>
                Answer this question correctly in order to go to next factor.
              </Text>

              {questions.map((question, index) => (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.question}</Text>
                {question.options.map((option, optionIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
                    style={[
                      styles.optionButton,
                      selectedAnswers[index] === option && styles.selectedOption,
                    ]}
                    onPress={() => handleAnswerSelection(index, option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
          ))}
              <TouchableOpacity style={[styles.NextBtn, {width: 200}]} onPress= {() => {handleCheckAnswers(); setIsModalVisibleCP(false);}}>
                <Text style={styles.btnFont}> Check Answer </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      <Modal
        visible={isModalVisibleNotCorrect} 
        onRequestClose={() => setIsModalVisibleNotCorrect(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={styles.titleText}>
              Wrong Answer
            </Text>
            <Text style={{textAlign:'center', marginTop:10}}>
              Your answer is not correct, Review the factor and answer the question again.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20, width: 200}]} onPress= {() =>  setIsModalVisibleNotCorrect(false)}>
              <Text style={styles.btnFont}> Try Again </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



    </SafeAreaView>
  )
}

export default ModuleF2Screen

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
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
questionContainer: {
  marginVertical: 20,

},
titleText: {
  fontSize: 18,
  fontWeight: 'bold',
},
questionText: {
  fontSize: 18,
  fontWeight: '500',
  marginBottom: 10,
},
optionButton: {
  borderWidth: 1,
  borderColor: 'black',
  borderRadius: 10,
  padding: 10,
  marginVertical: 5,
},
selectedOption: {
  backgroundColor: 'lightblue',
},
optionText: {
  fontSize: 16,
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
modalBg: {
  flex: 1, 
  backgroundColor: 'rgba(0,0,0,0.5)', 
  justifyContent: 'center',
  alignItems: 'center'
},
modalContainer:{
  width: '80%',
  backgroundColor: 'white',
  paddingHorizontal: 20,
  paddingVertical: 30,
  borderRadius: 20,
  elevation: 20,
  alignItems:'center'
},
btnFont:{
  fontSize: 15,
  fontWeight: '600',
}
})