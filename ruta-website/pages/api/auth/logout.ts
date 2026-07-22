import type { NextApiRequest, NextApiResponse } from "next";

import { clearSessionCookie } from "@/lib/auth/session";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Set-Cookie", clearSessionCookie());
  res.writeHead(302, { Location: "/auth/login" });
  res.end();
}
