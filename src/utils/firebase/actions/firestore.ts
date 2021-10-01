import firebase from "firebase";
import { db } from "../client";

type WhereFilterOp = firebase.firestore.WhereFilterOp;
type DocumentData = firebase.firestore.DocumentData;
type DocumentReference = firebase.firestore.DocumentReference;
type FieldPath = firebase.firestore.FieldPath;

export type Unsubscribe = () => void;
export type Query = [FieldPath | string, WhereFilterOp, any];

export const addData = async <T>(
  collection: string,
  data: T
): Promise<DocumentReference["id"]> => {
  try {
    const docRef = await db.collection(collection).add(data);

    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);

    throw new Error("Error adding document!");
  }
};

export const setDocument = async <T>(
  collection: string,
  doc: string,
  data: T
): Promise<void> => {
  try {
    await db.collection(collection).doc(doc).set(data);
  } catch (e) {
    console.error("Error setting document: ", e);

    throw new Error("Error setting document!");
  }
};

export const updateDocument = async <T>(
  collection: string,
  doc: string,
  data: T
): Promise<void> => {
  try {
    await db.collection(collection).doc(doc).update(data);
  } catch (e) {
    console.error("Error updating document: ", e);

    throw new Error("Error updating document!");
  }
};

export const getCollection = async (
  collection: string
): Promise<DocumentData[]> => {
  try {
    const querySnapshot = await db.collection(collection).get();

    return querySnapshot.docs.map((doc) => doc.data());
  } catch (e) {
    console.error("Error getting collection: ", e);

    throw new Error("Error getting collection!");
  }
};

export const observeCollection = async (
  collection: string,
  listener: (data: DocumentData[]) => void
): Promise<Unsubscribe> =>
  db.collection(collection).onSnapshot((snapshot) => {
    listener(snapshot.docs.map((doc) => doc.data()));
  });

export const getDocument = async (
  collection: string,
  doc: string
): Promise<DocumentData> => {
  try {
    const docSnap = await db.collection(collection).doc(doc).get();

    if (docSnap.exists) {
      return docSnap.data();
    }

    throw new Error("Document does not exist!");
  } catch (e) {
    console.error("Error getting document: ", e);

    throw new Error("Error getting document!");
  }
};

export const observeDocument = async (
  collection: string,
  doc: string,
  listener: (data: DocumentData) => void
): Promise<Unsubscribe> => {
  const unsub = db
    .collection(collection)
    .doc(doc)
    .onSnapshot((docSnap) => {
      if (!docSnap.exists) {
        unsub();
        throw new Error("Document does not exist!");
      }

      listener(docSnap.data());
    });

  return unsub;
};

export const queryDocuments = async (
  collection: string,
  query: Query
): Promise<DocumentData[]> => {
  try {
    const querySnapshot = await db
      .collection(collection)
      .where(...query)
      .get();

    return querySnapshot.docs.map((doc) => doc.data());
  } catch (e) {
    console.error("Error getting documents: ", e);

    throw new Error("Error getting documents!");
  }
};

export const observeQuery = async (
  collection: string,
  query: Query,
  listener: (data: DocumentData[]) => void
): Promise<Unsubscribe> =>
  db
    .collection(collection)
    .where(...query)
    .onSnapshot((snapshot) => {
      listener(snapshot.docs.map((doc) => doc.data()));
    });
