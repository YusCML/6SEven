export type AuthUser = {
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

const authUsers = new Map<string, AuthUser>();

export function storeUser(user: AuthUser) {
  authUsers.set(user.email.toLowerCase(), user);
}

export function findUserByEmail(email: string) {
  return authUsers.get(email.toLowerCase()) ?? null;
}

export function hasUser(email: string) {
  return authUsers.has(email.toLowerCase());
}
