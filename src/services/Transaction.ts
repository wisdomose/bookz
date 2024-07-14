import {
  Book,
  CartItem,
  COLLECTION,
  Customer,
  Transaction,
  User,
} from "@/types";
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
import { v4 } from "uuid";

export type UploadResponse = {};
export type FildAllBooksResponse = Book[];

export default class TransactionService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.init = this.init.bind(this);
  }

  async init(params: Pick<Transaction, "amount">) {
    return new Promise<Omit<Transaction, "id">>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const transaction: Omit<Transaction, "id"> = {
          reference: v4(),
          ...params,
          status: "pending",
        };

        await addDoc(collection(this.db, COLLECTION.TRANSACTIONS), transaction);

        resolve(transaction);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
