// src/app/login/page.tsx
"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth } from "@/auth/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const db = getFirestore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        // Check if this is the first user for any company (for demo, use email domain as company)
        const companyDomain = email.split('@')[1];
        const companyQuery = query(collection(db, "users"), where("companyId", "==", companyDomain));
        const companyUsers = await getDocs(companyQuery);
        const isFirstUser = companyUsers.empty;
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          email: user.email,
          companyId: companyDomain,
          role: isFirstUser ? "admin" : "driver", // admin if first, else driver (admin can change later)
          joinedAt: new Date(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mb-2">
          {isSignUp ? "Create Account" : "Sign In"}
        </button>
        <button
          type="button"
          className="w-full text-blue-600 underline"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
}
