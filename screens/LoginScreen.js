import { useNavigation } from "@react-navigation/native";
import React,{ useState } from "react";
import { Button, Image, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FIREBASE_AUTH, auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

//this is login screen
const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState ('');
    const [password, setPassword] = useState ('');
    const [loading,setLoading] =useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('Sign in failed:' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Check you emails!');
        } catch (error) {
            console.log(error);
            alert('Sign in failed:' + error.message);
        } finally {
            setLoading(false);
        }
    }

    // const handleSignUp = () => {
    //     auth
    //       .createUserWithEmailAndPassword(email, password)
    //       .then(userCredentials => {
    //         const user = userCredentials.user;
    //         console.log('Registered with:', user.email);
    //       })
    //       .catch(error => alert(error.message))
    //   }

    return(
        <KeyboardAvoidingView
            style = {styles.container}
            behavior="padding"
        >
        <SafeAreaView className="bg-white">
            <View className="justify-center items-center">
                <Image source={require('./../assets/usmLogo.png')}
                style={{marginTop: 40, marginBottom: 35}}/>
                <Text className="text-3xl font-extrabold">eZWC</Text>
                <Text className="text-xl font-medium mb-2">Educational Zero Waste Campus</Text>
                <Image  resizeMode="cover" source={require('./../assets/loginPageIcon.png')}
                style={{marginTop: 1, marginBottom: 25}}/>

                
            </View>
            <View className="mx-11">
                <Text className="text-2xl font-medium">Sign In</Text>
                <Text className="">Start your journey for a sustainable future</Text>


                <Text className="text-l mt-2 font-bold">Email : </Text>
                <View className="h-10 mt-1 p-3 bg-gray-200">
                    <TextInput
                        placeholder= "email@student.usm.my"
                        value ={email}
                        onChangeText={text => setEmail(text)}
                    />
                </View>

                <Text className="text-l mt-2 font-bold">Password : </Text>
                <View className="h-10 mt-1 p-3 bg-gray-200">
                    <TextInput
                        placeholder= "Password"
                        value ={ password }
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                    />
                </View>
                <Text className="text-l mt-3 font-bold">Forgot Password ? </Text>
                
                <View className="items-center mt-2">
                    <TouchableOpacity 
                        className="rounded-lg bg-black px-4 py-2 mt-2 w-60"
                        onPress={signIn}>
                        <Text className="color-white text-xl font-bold text-center">Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className="rounded-lg bg-white px-4 py-2 mt-2 w-60"
                        onPress={signUp}>
                        <Text className="color-black text-xl font-bold text-center">....</Text>
                    </TouchableOpacity>
                </View>
                

            </View>

            
            
        </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})