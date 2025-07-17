// src/app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { auth } from "@/auth/firebase";
import { useRouter } from "next/navigation";

const ROLES = ["admin", "manager", "dispatcher", "driver", "trainer"];

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only allow admins
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) router.push("/login");
      // TODO: Check user role from Firestore and redirect if not admin
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    async function fetchUsers() {
      const db = getFirestore();
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    const db = getFirestore();
    await updateDoc(doc(db, "users", userId), { role });
    setUsers(users => users.map(u => u.id === userId ? { ...u, role } : u));
  };

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
