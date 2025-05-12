import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const generateKey = async () => {
  const rawKey = uuidv4();
  const hashedKey = await bcrypt.hash(rawKey, 10);
  return hashedKey;
};
