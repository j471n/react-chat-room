import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import { db, storage } from "../services/firebase";
import firebase from "firebase";
import { PlusIcon, PaperAirplaneIcon } from "@heroicons/react/solid";
import { PhotographIcon } from "@heroicons/react/outline";
import Navbar from "./Navbar";
import PreviewImage from "../components/PreviewImage";

const ChatRoom = ({ user }) => {
  // to get the messages and store it here
  const [messages, setMessages] = useState([]);
  // Current input field value
  const [text, setText] = useState("");
  // is send button enable or not
  const [sendButton, setSendButton] = useState(false);
  // do we have an image to send or not
  const [imageToSend, setImageToSend] = useState(null);
  // To show the send menu
  const [showMenu, setShowMenu] = useState(false);
  // reference to the filePicker to send the image file
  const imagePickerRef = useRef();
  // dummy reference just to scroll
  const dummy = useRef(null);
  // the last image senderID
  let lastSenderId = undefined;
  // For the progress bar
  const [uploadProgress, setUploadProgress] = useState(null);
  // to send the message through ctrl+enter
  const formRef = useRef(null);
  const messageInputRef = useRef(null);

  // This fetch all the messages from the firebase db and set it the message state
  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(150) // only show the last 150 messages
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
            .reverse()
        );
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    function submitFormOnCtrlEnter(event) {
      if (
        (event.keyCode === 10 || event.keyCode === 13) &&
        event.ctrlKey &&
        text.trim()
      ) {
        sendMessage(event);
      }
    }

    if (formRef !== null) {
      formRef.current.addEventListener("keydown", submitFormOnCtrlEnter);
      return () =>
        formRef.current.removeEventListener("keydown", submitFormOnCtrlEnter);
    }
  }, [text, formRef, sendMessage]);

  // this identify isSendButton enable or not
  // if input field has a value or the image is selected only then it enables it
  useEffect(() => {
    if (text.trim() || imageToSend) {
      setSendButton(true);
    } else {
      setSendButton(false);
    }
  }, [text, imageToSend]);

  /* function just to scroll to the bottom to the dummy div */
  function scrollToBottom() {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }

  // Scroll every time as we send the messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // it clicks the filePicker ref because we don't want to show the actual file input field
  function imagePicker(e) {
    e.preventDefault();
    imagePickerRef.current.click();
    setShowMenu(false);
  }

  // It send the message to the firebase storage
  function sendMessage(e) {
    e.preventDefault();

    // Checking if text or image is empty then don't send the message
    if (!text && !imageToSend) return null;

    // Adding the data to the messages collection
    db.collection("messages")
      .add({
        text: text || "",
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        email: user.email,
      })
      .then((doc) => {
        if (imageToSend) {
          setUploadProgress(0);

          // upload the image coming from the user
          // encoding the image to data_url and uploading as data-url
          const uploadTask = storage
            .ref(`messages/${doc.id}`)
            .putString(imageToSend, "data_url");

          // Getting the Upload Progress to show Loading
          uploadTask.on("state_change", (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            setUploadProgress(percentUploaded);
          });

          uploadTask.on(
            "state_change",
            null,
            (err) => console.error(err),
            () => {
              // when the upload complete
              storage
                .ref("messages")
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  db.collection("messages").doc(doc.id).set(
                    {
                      sendImage: url,
                    },
                    { merge: true }
                  );
                })
                .then(() => {
                  setTimeout(() => {
                    setImageToSend(null);
                    setUploadProgress(null);
                  }, 1000);
                });
            }
          );
        }
      });

    scrollToBottom();
    setText("");
    messageInputRef.current.style.height = "40px";
  }

  function addImageToSend(e) {
    const reader = new FileReader();
    // reading the file path
    const file = e.target.files[0];

    // if file is not selected then return null
    if (!file) return null;

    // converting it to the DataURl
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => setImageToSend(readerEvent.target.result);
    scrollToBottom();
  }

  return (
    <div className="flex flex-col w-full gap-0 h-screen relative lg:mx-auto lg:my-0 ">
      {/* Navbar */}
      <Navbar user={user} />

      {/* main Chat content */}
      <div className="flex flex-col px-3 overflow-x-hidden scrollbar-hide h-full w-full max-w-5xl mx-auto pb-4">
        {messages &&
          messages.map((message) => {
            // It checks do we need to show the name of the sender or not
            // It determines the is lastMessageSender or the CurrentMessageSender are the same
            // if they are same then don't show the details
            // else show the details
            let showDetails =
              !lastSenderId || message.data.uid !== lastSenderId;
            lastSenderId = message.data.uid;
            return (
              <Message
                key={message.id}
                showDetails={showDetails}
                user={user}
                data={message.data}
              />
            );
          })}

        {/* Preview Image - before sending we use the preview */}
        {imageToSend && (
          <PreviewImage
            src={imageToSend}
            cancel={() => setImageToSend(null)}
            progress={uploadProgress}
          />
        )}

        {/* Dummy div onScrollBottom we scroll to here */}
        <div ref={dummy}></div>
      </div>

      {/* input form */}
      <form
        ref={formRef}
        className="sticky w-full bottom-0 z-50 bg-gray-600 dark:text-black px-5 py-2 flex justify-center gap-4 items-center"
        onSubmit={sendMessage}
      >
        <textarea
          ref={messageInputRef}
          type="text"
          onInput={(e) => {
            e.target.style.height = "5px";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex items-center max-w-full w-full max-h-44 h-10 lg:max-w-screen-md py-2 placeholder-gray-200 text-white outline-none resize-none scrollbar-hide bg-transparent"
        />

        {/* 
          Submit Button 
          - if the text is empty only then show the filePicker
          - otherwise show the send button  
        */}
        <button
          className="p-2 text-white bg-blue-500 self-end rounded-full grid place-items-center"
          type="submit"
          onClick={sendButton ? sendMessage : () => setShowMenu(!showMenu)}
        >
          {sendButton ? (
            <PaperAirplaneIcon className="w-7 h-7" />
          ) : (
            <PlusIcon className="w-7 h-7" />
          )}
        </button>

        {/* Ref of File picker and hidden*/}
        <input
          ref={imagePickerRef}
          onChange={addImageToSend}
          type="file"
          accept="image/*"
          hidden
        />
      </form>

      <div
        className={`${
          !showMenu
            ? "opacity-0 h-0 m-0  overflow-hidden"
            : "opacity-100 h-auto mt-5 mb-2"
        } flex justify-center items-center transition-opacity duration-500 ease-in-out`}
      >
        <div className="flex items-center">
          {/* Photo Picker Container */}
          <div
            className="p-6 bg-transparent hover:bg-blue-400 border-2 text-blue-400 border-blue-400 border-solid hover:text-white rounded-md cursor-pointer"
            onClick={imagePicker}
          >
            <PhotographIcon className="base-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
