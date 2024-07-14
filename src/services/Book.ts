import { Book, CartItem, COLLECTION, Customer, User } from "@/types";
import axios from "axios";
import { getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import UserService from "./User";

export type UploadResponse = {};
export type FildAllBooksResponse = Book[];

export default class BookService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.upload = this.upload.bind(this);
    // this.remove = this.remove.bind(this);
    // this.update = this.update.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
  }

  async upload({
    image,
    ...params
  }: Omit<Book, "id" | "coverImageUrl" | "timestamp"> & { image: File }) {
    return new Promise<UploadResponse>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const storageRef = ref(
          this.storage,
          `images/${params.title}.${image.type.split("/")[1]}`
        );
        const snapshot = await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);

        const book: Omit<Book, "id"> = {
          coverImageUrl: url,
          ...params,
          timestamp: serverTimestamp() as unknown as Timestamp,
        };

        await addDoc(collection(this.db, COLLECTION.BOOKS), book);

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findAll(max?: number) {
    return new Promise<FildAllBooksResponse>(async (resolve, reject) => {
      try {
        // if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const bookCol = collection(this.db, COLLECTION.BOOKS);
        let q = (max ?? 0) > 1 ? query(bookCol, limit(max!)) : query(bookCol);

        const querySnapshot = await getDocs(q);
        const books: Book[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          books.push({ id: doc.id, ...data } as Book);
        });

        resolve(books);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findOne(isbn: string) {
    return new Promise<Book>(async (resolve, reject) => {
      try {
        const q = query(
          collection(this.db, COLLECTION.BOOKS),
          where("ISBN", "==", isbn)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const book = {
            id: doc.id,
            ...doc.data(),
          };

          resolve(book as unknown as Book);
        }
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
