import Head from "next/head";
import Link from "next/link";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>RUTA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-[#0a1220] text-[#e6eef8]">
        <section className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
          <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#8fb4ff]">
                Smarter Commuting
              </p>
              <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
                Plan every ride in one place.
              </h1>
              <p className="max-w-2xl text-lg text-[#e6eef8]/75">
                RUTA helps you manage routes, alerts, and your commute dashboard from a single, connected experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth/login"
                  className="rounded-lg bg-[#4f8cff] px-5 py-3 font-semibold text-white hover:bg-[#3d76e0]"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-[#e6eef8] hover:border-[#4f8cff] hover:text-white"
                >
                  Register
                </Link>
                <Link
                  href="/home"
                  className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-[#e6eef8] hover:border-[#4f8cff] hover:text-white"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#101e33] p-6 shadow-lg">
              <div className="grid gap-4">
                <div className="rounded-2xl bg-[#0a1526] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8fb4ff]">
                    Route Overview
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">2 active trips</h2>
                </div>
                <div className="rounded-2xl bg-[#0a1526] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8fb4ff]">
                    Alerts
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">3 updates</h2>
                </div>
                <div className="rounded-2xl bg-[#0a1526] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8fb4ff]">
                    Profile
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Pro commuter</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
