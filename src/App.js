import React, { useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDTFoA1BU4bi4XEhvesyinNxtOVdr-SmF4",
  authDomain: "reactchat-b8d14.firebaseapp.com",
  databaseURL: "https://reactchat-b8d14.firebaseio.com",
  projectId: "reactchat-b8d14",
  storageBucket: "reactchat-b8d14.appspot.com",
  messagingSenderId: "203593253129",
  appId: "1:203593253129:web:93a64ea3c090b997d7d3d8",
  measurementId: "G-EFBB8W95M2",
});

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      {/* <header className="App-header"></header> */}

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
}

function ChatRoom() {
  const messagesRef = db.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMsg = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMsg key={msg.id} message={msg} />)}
      </main>
      <form onSubmit={sendMsg}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

function ChatMsg(props) {
  const { text, uid, photoURL } = props.message;
  const msgClass = uid === auth.currentUser.uid ? "send" : "received";
  return (
    <div className={`message ${msgClass}`}>
      <img src={photoURL} alt="profilePicture" />
      <p>{text}</p>
    </div>
  );
}

export default App;
