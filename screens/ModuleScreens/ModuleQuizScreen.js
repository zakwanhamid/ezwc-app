import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const ModuleQuizScreen = () => {
  const navigation = useNavigation();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isModalVisibleFullMark, setIsModalVisibleFullMark] = useState(false);
  const [isModalVisibleNotFullMark, setIsModalVisibleNotFullMark] = useState(false);


  const [score, setScore] = useState(0);
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  const handleModuleRM = () => {
    navigation.navigate('ModuleRMScreen');
  };
  const handleModuleFeedback = () => {
    navigation.navigate('ModuleFeedbackScreen');
  };
  const handleModuleSumm = () => {
    navigation.navigate('ModuleFacSummScreen');
  };

  const questions = [
    {
      question: '1. Which of the following does not describe zero-waste?',
      options: [
        'The conservation of all resources', 
        'Encourage waste-to-energy coversion-', 
        'To maximize recycling', 
        'To minimize production of waste'],
      correctAnswer: 'Encourage waste-to-energy coversion-',
    },
    {
      question: '2. The SMART Goal to promote zero waste is important. The goal must be spcific, measurable, achievable _______ and timely.',
      options: [
        'Simple', 
        'Complex', 
        'Realistic-', 
        'Big'],
      correctAnswer: 'Realistic-',
    },
    {
      question: '3. Participating in zero-waste pro environmental activities can provide the community with a personal experience that allows us to better realte our experiences to zero waste and environmental information.',
      options: [
       'True-', 
       'False'],
      correctAnswer: 'True-',
    },
    {
      question: '4. Being environmentally self aware is chareacterised by the following:',
      options: [
        'Being aware of environmental issues', 
        'Determining which actions can have an impact on the environment',
        'Being self-aware of the personal environmental philosophies', 
        'All of above-'],
      correctAnswer: 'All of above-',
    },
    {
      question: '5.  Individuals are responsible towards their impact on the environment and, if feasible, minimising the harm they cause to the environment.',
      options: [ 'True-', 'False'],
      correctAnswer: 'True-',
    },
    {
      question: '6. USM policy includes a whole system approach which involves four major domains of ______.',
      options: [
        'Teaching, research, community engagement and institutional arrangement-',
        'Teaching, learning, community engagement and institutional arrangement', 
        'Teaching, learning, public relationship, and institutional arrangement', 
        'Teaching, research, public relationship and institutional arrangement'],
      correctAnswer: 'Teaching, research, community engagement and institutional arrangement-',
    },
    {
      question: '7. The five practices of exemplary leadership include the following, except ______?',
      options: [
      'Model the way', 
      'Inspire a shared vision', 
      'Encourage the heart', 
      'Challenge the people-'],
      correctAnswer: 'Challenge the people-',
    },
    {
      question: '8. Negative reinforcement increases the likelihood of a specific response by removing an unfavourable consequence',
      options: [
      'True-', 
      'False'],
      correctAnswer: 'True-',
    },
    {
      question: '9. Community engagement is the process of working collaboratively with groups of people who are affiliated by',
      options: [
        'Different interest-', 
        'A common interest', 
        'Similar circumstances', 
        'Geograpghic proximity'],
      correctAnswer: 'Different interest-',
    },
    {
      question: '10. Which of the following is not a social media benefit?',
      options: [
      'Spreading unfolded information-', 
      'Entertainment', 
      'Connecting with people', 
      'Source of inspiration'],
      correctAnswer: 'Spreading unfolded information-',
    },
    // Add more questions as needed
  ];

  const handleAnswerSelection = (questionIndex, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
  };

  const handleCheckAnswers = () => {
    let currentScore = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        currentScore++;
      }
      console.log("At check modal::",score)
        if (currentScore === 10) {
          setIsModalVisibleFullMark(true);
        } else {
          setIsModalVisibleNotFullMark(true);
        }
    });
    console.log("Current",currentScore)
    setScore(currentScore);
  };

  const handleResetAnswers = () => {
    setSelectedAnswers({});
    setScore(null);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView >
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
            <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
            <Text style={{ fontSize: 20, fontWeight:"600"}}>Quiz</Text>
        </View>
        <TouchableOpacity style={styles.mapBtn} onPress={handleModuleRM}>
            <FontAwesome name="map-o" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        <TouchableOpacity
          style={styles.checkButton}
          onPress= {() => handleCheckAnswers() 
            }
          
        >
          <Text style={styles.checkButtonText}>Check Answers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetAnswers}

          
        >
          <Text style={styles.resetButtonText}>Reset Answers</Text>
        </TouchableOpacity>

        

        <View style={{alignItems:'center', justifyContent: 'center', marginTop: 20}}>
          <TouchableOpacity style={styles.NextBtn} onPress={handleModuleFeedback}>
              <Text style={{
                  fontSize: 15,
                  fontWeight: 600,
              }}>
                  Feedback
              </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisibleFullMark} 
        onRequestClose={() => setIsModalVisibleFullMark(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            {score !== null && (
            <Text style={styles.scoreText}>Score: {score} / {questions.length}</Text>
            )}
            <Text style={[styles.modalSumm, {textAlign:'center', marginTop:10}]}>
              Congratulation! You have a perfect score! Please click this button and share your experience regarding this module. Your response is appreciated for our improvement
            </Text>
            
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20}]} onPress={() => {setIsModalVisibleFullMark(false); handleModuleFeedback()}}>
              <Text> Feedback </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal
        visible={isModalVisibleNotFullMark} 
        onRequestClose={() => setIsModalVisibleNotFullMark(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            {score !== null && (
            <Text style={styles.scoreText}>Score: {score} / {questions.length}</Text>
            )}
            <Text style={{textAlign:'center', marginTop:10}}>
              Sorry your is not perfect, go to summary page to revise and try again
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20, width: 200}]} onPress= {() => {handleCheckAnswers(); setIsModalVisibleNotFullMark(false); handleModuleSumm()}}>
            
              <Text> Summary Page </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default ModuleQuizScreen

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

    scrollContainer: {
      marginTop:20,
      paddingHorizontal: 20,
      paddingBottom: 200,
    },
    questionContainer: {
      marginBottom: 20,
    },
    questionText: {
      fontSize: 18,
      fontWeight: 'bold',
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
    checkButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    checkButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    resetButton: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    resetButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    scoreText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: 'bold',
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
})