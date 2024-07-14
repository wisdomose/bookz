import { Timestamp } from "firebase/firestore";

export type Book = {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  genre: string;
  pages: number;
  ISBN: string;
  price: number;
  publisher: string;
  language: string;
  description: string;
  coverImageUrl: string;
  stockQuantity: number;
  timestamp: Timestamp;
};
