import React from "react";

import { CheckCircleIcon } from "@heroicons/react/solid";

const Message = ({ user, data }) => {
  const isUserSender = user.uid === data.uid;

  const defaultImg =
    "https://worldgovernmentmovement.org/wp-content/uploads/2021/05/profilepic.jpg";
  
  return (
    <div className={`message ${isUserSender ? "sent" : "received"}`}>
      <div className="flex flex-col">
        {!isUserSender && (
          <div className="flex items-center">
            <img
              className="rounded-full w-7 h-7"
              width={30}
              height={30}
              src={data.photoURL ? data.photoURL : defaultImg}
              alt=""
            />
            <div className="font-medium text-gray-500 ml-2">
              <p className="">{data.displayName}</p>
            </div>
          </div>
        )}

        {/* Message Container */}

        <section className="text-sm bg-blue-500 max-w-xs text-white p-2 relative rounded-xl sm:max-w-lg flex flex-col shadow-md">

          {
            data.sendImage && (

              <img className="rounded-md max-h-full max-w-full mb-2" src={data.sendImage} alt=""/>
            )
          }
          <p className="break-all">{data.text}</p>

          <div className="text-xs font-mono text-gray-300 flex justify-end items-center pt-0.5">
            <p className="">
              {new Date(data.createdAt?.toDate()).toTimeString().slice(0, 5)}
            </p>

            {isUserSender && (
              <p className="ml-1 text-white">
                <CheckCircleIcon className="w-4 h-4 " />
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Message;
