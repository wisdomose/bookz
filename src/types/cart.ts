import { Book } from "./book";
import { Customer } from "./profile";

export type CartItem = {
  id: string;
  book: Book;
  qty: number;
  owner: Customer;
};

export type AddToCart = Pick<CartItem, "book" | "qty"> &
  Partial<Pick<CartItem, "owner" | "id">>;
