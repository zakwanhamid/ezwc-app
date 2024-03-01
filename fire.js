import firebase from "firebase";
import "firebase/firestore";
import { FIREBASE_APP } from "./firebase";

class Fire {
    constructor() {
        firebase.initializeApp(FIREBASE_APP);
    }

    addPost = async ({ text, images }) => {
        const user = firebase.auth().currentUser;
        const userId = user.uid;

        const post = {
            text: text,
            images: images,
            userId: userId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await firebase.firestore().collection("posts").add(post);
            return true;
        } catch (error) {
            console.error("Error adding post: ", error);
            return false;
        }
    };
}

const fire = new Fire();
export default fire;
