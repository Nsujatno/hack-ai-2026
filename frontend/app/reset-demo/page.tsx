'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCcw, ArrowRight } from 'lucide-react'

export default function ResetDemoPage() {
    const [status, setStatus] = useState<'resetting' | 'done'>('resetting')

    useEffect(() => {
        // Clear the dashboard persistent demo cache
        localStorage.removeItem('demo_dashboard_state')
        // Give a tiny simulated delay so it feels like it "did something"
        setTimeout(() => setStatus('done'), 600)
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                    <RefreshCcw className={`w-10 h-10 ${status === 'resetting' ? 'animate-spin' : ''}`} />
                </div>
                <h1 className="text-2xl font-black font-serif text-slate-800 mb-2">
                    Demo Reset
                </h1>
                <p className="text-slate-500 mb-8">
                    {status === 'resetting' 
                        ? 'Clearing cache and resetting the learning path...' 
                        : 'Success! The dashboard progress has been completely reset.'}
                </p>

                {status === 'done' && (
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 w-full py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm active:scale-95"
                    >
                        Return to Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                )}
            </div>
        </div>
    )
}
