import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isSameId = (a, b) => a?.toString() === b?.toString();

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const search = req.query.search?.trim();

    const user = await User.findById(loggedInUserId).populate({
      path: "contacts",
      select: "fullName email profilePic",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let contacts = user.contacts || [];

    if (search) {
      const lowerSearch = search.toLowerCase();
      contacts = contacts.filter((contact) =>
        contact.fullName.toLowerCase().includes(lowerSearch) ||
        (contact.email && contact.email.toLowerCase().includes(lowerSearch))
      );
    }

    res.status(200).json(contacts);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getContactRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("incomingContactRequests", "fullName profilePic email")
      .populate("outgoingContactRequests", "fullName profilePic email");

    res.status(200).json({
      incoming: user.incomingContactRequests,
      outgoing: user.outgoingContactRequests,
    });
  } catch (error) {
    console.error("Error in getContactRequests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const user = await User.findById(id).select(
      "fullName profilePic email contacts incomingContactRequests outgoingContactRequests"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    const isSelf = isSameId(user._id, currentUserId);
    const isContact = user.contacts.some((contactId) => isSameId(contactId, currentUserId));
    const hasOutgoingRequest = user.incomingContactRequests.some((requesterId) => isSameId(requesterId, currentUserId));
    const hasIncomingRequest = user.outgoingContactRequests.some((receiverId) => isSameId(receiverId, currentUserId));

    let requestStatus = "none";
    if (hasIncomingRequest) requestStatus = "incoming";
    else if (hasOutgoingRequest) requestStatus = "outgoing";

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      profilePic: user.profilePic,
      email: user.email,
      isSelf,
      isContact,
      requestStatus,
    });
  } catch (error) {
    console.error("Error in getUserPublicProfile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendContactRequest = async (req, res) => {
  try {
    const { id: targetUserId } = req.params;
    const senderId = req.user._id;

    if (isSameId(senderId, targetUserId)) {
      return res.status(400).json({ message: "You cannot send a contact request to yourself." });
    }

    const [sender, targetUser] = await Promise.all([
      User.findById(senderId),
      User.findById(targetUserId),
    ]);

    if (!targetUser) return res.status(404).json({ message: "User not found." });

    if (
      sender.contacts.some((contactId) => isSameId(contactId, targetUserId)) ||
      targetUser.contacts.some((contactId) => isSameId(contactId, senderId))
    ) {
      return res.status(400).json({ message: "You are already connected." });
    }

    if (sender.outgoingContactRequests.some((contactId) => isSameId(contactId, targetUserId))) {
      return res.status(400).json({ message: "Contact request already sent." });
    }

    if (sender.incomingContactRequests.some((contactId) => isSameId(contactId, targetUserId))) {
      return res.status(400).json({ message: "This user already sent you a request. Accept it instead." });
    }

    sender.outgoingContactRequests.push(targetUserId);
    targetUser.incomingContactRequests.push(senderId);

    await Promise.all([sender.save(), targetUser.save()]);

    res.status(200).json({ message: "Contact request sent." });
  } catch (error) {
    console.error("Error in sendContactRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptContactRequest = async (req, res) => {
  try {
    const { id: requestUserId } = req.params;
    const userId = req.user._id;

    const [user, requester] = await Promise.all([
      User.findById(userId),
      User.findById(requestUserId),
    ]);

    if (!requester) return res.status(404).json({ message: "Requesting user not found." });

    if (!user.incomingContactRequests.some((id) => isSameId(id, requestUserId))) {
      return res.status(400).json({ message: "No incoming request from this user." });
    }

    user.incomingContactRequests = user.incomingContactRequests.filter((id) => !isSameId(id, requestUserId));
    requester.outgoingContactRequests = requester.outgoingContactRequests.filter((id) => !isSameId(id, userId));

    if (!user.contacts.some((contactId) => isSameId(contactId, requestUserId))) {
      user.contacts.push(requestUserId);
    }
    if (!requester.contacts.some((contactId) => isSameId(contactId, userId))) {
      requester.contacts.push(userId);
    }

    await Promise.all([user.save(), requester.save()]);

    res.status(200).json({ message: "Contact request accepted." });
  } catch (error) {
    console.error("Error in acceptContactRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const declineContactRequest = async (req, res) => {
  try {
    const { id: requestUserId } = req.params;
    const userId = req.user._id;

    const [user, requester] = await Promise.all([
      User.findById(userId),
      User.findById(requestUserId),
    ]);

    if (!user) return res.status(404).json({ message: "User not found." });
    if (!requester) return res.status(404).json({ message: "Requesting user not found." });

    user.incomingContactRequests = user.incomingContactRequests.filter((id) => !isSameId(id, requestUserId));
    requester.outgoingContactRequests = requester.outgoingContactRequests.filter((id) => !isSameId(id, userId));

    await Promise.all([user.save(), requester.save()]);

    res.status(200).json({ message: "Contact request declined." });
  } catch (error) {
    console.error("Error in declineContactRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const user = await User.findById(myId);
    if (!user.contacts.some((contactId) => isSameId(contactId, userToChatId))) {
      return res.status(403).json({ message: "You can only view messages with accepted contacts." });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }

    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    if (!sender.contacts.some((contactId) => isSameId(contactId, receiverId))) {
      return res.status(403).json({ message: "You can only send messages to accepted contacts." });
    }

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};