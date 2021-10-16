import React, { useState } from "react";
import { auth, googleProvider } from "../services/firebase";
import Loading from "./Loading/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    /*  async function to login with the google
        - if all good then it will login and show the chatRoom defined in index.js
        - otherwise it will prompt the error in the toast form
    */
    setLoading(true);

    await auth
      .signInWithPopup(googleProvider)
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
        setLoading(false);
      });
  }

  if (loading) return <Loading />;

  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-screen h-screen space-y-10 max-w-screen max-h-screen overflow-hidden">
        <h1 className="text-5xl font-medium font-poppins uppercase">
          Chat Room
        </h1>

        <button
          className="flex items-center w-9/12 sm:w-96 py-2 px-4 m-2 bg-gray-200 rounded-md  font-medium shadow-md lg:hover:bg-blue-500 lg:hover:text-white dark:text-black"
          onClick={signInWithGoogle}
        >
          <img src="https://cdn.iconscout.com/icon/free/png-256/google-152-189813.png" width={30} height={30} alt="" />
          <p className="text-center w-full">Login with Google</p>
        </button>

        {/* absolute thing */}
        <div className="w-56 h-56 md:w-96 md:h-96 rounded-tr-full rounded-br-full absolute bg-blue-400 -top-40 -left-10 blur-sm shadow-sm "></div>
        <div className="w-56 h-56 md:w-96 md:h-96 rounded-tl-full rounded-bl-full absolute bg-blue-400 -bottom-20 -right-10 blur-sm shadow-sm "></div>

        <ToastContainer theme="dark" />
      </div>
    </>
  );
};

export default Login;
