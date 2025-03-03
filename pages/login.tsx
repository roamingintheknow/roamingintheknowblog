import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (router.query.admin === "true") {
      setShowForm(true);
    }
  }, [router.query]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", { redirect: false, email, password });

    if (result?.ok) router.push("/admin"); // Redirect to admin panel
  };

  if (session?.user?.role === "admin") {
    router.push("/admin");
    return null;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {showForm ? (
        <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required className="block w-full p-2 mb-4 border roaming-black-text"/>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required className="block w-full p-2 mb-4 border roaming-black-text"/>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
      ) : (
        <p>Access Denied</p> // Hide login form for normal users
      )}
    </div>
  );
}
