import { Timestamp } from "firebase/firestore";
import { Book } from "./book";
import { Customer } from "./profile";

export type Order = {
  id: string;
  customer: Customer;
  book: Book;
  timestamp: Timestamp;
  totalQuantity: number;
  totalPrice: number;
};
