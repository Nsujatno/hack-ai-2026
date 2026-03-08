'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle2, Lock, Play, Star, Zap, Flame, Trophy, Compass, ArrowRight, Target, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { LessonModal, LessonData } from '@/components/LessonModal'
import { ChallengeInbox, ChallengeInvite, INITIAL_INVITES } from '@/components/ChallengeInbox'

// Read the saved avatar URL from localStorage (written by the shop Save button)
const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&skinColor=edb98a&top=shortFlat&topProbability=100&clothing=hoodie&accessoriesProbability=0'
const getSavedAvatarUrl = () => {
    if (typeof window === 'undefined') return DEFAULT_AVATAR_URL
    return localStorage.getItem('skillDuelAvatarUrl') ?? DEFAULT_AVATAR_URL
}

// --- Mock Data ---
// ... (Chapter data remains the same) ...
const MOCK_LESSON_DATA: LessonData = {
    id: 'l4',
    title: 'Core Mechanics: Variable Binding',
    description: 'Learn how to bind variables and manage memory in your applications.',
    duration: 30, // 30 second simulated video
    questions: [
        {
            id: 'q1',
            text: 'Which keyword is typically used to define a block-scoped, mutable variable?',
            options: [
                { id: 'a', text: 'var', isCorrect: false },
                { id: 'b', text: 'let', isCorrect: true },
                { id: 'c', text: 'const', isCorrect: false },
                { id: 'd', text: 'static', isCorrect: false },
            ],
            explanation: '"let" creates variables that can be reassigned but exist only within the block they are defined.'
        },
        {
            id: 'q2',
            text: 'What happens if you try to reassign a "const" variable?',
            options: [
                { id: 'a', text: 'It creates a global variable.', isCorrect: false },
                { id: 'b', text: 'It throws a TypeError.', isCorrect: true },
                { id: 'c', text: 'It fails silently.', isCorrect: false },
                { id: 'd', text: 'It creates a new memory pointer.', isCorrect: false },
            ],
            explanation: 'Variables declared with const cannot be reassigned. Doing so will throw a TypeError in most modern engines.'
        },
        {
            id: 'q3',
            text: 'Which of the following is true about "var" declarations?',
            options: [
                { id: 'a', text: 'They are block-scoped.', isCorrect: false },
                { id: 'b', text: 'They cannot be reassigned.', isCorrect: false },
                { id: 'c', text: 'They are strictly typed.', isCorrect: false },
                { id: 'd', text: 'They are function-scoped or globally-scoped.', isCorrect: true },
            ],
            explanation: '"var" is function-scoped (or globally-scoped if declared outside a function), which can lead to unexpected behavior compared to block-scoped "let" and "const".'
        }
    ]
}

// Types
type LessonStatus = 'completed' | 'active' | 'locked'

interface LessonNode {
    id: string
    title: string
    status: LessonStatus
    type: 'lesson' | 'quiz' | 'boss'
    position: number // Horizontal offset
}

interface Chapter {
    id: string
    title: string
    description: string
    nodes: LessonNode[]
}

// Mock Data
const MOCK_CHAPTERS: Chapter[] = [
    {
        id: 'ch1',
        title: 'Unit 1: Fundamentals',
        description: 'Master the core concepts of your chosen skill.',
        nodes: [
            { id: 'l1', title: 'Introduction & Setup', status: 'completed', type: 'lesson', position: 0 },
            { id: 'l2', title: 'Basic Principles', status: 'completed', type: 'lesson', position: -20 },
            { id: 'l3', title: 'First Mini-Project', status: 'completed', type: 'quiz', position: 10 },
            { id: 'l4', title: 'Core Mechanics', status: 'active', type: 'lesson', position: -10 },
            { id: 'l5', title: 'Unit 1 Boss Challenge', status: 'locked', type: 'boss', position: 0 },
        ]
    },
    {
        id: 'ch2',
        title: 'Unit 2: Intermediate Tools',
        description: 'Expand your toolkit and build more complex projects.',
        nodes: [
            { id: 'l6', title: 'Advanced Syntax', status: 'locked', type: 'lesson', position: -15 },
            { id: 'l7', title: 'Working with Data', status: 'locked', type: 'lesson', position: 15 },
            { id: 'l8', title: 'Design Patterns', status: 'locked', type: 'lesson', position: 0 },
            { id: 'l9', title: 'Troubleshooting & Debugging', status: 'locked', type: 'lesson', position: -25 },
            { id: 'l10', title: 'Unit 2 Boss Challenge', status: 'locked', type: 'boss', position: 0 },
        ]
    }
]

export default function DashboardPage() {
    const [xp, setXp] = useState(350)
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
    const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null)
    const [activeInvite, setActiveInvite] = useState<ChallengeInvite | undefined>(undefined)
    // Server state
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [activeLessonData, setActiveLessonData] = useState<LessonData | null>(null)
    const [pvpLesson, setPvpLesson] = useState<LessonData | null>(null)
    const [invites, setInvites] = useState<ChallengeInvite[]>(INITIAL_INVITES)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)

    // Load User
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getSession().then(({ data }: any) => {
            setUserId(data.session?.user?.id ?? null)
        })
    }, [])

    // Fetch Dashboard Data
    useEffect(() => {
        if (userId === null) return // Wait for user ID resolution

        const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
        
        const fetchDashboard = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/dashboard/${userId}`)
                if (!res.ok) {
                    if (res.status === 404) {
                        // Fallback to mock data or empty state if no survey found
                        setChapters(MOCK_CHAPTERS)
                        setActiveLessonData(MOCK_LESSON_DATA)
                        setLoading(false)
                        return
                    }
                    throw new Error('Failed to load dashboard data')
                }
                const data = await res.json()
                setChapters(data.chapters)
                setActiveLessonData(data.activeLesson)
                setLoading(false)
            } catch (err: any) {
                console.error(err)
                setError(err.message)
                // Fallback to mock data for presentation purposes if backend fails
                setChapters(MOCK_CHAPTERS)
                setActiveLessonData(MOCK_LESSON_DATA)
                setLoading(false)
            }
        }
        
        fetchDashboard()
    }, [userId])

    // Fetch PvP challenge lesson from backend (Supabase cache)
    useEffect(() => {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
        fetch(`${API_BASE}/api/pvp-challenge`)
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then((data: LessonData) => setPvpLesson(data))
            .catch(err => console.error('Failed to load PvP challenge lesson:', err))
    }, [])

    const handleNodeClick = (node: LessonNode) => {
        if (node.status === 'active' || node.status === 'completed') {
            // Load the fetched active lesson data
            if (activeLessonData) {
                setSelectedLesson({
                    ...activeLessonData,
                    title: node.title
                })
            }
            setActiveInvite(undefined)
            setIsLessonModalOpen(true)
        }
    }

    const handleAcceptChallenge = (invite: ChallengeInvite) => {
        // Use the Supabase-fetched PvP lesson as the battle content
        if (!pvpLesson) return
        setSelectedLesson(pvpLesson)
        setActiveInvite(invite)
        setIsLessonModalOpen(true)
    }


    const handleLessonComplete = (xpEarned: number) => {
        setXp(prev => prev + xpEarned)

        if (activeInvite) {
            // This was a PvP challenge — mark the invite as completed, don't touch the path
            const correctCount = xpEarned / 10 // 10 XP per correct answer
            const won = correctCount > activeInvite.challengerScore
            setInvites(prev => prev.map(inv =>
                inv.id === activeInvite.id
                    ? { ...inv, status: 'completed', won }
                    : inv
            ))
            setActiveInvite(undefined)
            return
        }

        // Normal lesson — advance the learning path
        setChapters(prevChapters => {
            const newChapters = [...prevChapters]
            let foundActive = false
            for (let c = 0; c < newChapters.length; c++) {
                const chapter = { ...newChapters[c], nodes: [...newChapters[c].nodes] }
                newChapters[c] = chapter
                
                for (let n = 0; n < chapter.nodes.length; n++) {
                    if (chapter.nodes[n].status === 'active') {
                        chapter.nodes[n] = { ...chapter.nodes[n], status: 'completed' }
                        if (n + 1 < chapter.nodes.length) {
                            chapter.nodes[n + 1] = { ...chapter.nodes[n + 1], status: 'active' }
                        }
                        foundActive = true
                        break
                    }
                }
                if (foundActive) break
            }
            return newChapters
        })
    }

    if (loading) {
        return (
             <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                 <div className="flex items-center gap-3">
                     <Target className="w-6 h-6 text-indigo-500 animate-pulse" />
                     <span className="font-bold text-slate-500">Loading Dashboard...</span>
                 </div>
             </div>
        )
    }

    // Now standard return flow for the page (replace `MOCK_CHAPTERS` references below)

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/30">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <Compass className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold font-serif text-slate-900 hidden sm:block">SkillDuel</span>
                    </div>

                    {/* Stats Header (Mobile & Desktop) */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-1.5 text-orange-500 font-bold">
                            <Flame className="w-5 h-5 fill-orange-500" />
                            <span>12</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-indigo-500 font-bold">
                            <Zap className="w-5 h-5 fill-indigo-500" />
                            <span>{xp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/shop" className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-105 transition-all shadow-sm border border-indigo-100" title="XP Shop">
                                <ShoppingCart className="w-5 h-5" />
                            </Link>
                            <Link href="/trophies" className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 transition-all shadow-sm border border-amber-100" title="Trophy Case">
                                <Trophy className="w-5 h-5" />
                            </Link>
                        </div>
                        <Link href="/shop" className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300 overflow-hidden hover:ring-2 hover:ring-indigo-400 transition-all" title="Customize Avatar">
                            <img src={getSavedAvatarUrl()} alt="User avatar" className="w-full h-full object-cover" />
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

                {/* Main Content Area (Learning Path) */}
                <div className="flex-1 lg:max-w-2xl mx-auto w-full">

                    {/* Course Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-serif font-extrabold text-slate-900 mb-3">Your Journey</h1>
                        <p className="text-slate-500 text-lg">Continue building your skills to unlock the next challenge.</p>
                    </div>

                    {/* The Path */}
                    <div className="relative pb-20">
                        {chapters.map((chapter, chapterIdx) => (
                            <div key={chapter.id} className="mb-16 relative">

                                {/* Chapter Header */}
                                <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border-2 border-slate-200 shadow-sm mb-12 flex items-start gap-4 mx-auto max-w-sm">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <Trophy className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-900 text-lg">{chapter.title}</h2>
                                        <p className="text-sm text-slate-500 hidden sm:block">{chapter.description}</p>
                                    </div>
                                </div>

                                {/* Nodes Layout */}
                                <div className="flex flex-col items-center gap-8 relative py-4">
                                    {/* Vertical connecting line background (under nodes) */}
                                    <div className="absolute top-0 bottom-0 left-1/2 w-8 -ml-4 pointer-events-none origin-top">
                                        <svg className="w-full h-full" preserveAspectRatio="none">
                                            <path d="M16 0 C -20 200, 50 400, 16 600 C -20 800, 50 1000, 16 1200 C -20 1400, 50 1600, 16 1800" fill="none" strokeWidth="8" strokeOpacity="0.2" className="stroke-slate-300" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    {chapter.nodes.map((node, i) => {
                                        // Specific UI based on status
                                        const isCompleted = node.status === 'completed';
                                        const isActive = node.status === 'active';
                                        const isLocked = node.status === 'locked';
                                        const isBoss = node.type === 'boss';

                                        // Colors and sizing
                                        let bgClass = "bg-slate-200"
                                        let borderClass = "border-slate-300"
                                        let iconColor = "text-slate-400"
                                        let shadowClass = ""
                                        let sizeClass = isBoss ? "w-20 h-20" : "w-16 h-16"

                                        if (isCompleted) {
                                            bgClass = "bg-amber-100"
                                            borderClass = "border-amber-200 border-b-4"
                                            iconColor = "text-amber-500"
                                            shadowClass = "shadow-[0_4px_0_0_rgb(253,230,138)]" // amber-200
                                        } else if (isActive) {
                                            bgClass = "bg-indigo-500"
                                            borderClass = "border-indigo-600 border-b-6 shadow-xl shadow-indigo-500/30"
                                            iconColor = "text-white"
                                            shadowClass = "shadow-[0_6px_0_0_rgb(79,70,229)] animate-bounce-slow" // indigo-600
                                            sizeClass = isBoss ? "w-24 h-24" : "w-20 h-20"
                                        }

                                        return (
                                            <div
                                                key={node.id}
                                                className="relative group z-10 flex flex-col items-center"
                                                style={{ transform: `translateX(${node.position}px)` }}
                                            >

                                                {/* Active State Tooltip/Label */}
                                                {isActive && (
                                                    <div className="absolute -top-12 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200 font-bold text-slate-800 text-sm whitespace-nowrap z-20 tooltip-arrow opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                                        START
                                                    </div>
                                                )}

                                                <button
                                                    disabled={isLocked}
                                                    onClick={() => handleNodeClick(node)}
                                                    className={`
                                                        ${sizeClass} rounded-full flex items-center justify-center transition-all duration-200 relative
                                                        ${bgClass} ${borderClass} ${shadowClass}
                                                        ${isActive ? 'hover:brightness-110 hover:-translate-y-1 active:translate-y-1 active:border-b-0 active:shadow-none cursor-pointer' : ''}
                                                        ${isCompleted ? 'hover:brightness-110 cursor-pointer' : ''}
                                                        ${isLocked ? 'cursor-not-allowed opacity-80' : ''}
                                                    `}
                                                >
                                                    {/* Inner icon element */}
                                                    {isCompleted && (
                                                        <CheckCircle2 className={`w-8 h-8 ${iconColor}`} />
                                                    )}
                                                    {isActive && (
                                                        isBoss ? <Trophy className={`w-10 h-10 ${iconColor}`} /> : <Play className={`w-10 h-10 ml-1 ${iconColor} fill-white`} />
                                                    )}
                                                    {isLocked && (
                                                        <Lock className={`w-6 h-6 ${iconColor}`} />
                                                    )}

                                                    {/* Boss crown */}
                                                    {isBoss && !isCompleted && (
                                                        <div className="absolute -top-4 text-amber-500">
                                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" /></svg>
                                                        </div>
                                                    )}
                                                </button>

                                                <span className={`mt-2 font-bold text-sm max-w-[140px] text-center ${isActive ? 'text-indigo-900' : 'text-slate-500'} ${isLocked ? 'opacity-50' : ''}`}>
                                                    {node.title}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right Sidebar (Stats & Goals) */}
                <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">

                    {/* Challenge Inbox */}
                    <ChallengeInbox invites={invites} onAcceptChallenge={handleAcceptChallenge} />

                    {/* Weekly Goal Card */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 rounded-bl-full pointer-events-none"></div>

                        <div className="flex items-center gap-3 mb-4">
                            <Target className="w-6 h-6 text-slate-800" />
                            <h3 className="font-bold text-slate-800 text-lg">Daily Goal</h3>
                        </div>

                        <div className="flex items-end gap-2 mb-3">
                            <span className="text-3xl font-extrabold text-indigo-600">1</span>
                            <span className="text-slate-500 font-bold mb-1">/ 5 mins</span>
                        </div>

                        <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                            <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '20%' }}></div>
                        </div>

                    </div>

                    {/* Quick Start Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                        <h3 className="font-bold text-xl mb-2 relative z-10">Up Next</h3>
                        <p className="text-indigo-100 text-sm mb-6 relative z-10 h-10 overflow-hidden text-ellipsis line-clamp-2">
                            Mastering the core mechanics of your skill. Focus on precision.
                        </p>

                        <button className="w-full py-3 px-4 bg-white text-indigo-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:shadow-lg transition-all active:scale-95 relative z-10">
                            <span>Continue Learning</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Unlock Premium or extra feature */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm flex items-start gap-4 hover:border-indigo-300 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Challenge a Friend</h4>
                            <p className="text-sm text-slate-500 mt-1">Earn double XP by winning a knowledge duel.</p>
                        </div>
                    </div>

                </div>
            </div>

            <LessonModal
                isOpen={isLessonModalOpen}
                onClose={() => setIsLessonModalOpen(false)}
                lesson={selectedLesson}
                onComplete={handleLessonComplete}
                challengeInvite={activeInvite}
            />

            {/* Custom Styles for Tooltip Arrow & Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .tooltip-arrow::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -6px;
                    border-width: 6px;
                    border-style: solid;
                    border-color: white transparent transparent transparent;
                }
                .border-b-6 {
                    border-bottom-width: 6px;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(-5%); }
                    50% { transform: translateY(0); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite ease-in-out;
                }
            `}} />

        </div>
    )
}
