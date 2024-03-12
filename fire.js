import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from "./firebase";
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import { getStorage } from "firebase/storage";

class Fire {
    constructor() {
        // Initialize Firebase app using the exported FIREBASE_APP
        this.firebaseApp = FIREBASE_APP;
        // Access Firestore database service using the exported FIREBASE_DB
        this.firestore = FIREBASE_DB; // Initialize Firestore instance
    }

    addPost = async ({ text, images }) => {
        const user = FIREBASE_AUTH.currentUser;
        const userId = user.uid;
    
        const post = {
            text: text,
            userId: userId,
            timestamp: new Date()
        };
    
        try {
            // Add the post details to Firestore
            const docRef = await addDoc(collection(this.firestore, 'posts'), post);
            console.log("Document written with ID: ",docRef.id)
            
            // Upload images to Firebase Storage
            // const imageUrls = [];
            // for (const image of images) {
            //     const imageRef = getStorage(FIREBASE_APP).ref().child(`images/${docRef.id}/${image.name}`);
            //     await imageRef.put(image);
            //     const imageUrl = await imageRef.getDownloadURL();
            //     imageUrls.push(imageUrl);
            // }
    
            // // Update the post with image URLs
            // await docRef.update({ images: imageUrls });
    
            return true;
        } catch (error) {
            console.error("Error adding post: ", error);
            return false;
        }
    };
}

const fire = new Fire();
export default fire;
