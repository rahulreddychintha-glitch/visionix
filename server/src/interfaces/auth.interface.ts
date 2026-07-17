/** Payload embedded in the JWT — always minimal (userId, email, role only) */
export interface ITokenPayload {
  sub: string;   // User's MongoDB ObjectId as string
  email: string;
  role: string;
  iat?: number;  // Issued at (set by jsonwebtoken)
  exp?: number;  // Expires at (set by jsonwebtoken)
}

/** Input shape for registration */
export interface IRegisterInput {
  fullName: string;
  email: string;
  password: string;
}

/** Input shape for login */
export interface ILoginInput {
  email: string;
  password: string;
}

/** Shape of the user object returned in API responses (never includes password) */
export interface IUserPublic {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: Date;
}

/** Shape returned by register and login endpoints */
export interface IAuthResponse {
  user: IUserPublic;
  token: string;
}
