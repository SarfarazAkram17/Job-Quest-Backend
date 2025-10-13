import { ObjectId } from "mongodb";
import connectDB from "../config/db.js";

const { reviews } = await connectDB();

export const getApprovedReviewPost = async (req, res) => {
  try {
    const approvedReviewPosts = await reviews
      .find({ status: "approved" })
      .toArray();

    res.status(200).send(approvedReviewPosts);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const getAllReviewPost = async (req, res) => {
  try {
    let { page = 0, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = page * limit;
    const total = await reviews.countDocuments({});
    const allReviewsPosts = await reviews
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).send({ total, allReviewsPosts });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const createReviewPost = async (req, res) => {
  try {
    const createReviewPost = await reviews.insertOne({
      ...req.body,
    });

    res.status(201).send({
      message:
        "Review created successfully. After admin approval it can be seen here.",
    });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const updateReviewPostStatus = async (req, res) => {
  try {
    await reviews.updateOne(
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

export const deleteReviewPost = async (req, res) => {
  try {
    await reviews.deleteOne({ _id: new ObjectId(req.params.id) });

    res.status(200).send({
      message: "Reviews Post deleted",
    });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};