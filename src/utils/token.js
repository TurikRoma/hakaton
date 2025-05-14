import jwt from "jsonwebtoken";
import { JWT_SECRET, prisma } from "../config/env.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

export const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, JWT_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, JWT_SECRET, { expiresIn: "30d" });
};

export const hashRefreshToken = async (refresh_token, userId) => {
  const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: hashedRefreshToken },
  });
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });
  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_SECRET);
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });

  if (!user || !user.refreshToken) {
    return res
      .status(403)
      .json({ message: "User not found or refresh token missing" });
  }

  const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

  if (!isMatch) {
    return res.status(403).json({ message: "Refresh token does not match" });
  }

  const newAccessToken = generateAccessToken(payload.id);

  const newRefreshToken = generateRefreshToken(payload.id);

  await hashRefreshToken(newRefreshToken, payload.id);

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};
