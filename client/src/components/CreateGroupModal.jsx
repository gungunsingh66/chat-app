import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";
import toast from "react-hot-toast";

function CreateGroupModal({ onClose }) {

  const {
    users,
    getGroups,
  } = useContext(ChatContext);

  const { axios, authUser } = useContext(AuthContext);

  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);


  // =========================
  // SELECT / DESELECT MEMBER
  // =========================

  const handleMemberSelect = (userId) => {

    setSelectedMembers((prev) => {

      if (prev.includes(userId)) {

        return prev.filter(
          (id) => id !== userId
        );

      }

      return [...prev, userId];

    });

  };


  // =========================
  // CREATE GROUP
  // =========================

  const handleCreateGroup = async (e) => {

    e.preventDefault();

    if (!groupName.trim()) {

      toast.error("Enter group name");

      return;
    }

    if (selectedMembers.length === 0) {

      toast.error(
        "Select at least one member"
      );

      return;
    }

    try {

      setLoading(true);

      const { data } = await axios.post(
        "/api/groups/create",
        {
          name: groupName.trim(),
          members: selectedMembers,
        }
      );

      if (data.success) {

        toast.success("Group created successfully");

        // Refresh groups
        await getGroups();

        onClose();

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.log(
        "CREATE GROUP ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        error.message
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

      <div className="bg-[#282142] w-full max-w-md rounded-xl p-5 shadow-xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-lg font-semibold text-white">
            Create Group
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>

        </div>


        {/* =========================
            GROUP NAME
        ========================= */}

        <form onSubmit={handleCreateGroup}>

          <input
            type="text"
            value={groupName}
            onChange={(e) =>
              setGroupName(e.target.value)
            }
            placeholder="Enter group name"
            className="w-full bg-[#1f1a35] text-white text-sm px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-violet-500"
          />


          {/* =========================
              SELECT MEMBERS
          ========================= */}

          <div className="mt-5">

            <div className="flex justify-between items-center mb-2">

              <p className="text-sm text-gray-300">
                Select Members
              </p>

              <p className="text-xs text-gray-500">
                {selectedMembers.length} selected
              </p>

            </div>


            <div className="max-h-60 overflow-y-auto space-y-1">

              {users
                .filter(
                  (user) =>
                    user._id !== authUser?._id
                )
                .map((user) => {

                  const isSelected =
                    selectedMembers.includes(
                      user._id
                    );

                  return (

                    <div
                      key={user._id}
                      onClick={() =>
                        handleMemberSelect(
                          user._id
                        )
                      }
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                        isSelected
                          ? "bg-violet-500/20"
                          : "hover:bg-white/5"
                      }`}
                    >

                      {/* Checkbox */}

                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected
                            ? "bg-violet-500 border-violet-500"
                            : "border-gray-500"
                        }`}
                      >

                        {isSelected && (
                          <span className="text-white text-xs">
                            ✓
                          </span>
                        )}

                      </div>


                      {/* Profile */}

                      <img
                        src={
                          user.profilePic ||
                          assets.avatar_icon
                        }
                        alt=""
                        className="w-9 h-9 rounded-full object-cover"
                      />


                      {/* Name */}

                      <div className="flex flex-col">

                        <p className="text-sm text-white">
                          {user.fullName}
                        </p>

                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>

                      </div>

                    </div>

                  );

                })}

            </div>

          </div>


          {/* =========================
              BUTTONS
          ========================= */}

          <div className="flex gap-3 mt-6">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Group"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default CreateGroupModal;