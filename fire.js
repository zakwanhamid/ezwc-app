import { FIREBASE_APP, FIREBASE_AUTH } from "./firebase";
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

class Fire {
    constructor() {
        // Initialize Firebase app using the exported FIREBASE_APP
        this.firebaseApp = FIREBASE_APP;
        // Access Firestore database service using the exported FIREBASE_DB
        this.firestore = getFirestore(FIREBASE_APP); // Initialize Firestore instance
    }

    addPost = async ({ text, images }) => {
        // Get the current user from Firebase Authentication service
        const user = FIREBASE_AUTH.currentUser;
        const userId = user.uid;

        const post = {
            text: text,
            images: images,
            userId: userId,
            timestamp: new Date() // Use JavaScript Date object
        };

        try {
            // Add the post to the Firestore collection
            const docRef = await addDoc(collection(this.firestore, 'posts'), post);
            console.log("Document written with ID: ", docRef.id);
            return true;
        } catch (error) {
            console.error("Error adding post: ", error);
            return false;
        }
    };
}

const fire = new Fire();
export default fire;
