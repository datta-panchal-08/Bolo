import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;

    if (friendId === userId.toString()) {
      return res.status(400).json({ message: "Cannot add yourself as friend" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: "Friend user not found" });
    if (user.friends.includes(friendId)) return res.status(400).json({ message: "Already friends" });

    user.friends.push(friendId);
    await user.save();

    res.status(200).json({ success: true, message: "Friend added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Friend not found in your list" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    await user.save();

    const conversations = await Conversation.find({
      members: { $all: [userId, friendId] }
    });

    for (let conv of conversations) {
      await Message.deleteMany({ _id: { $in: conv.messages } });

      await Conversation.findByIdAndDelete(conv._id);
    }

    res.status(200).json({ success: true, message: "Friend removed and related conversations/messages deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "name email profileUrl");
    
    res.status(200).json({
      success: true,
      friends: user.friends || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const makeFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const allUsers = await User.find({ _id: { $ne: req.user._id } }).select("name email profileUrl");

    const nonFriends = allUsers.filter(u => !user.friends.includes(u._id.toString()));

    res.status(200).json({
      success: true,
      users: nonFriends,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};