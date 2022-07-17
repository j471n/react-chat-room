// import React from "react";
import ReactDOM from "react-dom";
import { XIcon } from "@heroicons/react/solid";
import Loading from "./Loading/Loading";

export default function PreviewImage({ src, cancel, progress }) {
  return ReactDOM.createPortal(
    <div className="fixed w-full top-16 bottom-10 bg-gray-800">
      <div className="relative w-full h-full grid place-items-center p-4">
        <div
          className="absolute right-5 top-5 flex bg-gray-200 rounded-lg p-1 sm:p-1 space-x-1 cursor-pointer hover:opacity-70 z-10"
          onClick={cancel}
        >
          <XIcon className="w-5 sm:w-7 text-black" />
        </div>
        <div
          className="relative w-full max-w-4xl overflow-y-scroll"
          style={{ maxHeight: "30rem"}}
        >
          <img className="rounded-md w-full h-full" src={src} alt="" />
        </div>
        {progress !== null && <Loading />}
      </div>
    </div>,
    document.getElementById("modal")
  );
}
