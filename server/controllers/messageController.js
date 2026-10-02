import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";
import Group from "../models/Group.js";

//get all user except the logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );

    //count number of messages not seen
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get all message for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true },
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to mark all messages from a user as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.updateMany(
      {
        senderId: id,
        receiverId: req.user._id,
        seen: false,
      },
      {
        $set: { seen: true },
      },
    );

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

//send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    //Emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    const { groupId } = req.params;

    const senderId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.toString() === senderId.toString()
    );

    if (!isMember) {
      return res.json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    let imageUrl;

    if (image) {
      const uploadResponse =
        await cloudinary.uploader.upload(image);

      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      groupId,
      text,
      image: imageUrl,
    });

    const populatedMessage = await Message.findById(
      newMessage._id
    ).populate("senderId", "-password");

    // Send to everyone in group
    io.to(`group:${groupId}`).emit(
      "newGroupMessage",
      populatedMessage
    );

    res.json({
      success: true,
      newMessage: populatedMessage,
    });

  } catch (error) {

    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupMessages = async (req, res) => {
  try {

    const { groupId } = req.params;

    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.toString() === userId.toString()
    );

    if (!isMember) {
      return res.json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    const messages = await Message.find({
      groupId,
    })
      .populate("senderId", "-password")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};
