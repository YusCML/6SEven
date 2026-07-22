import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as {
        message?: string;
        user?: { name: string; email: string };
      };

      if (!response.ok) {
        setMessage(data.message ?? "Unable to log in right now.");
        return;
      }

      if (data.user) {
        window.localStorage.setItem(
          "ruta-session",
          JSON.stringify({
            name: data.user.name,
            email: data.user.email,
          }),
        );
      }

      router.push("/home");
    } catch {
      setMessage("Something went wrong while logging in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login - RUTA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="fixed top-0 left-0 w-full z-50 bg-[#0e1a2b] border-b border-white/5">
        <div className="max-w-3xl mx-auto px-10 py-3 flex items-center justify-between">
          <h1 className="m-0 text-sm font-bold tracking-wide text-[#e6eef8] flex items-center">
            <span className="inline-flex items-center justify-center mr-2 text-xs bg-white/5 rounded px-1 py-[2px]">
              ☠
            </span>
            RUTA
          </h1>

          <Link
            href="/"
            className="text-sm font-semibold text-[#e6eef8]/90 hover:text-white"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-[#0a1220] text-[#e6eef8] pt-20">
        <div className="max-w-md mx-auto mt-6 p-8 bg-[#101e33] border border-white/10 rounded-xl shadow-lg">
          <h2 className="mb-2 text-2xl font-semibold text-white">
            Welcome Back!
          </h2>

          <p className="mb-6 text-sm text-[#e6eef8]/70">
            Sign in to manage your routes and commute alerts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {message ? (
              <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                {message}
              </p>
            ) : null}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#e6eef8]/85 mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1526] border border-white/10 text-[#e6eef8] placeholder:text-[#e6eef8]/40 focus:outline-none focus:border-[#4f8cff]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#e6eef8]/85 mb-2">
                Password
              </label>

              <input
                type="password"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1526] border border-white/10 text-[#e6eef8] placeholder:text-[#e6eef8]/40 focus:outline-none focus:border-[#4f8cff]"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-lg bg-[#4f8cff] font-bold text-white transition-colors hover:bg-[#3d76e0] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            {/* Register Link */}
            <div className="text-center text-sm text-[#e6eef8]/70 mt-2">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#4f8cff] font-semibold hover:underline"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}