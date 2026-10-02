import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import CreateGroupModal from "./CreateGroupModal";

function Sidebar() {
  const {
    getUsers,
    users,

    selectedUser,
    setSelectedUser,

    unseenMessages,
    setUnseenMessages,

    // GROUPS
    groups,
    getGroups,
    selectedGroup,
    setSelectedGroup,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const navigate = useNavigate();

  // Search users
  const filteredUser = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()),
      )
    : users;

  // Get users and groups
  useEffect(() => {
    getUsers();
    getGroups();
  }, []);

  // Select private user
  const handleSelectUser = (user) => {
    setSelectedUser(user);

    // Important: deselect group
    setSelectedGroup(null);

    // Remove unseen count
    setUnseenMessages((prev) => ({
      ...prev,
      [user._id]: 0,
    }));
  };

  // Select group
  const handleSelectGroup = (group) => {
    // Important: deselect user
    setSelectedUser(null);

    setSelectedGroup(group);
  };

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser || selectedGroup ? "max-md:hidden" : ""
      }`}
    >
      {/* ================= HEADER ================= */}

      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />

            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>

              <hr className="my-2 border-t border-gray-500" />

              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* ================= USERS ================= */}

      <div className="flex flex-col">
        {/* USERS HEADING */}

        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 uppercase">Chats</p>
        </div>

        {filteredUser.map((user) => (
          <div
            onClick={() => handleSelectUser(user)}
            key={user._id}
            className={`relative flex items-center gap-2 p-2 pl-1 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />

            <div className="flex flex-col leading-tight">
              <p>{user.fullName}</p>

              {onlineUsers.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>

            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}

        {/* ================= GROUPS ================= */}

        <div className="flex items-center justify-between mt-6 mb-2">
          <p className="text-xs text-gray-400 uppercase">Groups</p>

          <button
            onClick={() => setShowCreateGroup(true)}
            className="text-violet-400 hover:text-violet-300 text-xs"
          >
            + Create
          </button>
        </div>

        {groups.map((group) => (
          <div
            onClick={() => handleSelectGroup(group)}
            key={group._id}
            className={`flex items-center gap-2 p-2 pl-1 rounded cursor-pointer max-sm:text-sm ${
              selectedGroup?._id === group._id ? "bg-[#282142]/50" : ""
            }`}
          >
            {/* Group image */}

            <img
              src={group.groupPic || assets.avatar_icon}
              alt=""
              className="w-[35px] h-[35px] rounded-full object-cover"
            />

            {/* Group information */}

            <div className="flex flex-col leading-tight">
              <p>{group.name}</p>

              <span className="text-neutral-400 text-xs">
                {group.members?.length || 0} members
              </span>
            </div>
          </div>
        ))}

        {/* No groups */}

        {groups.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-3">
            No groups yet
          </p>
        )}
      </div>

      {/* ================= CREATE GROUP MODAL ================= */}

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
      )}
    </div>
  );
}

export default Sidebar;
