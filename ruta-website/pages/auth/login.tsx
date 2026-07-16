import Head from 'next/head'
import Link from 'next/link'
import { FormEvent } from 'react'

export default function Register() {
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // placeholder submit handler
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
        <div className="max-w-md mx-auto mt-6 p-8 bg-[#101e33] border border-white/6 rounded-xl shadow-lg">
          <header className="mb-2 text-2xl font-semibold text-white">Welcome Back!</header>
          <p className="mb-6 text-sm text-[#e6eef8]/70">Sign in to manage your routes and commute alerts.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#e6eef8]/85 mb-2">Email Address</label>
              <input required placeholder="name@gmail.com" className="w-full px-3 py-2 rounded-lg bg-[#0a1526] border border-white/8 text-[#e6eef8] placeholder:text-[#e6eef8]/40 focus:outline-none focus:border-[#4f8cff]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#e6eef8]/85 mb-2">Password</label>
              <input type="email" required placeholder="********" className="w-full px-3 py-2 rounded-lg bg-[#0a1526] border border-white/8 text-[#e6eef8] placeholder:text-[#e6eef8]/40 focus:outline-none focus:border-[#4f8cff]" />
            </div>

            <button type="submit" className="w-full mt-2 py-3 rounded-lg bg-[#4f8cff] font-bold text-white hover:bg-[#3d76e0]">Login</button>

            <div className="text-center text-sm text-[#e6eef8]/70 mt-2">
              Don't have an account? <Link href="/auth/register"><a className="text-[#4f8cff] font-semibold">Register</a></Link>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}