import { initializeApp } from "firebase/app"
import {getFirestore} from "@firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBDvq5n2_jnJ4nWZ7KyXhqkuDKC7zjAiLM",
    authDomain: "fir-test-f2adb.firebaseapp.com",
    projectId: "fir-test-f2adb",
    storageBucket: "fir-test-f2adb.appspot.com",
    messagingSenderId: "315177872375",
    appId: "1:315177872375:web:04a6502a2538e9bb579cf2",
    measurementId: "G-VXEHNKFG1N"
  }

  const app = initializeApp(firebaseConfig)

  export const db = getFirestore(app)
  
  export const storage = getStorage(app)