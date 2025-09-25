import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, message } = req.body;

    if (!conversationId || !receiverId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message,
    });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    conversation.messages.push(newMessage._id);
    await conversation.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      _id: { $in: (await Conversation.findById(conversationId)).messages },
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name profileUrl")
      .populate("receiver", "name profileUrl");

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
