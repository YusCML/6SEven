import fs from "fs";
import path from "path";

export type AuthUser = {
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

type AuthStoreFile = {
  users: AuthUser[];
};

const DATA_FILE = path.join(process.cwd(), "data", "auth-store.json");

function readStore(): AuthStoreFile {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as AuthStoreFile;

    if (!Array.isArray(parsed.users)) {
      return { users: [] };
    }

    return parsed;
  } catch {
    return { users: [] };
  }
}

function writeStore(store: AuthStoreFile) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function storeUser(user: AuthUser) {
  const store = readStore();
  writeStore({
    users: [...store.users, user],
  });
}

export function findUserByEmail(email: string) {
  const store = readStore();
  return (
    store.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export function hasUser(email: string) {
  return Boolean(findUserByEmail(email));
}
