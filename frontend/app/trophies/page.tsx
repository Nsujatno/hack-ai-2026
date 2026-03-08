'use client'

import Link from 'next/link'
import { ArrowLeft, Trophy, Lock, Star } from 'lucide-react'

interface Badge {
    id: string;
    emoji: string;
    name: string;
    description: string;
    xpReward: number;
    earned: boolean;
    earnedDate?: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const BADGES: Badge[] = [
    { id: 'first_lesson', emoji: '🎓', name: 'First Step', description: 'Complete your first lesson.', xpReward: 50, earned: true, earnedDate: 'Mar 3', rarity: 'common' },
    { id: 'streak_3', emoji: '🔥', name: 'On Fire', description: 'Keep a 3-day streak.', xpReward: 100, earned: false, rarity: 'common' },
    { id: 'first_quiz', emoji: '✅', name: 'Quiz Whiz', description: 'Ace your first quiz.', xpReward: 75, earned: false, rarity: 'common' },
    { id: 'streak_7', emoji: '⚡', name: 'Lightning Rod', description: 'Maintain a 7-day streak.', xpReward: 200, earned: false, rarity: 'rare' },
    { id: 'unit_1', emoji: '🏆', name: 'Unit Champion', description: 'Beat the Unit 1 Boss Challenge.', xpReward: 500, earned: false, rarity: 'epic' },
    { id: 'perfect_score', emoji: '💯', name: 'Perfectionist', description: 'Get 100% on a quiz.', xpReward: 150, earned: false, rarity: 'rare' },
    { id: 'speed_run', emoji: '⏱️', name: 'Speed Coder', description: 'Complete a lesson in under 5 minutes.', xpReward: 100, earned: false, rarity: 'rare' },
    { id: 'lore_master', emoji: '📚', name: 'Lore Master', description: 'Read all bonus material in a unit.', xpReward: 250, earned: false, rarity: 'epic' },
    { id: 'legend', emoji: '👑', name: 'The Legend', description: 'Complete the entire course with a perfect score.', xpReward: 2000, earned: false, rarity: 'legendary' },
]

const rarityConfig = {
    common: { border: 'border-slate-200', glow: 'shadow-slate-200', label: 'bg-slate-100 text-slate-500', labelText: 'Common' },
    rare: { border: 'border-blue-300', glow: 'shadow-blue-100', label: 'bg-blue-50 text-blue-600', labelText: 'Rare' },
    epic: { border: 'border-purple-300', glow: 'shadow-purple-100', label: 'bg-purple-50 text-purple-600', labelText: 'Epic' },
    legendary: { border: 'border-amber-300', glow: 'shadow-amber-100/80', label: 'bg-amber-50 text-amber-600', labelText: 'Legendary' },
}

export default function TrophiesPage() {
    const earned = BADGES.filter(b => b.earned)
    const totalXpFromBadges = earned.reduce((sum, b) => sum + b.xpReward, 0)

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-indigo-500/30">

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl inline-flex items-center gap-2 font-black text-slate-800 font-serif tracking-tight">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Trophy Cabinet
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl shadow-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-amber-700">{totalXpFromBadges} XP earned from badges</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                        <div className="text-3xl font-black text-indigo-600">{earned.length}</div>
                        <div className="text-sm text-slate-500 font-medium mt-1">Earned</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                        <div className="text-3xl font-black text-slate-800">{BADGES.length}</div>
                        <div className="text-sm text-slate-500 font-medium mt-1">Total</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                        <div className="text-3xl font-black text-amber-500">{Math.round((earned.length / BADGES.length) * 100)}%</div>
                        <div className="text-sm text-slate-500 font-medium mt-1">Complete</div>
                    </div>
                </div>

                {/* Earned Badges Section */}
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Earned Badges</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {BADGES.filter(b => b.earned).map(badge => {
                        const cfg = rarityConfig[badge.rarity]
                        return (
                            <div key={badge.id} className={`bg-white rounded-3xl border-2 ${cfg.border} p-6 shadow-lg ${cfg.glow} flex gap-5 items-start hover:-translate-y-1 transition-transform`}>
                                <div className="text-5xl select-none flex-shrink-0">{badge.emoji}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-black text-slate-800 text-base truncate">{badge.name}</h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.label} flex-shrink-0`}>{cfg.labelText}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-snug">{badge.description}</p>
                                    <div className="flex items-center gap-1 mt-3">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-bold text-amber-600">+{badge.xpReward} XP</span>
                                        {badge.earnedDate && <span className="text-xs text-slate-400 ml-auto">{badge.earnedDate}</span>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Locked Badges Section */}
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Locked Badges</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {BADGES.filter(b => !b.earned).map(badge => {
                        const cfg = rarityConfig[badge.rarity]
                        return (
                            <div key={badge.id} className="bg-slate-100 rounded-3xl border-2 border-slate-200 p-6 flex gap-5 items-start opacity-60">
                                <div className="text-5xl select-none flex-shrink-0 grayscale">{badge.emoji}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-black text-slate-500 text-base truncate">{badge.name}</h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.label} flex-shrink-0 opacity-60`}>{cfg.labelText}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-snug">{badge.description}</p>
                                    <div className="flex items-center gap-1 mt-3">
                                        <Lock className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs font-medium text-slate-400">+{badge.xpReward} XP on unlock</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </main>
        </div>
    )
}
