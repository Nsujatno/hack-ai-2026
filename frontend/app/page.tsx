import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/signin')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="relative z-10 w-full max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Welcome to Hack AI 2026
        </h1>

        <p className="text-xl text-gray-300 mb-12 max-w-xl mx-auto">
          Start building your next big idea securely with Supabase Authentication.
        </p>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          {user ? (
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 mb-4 shadow-lg shadow-green-500/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold">You are authenticated!</h2>
              <p className="text-gray-400">Logged in as: <span className="text-white font-mono bg-white/10 px-2 py-1 rounded">{user.email}</span></p>

              <form action={signOut} className="pt-6">
                <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all border border-white/10 hover:border-white/30 hover:scale-105 active:scale-95">
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 mb-4 shadow-lg shadow-purple-500/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Please sign in to continue</h2>
              <p className="text-gray-400">Secure access to your dashboard and features.</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link
                  href="/signin"
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-all border border-white/10 hover:border-white/30 hover:scale-105 active:scale-95"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background decorations */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-900/20 blur-[120px] pointer-events-none" />
    </div>
  )
}
