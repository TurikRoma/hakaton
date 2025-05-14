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
  const accessToken = generateAccessToken(user.id, "USER");
  const refreshToken = generateRefreshToken(user.id, "USER");

  await hashRefreshToken(refreshToken, user.id);

  res.json({ user, accessToken, refreshToken });
};

export const registerAdmin = async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(400).json({ message: "Admin already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { fullName, email, passwordHash, role: "ADMIN" },
  });
  const accessToken = generateAccessToken(user.id, "ADMIN");
  const refreshToken = generateRefreshToken(user.id, "ADMIN");

  await hashRefreshToken(refreshToken, user.id);

  res.json({ user, accessToken, refreshToken });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  await hashRefreshToken(refreshToken, user.id);

  res.json({ user, accessToken, refreshToken });
};
