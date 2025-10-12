import jwt from "jsonwebtoken";
import connectDB from "../config/db.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const { users } = await connectDB();

export const signup = async (req, res) => {
  const { password, email, role } = req.body;

  const userExists = await users.findOne({ email });
  if (userExists) {
    return res.send({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createUser = await users.insertOne({
    ...req.body,
    password: hashedPassword,
  });

  const user = await users.findOne({
    _id: new ObjectId(createUser.insertedId),
  });

  const payload = { email, role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).send({ success: true, user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await users.findOne({ email });
  if (!user) {
    return res.send({ message: "Invalid credentials" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.send({ message: "Invalid credentials" });
  }

  const payload = { email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).send({ success: true, user });
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).send({ success: true });
};

export const check = async (req, res) => {
  const user = await users.findOne({ email: req.user.email });
  res.send({ success: true, user });
};

export const updatePassword = async (req, res) => {
  const user = await users.findOne({ email: req.user.email });
  const { currentPassword, newPassword } = req.body;

  const isCurrentPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordCorrect) {
    return res.send({ message: "Wrong Password" });
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  const passwordUpdate = await users.updateOne(
    { email: req.user.email },
    { $set: { password: newHashedPassword } }
  );

  res.status(200).send({ success: true });
};