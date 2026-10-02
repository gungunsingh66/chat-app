import Group from "../models/Group.js";
import User from "../models/User.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !members || members.length === 0) {
      return res.json({
        success: false,
        message: "Group name and members are required",
      });
    }

    const adminId = req.user._id;

    const group = await Group.create({
      name,
      admin: adminId,
      members: [adminId, ...members],
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("members", "-password")
      .populate("admin", "-password");

    res.json({
      success: true,
      group: populatedGroup,
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({
      members: userId,
    })
      .populate("members", "-password")
      .populate("admin", "-password")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      groups,
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.json({
        success: false,
        message: "Group not found",
      });
    }

    if (group.admin.toString() !== req.user._id.toString()) {
      return res.json({
        success: false,
        message: "Only admin can add members",
      });
    }

    if (group.members.some((id) => id.toString() === userId)) {
      return res.json({
        success: false,
        message: "User already exists in group",
      });
    }

    group.members.push(userId);

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("members", "-password")
      .populate("admin", "-password");

    res.json({
      success: true,
      group: updatedGroup,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.json({
        success: false,
        message: "Group not found",
      });
    }

    if (group.admin.toString() !== req.user._id.toString()) {
      return res.json({
        success: false,
        message: "Only admin can remove members",
      });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );

    await group.save();

    res.json({
      success: true,
      message: "Member removed",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
