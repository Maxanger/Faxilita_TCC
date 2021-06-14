import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'


let firebaseConfig = {
    apiKey: "AIzaSyBO_RrWqTCAH2iRDdhhHEN3WySQVO-5ijo",
    authDomain: "curso-bfa90.firebaseapp.com",
    projectId: "curso-bfa90",
    storageBucket: "curso-bfa90.appspot.com",
    messagingSenderId: "216896830883",
    appId: "1:216896830883:web:5c0eaac3025a0338416e16",
    measurementId: "G-V2EQ55BFG1"
};

//se nao tem nenhuma conexão aberta ele abre uma conexao
if (!firebase.apps.length){
firebase.initializeApp(firebaseConfig);}

export default firebase;