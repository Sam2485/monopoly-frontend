import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { Trophy, Home as HomeIcon } from 'lucide-react';

export default function WinnerScreen() {
    const { game } = useContext(GameContext);

    if (!game) return null;

    const winnerId = game.winnerId;
    const winner = game.players.find(p => p.playerId === winnerId);

    const handleReturn = () => {
        // Go home by simple state transition or logout/reset
        window.location.reload();
    };

    return (
        <div className="flex min-height-screen items-center justify-center bg-radial from-[#1e1b4b] to-[#09090b] px-4 py-12 w-full min-h-screen">
            <div className="w-full max-w-md">
                <div className="glass-premium rounded-3xl p-8 text-center glow-primary relative overflow-hidden">
                    {/* Confetti-like ambient glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>

                    {/* Trophy icon */}
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 mx-auto border border-amber-500/30 glow-primary scale-110 animate-bounce">
                        <Trophy className="h-10 w-10" />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Match Completed</p>
                    <h2 className="text-3xl font-black text-white mt-1 mb-6">VICTORY</h2>

                    {/* Winner Card */}
                    {winner ? (
                        <div className="glass rounded-2xl p-6 mb-8 flex flex-col items-center gap-4">
                            <img
                                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${winner.username}`}
                                alt={winner.username}
                                className="h-20 w-20 rounded-2xl border-2 border-amber-500/40 bg-slate-900/50 p-1"
                            />
                            <div>
                                <h3 className="text-2xl font-extrabold text-white m-0">{winner.username}</h3>
                                <p className="text-sm text-slate-400 mt-1">Declared the ultimate business tycoon!</p>
                            </div>
                            <div className="w-full border-t border-slate-800 pt-4 flex justify-between text-sm text-slate-400">
                                <span>Final Assets:</span>
                                <span className="font-bold text-emerald-400">₹{winner.balance}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 mb-8">The match ended but the winner could not be resolved.</p>
                    )}

                    {/* Buttons */}
                    <button
                        onClick={handleReturn}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-purple-500 transition-colors glow-primary cursor-pointer"
                    >
                        <HomeIcon className="h-4.5 w-4.5" />
                        Return to Main Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
