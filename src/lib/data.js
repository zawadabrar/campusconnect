import {
  addDoc, collection, deleteDoc, doc, getDocs, updateDoc
} from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

const KEYS = {
  students: "cc_students",
  notices: "cc_notices",
  events: "cc_events",
};

const seed = {
  students: [
    { id: "s1", name: "Ayesha Rahman", email: "ayesha@example.com", department: "CSE", studentId: "CSE-2301" },
    { id: "s2", name: "Tanvir Hasan", email: "tanvir@example.com", department: "EEE", studentId: "EEE-2308" },
  ],
  notices: [
    { id: "n1", title: "Midterm examination schedule", category: "Academic", body: "The midterm examination schedule will be published by the department office.", date: "2026-11-10" },
    { id: "n2", title: "Library hour update", category: "General", body: "The central library will remain open until 8:00 PM during weekdays.", date: "2026-11-08" },
  ],
  events: [
    { id: "e1", title: "Programming Contest", date: "2026-11-25", location: "Computer Lab 2", description: "A friendly programming contest for all CSE students.", registered: [] },
    { id: "e2", title: "Career & Internship Talk", date: "2026-12-02", location: "Auditorium", description: "Meet industry speakers and learn about career paths.", registered: [] },
  ],
};

function localRead(type) {
  const raw = localStorage.getItem(KEYS[type]);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(KEYS[type], JSON.stringify(seed[type]));
  return seed[type];
}
function localWrite(type, rows) {
  localStorage.setItem(KEYS[type], JSON.stringify(rows));
}

export async function listRecords(type) {
  if (firebaseEnabled) {
    const snap = await getDocs(collection(db, type));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return localRead(type);
}

export async function createRecord(type, values) {
  if (firebaseEnabled) {
    const ref = await addDoc(collection(db, type), values);
    return { id: ref.id, ...values };
  }
  const rows = localRead(type);
  const item = { id: crypto.randomUUID(), ...values };
  localWrite(type, [item, ...rows]);
  return item;
}

export async function updateRecord(type, id, values) {
  if (firebaseEnabled) {
    await updateDoc(doc(db, type, id), values);
    return;
  }
  localWrite(type, localRead(type).map((row) => row.id === id ? { ...row, ...values } : row));
}

export async function removeRecord(type, id) {
  if (firebaseEnabled) {
    await deleteDoc(doc(db, type, id));
    return;
  }
  localWrite(type, localRead(type).filter((row) => row.id !== id));
}

export function clearDemoData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
