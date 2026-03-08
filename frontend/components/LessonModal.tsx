'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Play, Pause, CheckCircle2, AlertCircle, Sparkles, ChevronRight } from 'lucide-react'

// Types for our Quiz Data
export interface QuizQuestion {
    id: string
    text: string
    options: {
        id: string
        text: string
        isCorrect: boolean
    }[]
    explanation: string
}

export interface LessonData {
    id: string
    title: string
    description: string
    duration: number // simulated duration in seconds
    videoUrl?: string
    questions: QuizQuestion[]
}

interface LessonModalProps {
    isOpen: boolean
    onClose: () => void
    lesson: LessonData | null
    onComplete: (xpEarned: number) => void
}

export function LessonModal({ isOpen, onClose, lesson, onComplete }: LessonModalProps) {
    // --- State ---
    // 'video' | 'transitioning' | 'quiz' | 'completed'
    const [phase, setPhase] = useState<'video' | 'transitioning' | 'quiz' | 'completed'>('video')

    // Video State
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0) // 0 to 100

    // Quiz State
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    // Refs for simulation
    const progressInterval = useRef<NodeJS.Timeout | null>(null)

    // --- Reset State when Modal Opens ---
    useEffect(() => {
        if (isOpen) {
            setPhase('video')
            setIsPlaying(false)
            setProgress(0)
            setCurrentQuestionIdx(0)
            setSelectedOptionId(null)
            setIsSubmitted(false)
            setScore(0)
        } else {
            // Cleanup on close
            if (progressInterval.current) {
                clearInterval(progressInterval.current)
            }
        }
    }, [isOpen])

    // --- Video Simulation Logic ---
    useEffect(() => {
        if (isPlaying && phase === 'video' && lesson) {
            // Simulate video progress
            // We'll tick every 100ms
            const tickRate = 100
            const totalDurationMs = lesson.duration * 1000
            const progressPerTick = (tickRate / totalDurationMs) * 100

            progressInterval.current = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + progressPerTick
                    if (next >= 100) {
                        // Video finished
                        clearInterval(progressInterval.current!)
                        setIsPlaying(false)
                        handleVideoComplete()
                        return 100
                    }
                    return next
                })
            }, tickRate)
        } else if (progressInterval.current) {
            clearInterval(progressInterval.current)
        }

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current)
        }
    }, [isPlaying, phase, lesson])

    const togglePlay = () => {
        if (progress >= 100) return
        setIsPlaying(!isPlaying)
    }

    const handleVideoComplete = () => {
        // Trigger the transition animation
        setPhase('transitioning')

        // After a short delay, move to the quiz phase
        setTimeout(() => {
            setPhase('quiz')
        }, 1000) // Match the 1000ms CSS duration
    }

    // --- Quiz Logic ---
    const handleOptionSelect = (id: string) => {
        if (isSubmitted) return
        setSelectedOptionId(id)
    }

    const handleQuizSubmit = () => {
        if (!selectedOptionId || !lesson) return

        setIsSubmitted(true)

        const currentQ = lesson.questions[currentQuestionIdx]
        const isCorrect = currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect

        if (isCorrect) {
            setScore(prev => prev + 10) // 10 XP per correct answer
        }
    }

    const handleNextQuestion = () => {
        if (!lesson) return

        if (currentQuestionIdx < lesson.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1)
            setSelectedOptionId(null)
            setIsSubmitted(false)
        } else {
            // Quiz finished
            setPhase('completed')
        }
    }

    const handleFinish = () => {
        onComplete(score)
        onClose()
    }


    // --- Render Helpers ---
    if (!isOpen || !lesson) return null

    const currentQ = lesson.questions[currentQuestionIdx]
    const isCorrectSelection = isSubmitted && currentQ?.options.find(o => o.id === selectedOptionId)?.isCorrect

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-300">
            {/* Dark/Glass Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className={`
                    relative bg-slate-50 w-full max-h-[90vh] overflow-hidden shadow-2xl rounded-3xl border border-slate-200/50 flex flex-col md:flex-row transition-all duration-700 ease-in-out
                    ${phase === 'video' ? 'max-w-4xl' : 'max-w-6xl'}
                `}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-slate-200/50 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors backdrop-blur-md border border-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* ========================================================= */}
                {/* LEFT SIDE: Video Player (Takes full width in 'video' phase) */}
                {/* ========================================================= */}
                <div
                    className={`
                        relative bg-slate-900 flex flex-col justify-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0
                        ${phase === 'video' ? 'w-full aspect-video md:aspect-auto md:h-[600px]' : 'w-full md:w-[400px] aspect-video md:aspect-auto h-[300px] md:h-auto border-b md:border-b-0 md:border-r border-slate-800'}
                    `}
                >
                    {/* Video Player or Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-slate-900 flex flex-col items-center justify-center text-center group overflow-hidden">
                        
                        {lesson.videoUrl ? (
                            <video
                                ref={(el) => {
                                    if (el) {
                                        // Synchronize play state
                                        if (isPlaying && el.paused) el.play().catch(console.error)
                                        if (!isPlaying && !el.paused) el.pause()
                                    }
                                }}
                                src={lesson.videoUrl}
                                className="w-full h-full object-cover"
                                onTimeUpdate={(e) => {
                                    const target = e.currentTarget
                                    if (target.duration) {
                                        setProgress((target.currentTime / target.duration) * 100)
                                    }
                                }}
                                onEnded={() => {
                                    setIsPlaying(false)
                                    handleVideoComplete()
                                }}
                                // We disable standard controls so we can use our custom overlay
                                playsInline
                            />
                        ) : (
                            <div className="p-8">
                                {/* Placeholder Content if no videoUrl is provided */}
                                <div className={`mt-6 text-indigo-200/50 font-mono text-sm uppercase tracking-widest ${isPlaying ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                                    Lesson Video (Placeholder)
                                </div>
                            </div>
                        )}

                        {/* Custom Video Controls Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                            <div className="text-white/80 font-medium text-left">{lesson.title}</div>

                            <div className="flex flex-col gap-2 relative z-20">
                                {/* Progress Bar */}
                                <div
                                    className="h-2 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                                    onPointerDown={(e) => {
                                        e.currentTarget.setPointerCapture(e.pointerId)
                                        const bounds = e.currentTarget.getBoundingClientRect()
                                        const x = e.clientX - bounds.left
                                        const newProgress = Math.min(Math.max((x / bounds.width) * 100, 0), 100)
                                        setProgress(newProgress)
                                        
                                        // Try to skip real video if present
                                        const videoEl = e.currentTarget.closest('.group')?.querySelector('video')
                                        if (videoEl && videoEl.duration) {
                                            videoEl.currentTime = (newProgress / 100) * videoEl.duration
                                        }

                                        e.currentTarget.dataset.dragging = "true"
                                        if (isPlaying) {
                                            setIsPlaying(false)
                                            e.currentTarget.dataset.wasPlaying = "true"
                                        }
                                    }}
                                    onPointerMove={(e) => {
                                        if (e.currentTarget.dataset.dragging === "true") {
                                            const bounds = e.currentTarget.getBoundingClientRect()
                                            const x = e.clientX - bounds.left
                                            const newProgress = Math.min(Math.max((x / bounds.width) * 100, 0), 100)
                                            setProgress(newProgress)
                                            
                                            // Optional: scrub video while dragging
                                            const videoEl = e.currentTarget.closest('.group')?.querySelector('video')
                                            if (videoEl && videoEl.duration) {
                                                videoEl.currentTime = (newProgress / 100) * videoEl.duration
                                            }
                                        }
                                    }}
                                    onPointerUp={(e) => {
                                        e.currentTarget.releasePointerCapture(e.pointerId)
                                        e.currentTarget.dataset.dragging = "false"
                                        if (progress >= 100) {
                                            setIsPlaying(false)
                                            handleVideoComplete()
                                        } else if (e.currentTarget.dataset.wasPlaying === "true") {
                                            setIsPlaying(true)
                                            e.currentTarget.dataset.wasPlaying = "false"
                                        }
                                    }}
                                >
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-100 ease-linear rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                {/* Controls */}
                                <div className="flex items-center gap-4 text-white">
                                    <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
                                        {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                                    </button>
                                    <span className="text-sm font-mono opacity-80">
                                        {Math.floor((progress / 100) * lesson.duration)}s / {lesson.duration}s
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Central Play Button (if not playing and not finished) */}
                        {!isPlaying && progress < 100 && (
                            <button
                                onClick={togglePlay}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-110 transition-all duration-300 z-10"
                            >
                                <Play className="w-8 h-8 ml-1 fill-white" />
                            </button>
                        )}

                        {/* Skip Video Button */}
                        {phase === 'video' && (
                            <button
                                onClick={() => {
                                    setProgress(100)
                                    setIsPlaying(false)
                                    handleVideoComplete()
                                }}
                                className="absolute top-6 right-6 px-4 py-2 bg-black/30 hover:bg-black/50 text-white/80 hover:text-white rounded-full text-sm font-medium transition-colors border border-white/10 flex items-center gap-2 backdrop-blur-md z-20 group-hover:opacity-100 md:opacity-0 animate-in fade-in"
                            >
                                Skip Video
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ========================================================= */}
                {/* RIGHT SIDE: Quiz Interface (Hidden in 'video' phase)      */}
                {/* ========================================================= */}
                <div
                    className={`
                        flex-1 flex flex-col bg-slate-50 relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
                        ${phase === 'video' ? 'w-0 opacity-0 flex-none' : 'w-full opacity-100 p-6 md:p-10'}
                    `}
                >
                    {(phase === 'quiz' || phase === 'completed' || phase === 'transitioning') && (
                        <div className={`
                            h-full flex flex-col transition-all duration-700
                            ${phase === 'transitioning' ? 'opacity-0 translate-x-12' : 'opacity-100 translate-x-0 delay-300'}
                        `}>

                            {phase === 'completed' ? (
                                // --- COMPLETED STATE ---
                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/20 animate-bounce">
                                        <Sparkles className="w-12 h-12 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Lesson Complete!</h2>
                                        <p className="text-lg text-slate-500">You earned <span className="font-bold text-amber-500">+{score} XP</span></p>
                                    </div>
                                    <button
                                        onClick={handleFinish}
                                        className="mt-4 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            ) : (
                                // --- QUIZ STATE ---
                                <>
                                    <div className="mb-8 relative">

                                        {/* Header Row */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">
                                                    Knowledge Check
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    Question {currentQuestionIdx + 1} of {lesson.questions.length}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setPhase('video')
                                                    setProgress(99) // don't set to 100 or it immediately triggers completion again
                                                    setIsPlaying(false)
                                                }}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg"
                                            >
                                                <Play className="w-3 h-3 fill-indigo-600" />
                                                Re-watch Video
                                            </button>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                                            {currentQ.text}
                                        </h3>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        {currentQ.options.map((option, idx) => {
                                            const isSelected = selectedOptionId === option.id

                                            // Determine styling based on state
                                            let cardClass = "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700"
                                            let iconClass = "border-slate-300 text-slate-400"

                                            if (isSelected && !isSubmitted) {
                                                cardClass = "bg-indigo-50 border-indigo-500 shadow-[0_0_0_1px_rgba(99,102,241,1)] text-indigo-900"
                                                iconClass = "bg-indigo-600 border-indigo-600 text-white"
                                            } else if (isSubmitted) {
                                                if (option.isCorrect) {
                                                    cardClass = "bg-emerald-50 border-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,1)] text-emerald-900"
                                                    iconClass = "bg-emerald-500 border-emerald-500 text-white"
                                                } else if (isSelected && !option.isCorrect) {
                                                    cardClass = "bg-rose-50 border-rose-300 text-rose-900 opacity-60"
                                                    iconClass = "bg-rose-500 border-rose-500 text-white"
                                                } else {
                                                    cardClass = "bg-white border-slate-200 text-slate-400 opacity-60"
                                                }
                                            }

                                            return (
                                                <button
                                                    key={option.id}
                                                    disabled={isSubmitted}
                                                    onClick={() => handleOptionSelect(option.id)}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${cardClass}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-colors ${iconClass}`}>
                                                        {isSubmitted && option.isCorrect ? (
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        ) : (
                                                            String.fromCharCode(65 + idx) // A, B, C, D...
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-[15px]">{option.text}</span>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* Bottom Area: Feedback & Actions */}
                                    <div className="mt-8 pt-6 border-t border-slate-200 min-h-[120px] flex flex-col justify-end">
                                        {!isSubmitted ? (
                                            <button
                                                onClick={handleQuizSubmit}
                                                disabled={!selectedOptionId}
                                                className={`
                                                    w-full py-3.5 rounded-xl font-bold transition-all duration-200
                                                    ${selectedOptionId
                                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:-translate-y-0.5 cursor-pointer'
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    }
                                                `}
                                            >
                                                Check Answer
                                            </button>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-2 fade-in duration-300">

                                                {/* Feedback Banner */}
                                                <div className={`relative flex items-center gap-3 p-4 rounded-xl flex-1 w-full overflow-visible ${isCorrectSelection ? 'bg-emerald-100/50 text-emerald-800 border-2 border-emerald-400/50' : 'bg-rose-100/50 text-rose-800'}`}>
                                                    {isCorrectSelection ? (
                                                        <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0 animate-in zoom-in duration-300" />
                                                    ) : (
                                                        <AlertCircle className="w-8 h-8 text-rose-500 flex-shrink-0" />
                                                    )}
                                                    <div>
                                                        <h4 className="font-extrabold text-lg">{isCorrectSelection ? 'Excellent!' : 'Not quite right.'}</h4>
                                                        <p className="text-sm opacity-90 font-medium">{currentQ.explanation}</p>
                                                    </div>

                                                    {/* Floating XP Badge */}
                                                    {isCorrectSelection && (
                                                        <div
                                                            key={`xp-${currentQuestionIdx}`}
                                                            className="absolute -top-4 -right-2 bg-indigo-700 text-amber-300 px-4 py-1.5 rounded-xl font-black text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-700/40 animate-bounce rotate-3 border-2 border-indigo-500"
                                                        >
                                                            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                                                            <span>+10 XP</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={handleNextQuestion}
                                                    className={`
                                                        px-8 py-4 rounded-xl font-bold text-white shadow-lg whitespace-nowrap hover:-translate-y-0.5 transition-all w-full sm:w-auto flex items-center justify-center gap-2
                                                        ${isCorrectSelection ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30' : 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/30'}
                                                    `}
                                                >
                                                    {currentQuestionIdx < lesson.questions.length - 1 ? 'Next Question' : 'Finish Lesson'}
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>

                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
