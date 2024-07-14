import { Book, CartItem, COLLECTION, Customer, Order, User } from "@/types";
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
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import UserService from "./User";
import CartService from "./Cart";

export type AddToCartResponse = {};

export default class OrderService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.confirm = this.confirm.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  async confirm() {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const cartService = new CartService();
        const cart = await cartService.findAll();

        const promises = cart.map((item) => {
          return new Promise(async (res, rej) => {
            try {
              const bookCol = collection(this.db, COLLECTION.BOOKS);
              const bookDoc = doc(bookCol, item.book.id);
              let order: Omit<Order, "id"> = {
                // @ts-ignore
                book: bookDoc,
                customer: item.owner,
                totalQuantity: item.qty,
                totalPrice: item.book.price * item.qty,
                timestamp: serverTimestamp() as Timestamp,
              };

              const saved = await addDoc(
                collection(this.db, COLLECTION.ORDER),
                order
              );
              res(saved);
            } catch (error) {
              rej(false);
            }
          });
        });

        const response = await Promise.all(promises);

        await cartService.removeAll();

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findAll() {
    return new Promise<Order[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userService = new UserService();
        const profile = await userService.profile();

        // default is fetching as student
        let q = query(collection(this.db, COLLECTION.ORDER));
        const orderCol = collection(this.db, COLLECTION.ORDER);

        const querySnapshot = await getDocs(q);

        let promises: Promise<Order | null>[] = [];

        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                const userService = new UserService();
                const data = doc.data();
                // book
                const book = await getDoc(data.book);
                const bookData: Book | null = book.exists()
                  ? ({ ...(book.data() as Object), id: book.id } as Book)
                  : null;

                if (!bookData) throw new Error("");

                // customer
                const customer = await userService.profile(data.customer?.id);

                const order = {
                  ...data,
                  id: doc.id,
                  book: bookData,
                  customer,
                };
                res(order as Order);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const orders = await Promise.all(promises);

        resolve(orders.filter((order) => order !== null));
      } catch (error: any) {
        console.log(error);
        reject(error.message);
      }
    });
  }
}
