import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, prisma } from "../config/env.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../utils/token.js";

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { fullName, email, passwordHash },
  });
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await hashRefreshToken(refreshToken, user.id);

  res.json({ user, accessToken, refreshToken });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await hashRefreshToken(refreshToken, user.id);

  res.json({ user, accessToken, refreshToken });
};

export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, fullName: true, email: true, createdAt: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};
