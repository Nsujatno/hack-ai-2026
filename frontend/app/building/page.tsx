'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles, Loader2, Server, Cog, Video, BookOpen, CheckCircle2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

const PHASES = [
    { title: 'Analyzing Topic', icon: Lightbulb, delayMs: 0 },
    { title: 'Structuring Curriculum', icon: BookOpen, delayMs: 3000 },
    { title: 'Drafting Scripts', icon: Cog, delayMs: 6000 },
    { title: 'Generating AI Video', icon: Video, delayMs: 9000 },
]

function Lightbulb(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
        </svg>
    )
}

export default function BuildingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const jobId = searchParams.get('job_id')
    const [status, setStatus] = useState<'processing' | 'completed' | 'failed' | 'error'>('processing')
    const [errorMessage, setErrorMessage] = useState('')
    const [currentPhase, setCurrentPhase] = useState(0)

    useEffect(() => {
        if (!jobId) {
            setErrorMessage('No job ID provided')
            setStatus('error')
            return
        }

        const pollJob = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/onboarding/job/${jobId}`)
                if (!res.ok) {
                    throw new Error('Failed to get job status')
                }
                const data = await res.json()
                
                if (data.status === 'completed') {
                    setStatus('completed')
                    // Wait a brief moment before navigating
                    setTimeout(() => {
                        router.push('/dashboard')
                    }, 1000)
                } else if (data.status === 'failed') {
                    setStatus('failed')
                    setErrorMessage(data.error || 'Server processing failed')
                }
                // If 'processing', we do nothing and wait for next poll
            } catch (err: any) {
                console.error("Polling error:", err)
            }
        }

        // Poll every 3 seconds
        const pollInterval = setInterval(pollJob, 3000)
        
        // Run initial poll right away
        pollJob()

        return () => clearInterval(pollInterval)
    }, [jobId, router])

    // Fake phase progression for a better UX while waiting
    useEffect(() => {
        if (status !== 'processing') return
        
        const timers = PHASES.map((phase, idx) => {
            if (phase.delayMs === 0) return null
            return setTimeout(() => {
                setCurrentPhase((prev) => Math.max(prev, idx))
            }, phase.delayMs)
        })
        
        return () => {
            timers.forEach(t => t && clearTimeout(t))
        }
    }, [status])

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-50 rounded-full blur-3xl pointer-events-none" />
                
                <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 relative shadow-lg shadow-indigo-200 z-10 animate-pulse">
                    <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <Server className="w-4 h-4 text-amber-900" />
                    </div>
                </div>

                <h1 className="text-3xl font-serif font-extrabold text-slate-900 mb-2 relative z-10">
                    {status === 'completed' ? 'Course Ready!' : 'Compiling Curriculum...'}
                </h1>
                
                <p className="text-slate-500 mb-10 max-w-sm relative z-10">
                    {status === 'completed' 
                        ? 'Heading to your dashboard now.' 
                        : 'Our AI engineers are drafting scripts, planning lessons, and generating video content. This usually takes about 60–90 seconds.'}
                </p>

                {status === 'processing' && (
                    <div className="w-full space-y-4 mb-4 relative z-10">
                        {PHASES.map((phase, idx) => {
                            const isPast = currentPhase > idx
                            const isCurrent = currentPhase === idx
                            const Icon = phase.icon
                            
                            return (
                                <div 
                                    key={idx} 
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500
                                        ${isPast ? 'bg-slate-50 border-slate-200' : ''}
                                        ${isCurrent ? 'bg-indigo-50 border-indigo-200 shadow-sm' : ''}
                                        ${!isPast && !isCurrent ? 'bg-white border-transparent opacity-40 grayscale' : ''}
                                    `}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                        ${isPast ? 'bg-slate-200 text-slate-500' : ''}
                                        ${isCurrent ? 'bg-indigo-600 text-white' : ''}
                                        ${!isPast && !isCurrent ? 'bg-slate-100 text-slate-400' : ''}
                                    `}>
                                        {isPast ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <span className={`font-bold
                                        ${isPast ? 'text-slate-600' : ''}
                                        ${isCurrent ? 'text-indigo-900' : ''}
                                        ${!isPast && !isCurrent ? 'text-slate-400' : ''}
                                    `}>
                                        {phase.title}
                                    </span>
                                    {isCurrent && (
                                        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin ml-auto" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
                
                {status === 'failed' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold w-full border border-red-200 relative z-10">
                        Generation failed: {errorMessage}
                        <button 
                            className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            onClick={() => router.push('/survey')}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-xl font-bold w-full border border-orange-200 relative z-10">
                        {errorMessage}
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                `
            }} />
        </div>
    )
}
