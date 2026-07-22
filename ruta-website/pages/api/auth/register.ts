import type { NextApiRequest, NextApiResponse } from "next";

import { hasUser, storeUser } from "@/lib/auth-store";
import { hashPassword } from "@/lib/auth/password";
import { createSessionCookie } from "@/lib/auth/session";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { name, email, password } = (req.body ?? {}) as RegisterPayload;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please complete all required fields.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long.",
    });
  }

  if (hasUser(email)) {
    return res.status(409).json({
      message: "An account with this email already exists.",
    });
  }

  const { passwordHash, passwordSalt } = hashPassword(password);

  storeUser({
    name,
    email: email.toLowerCase(),
    passwordHash,
    passwordSalt,
    createdAt: new Date().toISOString(),
  });

  res.setHeader("Set-Cookie", createSessionCookie({ name, email: email.toLowerCase() }));

  return res.status(201).json({
    message: "Account created successfully.",
    user: {
      name,
      email: email.toLowerCase(),
    },
  });
}
