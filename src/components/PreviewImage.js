// import React from "react";
import ReactDOM from "react-dom";
import { XCircleIcon } from "@heroicons/react/solid";
import Loading from "./Loading/Loading"

export default function PreviewImage({ src, cancel, progress }) {
  return ReactDOM.createPortal(
    <div className="absolute w-full top-16 bottom-10 bg-gray-800">
      <div className="relative w-full h-full grid place-items-center p-4">
        <div className="absolute top-0 p-3 sm:p-2 flex items-center justify-between w-full bg-black">
          <p className="text-white sm:text-xl font-medium">Preview</p>
          <div
            className="flex bg-gray-200 rounded-lg p-1 sm:p-1 space-x-1 cursor-pointer hover:opacity-70"
            onClick={cancel}
          >
            <XCircleIcon className="w-5 sm:w-7 text-red-500" />
            <p className="hidden sm:inline-flex font-medium pr-1">Cancel</p>
          </div>
        </div>
        <div className="grid place-items-center">
          <img className="rounded-md" src={src} height={100} alt="" />
        </div>

        {progress !== null && <Loading />}
      </div>
    </div>,
    document.getElementById("modal")
  );
}
