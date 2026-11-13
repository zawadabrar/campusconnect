import React, { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, firebaseEnabled } from "../lib/firebase";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (firebaseEnabled) return null;
    try { return JSON.parse(localStorage.getItem("cc_demo_user")) || null; } catch { return null; }
  });
  const [ready, setReady] = useState(!firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) return;
    return onAuthStateChanged(auth, (current) => {
      setUser(current ? { uid: current.uid, email: current.email } : null);
      setReady(true);
    });
  }, []);

  async function login(email, password) {
    if (firebaseEnabled) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { uid: result.user.uid, email: result.user.email };
    }
    const demo = { uid: "demo-" + email, email };
    localStorage.setItem("cc_demo_user", JSON.stringify(demo));
    setUser(demo);
    return demo;
  }
  async function register(email, password) {
    if (firebaseEnabled) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { uid: result.user.uid, email: result.user.email };
    }
    const demo = { uid: "demo-" + email, email };
    localStorage.setItem("cc_demo_user", JSON.stringify(demo));
    setUser(demo);
    return demo;
  }
  async function logout() {
    if (firebaseEnabled) await signOut(auth);
    else localStorage.removeItem("cc_demo_user");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, ready, login, register, logout }}>
    {children}
  </AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
