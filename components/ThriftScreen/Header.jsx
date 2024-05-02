import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';

export default function Header() {
    const [currentUser, setCurrentUser] = useState([]);

    useEffect(() => {
        const currentUserUid = FIREBASE_AUTH.currentUser.uid;
        const userRef = doc(collection(FIREBASE_DB, "users"), currentUserUid);
    
        const unsubscribe = onSnapshot(userRef, (documentSnapshot) => {
          if (documentSnapshot.exists()) {
            const userData = {
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            }; // Include user ID in userData
            setCurrentUser(userData);
            console.log(currentUser.email)
          } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
          }
        });
        return () => unsubscribe();
    }, []);  
  
  return (
    <View>
        <Text>This is header</Text>
    </View>
  )
}