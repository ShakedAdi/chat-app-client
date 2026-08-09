export interface Errors {
  username?: string;
  password?: string;
  confirm?: string;
}

export const AuthAction = {
  SIGNUP: 'signup',
  SIGNIN: 'signin',
} as const;

export type AuthAction = (typeof AuthAction)[keyof typeof AuthAction];
