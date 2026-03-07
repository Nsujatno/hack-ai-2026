import { login } from '@/app/auth/actions'
import { AuthLayout } from '@/components/AuthLayout'
import Link from 'next/link'
import { ArrowRight, LogIn } from 'lucide-react'

export default async function SignInPage(props: {
    searchParams: Promise<{ message?: string }>
}) {
    const searchParams = await props.searchParams

    return (
        <AuthLayout>
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 border border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-300/40">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-extrabold text-slate-900 mb-2">Welcome Back</h2>
                    <p className="text-slate-500 text-[15px]">Continue your learning journey.</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="email">Email</label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between ml-1 mr-1">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                            <Link href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {searchParams?.message && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <span className="text-rose-600 font-medium text-sm">
                                {searchParams.message}
                            </span>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            formAction={login}
                            className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:bg-indigo-500 hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                        >
                            <span>Log In</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </form>

                <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">New to SkillDuel?</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
                    >
                        Create Account
                    </Link>
                </div>

            </div>
        </AuthLayout>
    )
}
