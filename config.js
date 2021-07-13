import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyARTbJfwLU8sYzCM16ajnuwhVBkWBBOOuQ",
    authDomain: "wily-4b15d.firebaseapp.com",
    projectId: "wily-4b15d",
    storageBucket: "wily-4b15d.appspot.com",
    messagingSenderId: "7820334209",
    appId: "1:7820334209:web:70ebd255e5b7323c15e980"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()