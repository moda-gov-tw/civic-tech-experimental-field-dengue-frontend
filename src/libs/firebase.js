// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  DataSnapshot,
  push,
  remove,
} from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// 建立資料庫ref
export const realtimeRef = ref(database, "callHelp");

// 寫入 database
export const addTask = (section, payload) => {
  push(ref(database, `callHelp/${section}/task`), payload);
};

export const updateTask = async (section, index, payload) => {
  await set(ref(database, `callHelp/${section}/task/${index}`), payload);
};

// 取得realtime database內的資料
export const watchTasks = (section, cb) => {
  const taskRef = ref(database, `callHelp/${section}/task`);

  return onValue(
    taskRef,
    (snapshot) => {
      const data = snapshot.val();
      cb(data);
    },
    (error) => {
      console.error(error);
    }
  );
};

export const addSupport = (section, payload) => {
  if (payload.name) {
    push(ref(database, `callHelp/${section}/support`), payload);
  }
};

export const updateSupport = (section, index, payload) => {
  set(ref(database, `callHelp/${section}/support/${index}`), payload);
};

export const removeSupport = (section, index) => {
  console.log(index);
  remove(ref(database, `callHelp/${section}/support/${index}`));
};

export const watchSupport = (section, cb) => {
  const supportRef = ref(database, `callHelp/${section}/support`);

  return onValue(
    supportRef,
    (snapshot) => {
      const data = snapshot.val();
      cb(data);
    },
    (error) => {
      console.error(error);
    }
  );
};

export const removeSection = (section) => {
  remove(ref(database, `callHelp/${section}`));
};
