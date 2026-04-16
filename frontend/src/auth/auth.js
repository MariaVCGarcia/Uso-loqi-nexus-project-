import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
// console.log("ENV TEST:", process.env.REACT_APP_FIREBASE_API_KEY);

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const reauth = (password) => {
  const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
  return reauthenticateWithCredential(auth.currentUser, credential);
};

export const updateDisplayName = (name) => {
  return updateProfile(auth.currentUser, {displayName: name});
};

export const changeEmail = async (newEmail, currentPassword) => {
  await reauth(currentPassword);
  return updateEmail(auth.currentUser, newEmail);
};

export const changePassword = async (currentPassword, newPassword) => {
  await reauth(currentPassword);
  return updatePassword(auth.currentUser, newPassword);
};

export const deleteAccount = async (currentPassword) => {
  await reauth(currentPassword);
  return deleteUser(auth.currentUser);
};
