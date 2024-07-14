import { Timestamp } from "firebase/firestore";

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type Address = {
  country: string;
  state: string;
  city: string;
  street: string;
  houseNo: string;
};

export type Admin = {
  userId: string;
  role: ROLES;
  email: any;
  displayName: any;
  timestamp: Timestamp;
};

export type Customer = {
  userId: string;
  role: ROLES;
  displayName: string;
  email: string;
  phoneNo: string;
  timestamp: Timestamp;
  address?: Address;
};

export type User = Admin | Customer;
