import firebase from 'firebase/app'

const config = {
    apiKey: "AIzaSyCLPB3rMOJ6a5IYh2443R-jG2CFesZ_Qkw",
    authDomain: "greatextapp.firebaseapp.com",
    projectId: "greatextapp",
    storageBucket: "greatextapp.appspot.com",
    messagingSenderId: "539011448514",
    appId: "1:539011448514:web:509d0f8b3b908c7addc55b",
    measurementId: "G-CJV9WS2QYL"
};

export const app = firebase.initializeApp(config);
