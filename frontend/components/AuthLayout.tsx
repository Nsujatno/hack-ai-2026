'use client'

import { BookOpen, Trophy, Compass, Star, Sparkles, GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="flex min-h-screen bg-slate-50 selection:bg-indigo-500/30">

            {/* Left Panel: Immersive Brand Experience */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-600 flex-col justify-between p-12 lg:p-16">

                {/* Background Texture & Particles */}
                <div className="absolute inset-0 z-0">
                    {/* Faint Dotted Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                    {/* Soft Particle Glows */}
                    <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] mix-blend-screen mix-blend-overlay"></div>
                    <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-overlay"></div>
                </div>

                {/* Dynamic Skill Tree / Learning Map Visual (Abstract) */}
                {mounted && (
                    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-60 pointer-events-none">
                        {/* Central Node */}
                        <div className="absolute w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-400/30 shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-pulse">
                            <Compass className="w-5 h-5 text-indigo-300" />
                        </div>

                        {/* Path 1 (Top Right) */}
                        <div className="absolute w-[200px] h-0.5 bg-gradient-to-r from-indigo-500/50 to-transparent rotate-[-30deg] origin-left translate-x-[24px]" />
                        <div className="absolute translate-x-[180px] translate-y-[-100px] w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <Trophy className="w-4 h-4 text-emerald-300" />
                        </div>

                        {/* Path 2 (Bottom Right) */}
                        <div className="absolute w-[180px] h-0.5 bg-gradient-to-r from-indigo-500/50 to-transparent rotate-[45deg] origin-left translate-x-[24px]" />
                        <div className="absolute translate-x-[120px] translate-y-[120px] w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-400/30">
                            <Star className="w-4 h-4 text-amber-300" />
                        </div>

                        {/* Path 3 (Left) */}
                        <div className="absolute w-[220px] h-0.5 bg-gradient-to-l from-indigo-500/50 to-transparent origin-left translate-x-[-24px]" />
                        <div className="absolute translate-x-[-220px] w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md">
                            <BookOpen className="w-5 h-5 text-slate-300" />
                        </div>

                        {/* Path 4 (Top Left) */}
                        <div className="absolute w-[150px] h-0.5 bg-gradient-to-l from-indigo-500/50 to-slate-500/20 rotate-[30deg] origin-left translate-x-[-24px]" />
                        <div className="absolute translate-x-[-120px] translate-y-[-70px] w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                            <Sparkles className="w-3 h-3 text-indigo-200" />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold font-serif text-white tracking-wide">SkillDuel</span>
                    </div>

                    <div className="max-w-xl">
                        <h1 className="text-5xl lg:text-6xl font-serif text-white font-extrabold tracking-tight leading-[1.1] mb-6">
                            SkillDuel
                        </h1>
                        <p className="text-xl lg:text-2xl text-slate-300 font-light leading-relaxed">
                            Learn faster.<br />
                            <span className="text-indigo-300 font-medium">Challenge friends.</span><br />
                            Master new skills.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> System Operational</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-400"></div> AI Engine Active</span>
                </div>
            </div>

            {/* Right Panel: Auth Card Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative">
                {/* Mobile Logo (only visible on small screens) */}
                <div className="lg:hidden flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold font-serif text-slate-900 tracking-wide">SkillDuel</span>
                </div>

                {/* Form Content */}
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>

        </div>
    )
}
