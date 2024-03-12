import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from "./firebase";
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

class Fire {
    constructor() {
        // Initialize Firebase app using the exported FIREBASE_APP
        this.firebaseApp = FIREBASE_APP;
        // Access Firestore database service using the exported FIREBASE_DB
        this.firestore = FIREBASE_DB; // Initialize Firestore instance

        this.storage = FIREBASE_STORAGE;
    }

    addPost = async ({ text, images }) => {
        const user = FIREBASE_AUTH.currentUser;
        const userId = user.uid;
    
        const post = {
            text: text,
            userId: userId,
            timestamp: new Date(),
            images: [],
        };
        
    
        try {
            // Add the post details to Firestore
            const docRef = await addDoc(collection(this.firestore, 'posts'), post);
            console.log("Document written with ID: ",docRef.id)
            
            // Upload images to Firebase Storage
            const imageUrls = [];
            
            for (const image of images) {
                const imageRef = ref(this.storage,`images/${docRef.id}/${image.name}`);
                await uploadBytes(imageRef,image );
                console.log('Image uploaded');
                // const imageUrl = await getDownloadURL(imageRef);
                // imageUrls.push(imageUrl);
            }
    
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
