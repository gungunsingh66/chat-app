import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    // Used for group chat
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    seen: {
        type: Boolean,
        default:false
    }
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema)

export default Message