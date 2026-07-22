import type { NextApiRequest, NextApiResponse } from "next";

import { findUserByEmail } from "@/lib/auth-store";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionCookie } from "@/lib/auth/session";

type LoginPayload = {
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

  const { email, password } = (req.body ?? {}) as LoginPayload;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide both email and password.",
    });
  }

  const user = findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  res.setHeader("Set-Cookie", createSessionCookie({ name: user.name, email: user.email }));

  return res.status(200).json({
    message: "Login successful.",
    user: {
      name: user.name,
      email: user.email,
    },
  });
}
