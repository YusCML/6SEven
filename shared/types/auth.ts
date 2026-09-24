export type Credentials = {
  username: string;
  password: string;
};

export type RegisterInput = Credentials & {
  confirmPassword: string;
};

export type ProfileUpdate = {
  username?: string;
  nickname?: string;
};

export type MessageResponse = {
  message: string;
};

export type ApiErrorBody = {
  error: string;
};
