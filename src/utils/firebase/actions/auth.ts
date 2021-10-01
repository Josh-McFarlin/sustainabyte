import firebase from "firebase";
import { auth } from "../client";

type User = firebase.User;

export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const { user } = userCredential;

    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    throw new Error("Failed to sign up!");
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    const { user } = userCredential;

    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    throw new Error("Failed to login!");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    throw new Error("Failed to logout!");
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await auth.sendPasswordResetEmail(email);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    throw new Error("Failed to send reset password email!");
  }
};

export const verifyPasswordResetCode = async (code: string): Promise<void> => {
  try {
    await auth.verifyPasswordResetCode(code);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    throw new Error("Failed to verify password reset code!");
  }
};

export const confirmPasswordReset = async (
  code: string,
  newPassword: string
): Promise<void> => {
  try {
    await auth.confirmPasswordReset(code, newPassword);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    throw new Error("Failed to reset password!");
  }
};

export const observeAuthState = (
  listener: (user: User | null) => void
): void => {
  auth.onAuthStateChanged(listener);
};
