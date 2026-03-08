'use client'

import { Swords, Play, Zap } from 'lucide-react'
import { LessonData } from '@/components/LessonModal'

interface PvpChallengeCardProps {
    /** The lesson data fetched from the API — null while loading */
    lesson: LessonData | null
    /** Called when the user accepts the challenge */
    onAccept: (lesson: LessonData) => void
}

export function PvpChallengeCard({ lesson, onAccept }: PvpChallengeCardProps) {
    const totalQuestions = lesson?.questions.length ?? 3

    return (
        <div className="bg-white rounded-3xl border-2 border-rose-200 overflow-hidden shadow-sm hover:shadow-md hover:border-rose-300 transition-all group">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-rose-50 to-orange-50 border-b border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center shadow-sm">
                        <Swords className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm font-serif">⚔️ PvP Challenge</h3>
                </div>
                <div className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    Live
                </div>
            </div>

            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
                {lesson?.videoUrl ? (
                    <video
                        src={lesson.videoUrl}
                        className="w-full h-full object-cover opacity-70"
                        muted
                        playsInline
                        preload="metadata"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-950 to-slate-900 animate-pulse" />
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-rose-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 text-white fill-white" />
                    </div>
                </div>
                {/* Topic tag */}
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
                    LLM Basics
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
                {lesson ? (
                    <>
                        <div>
                            <h4 className="font-bold text-slate-900 leading-snug line-clamp-2">{lesson.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lesson.description}</p>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                                {totalQuestions * 10} XP at stake
                            </span>
                            <span className="text-slate-300">·</span>
                            <span>{totalQuestions} questions</span>
                            <span className="text-slate-300">·</span>
                            <span>5 min</span>
                        </div>
                    </>
                ) : (
                    // Loading skeleton
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 rounded w-full" />
                        <div className="h-3 bg-slate-100 rounded w-5/6" />
                    </div>
                )}

                {/* CTA Button */}
                <button
                    disabled={!lesson}
                    onClick={() => lesson && onAccept(lesson)}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-bold rounded-xl shadow-md shadow-rose-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    <Swords className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    {lesson ? 'Accept Challenge' : 'Loading…'}
                </button>
            </div>
        </div>
    )
}
