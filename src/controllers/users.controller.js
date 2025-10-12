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

// export const updateProfile = async (req, res) => {
//   try {
//     const { name, photo } = req.body;
//     const { email } = req.query;

//     if (!email) {
//       return res
//         .status(400)
//         .send({ success: false, message: "Email is required." });
//     }

//     const query = { email };
//     const updateDoc = { $set: { name, photo } };

//     const result = await users.updateOne(query, updateDoc);
//     res.send(result);
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// };

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