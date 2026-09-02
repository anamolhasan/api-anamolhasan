import { TRole } from "../constants/roles.js";

export interface IRequestUser {
  userId: string;
  role: TRole;
}
