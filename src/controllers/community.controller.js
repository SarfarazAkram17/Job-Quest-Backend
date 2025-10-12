import { ObjectId } from "mongodb";
import connectDB from "../config/db.js";

const { community } = await connectDB();

export const getApprovedCommunityPost = async (req, res) => {
  try {
    const approvedCommunityPosts = await community
      .find({ status: "approved" })
      .toArray();

    res.status(200).send(approvedCommunityPosts);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const getAllCommunityPost = async (req, res) => {
  try {
    let { page = 0, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = page * limit;
    const total = await community.countDocuments({});
    const allCommunityPosts = await community
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).send({ total, allCommunityPosts });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const createCommunityPost = async (req, res) => {
  try {
    const createCommunityPost = await community.insertOne({
      ...req.body,
      status: "pending",
      totalLikes: 0,
      totalLove: 0,
      totalHaha: 0,
      createdAt: new Date().toISOString(),
    });

    res.status(201).send({
      message:
        "Post created successfully. After admin approval it can be seen here.",
    });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const giveReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body;

    // Validate reaction type
    const validReactions = ["like", "love", "haha"];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).send({ message: "Invalid reaction type" });
    }

    // Map reaction type to field name
    const reactionFieldMap = {
      like: "totalLikes",
      love: "totalLove",
      haha: "totalHaha",
    };

    const fieldName = reactionFieldMap[reactionType];

    const query = { _id: new ObjectId(id) };

    // Use $inc to increment the field by 1 (creates field with value 1 if it doesn't exist)
    const updateDoc = {
      $inc: {
        [fieldName]: 1,
      },
    };

    const result = await community.updateOne(query, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Post not found" });
    }

    res.status(200).send({
      message: `${reactionType} reaction added successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const updateCommunityPostStatus = async (req, res) => {
  try {
    await community.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "approved" } }
    );

    res.status(200).send({
      message: "Status updated",
    });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const deleteCommunityPostStatus = async (req, res) => {
  try {
    await community.deleteOne({ _id: new ObjectId(req.params.id) });

    res.status(200).send({
      message: "Community Post deleted",
    });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};