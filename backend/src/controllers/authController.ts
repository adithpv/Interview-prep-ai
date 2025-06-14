import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { catchAsync } from "../utils/catchAsync";
import { User } from "../models/userModel";
import { generateToken } from "../utils/generateToken";
import {
  assertAuth,
  assertNotFound,
  assertConflict,
  assertFieldsExist,
} from "../utils/appAssert";
import { HttpStatus } from "../utils/httpStatus";
import { AuthenticatedRequest } from "../types";

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name, profileImageUrl } = req.body;

  assertFieldsExist({ email, password, name });

  const userExist = await User.findOne({ email });
  assertConflict(!userExist, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profileImageUrl,
  });

  return res.status(201).json({
    message: "User registered successfully",
    id: user._id,
    email: user.email,
    name: user.name,
    profileImageUrl,
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  assertFieldsExist({ email, password });

  const user = await User.findOne({ email });
  assertAuth(!!user, "Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user!.password);
  assertAuth(isPasswordValid, "Invalid credentials");

  const token = generateToken(user!._id.toString());

  return res.status(200).json({
    message: "Login successful",
    id: user!._id,
    email: user!.email,
    name: user!.name,
    profileImageUrl: user!.profileImageUrl,
    token,
  });
});

export const getUserProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.params.id || req.user?._id;
    assertFieldsExist({ userId });

    const user = await User.findById(userId).select("-password");
    assertNotFound(!!user, "User");

    return res.status(200).json({
      message: "User profile fetched",
      user,
    });
  }
);

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  const { file } = req;
  assertFieldsExist({ file });

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file?.filename}`;
  res.status(HttpStatus.OK).json({ imageUrl });
});
