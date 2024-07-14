import { CartItem, COLLECTION, Customer, User } from "@/types";
import axios from "axios";
import { getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  WriteBatch,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import UserService from "./User";

export type AddToCartResponse = {};

export default class CartService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);
    this.findAll = this.findAll.bind(this);
    this.removeAll = this.removeAll.bind(this);
  }

  async findAll() {
    return new Promise<CartItem[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userService = new UserService();
        const profile = await userService.profile();

        // default is fetching as student
        let q = query(collection(this.db, COLLECTION.CART));
        const cartCol = collection(this.db, COLLECTION.CART);

        const querySnapshot = await getDocs(q);

        let promises: Promise<CartItem | null>[] = [];

        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                const data = doc.data();
                const book = await getDoc(data.book);
                const bookData = book.exists()
                  ? { ...(book.data() as Object), id: book.id }
                  : null;
                const cart = { ...data, id: doc.id, book: bookData };
                res(cart as CartItem);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const cart = await Promise.all(promises);

        resolve(cart.filter((cart) => cart !== null));
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async add({ book, qty }: Pick<CartItem, "book" | "qty">) {
    return new Promise<CartItem>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userCol = collection(this.db, COLLECTION.USERS);
        const userDoc = doc(userCol, this.auth.currentUser.uid);

        const bookCol = collection(this.db, COLLECTION.BOOKS);
        const bookDoc = doc(bookCol, book.id);

        let cart = {
          book: bookDoc,
          owner: userDoc,
          qty,
          timestamp: serverTimestamp(),
        };

        const res = await addDoc(collection(this.db, COLLECTION.CART), cart);

        resolve({ ...cart, book, id: res.id } as unknown as CartItem);
      } catch (error: any) {
        console.log(error);
        reject(error.message);
      }
    });
  }

  async remove(id: string) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const cartCol = collection(this.db, COLLECTION.CART);
        const cartDoc = doc(cartCol, id);

        await deleteDoc(cartDoc);

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async removeAll() {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userRef = doc(
          this.db,
          COLLECTION.USERS,
          this.auth.currentUser.uid
        );

        const cartCol = await collection(this.db, COLLECTION.CART);
        const q = query(cartCol, where("owner", "==", userRef));
        const cart = await getDocs(q);

        const batch = writeBatch(this.db);
        cart.forEach((item) => {
          batch.delete(item.ref);
        });

        await batch.commit();
        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async update({ qty, id }: Pick<CartItem, "qty" | "id">) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const cartRef = doc(this.db, COLLECTION.CART, id);

        const cart = {
          qty,
        };

        await updateDoc(cartRef, cart);
        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
