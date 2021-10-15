import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import { db, storage } from "../services/firebase";
import firebase from "firebase";
import {
  ArrowCircleRightIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import Compressor from "compressorjs";
import Navbar from "./Navbar";

// import {ImageCo}

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sendButton, setSendButton] = useState(false);
  const [imageToSend, setImageToSend] = useState(null);
  const filePickerRef = useRef();
  // const messageEl = useRef();
  // const [loading, setLoading] = useState(true);

  const dummy = useRef(null);

  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (text || imageToSend) {
      setSendButton(true);
    } else {
      setSendButton(false);
    }
  }, [text, imageToSend]);

  function scrollToBottom() {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function filePicker(e) {
    e.preventDefault();
    filePickerRef.current.click();
  }

  function sendMessage(e) {
    e.preventDefault();

    if (!text && !imageToSend) return null;

    db.collection("messages")
      .add({
        text: text || "",
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        if (imageToSend) {
          // upload the image coming from the user

          // encoding the image to data_url and uploading as data-url
          const uploadTask = storage
            .ref(`messages/${doc.id}`)
            .putString(imageToSend, "data_url");

          setImageToSend(null);

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
                });
            }
          );
        }
      });

    // dummy.current.scrollIntoView({ behaviour: "smooth" });
    // scrollToBottom()
    setText("");
  }

  function addImageToSend(e) {
    const reader = new FileReader();

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    new Compressor(file, {
      quality: 0.6,

      // The compression process is asynchronous,
      // which means you have to access the `result` in the `success` hook function.
      success(res) {
        // console.log(result);
        // The third parameter is required for server
        // formData.append("file", result);
        // console.log(formData);
        reader.readAsDataURL(res);
        reader.onload = (readerEvent) =>
          setImageToSend(readerEvent.target.result);
      },
      error(err) {
        console.log(err.message);
      },
    });

    scrollToBottom();
  }

  // console.log(imageToSend);
  return (
    <div className="flex flex-col w-full h-full relative lg:mx-auto lg:my-0">
      {/* Navbar */}

      <Navbar user={user} />

      {/* main Chat content */}

      <div className="flex flex-col px-3 lg:px-20 overflow-x-hidden">
        {messages &&
          messages.map((message) => {
            return <Message key={message.id} user={user} data={message.data} />;
          })}

        {imageToSend && (
          <div className="md:mx-auto my-0 h-full p-2 bg-blue-500 relative rounded-tl-xl rounded-tr-xl cursor-pointer-ml-3">
            <XCircleIcon
              className="w-7 h-7 mb-2 text-red-500"
              onClick={() => setImageToSend(null)}
            />

            <img className="rounded-md" src={imageToSend} height={100} alt="" />
          </div>
        )}
      </div>

      <div ref={dummy}></div>
      {/* Preview Image */}

      {/* dummy div */}
      {/* input form */}
      <form
        className="sticky bottom-0 z-50 bg-gray-600 dark:text-black  px-4 py-2 flex justify-center items-center"
        onSubmit={sendMessage}
      >
        <textarea
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex items-center max-w-full w-full h-11 max-h-16 md:w-9/12 py-2 px-5 rounded-full placeholder-gray-500 outline-none resize-none"
        />

        {/* Submit Button */}
        <button
          className="p-2 text-white bg-green-400 h-full rounded-full ml-2"
          type="submit"
          onClick={sendButton ? sendMessage : filePicker}
        >
          {sendButton ? (
            <ArrowCircleRightIcon className="w-7 h-7" />
          ) : (
            <PlusIcon className="w-7 h-7" />
          )}
        </button>

        {/* Ref of File picker */}
        <input
          ref={filePickerRef}
          onChange={addImageToSend}
          type="file"
          accept="image/*"
          hidden
        />
      </form>
    </div>
  );
};

export default ChatRoom;
