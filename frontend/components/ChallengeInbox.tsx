import { useState } from 'react'
import { Trophy, Swords, X, Check, Clock } from 'lucide-react'

export interface ChallengeInvite {
    id: string
    challengerName: string
    challengerAvatarId: string
    lessonTitle: string
    challengerScore: number
    totalQuestions: number
    status: 'pending' | 'completed'
    won?: boolean
    timestamp: string
}

const MOCK_INBOX_DATA: ChallengeInvite[] = [
    {
        id: 'c1',
        challengerName: 'AlexChen',
        challengerAvatarId: 'Aneka',
        lessonTitle: 'Core Mechanics',
        challengerScore: 3,
        totalQuestions: 3,
        status: 'pending',
        timestamp: '2h ago'
    },
    {
        id: 'c2',
        challengerName: 'SarahDev',
        challengerAvatarId: 'Jocelyn',
        lessonTitle: 'First Mini-Project',
        challengerScore: 2,
        totalQuestions: 3,
        status: 'completed',
        won: true,
        timestamp: '1d ago'
    },
    {
        id: 'c3',
        challengerName: 'CodeMaster99',
        challengerAvatarId: 'Jack',
        lessonTitle: 'Introduction & Setup',
        challengerScore: 3,
        totalQuestions: 3,
        status: 'completed',
        won: false,
        timestamp: '3d ago'
    }
]

interface ChallengeInboxProps {
    onAcceptChallenge: (challenge: ChallengeInvite) => void
}

export function ChallengeInbox({ onAcceptChallenge }: ChallengeInboxProps) {
    const [invites] = useState<ChallengeInvite[]>(MOCK_INBOX_DATA)

    const pendingCount = invites.filter(i => i.status === 'pending').length

    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <Swords className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold text-slate-900 font-serif">Challenge Inbox</h3>
                </div>
                {pendingCount > 0 && (
                    <div className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                        {pendingCount} New
                    </div>
                )}
            </div>

            <div className="divide-y divide-slate-100">
                {invites.map((invite) => (
                    <div key={invite.id} className="p-5 hover:bg-slate-50 transition-colors flex items-start sm:items-center gap-4 flex-col sm:flex-row cursor-pointer group">

                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${invite.challengerAvatarId}`}
                                alt={invite.challengerName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2 mb-1">
                                <h4 className="font-bold text-slate-900 truncate">
                                    {invite.status === 'pending' ? (
                                        <span><span className="text-indigo-600">{invite.challengerName}</span> challenged you!</span>
                                    ) : (
                                        <span>vs {invite.challengerName}</span>
                                    )}
                                </h4>
                                <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{invite.timestamp}</span>
                            </div>
                            <p className="text-sm text-slate-500 truncate mb-2">Lesson: {invite.lessonTitle}</p>

                            {/* Actions / Status */}
                            {invite.status === 'pending' ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onAcceptChallenge(invite)}
                                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1"
                                    >
                                        <Swords className="w-3 h-3" /> Accept
                                    </button>
                                    <button className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                                        <X className="w-3 h-3" /> Decline
                                    </button>
                                </div>
                            ) : (
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${invite.won ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {invite.won ? <Trophy className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                                    {invite.won ? 'Victory' : 'Defeat'}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {invites.length === 0 && (
                    <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                        <Clock className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">No recent challenges. Finish a lesson to invite a friend!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
