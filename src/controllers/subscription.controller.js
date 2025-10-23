import connectDB from "../config/db.js";
import { ObjectId } from "mongodb";

const { subscriptions } = await connectDB();

// Get all subscriptions
export const getAllSubscriptions = async (req, res) => {
  try {
    const allSubscriptions = await subscriptions.find({}).toArray();

    return res.status(200).json({
      success: true,
      message: "Subscriptions fetched successfully",
      data: allSubscriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscriptions",
      error: error.message,
    });
  }
};

// Add new subscription
export const addSubscription = async (req, res) => {
  try {
    const {
      planName,
      planCycle,
      price,
      jobPostLimit,
      featuredJobsLimit,
      applicantViewLimit,
      features,
      popular,
    } = req.body;

    // Validation
    if (
      !planName ||
      !planCycle ||
      price === undefined ||
      jobPostLimit === undefined ||
      !features
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate planCycle
    const validCycles = ["monthly", "yearly", "lifetime"];
    if (!validCycles.includes(planCycle)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan cycle. Must be monthly, yearly, or lifetime",
      });
    }

    // Validate features array
    if (!Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array",
      });
    }

    // Validate numeric fields
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    if (isNaN(jobPostLimit) || jobPostLimit < 0) {
      return res.status(400).json({
        success: false,
        message: "Job post limit must be a valid non-negative number",
      });
    }

    // Trim all feature strings and filter empty ones
    const trimmedFeatures = features
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "");

    // Create subscription object
    const newSubscription = {
      planName: planName.trim(),
      planCycle,
      price: parseFloat(price),
      jobPostLimit: parseInt(jobPostLimit),
      featuredJobsLimit: featuredJobsLimit ? parseInt(featuredJobsLimit) : 0,
      applicantViewLimit: applicantViewLimit ? parseInt(applicantViewLimit) : 0,
      features: trimmedFeatures,
      popular: Boolean(popular),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await subscriptions.insertOne(newSubscription);

    // Fetch the created subscription
    const createdSubscription = await subscriptions.findOne({
      _id: result.insertedId,
    });

    return res.status(201).json({
      success: true,
      message: "Subscription plan created successfully",
      data: createdSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create subscription plan",
      error: error.message,
    });
  }
};

// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      planName,
      planCycle,
      price,
      jobPostLimit,
      featuredJobsLimit,
      applicantViewLimit,
      features,
      popular,
    } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription ID",
      });
    }

    // Check if subscription exists
    const existingSubscription = await subscriptions.findOne({
      _id: new ObjectId(id),
    });

    if (!existingSubscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    // Validation
    if (
      !planName ||
      !planCycle ||
      price === undefined ||
      jobPostLimit === undefined ||
      !features
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate planCycle
    const validCycles = ["monthly", "yearly", "lifetime"];
    if (!validCycles.includes(planCycle)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan cycle. Must be monthly, yearly, or lifetime",
      });
    }

    // Validate features array
    if (!Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array",
      });
    }

    // Validate numeric fields
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    if (isNaN(jobPostLimit) || jobPostLimit < 0) {
      return res.status(400).json({
        success: false,
        message: "Job post limit must be a valid non-negative number",
      });
    }

    // Trim all feature strings and filter empty ones
    const trimmedFeatures = features
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "");

    // Update subscription object
    const updateData = {
      planName: planName.trim(),
      planCycle,
      price: parseFloat(price),
      jobPostLimit: parseInt(jobPostLimit),
      featuredJobsLimit: featuredJobsLimit ? parseInt(featuredJobsLimit) : 0,
      applicantViewLimit: applicantViewLimit ? parseInt(applicantViewLimit) : 0,
      features: trimmedFeatures,
      popular: Boolean(popular),
      updatedAt: new Date(),
    };

    // Update in database
    const updateResult = await subscriptions.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch the updated subscription
    const updatedSubscription = await subscriptions.findOne({
      _id: new ObjectId(id),
    });

    return res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
      data: updatedSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update subscription plan",
      error: error.message,
    });
  }
};

// Delete subscription
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription ID",
      });
    }

    // Check if subscription exists
    const existingSubscription = await subscriptions.findOne({
      _id: new ObjectId(id),
    });

    if (!existingSubscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    // Delete from database
    const deleteResult = await subscriptions.deleteOne({ 
      _id: new ObjectId(id) 
    });

    return res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully",
      data: existingSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete subscription plan",
      error: error.message,
    });
  }
};