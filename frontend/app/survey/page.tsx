'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, BookOpen, Target, Sparkles, Clock, CheckCircle2, MonitorPlay, Palette, GraduationCap, Compass, Briefcase, Smile, Zap, Coffee, Dumbbell, Feather } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type SurveyData = {
    topic: string;
    skillLevel: string;
    goal: string;
    tone: string;
    timeCommitment: string;
};

const SKILL_LEVELS = [
    { id: 'beginner', title: 'Complete beginner', description: 'I have never done this before.' },
    { id: 'basics', title: 'I know the basics', description: 'I have basic foundational knowledge.' },
    { id: 'intermediate', title: 'Intermediate', description: "I've practiced but have gaps." },
    { id: 'advanced', title: 'Advanced', description: 'I want to refine specific areas.' }
];

const GOALS = [
    { id: 'career', title: 'Career & Professional Growth', description: 'Focus on industry applications', icon: Briefcase },
    { id: 'hobby', title: 'Personal Hobby & Fun', description: 'Focus on creative and enjoyable projects', icon: Palette },
    { id: 'school', title: 'School & Academics', description: 'Focus on theory and core principles', icon: GraduationCap },
    { id: 'curious', title: 'Just Curious', description: 'Keep it high-level and interesting', icon: Compass }
];

const TONES = [
    { id: 'fun', title: 'Fun & Energetic', description: 'Upbeat, uses analogies, highly engaging', icon: Zap },
    { id: 'professional', title: 'Professional & Direct', description: 'No fluff, straight to the facts', icon: Target },
    { id: 'challenging', title: 'Challenging & Coach-like', description: 'Pushes you to beat your high score', icon: Dumbbell },
    { id: 'relaxed', title: 'Relaxed & Encouraging', description: 'Paced, supportive, easygoing', icon: Coffee }
];

const TIME_COMMITMENTS = [
    { id: '5min', title: '5 minutes', description: 'Just the daily lesson' },
    { id: '15min', title: '10–15 minutes', description: 'A consistent daily habit' },
    { id: '30min', title: '30+ minutes', description: 'Deep, focused learning' },
    { id: 'varies', title: 'It varies', description: "I'll go at my own pace" }
];

export default function SurveyPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [data, setData] = useState<SurveyData>({
        topic: '',
        skillLevel: '',
        goal: '',
        tone: '',
        timeCommitment: ''
    })

    const totalSteps = 5

    const handleNext = () => {
        if (step < totalSteps - 1) {
            setStep(s => s + 1)
        } else {
            // Finish survey
            console.log('Survey complete:', data)
            // Redirect to dashboard
            router.push('/dashboard')
        }
    }

    const handleBack = () => {
        if (step > 0) {
            setStep(s => s - 1)
        }
    }

    const progressPercentage = ((step + 1) / totalSteps) * 100

    const isStepValid = () => {
        switch (step) {
            case 0: return data.topic.trim().length > 0;
            case 1: return data.skillLevel !== '';
            case 2: return data.goal !== '';
            case 3: return data.tone !== '';
            case 4: return data.timeCommitment !== '';
            default: return false;
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/30 flex flex-col items-center pt-12 sm:pt-20 px-4 sm:px-6">

            {/* Header / Progress Bar */}
            <div className="w-full max-w-2xl mb-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold font-serif text-slate-900">SkillDuel</span>
                    </div>
                    <button
                        className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={() => router.push('/')}
                    >
                        Skip
                    </button>
                </div>

                <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Main Content Card */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 border border-slate-100 transition-all">

                {/* Step Content */}
                <div className="min-h-[300px]">

                    {/* Step 0: Topic */}
                    {step === 0 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-serif font-extrabold text-slate-900 mb-4">What do you want to master?</h2>
                            <p className="text-slate-500 text-[16px] mb-8">We'll generate a personalized, AI-driven curriculum just for you.</p>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="topic">Topic or Skill</label>
                                <input
                                    autoFocus
                                    className="w-full px-5 py-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                                    id="topic"
                                    value={data.topic}
                                    onChange={(e) => setData({ ...data, topic: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && isStepValid() && handleNext()}
                                    placeholder="e.g. Python, Graphic Design, Personal Finance, Creative Writing..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 1: Skill Level */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-serif font-extrabold text-slate-900 mb-4">What's your current level?</h2>
                            <p className="text-slate-500 text-[16px] mb-8">This helps us dial in the starting difficulty of your lessons.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {SKILL_LEVELS.map(level => (
                                    <button
                                        key={level.id}
                                        onClick={() => setData({ ...data, skillLevel: level.id })}
                                        className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all duration-200 text-left ${data.skillLevel === level.id
                                                ? 'border-indigo-500 bg-indigo-50/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                                : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-2">
                                            <span className={`font-bold ${data.skillLevel === level.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                {level.title}
                                            </span>
                                            {data.skillLevel === level.id && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                                        </div>
                                        <span className={`text-sm ${data.skillLevel === level.id ? 'text-indigo-700' : 'text-slate-500'}`}>
                                            {level.description}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Goal */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-serif font-extrabold text-slate-900 mb-4">Why are you learning this?</h2>
                            <p className="text-slate-500 text-[16px] mb-8">We'll tailor the practical examples to match your goals.</p>

                            <div className="grid grid-cols-1 gap-4">
                                {GOALS.map(goal => {
                                    const Icon = goal.icon;
                                    return (
                                        <button
                                            key={goal.id}
                                            onClick={() => setData({ ...data, goal: goal.id })}
                                            className={`flex items-center p-5 rounded-2xl border-2 transition-all duration-200 text-left group ${data.goal === goal.id
                                                    ? 'border-indigo-500 bg-indigo-50/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                                    : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-5 transition-colors ${data.goal === goal.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                                                }`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span className={`font-bold text-lg mb-1 ${data.goal === goal.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                    {goal.title}
                                                </span>
                                                <span className={`text-sm ${data.goal === goal.id ? 'text-indigo-700' : 'text-slate-500'}`}>
                                                    {goal.description}
                                                </span>
                                            </div>
                                            {data.goal === goal.id && <CheckCircle2 className="w-6 h-6 text-indigo-500 ml-4" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Tone */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-serif font-extrabold text-slate-900 mb-4">Choose your AI Instructor</h2>
                            <p className="text-slate-500 text-[16px] mb-8">How would you like your interactive guide to sound?</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {TONES.map(tone => {
                                    const Icon = tone.icon;
                                    return (
                                        <button
                                            key={tone.id}
                                            onClick={() => setData({ ...data, tone: tone.id })}
                                            className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all duration-200 text-left group gap-4 ${data.tone === tone.id
                                                    ? 'border-indigo-500 bg-indigo-50/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                                    : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex w-full justify-between items-start">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${data.tone === tone.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                {data.tone === tone.id && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold text-lg mb-1 ${data.tone === tone.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                    {tone.title}
                                                </h3>
                                                <p className={`text-sm leading-relaxed ${data.tone === tone.id ? 'text-indigo-700' : 'text-slate-500'}`}>
                                                    {tone.description}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Time Commitment */}
                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-serif font-extrabold text-slate-900 mb-4">Set your daily goal</h2>
                            <p className="text-slate-500 text-[16px] mb-8">How much time can you commit to SkillDuel each day?</p>

                            <div className="grid grid-cols-1 gap-4">
                                {TIME_COMMITMENTS.map(time => (
                                    <button
                                        key={time.id}
                                        onClick={() => setData({ ...data, timeCommitment: time.id })}
                                        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left ${data.timeCommitment === time.id
                                                ? 'border-indigo-500 bg-indigo-50/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                                : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`font-bold text-lg mb-1 ${data.timeCommitment === time.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                {time.title}
                                            </span>
                                            <span className={`text-sm ${data.timeCommitment === time.id ? 'text-indigo-700' : 'text-slate-500'}`}>
                                                {time.description}
                                            </span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${data.timeCommitment === time.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                                            }`}>
                                            {data.timeCommitment === time.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Controls */}
                <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={step === 0}
                        className={`font-semibold py-2 px-4 rounded-xl transition-colors ${step === 0
                                ? 'text-slate-300 cursor-not-allowed opacity-0 pointer-events-none'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className={`group relative flex items-center justify-center gap-2 py-3.5 px-8 font-bold rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 ${isStepValid()
                                ? 'bg-indigo-600 text-white shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:bg-indigo-500 hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <span>{step === totalSteps - 1 ? 'Finish Setup' : 'Continue'}</span>
                        <ArrowRight className={`w-4 h-4 transition-transform ${isStepValid() ? 'group-hover:translate-x-1' : ''}`} />
                    </button>
                </div>

            </div>
        </div>
    )
}
