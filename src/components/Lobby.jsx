import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { Crown, Play, CheckCircle, XCircle, LogOut } from 'lucide-react';

export default function Lobby() {
    const { user, room, leaveRoom, toggleReady, startGame } = useContext(GameContext);

    if (!room) return null;

    const isHost = room.players.find(p => p.host)?.username === user.username;
    const allPlayersReady = room.players.filter(p => !p.host).every(p => p.ready);
    const canStart = room.players.length >= 2 && allPlayersReady;

    const currentPlayer = room.players.find(p => p.username === user.username);

    return (
        <div className="flex min-height-screen items-center justify-center bg-radial from-[#1e1b4b] to-[#09090b] px-4 py-12 w-full min-h-screen">
            <div className="w-full max-w-xl">
                <div className="glass-premium rounded-2xl p-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between border-b border-slate-700/50 pb-6">
                        <div className="text-left">
                            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">Waiting Lobby</p>
                            <h2 className="text-3xl font-extrabold text-white m-0">Lobby Code</h2>
                        </div>
                        <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 px-6 py-2 text-2xl font-black tracking-widest text-purple-400 glow-primary select-all">
                            {room.roomCode}
                        </div>
                    </div>

                    {/* Player Cards List */}
                    <div className="space-y-4 mb-8">
                        <p className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Players Joined ({room.players.length})</p>
                        {room.players.map((player) => (
                            <div key={player.playerId} className="glass flex items-center justify-between rounded-xl p-4 transition-all hover:border-slate-600/50">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={player.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.username}`}
                                        alt="Avatar"
                                        className="h-10 w-10 rounded-lg bg-slate-900/50 p-0.5"
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-sm">{player.username}</span>
                                        {player.host && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                <Crown className="h-3 w-3" />
                                            </span>
                                        )}
                                        {player.username === user.username && (
                                            <span className="rounded bg-slate-700/50 px-2 py-0.5 text-[10px] uppercase font-semibold text-slate-300">You</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {player.host ? (
                                        <span className="rounded bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-xs font-bold text-purple-400">Host</span>
                                    ) : (
                                        player.ready ? (
                                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                                                <CheckCircle className="h-4 w-4" /> Ready
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                                <XCircle className="h-4 w-4" /> Waiting
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions Panel */}
                    <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-700/50 pt-6">
                        <button
                            onClick={leaveRoom}
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-5 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-all cursor-pointer w-full sm:w-auto"
                        >
                            <LogOut className="h-4 w-4" />
                            Leave Room
                        </button>

                        <div className="flex-1 flex gap-4">
                            {!isHost && (
                                <button
                                    onClick={toggleReady}
                                    className={`flex-1 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-all cursor-pointer ${
                                        currentPlayer?.ready
                                            ? 'bg-emerald-600 hover:bg-emerald-500 glow-success'
                                            : 'bg-purple-600 hover:bg-purple-500 glow-primary'
                                    }`}
                                >
                                    {currentPlayer?.ready ? 'Ready!' : 'Mark Ready'}
                                </button>
                            )}

                            {isHost && (
                                <button
                                    onClick={startGame}
                                    disabled={!canStart}
                                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-all ${
                                        canStart
                                            ? 'bg-purple-600 hover:bg-purple-500 glow-primary cursor-pointer'
                                            : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                                    }`}
                                >
                                    <Play className="h-4 w-4" />
                                    Start Match
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
