import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils.js";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

function ChatContainer() {
  const {
    messages,
    selectedUser,
    setSelectedUser,

    selectedGroup,
    setSelectedGroup,

    sendMessage,
    sendGroupMessage,

    getMessages,
    getGroupMessages,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();

  const [input, setInput] = useState("");

  //Handle Sending the message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (input.trim() === "") return;

    if (selectedGroup) {
      await sendGroupMessage({
        text: input.trim(),
      });
    } else if (selectedUser) {
      await sendMessage({
        text: input.trim(),
      });
    }

    setInput("");
  };

  //Handle Sending the image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      if (selectedGroup) {
        await sendGroupMessage({
          image: reader.result,
        });
      } else if (selectedUser) {
        await sendMessage({
          image: reader.result,
        });
      }

      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    } else if (selectedGroup) {
      getGroupMessages(selectedGroup._id);
    }
  }, [selectedUser, selectedGroup]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser || selectedGroup ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}

      <div className="flex items-center gap-3 py-3 mx-4 border-stone-500">
        <img
          src={
            selectedGroup
              ? selectedGroup.groupPic || assets.avatar_icon
              : selectedUser?.profilePic || assets.avatar_icon
          }
          alt=""
          className="w-8 h-8 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <p className="text-white">
            {selectedGroup ? selectedGroup.name : selectedUser?.fullName}
          </p>

          {selectedGroup ? (
            <span className="text-xs text-gray-400">
              {selectedGroup.members?.length || 0} members
            </span>
          ) : (
            selectedUser &&
            onlineUsers.includes(selectedUser._id) && (
              <span className="text-xs text-green-400">Online</span>
            )
          )}
        </div>

        <img
          onClick={() => {
            setSelectedUser(null);
            setSelectedGroup(null);
          }}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 ml-auto"
        />

        <img
          src={assets.help_icon}
          alt=""
          className="max-md:hidden max-w-5 ml-auto"
        />
      </div>
      {/* chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => {
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

          const isMine = String(senderId) === String(authUser?._id);

          const senderName =
            typeof msg.senderId === "object"
              ? msg.senderId.fullName
              : selectedUser?.fullName;

          const senderProfilePic =
            typeof msg.senderId === "object"
              ? msg.senderId.profilePic
              : isMine
                ? authUser?.profilePic
                : selectedUser?.profilePic;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 justify-end ${
                !isMine ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex flex-col ${
                  isMine ? "items-end" : "items-start"
                }`}
              >
                {/* Sender name - only for groups */}

                {selectedGroup && !isMine && (
                  <p className="text-xs text-violet-400 mb-1 ml-1">
                    {senderName}
                  </p>
                )}

                {/* Message */}

                {msg.image ? (
                  <img
                    src={msg.image}
                    alt=""
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                  />
                ) : (
                  <p
                    className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${
                      isMine ? "rounded-br-none" : "rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
              </div>

              {/* Profile + time */}

              <div className="text-center text-xs">
                <img
                  src={senderProfilePic || assets.avatar_icon}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />

                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder:gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
}

export default ChatContainer;
