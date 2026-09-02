/**
 * Application roles resolved from the Clerk user profile
 * (`publicMetadata.role`). Mirrors the role-based guard design
 * of the reference architecture without its custom auth layer.
 */
export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type TRole = (typeof Role)[keyof typeof Role];

export const ROLE_VALUES: readonly string[] = Object.values(Role);
