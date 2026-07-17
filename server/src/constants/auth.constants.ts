/** bcrypt cost factor — 12 rounds is the recommended production value */
export const BCRYPT_SALT_ROUNDS = 12;

/** User role definitions */
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
