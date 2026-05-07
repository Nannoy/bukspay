"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ username }: { username?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <Link href="/dashboard" className="text-xl font-bold tracking-wide">
        BuksPay
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
        <Link href="/transfer" className="hover:text-blue-200">Transfer</Link>
        <Link href="/beneficiaries" className="hover:text-blue-200">Beneficiaries</Link>
        <Link href="/transactions" className="hover:text-blue-200">History</Link>
        <Link href="/loans" className="hover:text-blue-200">Loans</Link>
        <Link href="/profile" className="hover:text-blue-200">Profile</Link>
        <Link href="/admin" className="hover:text-yellow-300 text-yellow-400">Admin</Link>
        <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white">
          Logout
        </button>
      </div>
    </nav>
  );
}
