import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from "./firebase";
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore methods
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage methods

class Fire {
    constructor() {
        // Initialize Firebase app using the exported FIREBASE_APP
        this.firebaseApp = FIREBASE_APP;
        // Access Firestore database service using the exported FIREBASE_APP
        this.firestore = getFirestore(this.firebaseApp); // Initialize Firestore instance
        // Access Firebase Storage service using the exported FIREBASE_APP
        this.storage = getStorage(this.firebaseApp); // Initialize Firebase Storage instance
    }

    addPost = async ({ text, images }) => {
        const user = FIREBASE_AUTH.currentUser;
        const userId = user.uid;
    
        const post = {
            text: text,
            userId: userId,
            timestamp: serverTimestamp() // Use serverTimestamp from Firebase SDK directly
        };
    
        try {
            // Add the post details to Firestore
            const docRef = await addDoc(collection(this.firestore, 'posts'), post);
            
            // Upload images to Firebase Storage
            const imageUrls = [];
            for (const image of images) {
                const imageRef = ref(this.storage, `images/${docRef.id}/${image.name}`);
                await uploadBytes(imageRef, image);
                const imageUrl = await getDownloadURL(imageRef);
                imageUrls.push(imageUrl);
            }
    
            // Update the post with image URLs
            await docRef.update({ images: imageUrls });
    
            return true;
        } catch (error) {
            console.error("Error adding post: ", error);
            return false;
        }
    };
}

const fire = new Fire();
export default fire;
