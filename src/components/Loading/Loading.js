// import React from "react";
import ReactDOM from "react-dom";

export default function Loading() {
  return ReactDOM.createPortal(
    <div className="absolute grid place-items-center inset-0 bg-white dark:bg-gray-700 z-100">
      <img src="img/loading.svg" alt="" />
    </div>,
    document.getElementById("modal")
  );
}
