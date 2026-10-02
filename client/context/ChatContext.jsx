import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // function to get all users for sidebar

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      console.log("GET USERS RESPONSE:", data);

      if (data.success) {
        console.log("USERS:", data.users);

        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("GET USERS ERROR:", error);
      toast.error(error.message);
    }
  };

  // funtion to get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);

      if (data.success) {
        setMessages(data.messages);

        // Mark messages from this user as seen
        await axios.put(`/api/messages/mark/${userId}`);

        // Remove unseen count from sidebar
        setUnseenMessages((prev) => ({
          ...prev,
          [userId]: 0,
        }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to send message to selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getGroups = async () => {
    try {
      const { data } = await axios.get("/api/groups");

      if (data.success) {
        setGroups(data.groups);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getGroupMessages = async (groupId) => {
    try {
      const { data } = await axios.get(`/api/messages/group/${groupId}`);

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendGroupMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/group/send/${selectedGroup._id}`,
        messageData,
      );

      if (data.success) {
        // Don't add here if socket will also deliver it
        // Otherwise you'll see duplicate messages.
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Subscribe to private messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        axios.put(`/api/messages/mark/${newMessage.senderId}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  // Subscribe to group messages
  useEffect(() => {
    if (!socket) return;

    const handleNewGroupMessage = (newMessage) => {
      if (selectedGroup && newMessage.groupId === selectedGroup._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on("newGroupMessage", handleNewGroupMessage);

    return () => {
      socket.off("newGroupMessage", handleNewGroupMessage);
    };
  }, [socket, selectedGroup]);

  // Join selected group
  useEffect(() => {
    if (!socket || !selectedGroup) return;

    socket.emit("joinGroup", selectedGroup._id);

    return () => {
      socket.emit("leaveGroup", selectedGroup._id);
    };
  }, [socket, selectedGroup]);

  const value = {
    messages,

    users,
    selectedUser,

    groups,
    selectedGroup,

    unseenMessages,

    getUsers,
    getMessages,

    getGroups,
    getGroupMessages,

    sendMessage,
    sendGroupMessage,

    setMessages,

    setSelectedUser,
    setSelectedGroup,

    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
