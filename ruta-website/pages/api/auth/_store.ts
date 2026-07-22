export type AuthUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

type ResetRequest = {
  email: string;
  token: string;
  createdAt: string;
};

type AuthStore = {
  users: AuthUser[];
  resetRequests: ResetRequest[];
};

declare global {
  var __rutaAuthStore: AuthStore | undefined;
}

function getStore(): AuthStore {
  if (!globalThis.__rutaAuthStore) {
    globalThis.__rutaAuthStore = {
      users: [],
      resetRequests: [],
    };
  }

  return globalThis.__rutaAuthStore;
}

export function findUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return getStore().users.find((user) => user.email === normalizedEmail);
}

export function createUser(input: { name: string; email: string; password: string }) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const store = getStore();

  if (store.users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with that email already exists.');
  }

  const user: AuthUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  return user;
}

export function validateCredentials(email: string, password: string) {
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  return user;
}

export function createResetRequest(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const request = {
    email: normalizedEmail,
    token: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  getStore().resetRequests.push(request);
  return request;
}

export function listSafeUsers() {
  return getStore().users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }));
}