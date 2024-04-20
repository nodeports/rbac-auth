import { Request, Response } from "express";
import User from "../models/user";
import Role from "../models/role";
import generateToken from "../utils/generate-token";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const userRole = await Role.findOne({ name: role });

  if (!userRole) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.create({
    username,
    email,
    password,
    roles: [userRole._id],
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("roles");

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};
