import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";


const config = {
    apiKey: "AIzaSyBxMh6Fe8EbwabWxR-i6nrxQ_iCf3m5oCM",
    authDomain: "vue-chat-5b994.firebaseapp.com",
    projectId: "vue-chat-5b994",
    storageBucket: "vue-chat-5b994.appspot.com",
    messagingSenderId: "798061274011",
    appId: "1:798061274011:web:c9feb9eea11d6d505ab73e"
}

const app = initializeApp(config);
export const db = getDatabase(app);
export const ref_db = ref;
export const set_db = set;
export const child_db = child;
export const get_db = get;


