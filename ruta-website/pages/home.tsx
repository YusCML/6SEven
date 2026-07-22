import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type SessionUser = {
  name: string;
  email: string;
};

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const storedSession = window.localStorage.getItem("ruta-session");

    if (!storedSession) {
      router.replace("/auth/login");
      return;
    }

    try {
      setUser(JSON.parse(storedSession) as SessionUser);
    } catch {
      window.localStorage.removeItem("ruta-session");
      router.replace("/auth/login");
    }
  }, [router]);

  function handleLogout() {
    window.localStorage.removeItem("ruta-session");
    router.push("/auth/login");
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard - RUTA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-[#0a1220] text-[#e6eef8] px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#101e33] px-6 py-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[#8fb4ff]">
                Welcome back
              </p>
              <h1 className="text-3xl font-semibold text-white">{user.name}</h1>
              <p className="text-sm text-[#e6eef8]/70">{user.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[#e6eef8] hover:border-[#4f8cff] hover:text-white"
              >
                Home
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-[#4f8cff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d76e0]"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <section className="rounded-2xl border border-white/10 bg-[#101e33] p-5">
              <h2 className="mb-2 text-lg font-semibold text-white">Routes</h2>
              <p className="text-sm text-[#e6eef8]/70">
                Review your saved routes and commute schedules.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#101e33] p-5">
              <h2 className="mb-2 text-lg font-semibold text-white">Alerts</h2>
              <p className="text-sm text-[#e6eef8]/70">
                Receive commute alerts and route updates in one place.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#101e33] p-5">
              <h2 className="mb-2 text-lg font-semibold text-white">Profile</h2>
              <p className="text-sm text-[#e6eef8]/70">
                Keep your preferences synced across the RUTA experience.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
