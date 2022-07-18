import React from "react";
import Linkify from "react-linkify";
import { CheckIcon } from "@heroicons/react/solid";
import { Image } from "react-img-placeholder";

const Message = ({ user, data, showDetails }) => {
  /* 
    props 
      - user : it gives the user details
      - data : the data which we get from the firebase and it is single document 
      - showDetails : it means that do we need to show the message sender's details
  */

  // Checking the current logged in user is the sender of current message
  const isUserSender = user.uid === data.uid;

  const defaultImg = "https://rb.gy/eqezqj";
  const IMAGE_404 = "https://rb.gy/eyjcz3";

  return (
    <div className={`message ${isUserSender ? "sent" : "received"}`}>
      <div className="flex flex-col">
        {/*
         * We only want to show the receiver image
         * here we are checking if current message is not send by the logged in user then simply show the sender info
         * it will show the image and name of the sender of the current message
         */}

        {!isUserSender && showDetails && (
          <a
            href={`mailto:${data.email || ""}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center my-1 mt-2"
          >
            <img
              className="rounded-full w-7 h-7"
              width={20}
              height={20}
              src={data.photoURL ? data.photoURL : defaultImg}
              alt=""
            />
            <div className="font-medium text-gray-300 ml-2 text-sm">
              <p className="">{data.displayName}</p>
            </div>
          </a>
        )}

        {/* Message Container */}
        <section
          className={`text-sm bg-black w-full  max-w-xs text-white p-2 relative rounded-xl sm:max-w-lg flex flex-col shadow-md ${
            !isUserSender && !showDetails && " -mt-6"
          }`}
        >
          {/* If the user sended the image then show the image in the message */}
          {data.sendImage && (
            <a href={data.sendImage} target="_blank">
              <Image
                className="rounded-md max-h-full max-w-full mb-2 w-full"
                src={data.sendImage}
                alt="Picture of the author"
                width={400}
                height={300}
                placeholderColor="#333"
              />
            </a>
          )}
          <Linkify>
            <pre className="break-all msg font-poppins text-xs md:text-sm">
              {data.text}
            </pre>
          </Linkify>
          <div
            style={{ fontSize: "10px" }}
            className=" text-gray-300 flex justify-end items-center pt-0.5"
          >
            {data.createdAt ? (
              <p className="tracking-tighter font-mono">
                {new Date(data.createdAt?.toDate())
                  .toDateString()
                  .slice(4, 10) +
                  ", " +
                  new Date(data.createdAt?.toDate()).toTimeString().slice(0, 5)}
              </p>
            ) : (
              <div className="h-1.5 w-16 bg-white rounded-lg animate-pulse"></div>
            )}

            {isUserSender && (
              <div className="ml-1 text-white flex items-center">
                <CheckIcon className="w-4 h-4" />
                {data.createdAt && <CheckIcon className="w-4 h-4 -ml-3" />}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Message;
