import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const ModuleFacSummScreen = () => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  const handleModuleRM = () => {
    navigation.navigate('ModuleRMScreen');
  };
  const handleModuleQuiz = () => {
    navigation.navigate('ModuleQuizScreen')
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalVisible3, setIsModalVisible3] = useState(false);
  const [isModalVisible4, setIsModalVisible4] = useState(false);
  const [isModalVisible5, setIsModalVisible5] = useState(false);
  const [isModalVisible6, setIsModalVisible6] = useState(false);
  const [isModalVisible7, setIsModalVisible7] = useState(false);
  const [isModalVisible8, setIsModalVisible8] = useState(false);
  const [isModalVisible9, setIsModalVisible9] = useState(false);
  const [isModalVisible10, setIsModalVisible10] = useState(false);

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
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Summary</Text>
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={handleModuleRM}>
                <FontAwesome name="map-o" size={20} color="black" />
            </TouchableOpacity>
      </View>

      <View style={styles.factorContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.factorBox} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.factorTitle}>Factor 1</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental Education
            </Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox} onPress={() => setIsModalVisible2(true)}>
            <Text style={styles.factorTitle}>Factor 2</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental Goal
            </Text> */}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.factorBox} onPress={() => setIsModalVisible3(true)}>
            <Text style={styles.factorTitle}>Factor 3</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Personal Experience on Waste Management
            </Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox} onPress={() => setIsModalVisible4(true)}>
            <Text style={styles.factorTitle}>Factor 4</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental{'\n'} Self-Awareness
            </Text> */}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.factorBox} onPress={() => setIsModalVisible5(true)}>
            <Text style={styles.factorTitle}>Factor 5</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Social Responsibilities
            </Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox} onPress={() => setIsModalVisible6(true)}>
            <Text style={styles.factorTitle}>Factor 6</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Environmental Policy
            </Text> */}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.factorBox} onPress={() => setIsModalVisible7(true)}>
            <Text style={styles.factorTitle}>Factor 7</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Examplary Leadership
            </Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox} onPress={() => setIsModalVisible8(true)}>
            <Text style={styles.factorTitle}>Factor 8</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Reinforcement Contigencies
            </Text> */}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.factorBox} onPress={() => setIsModalVisible9(true)}>
            <Text style={styles.factorTitle}>Factor 9</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Community Engagement
            </Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.factorBox}onPress={() => setIsModalVisible10(true)}>
            <Text style={styles.factorTitle}>Factor 10</Text>
            {/* <Text style={{fontSize: 13, fontWeight: 600, textAlign:'center', marginTop: 5}}>
              Social {'\n'}Technology
            </Text> */}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{alignItems:'center', justifyContent: 'center', marginTop:20 }}>
        <TouchableOpacity style={styles.NextBtn} onPress={handleModuleQuiz}>
            <Text style={{
                fontSize: 15,
                fontWeight: 600,
            }}>
                Quiz!
            </Text>
        </TouchableOpacity>
      </View>

      
      <Modal 
        visible={isModalVisible} 
        onRequestClose={() => setIsModalVisible(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 1</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Environmental Education</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
              Environmental education is a process that allows individuals to explore
              environmental issues, engage in problem-solving, and take steps to protect the 
              environment to gain a better understanding of the issues and make more informed decisions.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={isModalVisible2} 
        onRequestClose={() => setIsModalVisible2(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 2</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Evironmental Goal</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
            SDG 13 highlights the importance of financial support for
            developing countries to help them mitigate and adapt to climate change. This includes 
            providing resources for sustainable practices and technologies, and strengthening
            institutional capacity to address climate challenges.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible2(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={isModalVisible3} 
        onRequestClose={() => setIsModalVisible3(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 3</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Personal Experience on Waste Managements</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
            They set their own goals, seek out resources that best suit their needs, and apply new knowledge directly to solve real-life problems. This practical, 
        hands-on approach not only enhances their understanding but also makes the learning process more relevant and engaging, fostering a deeper commitment to their educational pursuits.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible3(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={isModalVisible4} 
        onRequestClose={() => setIsModalVisible4(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 4</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Environmental Self-Awareness</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
            Environmental self-awareness fosters 
        a deeper connection to nature and a greater appreciation for the planet's resources. 
        It motivates individuals to advocate for environmental protection and engage in community efforts to promote sustainability.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible4(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={isModalVisible5} 
        onRequestClose={() => setIsModalVisible5(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 5</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Social Responsibilities</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
            Zero waste practices foster a sense of community and collective responsibility. 
            When individuals and organizations commit to reducing waste, they often collaborate on 
            initiatives such as community clean-ups, educational programs, and sustainable business practices.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible5(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={isModalVisible6} 
        onRequestClose={() => setIsModalVisible6(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 6</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Environmental Policy</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
            They encompass a wide range of issues, including air and water quality, waste management, 
            biodiversity conservation, and climate change mitigation. By establishing clear rules 
            and standards, environmental policies help ensure that economic growth and development 
            do not come at the expense of environmental health and sustainability.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible6(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={isModalVisible7} 
        onRequestClose={() => setIsModalVisible7(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 7</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Examplary Leadership</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
            Exemplary leaders also foster an environment of trust and mutual respect, 
            where individuals feel valued and heard. They actively listen to their team members, provide constructive feedback, 
            and recognize their achievements. By creating a supportive and inclusive atmosphere, these leaders inspire loyalty 
            and dedication.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible7(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={isModalVisible8} 
        onRequestClose={() => setIsModalVisible8(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 8</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Reinforcement Contigencies</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
            Businesses might receive tax breaks or certifications for 
            implementing waste reduction programs, while individuals could be rewarded with discounts or loyalty 
            points for using reusable products and participating in recycling programs. By consistently acknowledging
            and rewarding sustainable actions, these contingencies help reinforce the desired behavior, making it more likely to be repeated over time.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible8(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={isModalVisible9}
        onRequestClose={() => setIsModalVisible9(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 9</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Community Engagement</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
            The association of the terms 'community' and 'engagement' broadens the scope, shifting the focus
            from the individual to the collective, with the implications for inclusiveness 
            to ensure that the diversity within any community is taken into account.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible9(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={isModalVisible10} 
        onRequestClose={() => setIsModalVisible10(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style = {styles.modalContainer}>
            <Text style={[styles.modalHeader, {fontWeight: 700}]}>Factor 10</Text>
            <Text style={[styles.modalTitle, {fontWeight: 500}]}>Social Technology (Social Media)</Text>
            <Text style={[styles.modalSumm, {textAlign:'center'}]}>
            Social technology and social media together have revolutionized the way people connect,
            share information, and collaborate across the globe. Social technology provides the infrastructure that enables real-time communication, 
            breaking down geographical barriers and making it possible for individuals to interact regardless of their physical location.
            </Text>
            <TouchableOpacity style={[styles.NextBtn, {marginTop: 20,}]} onPress={() => setIsModalVisible10(false)}>
              <Text style={styles.btnFont}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      

    </SafeAreaView>
  )
}

export default ModuleFacSummScreen

const styles = StyleSheet.create({
  container:{
      flex:1,
      backgroundColor: 'white',
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
    borderColor: 'white',
    marginHorizontal: 5,
    elevation: 5,
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
  modalHeader:{
    fontSize: 20,
  },
  modalTitle:{
    fontSize: 18,
  },
  modalSumm:{
    fontSize: 16,
    marginTop: 20,
  },
  btnFont:{
    fontSize: 15,
    fontWeight: '600',
  }
})