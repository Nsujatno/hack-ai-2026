import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookOpen, Trophy, GraduationCap, ArrowRight, LogOut, Compass } from 'lucide-react'

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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden text-slate-50 selection:bg-indigo-500/30">

      {/* Background Texture & Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Faint Dotted Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* Soft Particle Glows */}
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">

        {/* Logo Element */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold font-serif text-white tracking-wide">SkillDuel</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
          Master skills.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Challenge friends.</span>
        </h1>

        <p className="text-xl text-slate-300 mb-12 max-w-xl mx-auto font-light leading-relaxed">
          An AI-powered learning platform where knowledge meets friendly competition. Start your journey today.
        </p>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle inside glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none"></div>

          {user ? (
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-400/20 to-emerald-500/20 border border-emerald-500/30 mb-2 shadow-lg shadow-emerald-500/10">
                <Trophy className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold text-white mb-2">Welcome Back!</h2>
                <p className="text-slate-400 text-lg">Logged in as: <span className="text-slate-200 font-medium px-2 py-1 bg-slate-700/50 rounded-lg">{user.email}</span></p>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Compass className="w-5 h-5" />
                  <span>Enter Academy</span>
                </Link>
                <form action={signOut} className="w-full sm:w-auto">
                  <button className="w-full px-8 py-3.5 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-all border border-slate-600 hover:border-slate-500 flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin"
                className="group relative w-full sm:w-auto px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Log In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signup"
                className="w-full sm:w-auto px-10 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-all border border-slate-600 hover:border-slate-500 flex items-center justify-center"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500 font-medium">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> System Online</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> AI Ready</span>
        </div>
      </div>
    </div >
  )
}
