import { signup } from '@/app/auth/actions'
import { AuthLayout } from '@/components/AuthLayout'
import Link from 'next/link'
import { ArrowRight, UserPlus } from 'lucide-react'

export default async function SignUpPage(props: {
    searchParams: Promise<{ message?: string }>
}) {
    const searchParams = await props.searchParams

    return (
        <AuthLayout>
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 border border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-300/40">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-extrabold text-slate-900 mb-2">Create Account</h2>
                    <p className="text-slate-500 text-[15px]">Start your learning journey today.</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="email">Email</label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="password">Password</label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create a strong password"
                            required
                        />
                    </div>

                    {searchParams?.message && (
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <span className="text-orange-700 font-medium text-sm">
                                {searchParams.message}
                            </span>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            formAction={signup}
                            className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:bg-emerald-500 hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
                        >
                            <span>Sign Up</span>
                            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                </form>

                <div className="mt-8 text-center bg-slate-50 p-6 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 rounded-b-2xl border-t border-slate-100">
                    <p className="text-slate-600 text-sm">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors">
                            Log in instead
                        </Link>
                    </p>
                </div>

            </div>
        </AuthLayout>
    )
}
