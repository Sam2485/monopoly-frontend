import { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { LogOut, Plus, Users, UserPlus } from 'lucide-react';

export default function Home() {
    const { user, logout, createRoom, joinRoom } = useContext(GameContext);
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [roomCode, setRoomCode] = useState('');

    const handleCreate = (e) => {
        e.preventDefault();
        createRoom(maxPlayers);
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (!roomCode.trim()) return;
        joinRoom(roomCode.toUpperCase());
    };

    return (
        <div className="flex min-height-screen items-center justify-center bg-radial from-[#1e1b4b] to-[#09090b] px-4 py-12 w-full min-h-screen">
            <div className="w-full max-w-2xl">
                {/* Header User Panel */}
                <div className="glass relative mb-8 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.username}`}
                            alt="Avatar"
                            className="h-14 w-14 rounded-xl border border-purple-500/20 bg-purple-950/20 p-1"
                        />
                        <div className="text-left">
                            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">Welcome Back</p>
                            <h2 className="text-2xl font-bold text-white m-0">{user?.username}</h2>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/10 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>

                {/* Actions Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Create Room Box */}
                    <div className="glass-premium flex flex-col justify-between rounded-2xl p-8 text-center">
                        <div className="mb-6 flex flex-col items-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 glow-primary">
                                <Plus className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Create Game Room</h3>
                            <p className="mt-1 text-sm text-slate-400">Host a lobby and invite your friends</p>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="text-left">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Max Players</label>
                                <select
                                    value={maxPlayers}
                                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                                    className="mt-2 w-full rounded-lg bg-slate-900/50 border border-slate-700/50 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
                                >
                                    {[2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} Players</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors focus:outline-none glow-primary cursor-pointer"
                            >
                                <Users className="h-4 w-4" />
                                Host New Lobby
                            </button>
                        </form>
                    </div>

                    {/* Join Room Box */}
                    <div className="glass-premium flex flex-col justify-between rounded-2xl p-8 text-center">
                        <div className="mb-6 flex flex-col items-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                                <UserPlus className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Join Room</h3>
                            <p className="mt-1 text-sm text-slate-400">Enter a code to join an existing lobby</p>
                        </div>

                        <form onSubmit={handleJoin} className="space-y-4">
                            <div className="text-left">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Room Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    className="mt-2 w-full rounded-lg bg-slate-900/50 border border-slate-700/50 px-4 py-3 text-sm text-white placeholder-slate-500 uppercase focus:border-indigo-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors focus:outline-none cursor-pointer"
                            >
                                <UserPlus className="h-4 w-4" />
                                Join Room Code
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
