import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as {
        message?: string;
        user?: { name: string; email: string };
      };

      if (!response.ok) {
        setMessage(data.message ?? "Unable to create account.");
        return;
      }

      router.push("/home");
    } catch {
      setMessage("Something went wrong while creating your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up - RUTA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="fixed top-0 left-0 w-full z-50 bg-[#0e1a2b] border-b border-white/5">
        <div className="max-w-3xl mx-auto px-10 py-3 flex items-center justify-between">
          <h1 className="m-0 text-sm font-bold tracking-wide text-[#e6eef8] flex items-center">
            <span className="inline-flex items-center justify-center mr-2 text-xs bg-white/5 rounded px-1 py-[2px]">☠</span>
            RUTA
          </h1>

          <Link href="/">
            <a className="text-sm font-semibold text-[#e6eef8]/90">Back</a>
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-[#0a1220] text-[#e6eef8] pt-20">
        <div className="max-w-md mx-auto mt-6 p-8 bg-[#101e33] border border-white/10 rounded-xl shadow-lg">
          <header className="mb-2 text-2xl font-semibold text-white">Join RUTA Today</header>
          <p className="mb-6 text-sm text-[#e6eef8]/70">Plan your smarter commute in the Philippines.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {message ? (
              <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                {message}
              </p>
            ) : null}

            <div>
              <label className="block text-xs font-semibold text-[#e6eef8]/85 mb-2">Full Name</label>
              <input
                required
                placeholder="Juan Dela Cruz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1526] border border-white/8 text-[#e6eef8] placeholder:text-[#e6eef8]/40 focus:outline-none focus:border-[#4f8cff]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#e6eef8]/85 mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1526] border border-white/8 text-[#e6eef8] placeholder:text-[#e6eef8]/40 focus:outline-none focus:border-[#4f8cff]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#e6eef8]/85 mb-2">Password</label>
              <input
                type="password"
                required
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1526] border border-white/8 text-[#e6eef8] placeholder:text-[#e6eef8]/40 focus:outline-none focus:border-[#4f8cff]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-lg bg-[#4f8cff] font-bold text-white hover:bg-[#3d76e0] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>

            <div className="text-center text-sm text-[#e6eef8]/70 mt-2">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#4f8cff] font-semibold hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}