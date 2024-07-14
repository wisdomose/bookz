import { Customer, ROLES } from "@/types";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export const customer: Customer = {
  userId: "user_12345",
  role: ROLES["USER"],
  displayName: "John Doe",
  email: "john.doe@example.com",
  phoneNo: "+1234567890",
  timestamp: serverTimestamp() as Timestamp,
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    country: "USA",
    houseNo: 12,
  },
};
