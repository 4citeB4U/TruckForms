import { auth } from './firebase';
import { signOut } from 'firebase/auth';

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <button onClick={handleLogout} className="btn">Logout</button>
  );
}
