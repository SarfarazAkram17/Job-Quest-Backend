import { ObjectId } from "mongodb";
import connectDB from "../config/db.js";

const { users } = await connectDB();

export const getAllUsers = async (req, res) => {
  try {
    let {
      page = 0,
      limit = 10,
      search = "",
      searchType = "name",
      role = "",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (search) {
      const regex = new RegExp(search, "i");
      if (searchType === "email") {
        query.email = regex;
      } else {
        query.name = regex;
      }
    }

    if (role) {
      query.role = role;
    }

    const skip = page * limit;
    const total = await users.countDocuments(query);
    const allUsers = await users.find(query).skip(skip).limit(limit).toArray();

    res.send({ allUsers, total });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const getCandidate = async (req, res) => {
  try {
    const query = { email: req.user.email };
    const me = await users.findOne(query);

    res.send(me);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const updateCandidateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      bio,
      socialLinks,
      profileImage,
      education,
      experience,
      skills,
    } = req.body;
    const { email } = req.user;

    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required." });
    }

    const query = { email };
    const updateDoc = { $set: {} };

    // Update all fields if provided (using $set to replace)
    if (name !== undefined) updateDoc.$set.name = name;
    if (phone !== undefined) updateDoc.$set.phone = phone;
    if (address !== undefined) updateDoc.$set.address = address;
    if (bio !== undefined) updateDoc.$set.bio = bio;
    if (socialLinks !== undefined) updateDoc.$set.socialLinks = socialLinks;
    if (profileImage !== undefined) updateDoc.$set.profileImage = profileImage;

    // Replace entire arrays (this prevents duplicates)
    if (education !== undefined) updateDoc.$set.education = education;
    if (experience !== undefined) updateDoc.$set.experience = experience;
    if (skills !== undefined) updateDoc.$set.skills = skills;

    // Remove $set if empty
    if (Object.keys(updateDoc.$set).length === 0) {
      return res.status(400).send({
        success: false,
        message: "No data provided to update.",
      });
    }

    const result = await users.updateOne(query, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Fetch updated candidate data to return
    const updatedCandidate = await users.findOne(query);

    res.send({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleteUser = await users.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// export interface Candidate {
//   name: string;
//   phone?: string;
//   profileImage?: string;
//   address?: string;
//   bio?: string;
//   socialLinks?: SocialLinks;
//   education: Education[];
//   experience: Experience[];
//   skills: string[];
//   savedJobs: string[];
// }

// export interface Education {
//   _id?: string;
//   institution: string;
//   degree: string;
//   fieldOfStudy?: string;
//   startDate: string;
//   endDate: string;
// }

// export interface Experience {
//   _id?: string;
//   company: string;
//   position: string;
//   startDate: string;
//   endDate?: string;
//   isCurrentlyWorking?: boolean;
//   responsibilities?: string;
// }