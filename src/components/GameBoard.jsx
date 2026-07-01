import { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { boardData, propertyCatalogById } from '../utils/boardData';
import { 
    Dice5, 
    Home as HomeIcon, 
    DollarSign, 
    ShieldAlert, 
    LogOut,
    Building2,
    Lock,
    Unlock,
    UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function GameBoard() {
    const { 
        user, 
        game, 
        dice, 
        logs, 
        leaveRoom, 
        sendGameAction 
    } = useContext(GameContext);

    const [activeTab, setActiveTab] = useState('actions'); // 'actions' | 'assets' | 'logs'
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedPropImgError, setSelectedPropImgError] = useState(null);
    const [unownedPropImgError, setUnownedPropImgError] = useState(null);

    const getPropertyImagePath = (name, type) => {
        const value = name || type;
        if (!value) return '';
        let cleanName = value.toLowerCase().replace(/\s+/g, '_');
        if (cleanName === 'bangalore') cleanName = 'bengaluru';
        return `/images/${cleanName}.png`;
    };

    const getPropertyImageKey = (property) => (
        property?.propertyId ?? property?.propertyName ?? property?.name ?? ''
    );

    if (!game) return null;

    const me = game.players.find(p => p.username?.toLowerCase() === user?.username?.toLowerCase());
    if (!me) {
        console.error('Logged in user not found in game players list:', user?.username, game?.players);
        return (
            <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col items-center justify-center p-4 text-center">
                <p className="text-red-400 font-bold text-lg">Error: Player "{user?.username || 'Unknown'}" not found in this match.</p>
                <p className="text-slate-400 text-xs mt-1">Available players: {game.players.map(p => p.username).join(', ')}</p>
                <button 
                    onClick={leaveRoom} 
                    className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-semibold cursor-pointer"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    const isMyTurn = game.currentTurnPlayerId === me.playerId;
    const isJailed = me.status === 'IN_JAIL';
    const isRecovering = me.status === 'RECOVERY';
    const currentTile = boardData[Number(me.position)];
    const currentProperty = currentTile?.propertyId
        ? {
            ...propertyCatalogById[currentTile.propertyId],
            ...game.properties.find(p => p.propertyId === currentTile.propertyId)
        }
        : null;
    const pendingAction = (game.pendingAction || 'NONE').toUpperCase();
    const hasRolled = Boolean(
        game.hasRolled ??
        game.rolled ??
        game.diceRolled ??
        dice ??
        (pendingAction !== 'NONE' && pendingAction !== 'ROLL_DICE')
    );
    const canBuyCurrentProperty = Boolean(
        currentProperty &&
        !currentProperty.ownerId &&
        ['BUY_PROPERTY', 'PURCHASE_PROPERTY', 'BUY_ESTATE', 'PROPERTY_PURCHASE'].includes(pendingAction)
    );

    const turnPlayer = game.players.find(p => p.playerId === game.currentTurnPlayerId);
    const turnPlayerTile = turnPlayer ? boardData[Number(turnPlayer.position)] : null;
    const turnPlayerProperty = turnPlayerTile?.propertyId
        ? {
            ...propertyCatalogById[turnPlayerTile.propertyId],
            ...game.properties.find(p => p.propertyId === turnPlayerTile.propertyId)
        }
        : null;
    const showUnownedCard = Boolean(
        turnPlayerProperty &&
        !turnPlayerProperty.ownerId
    );
    const unownedPropImgKey = getPropertyImageKey(turnPlayerProperty);
    const isUnownedPropImgError = unownedPropImgError === unownedPropImgKey;
    // Color mapper for board properties
    const groupColors = {
        'DARK_BLUE': 'bg-blue-600',
        'GREEN': 'bg-emerald-600',
        'RED': 'bg-rose-600',
        'YELLOW': 'bg-amber-500',
        'RAIL_ELECTRIC': 'bg-white',
        'AIR_WATER': 'bg-cyan-600',
        'ROAD_BUS': 'bg-slate-500'
    };

    // Color indicators for player ownership borders
    const playerColors = [
        'border-red-700 shadow-[inset_0_0_16px_rgba(185,28,28,0.7)]', 
        'border-blue-700 shadow-[inset_0_0_16px_rgba(29,78,216,0.7)]',   
        'border-green-700 shadow-[inset_0_0_16px_rgba(21,128,61,0.7)]', 
        'border-orange-700 shadow-[inset_0_0_16px_rgba(194,65,12,0.7)]',  
        'border-purple-800 shadow-[inset_0_0_16px_rgba(107,33,168,0.7)]',    
        'border-[#4e342e] shadow-[inset_0_0_16px_rgba(78,52,46,0.7)]'    
    ];

    const getOwnerColorClass = (ownerId) => {
        if (!ownerId) return '';
        const idx = game.players.findIndex(p => p.playerId === ownerId);
        return idx !== -1 ? playerColors[idx % playerColors.length] : '';
    };

    const playerTextColors = [
        'text-red-400 fill-red-400',
        'text-blue-400 fill-blue-400',
        'text-green-400 fill-green-400',
        'text-orange-400 fill-orange-400',
        'text-purple-400 fill-purple-400',
        'text-[#d7ccc8] fill-[#d7ccc8]'
    ];

    const getPlayerColorClass = (ownerId) => {
        if (!ownerId) return 'text-emerald-400 fill-emerald-400';
        const idx = game.players.findIndex(p => p.playerId === ownerId);
        return idx !== -1 ? playerTextColors[idx % playerTextColors.length] : 'text-emerald-400 fill-emerald-400';
    };

    const playerBgColors = [
        'bg-red-800/70', 
        'bg-blue-800/70',   
        'bg-green-800/70', 
        'bg-orange-800/70',  
        'bg-purple-900/70',    
        'bg-[#3e2723]/70'    
    ];

    const getPlayerBgColorClass = (ownerId) => {
        if (!ownerId) return '';
        const idx = game.players.findIndex(p => p.playerId === ownerId);
        return idx !== -1 ? playerBgColors[idx % playerBgColors.length] : '';
    };

    const getPlayerBadgeClass = (playerId) => {
        const idx = game.players.findIndex(p => p.playerId === playerId);
        const badgeColors = [
            'bg-red-800 text-white shadow-[0_0_8px_rgba(185,28,28,0.6)] border-red-600/50',
            'bg-blue-800 text-white shadow-[0_0_8px_rgba(29,78,216,0.6)] border-blue-600/50',
            'bg-green-800 text-white shadow-[0_0_8px_rgba(21,128,61,0.6)] border-green-600/50',
            'bg-orange-700 text-white shadow-[0_0_8px_rgba(234,88,12,0.6)] border-orange-500/50',
            'bg-purple-900 text-white shadow-[0_0_8px_rgba(107,33,168,0.6)] border-purple-700/50',
            'bg-[#3e2723] text-white shadow-[0_0_8px_rgba(62,39,35,0.6)] border-[#4e342e]/50'
        ];
        return idx !== -1 ? badgeColors[idx % badgeColors.length] : 'bg-slate-600 border-slate-400';
    };

    const getOwnerName = (ownerId) => {
        if (!ownerId) return '';
        const p = game.players.find(pl => pl.playerId === ownerId);
        return p ? p.username : '';
    };

    const liveSelectedProperty = selectedProperty
        ? {
            ...selectedProperty,
            ...game.properties.find(p => p.propertyId === selectedProperty.propertyId)
          }
        : null;
    const selectedPropImgKey = getPropertyImageKey(selectedProperty);
    const isSelectedPropImgError = selectedPropImgError === selectedPropImgKey;

    const ownedInGroup = liveSelectedProperty
        ? game.properties.filter(p => 
            p.group === liveSelectedProperty.group && 
            p.ownerId === me.playerId && 
            !p.mortgaged
          ).length
        : 0;

    const isStandingOnSelected = Boolean(
        currentProperty &&
        liveSelectedProperty &&
        currentProperty.propertyId === liveSelectedProperty.propertyId
    );

    const canBuildOnSelected = Boolean(
        isMyTurn &&
        hasRolled &&
        !me.hasBuiltHouseThisTurn &&
        isStandingOnSelected &&
        ownedInGroup >= 3
    );

    const formatMoney = (value) => {
        if (value === undefined || value === null) return '';
        return `₹${Number(value).toLocaleString('en-IN')}`;
    };

    const getTileName = (tile, propState) => {
        if (propState) return propState.propertyName || propState.name;
        return tile?.name || tile?.type?.replaceAll('_', ' ') || '';
    };

    const getTileMeta = (tile, propState) => {
        if (propState?.price) return formatMoney(propState.price);
        if (!tile) return '';
        if (tile.type === 'CHANCE') return 'Card';
        if (tile.type === 'COMMUNITY_CHEST') return 'Card';
        if (tile.type === 'INCOME_TAX' || tile.type === 'WEALTH_TAX') return 'Tax';
        if (tile.type === 'CLUB') return 'Penalty';
        if (tile.type === 'START') return 'Collect';
        return '';
    };

    const getGridArea = (pos) => {
        if (pos >= 0 && pos <= 9) {
            return { gridRow: 10, gridColumn: 10 - pos };
        } else if (pos > 9 && pos <= 18) {
            return { gridRow: 19 - pos, gridColumn: 1 };
        } else if (pos > 18 && pos <= 27) {
            return { gridRow: 1, gridColumn: pos - 17 };
        } else {
            return { gridRow: pos - 26, gridColumn: 10 };
        }
    };

    // Handler helpers for actions
    const handleRoll = () => sendGameAction('ROLL_DICE');
    const handleBuy = (propId) => {
        if (!propId) {
            toast.error('No estate found on your current tile');
            return;
        }
        sendGameAction('BUY_PROPERTY', propId);
    };
    const handleSkip = () => sendGameAction('SKIP_PROPERTY', currentProperty?.propertyId ?? null, { endTurnAfter: true });
    const handlePayBail = () => sendGameAction('PAY_BAIL');
    const handleEndTurn = () => sendGameAction('END_TURN');

    // Build/upgrade/mortgage
    const handleBuildHouse = (propId) => sendGameAction('BUILD_HOUSE', propId);
    const handleBuildHotel = (propId) => sendGameAction('BUILD_HOTEL', propId);
    const handleSellHouse = (propId) => sendGameAction('SELL_HOUSE', propId);
    const handleSellHotel = (propId) => sendGameAction('SELL_HOTEL', propId);
    const handleMortgage = (propId) => sendGameAction('MORTGAGE', propId);
    const handleUnmortgage = (propId) => sendGameAction('UNMORTGAGE', propId);

    // Get current tile client-side description
    const getTileDesc = (tile) => {
        if (tile.propertyId) {
            const prop = game.properties.find(p => p.propertyId === tile.propertyId);
            return { ...tile.property, ...prop };
        }
        return null;
    };

    // Find players currently on a tile position
    const getPlayersOnTile = (pos) => {
        return game.players.filter(p => p.position === pos && p.status !== 'BANKRUPT');
    };

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-8 flex flex-col items-center justify-center w-full">
            {/* Top Info Bar */}
            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <img 
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${me.username}`} 
                        alt="Me" 
                        className="h-10 w-10 rounded-lg bg-slate-900 border border-purple-500/20"
                    />
                    <div className="text-left">
                        <h4 className="text-sm font-extrabold text-white m-0">{me.username} (You)</h4>
                        <p className="text-xs text-purple-400 font-bold m-0">Balance: ₹{me.balance}</p>
                    </div>
                </div>

                {/* Status message */}
                <div className="glass px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    {isMyTurn ? (
                        <span className="flex h-2.5 w-2.5 rounded-full bg-purple-500 glow-primary animate-pulse"></span>
                    ) : (
                        <span className="flex h-2.5 w-2.5 rounded-full bg-slate-600"></span>
                    )}
                    {isMyTurn ? "Your Turn" : `${game.players.find(p => p.playerId === game.currentTurnPlayerId)?.username || 'Someone'}'s Turn`}
                </div>

                <button 
                    onClick={leaveRoom}
                    className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                >
                    <LogOut className="h-4.5 w-4.5" />
                    Forfeit Match
                </button>
            </div>

            {/* Main Game Container */}
            <div className="w-full max-w-5xl grid md:grid-cols-3 gap-8 items-start">
                
                {/* 1. Player HUD (Left Panel) */}
                <div className="flex flex-col gap-4">
                    {/* Players Status list */}
                    <div className="glass-premium rounded-2xl p-6 flex flex-col gap-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 text-left mb-2">Players Status</h3>
                        {game.players.map(p => {
                            const isCurrentTurn = game.currentTurnPlayerId === p.playerId;
                            return (
                                <div 
                                    key={p.playerId} 
                                    className={`flex items-center justify-between rounded-xl p-3.5 border transition-all ${
                                        isCurrentTurn 
                                            ? 'bg-purple-950/20 border-purple-500/50 glow-primary' 
                                            : p.status === 'BANKRUPT'
                                                ? 'border-red-950 bg-red-950/5 opacity-50'
                                                : 'border-slate-800 bg-slate-900/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img 
                                                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${p.username}`} 
                                                alt={p.username} 
                                                className="h-9 w-9 rounded-lg bg-slate-950/50 border border-slate-800 p-0.5"
                                            />
                                            {p.status === 'IN_JAIL' && (
                                                <span className="absolute -bottom-1 -right-1 rounded-full bg-red-500 px-1 py-0.5 text-[8px] font-bold text-white uppercase">Jail</span>
                                            )}
                                            {p.status === 'RECOVERY' && (
                                                <span className="absolute -bottom-1 -right-1 rounded-full bg-yellow-500 px-1 py-0.5 text-[8px] font-bold text-black uppercase">Liqu</span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-semibold text-white">{p.username}</span>
                                                {isCurrentTurn && <span className="flex h-1.5 w-1.5 rounded-full bg-purple-500 animate-ping"></span>}
                                            </div>
                                            <p className="text-xs text-slate-400">Pos: Tile #{p.position}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        {p.status === 'BANKRUPT' ? (
                                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Bankrupt</span>
                                        ) : (
                                            <span className="text-sm font-bold text-purple-400">₹{p.balance}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Unowned Property Details Card */}
                    {showUnownedCard && (
                        <div className="glass-premium rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-fade-in flex flex-col">
                            {/* Top bar with Name, Price, and background color */}
                            <div className={`px-4 py-2.5 flex justify-between items-center ${groupColors[turnPlayerProperty.group] || 'bg-slate-700'} text-slate-950 font-black uppercase text-xs tracking-wide`}>
                                <span>{turnPlayerProperty.name || turnPlayerProperty.propertyName}</span>
                                <span className="bg-slate-950/20 px-1.5 py-0.5 rounded text-[10px]">
                                    {formatMoney(turnPlayerProperty.price)}
                                </span>
                            </div>

                            {/* City Image (1:1 square aspect ratio layout) */}
                            {!isUnownedPropImgError ? (
                                <img 
                                    src={getPropertyImagePath(turnPlayerProperty.name || turnPlayerProperty.propertyName)} 
                                    onError={() => setUnownedPropImgError(unownedPropImgKey)}
                                    className="w-full h-36 object-cover border-b border-slate-800/60"
                                    alt={turnPlayerProperty.name || turnPlayerProperty.propertyName}
                                />
                            ) : (
                                <div className="w-full h-16 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center border-b border-slate-800/60 text-slate-700 font-extrabold text-lg">
                                    {turnPlayerProperty.name?.substring(0, 1) || turnPlayerProperty.propertyName?.substring(0, 1)}
                                </div>
                            )}

                            <div className="p-4 space-y-3.5 text-left">
                                <div className="space-y-1.5 text-[11px] text-slate-300">
                                    {turnPlayerProperty.rent ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Base Rent:</span>
                                                <span className="font-semibold text-white">{formatMoney(turnPlayerProperty.rent[0])}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Rent 1 House:</span>
                                                <span className="font-semibold text-white">{formatMoney(turnPlayerProperty.rent[1])}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Rent 2 Houses:</span>
                                                <span className="font-semibold text-white">{formatMoney(turnPlayerProperty.rent[2])}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Rent 3 Houses:</span>
                                                <span className="font-semibold text-white">{formatMoney(turnPlayerProperty.rent[3])}</span>
                                            </div>
                                            <div className="flex justify-between text-emerald-400 font-medium">
                                                <span>Rent Hotel:</span>
                                                <span className="font-bold">{formatMoney(turnPlayerProperty.rent[4])}</span>
                                            </div>
                                            <div className="border-t border-slate-800/40 pt-1.5 mt-2 flex justify-between">
                                                <span className="text-slate-500">Build House:</span>
                                                <span className="font-semibold text-white">{formatMoney(turnPlayerProperty.housePrice)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Build Hotel:</span>
                                                <span className="font-semibold text-white">{formatMoney(turnPlayerProperty.hotelPrice)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {turnPlayerProperty.type === 'UTILITY' && (
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Utility Rent:</span>
                                                    <span className="font-semibold text-white">{turnPlayerProperty.diceMultiplier}x Dice Roll</span>
                                                </div>
                                            )}
                                            {turnPlayerProperty.type === 'TRANSPORT' && (
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Transport Rent:</span>
                                                    <span className="font-semibold text-white">{formatMoney(turnPlayerProperty.baseRent)}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="flex justify-between border-t border-slate-800/40 pt-1.5">
                                        <span className="text-slate-500">Mortgage Value:</span>
                                        <span className="font-semibold text-white">{formatMoney(turnPlayerProperty.price / 2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Board Grid & Center Hub (Center & Right Panel span 2 cols) */}
                <div className="md:col-span-2 relative bg-[#383636] border border-slate-800 rounded-3xl overflow-hidden p-2.5 shadow-2xl">
                    <div className="board-grid relative">
                        
                        {/* Render 36 Tiles */}
                        {Array.from({ length: 36 }).map((_, idx) => {
                            const gridStyle = getGridArea(idx);
                            const isCorner = idx === 0 || idx === 9 || idx === 18 || idx === 27;
                            const tileInfo = boardData[idx];
                            if (!tileInfo) return null;
                            const propState = getTileDesc(tileInfo);
                            const playersOnTile = getPlayersOnTile(idx);
                            const tileName = getTileName(tileInfo, propState);
                            const tileMeta = getTileMeta(tileInfo, propState);

                            const ownerColorClass = propState && propState.ownerId ? getOwnerColorClass(propState.ownerId) : '';

                            return (
                                <div 
                                    key={idx}
                                    style={gridStyle}
                                    className={`relative flex flex-col justify-between overflow-hidden select-none transition-all duration-200 hover:bg-slate-800/40 hover:scale-[1.02] hover:z-20 cursor-pointer ${
                                        isCorner 
                                            ? 'bg-slate-900 text-slate-100 font-black border border-slate-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]' 
                                            : `bg-slate-950/95 text-slate-200 shadow-[inset_0_0_6px_rgba(0,0,0,0.15)] ${
                                                ownerColorClass ? `border-[6px] ${ownerColorClass}` : 'border border-slate-900/60'
                                              }`
                                    }`}
                                    onClick={() => {
                                        if (propState) {
                                            setSelectedProperty(propState);
                                        }
                                    }}
                                >
                                    {/* For Properties: Colored Header with Name */}
                                    {propState ? (
                                        <div className="w-full flex flex-col h-full justify-between z-10 relative">
                                            {/* Top Bar: group color background, name inside */}
                                            <div className={`w-full py-0.5 px-0.5 text-center ${groupColors[propState.group] || 'bg-slate-600'} text-slate-950 font-black uppercase text-[5.5px] leading-tight truncate z-10 relative border-b border-slate-950/20`}>
                                                {tileName}
                                            </div>

                                            {/* Body/Image container */}
                                            <div className="flex-1 w-full relative overflow-hidden flex flex-col justify-between p-0.5">
                                                {/* Tile Image */}
                                                <img 
                                                    src={getPropertyImagePath(tileInfo.name || tileName, tileInfo.type)} 
                                                    className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none transition-opacity duration-300 z-0"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                    alt=""
                                                />

                                                {/* Possession Color Overlay (30% opacity of player badge color) */}
                                                {propState.ownerId && (
                                                    <div className={`absolute inset-0 ${getPlayerBgColorClass(propState.ownerId)} pointer-events-none z-5`} />
                                                )}

                                                {/* Price overlay at the bottom */}
                                                <div className="w-full flex flex-col items-center mt-auto z-10 relative">
                                                    {tileMeta && (
                                                        <span className="text-[6px] font-black leading-none text-white bg-slate-950/85 px-1 py-0.5 rounded shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                                                            {tileMeta}
                                                        </span>
                                                    )}
                                                    
                                                    {/* Owner name */}
                                                    {propState.ownerId && (
                                                        <span className="text-[5px] rounded bg-purple-950/90 text-purple-300 px-0.5 border border-purple-500/20 mt-0.5 scale-90 font-bold">
                                                            {getOwnerName(propState.ownerId)}
                                                        </span>
                                                    )}

                                                    {/* Development Level */}
                                                    {propState.developmentLevel > 0 && (
                                                        <div className={`text-[8px] font-black flex gap-0.5 items-center mt-0.5 bg-slate-950/85 px-1 py-0.5 rounded border border-slate-900 shadow-sm ${getPlayerColorClass(propState.ownerId)}`}>
                                                            {propState.developmentLevel === 4 ? (
                                                                <>
                                                                    <Building2 className="h-3 w-3" />
                                                                    <span className="text-[5px] font-black ml-0.5 text-white">HOTEL</span>
                                                                </>
                                                            ) : propState.developmentLevel === 1 ? (
                                                                <HomeIcon className="h-3 w-3" />
                                                            ) : (
                                                                <>
                                                                    <HomeIcon className="h-3 w-3" />
                                                                    <span className="text-[7.5px] font-black ml-0.5 text-white">*{propState.developmentLevel}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // For Non-Properties (Corners, Chance, Chest, Tax): Standard render
                                        <>
                                            {/* Tile Image */}
                                            <img 
                                                src={getPropertyImagePath(tileInfo.name || tileName, tileInfo.type)} 
                                                className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none transition-opacity duration-300 z-0"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                alt=""
                                            />

                                            <div className="flex-1 flex flex-col justify-between items-center text-center p-0.5 z-10 relative h-full">
                                                {tileInfo.type !== 'INCOME_TAX' && tileInfo.type !== 'WEALTH_TAX' && (
                                                    <>
                                                        <span className="text-[7px] font-extrabold tracking-tight leading-none text-slate-100 w-full uppercase line-clamp-2 mt-1.5 bg-slate-950/75 px-1 py-0.5 rounded shadow-sm border border-slate-800/40">
                                                            {tileName}
                                                        </span>
                                                        {tileMeta && (
                                                            <span className="text-[6px] font-bold leading-none text-slate-300 mb-1 bg-slate-950/75 px-1 py-0.5 rounded shadow-sm border border-slate-800/40 mt-auto">
                                                                {tileMeta}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Stack Players' Tokens (absolute overlay on the bottom) */}
                                    {playersOnTile.length > 0 && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex -space-x-1 z-20">
                                            {playersOnTile.map(p => (
                                                <div 
                                                    key={p.playerId}
                                                    className={`h-6.5 w-6.5 rounded-lg border border-slate-950 shadow-md flex items-center justify-center text-[11px] font-black uppercase ${getPlayerBadgeClass(p.playerId)}`}
                                                    title={p.username}
                                                >
                                                    {p.username.substring(0, 1)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* 3. Center Control Hub (Col 2-9, Row 2-9) */}
                        <div className="grid-in-center bg-[#383636] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-inner" style={{ gridArea: "2 / 2 / 10 / 10" }}>
                            
                            {/* Inner Header Tabs */}
                            <div className="flex border-b border-slate-800 pb-2 mb-2 justify-between">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setActiveTab('actions')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                            activeTab === 'actions' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        Control Hub
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('assets')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                            activeTab === 'assets' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        My Estates
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setActiveTab('logs')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        activeTab === 'logs' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    Game Logs
                                </button>
                            </div>

                            {/* Panel Body */}
                            <div className="flex-1 overflow-y-auto mb-2 pr-1 custom-scrollbar">
                                {activeTab === 'actions' && (
                                    <div className="h-full flex flex-col justify-center items-center gap-4 text-center">
                                        {/* Render Dice Results */}
                                        {dice && (
                                            <div className="flex flex-col items-center animate-roll">
                                                <div className="flex gap-3 items-center">
                                                    <div className="h-10 w-10 bg-slate-900 border border-purple-500/30 text-white rounded-lg flex items-center justify-center font-black text-lg shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                                                        {dice.diceOne}
                                                    </div>
                                                    <span className="text-slate-500 font-bold">+</span>
                                                    <div className="h-10 w-10 bg-slate-900 border border-purple-500/30 text-white rounded-lg flex items-center justify-center font-black text-lg shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                                                        {dice.diceTwo}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-purple-300 font-bold mt-1.5">
                                                    Dice Total: {dice.total} {dice.isDouble && "(Double!)"}
                                                </p>
                                            </div>
                                        )}

                                        {/* Contextual Options */}
                                        <div className="w-full space-y-4">
                                            {isMyTurn && !isRecovering && (
                                                <div className="flex flex-col gap-2.5">
                                                    {/* Dice Roll */}
                                                    {!hasRolled && !isJailed && (
                                                        <button 
                                                            onClick={handleRoll}
                                                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-500 glow-primary cursor-pointer transition-transform duration-200 active:scale-95 shadow-md"
                                                        >
                                                            <Dice5 className="h-5 w-5" />
                                                            Roll Dice
                                                        </button>
                                                    )}

                                                    {/* Bail Options */}
                                                    {isJailed && (
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={handlePayBail}
                                                                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 py-2.5 text-xs font-bold text-white hover:bg-amber-500 transition-all cursor-pointer shadow-sm"
                                                            >
                                                                <DollarSign className="h-4 w-4" />
                                                                Pay ₹500 Bail
                                                            </button>
                                                            <button 
                                                                onClick={handleEndTurn}
                                                                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
                                                            >
                                                                Skip & Stay Jailed
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Purchase property decisions */}
                                                    {canBuyCurrentProperty && (
                                                        <div className="flex flex-col gap-2 bg-slate-900/85 p-3 rounded-xl border border-slate-850">
                                                            <p className="text-xs text-slate-200 font-bold m-0">
                                                                {currentProperty?.name || currentProperty?.propertyName || 'Property'} is unowned. Purchase?
                                                            </p>
                                                            <div className="flex gap-2 mt-1">
                                                                <button 
                                                                    onClick={() => handleBuy(currentProperty?.propertyId)}
                                                                    className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 glow-success cursor-pointer shadow-sm"
                                                                >
                                                                    Buy Estate
                                                                </button>
                                                                <button 
                                                                    onClick={handleSkip}
                                                                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer shadow-xs"
                                                                >
                                                                    Skip & End Turn
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* End Turn option */}
                                                    {hasRolled && pendingAction === 'NONE' && (
                                                        <button 
                                                            onClick={handleEndTurn}
                                                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors cursor-pointer shadow-md"
                                                        >
                                                            <UserCheck className="h-5 w-5" />
                                                            End Turn
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {!isMyTurn && (
                                                <p className="text-xs text-slate-400 font-semibold animate-pulse">Waiting for other players to take action...</p>
                                            )}
                                        </div>

                                        {/* Latest Log Display */}
                                        {logs.length > 0 && (
                                            <div className="w-full mt-2 p-2.5 rounded-lg border border-purple-500/20 bg-purple-950/20 text-left text-[10px] font-mono text-purple-300 shadow-sm shrink-0">
                                                <span className="text-purple-400 font-black mr-1.5">Latest Action:</span>
                                                {logs[logs.length - 1].replace(/^\[.*?\]\s*/, '')}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'assets' && (
                                    <div className="space-y-2">
                                        <p className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Click on an estate to manage upgrades/mortgages</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {game.properties.filter(p => p.ownerId === me.playerId).map(prop => (
                                                <button 
                                                    key={prop.propertyId}
                                                    onClick={() => setSelectedProperty(prop)}
                                                    className="bg-slate-900/60 p-2.5 rounded-lg text-left flex flex-col justify-between border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/90 hover:shadow-md cursor-pointer transition-all"
                                                >
                                                    <div className="flex gap-1.5 items-center">
                                                        <div className={`h-2 w-2 rounded-full ${groupColors[prop.group] || 'bg-slate-500'}`}></div>
                                                        <span className="text-xs font-bold text-slate-200 truncate">{prop.propertyName}</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 mt-1 flex justify-between items-center w-full">
                                                        <span>Lv: {prop.developmentLevel === 4 ? 'Hotel' : prop.developmentLevel + ' H'}</span>
                                                        {prop.mortgaged && <span className="text-red-500 text-[8px] font-black uppercase">Mort</span>}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'logs' && (
                                    <div className="space-y-1.5 text-left font-mono text-[10px]">
                                        {logs.map((log, i) => (
                                            <div key={i} className="text-slate-300 border-l-2 border-purple-500/40 pl-2 leading-relaxed font-medium">
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* 4. Property Detail Dialog Modal */}
            {selectedProperty && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => setSelectedProperty(null)}>
                    <div 
                        className="glass-premium rounded-2xl overflow-hidden w-full max-w-sm text-left shadow-2xl animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header Color band with name and price */}
                        <div className={`p-4 flex justify-between items-center ${groupColors[selectedProperty.group] || 'bg-slate-700'} text-slate-950 font-black uppercase tracking-tight`}>
                            <h3 className="text-lg font-black uppercase m-0 leading-none">
                                {selectedProperty.propertyName || selectedProperty.name}
                            </h3>
                            <span className="text-xs font-black bg-slate-950/20 px-2 py-0.5 rounded">
                                {formatMoney(selectedProperty.price)}
                            </span>
                        </div>

                        {/* City Image (1:1 square aspect ratio layout) */}
                        {!isSelectedPropImgError ? (
                            <img 
                                src={getPropertyImagePath(selectedProperty.propertyName || selectedProperty.name)} 
                                onError={() => setSelectedPropImgError(selectedPropImgKey)}
                                className="w-full h-48 object-cover border-b border-slate-800/60"
                                alt={selectedProperty.propertyName || selectedProperty.name}
                            />
                        ) : (
                            <div className="w-full h-24 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center border-b border-slate-800/60 text-slate-700 font-extrabold text-2xl">
                                {selectedProperty.propertyName?.substring(0, 1) || selectedProperty.name?.substring(0, 1)}
                            </div>
                        )}

                        <div className="p-6">
                            {/* Estate Details */}
                            <div className="space-y-2.5 text-xs text-slate-300">
                                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                                    <span className="text-slate-500">Price:</span>
                                    <span className="font-semibold text-white">{formatMoney(selectedProperty.price)}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                                    <span className="text-slate-500">Owner:</span>
                                    <span className="font-semibold text-white">
                                        {selectedProperty.ownerId 
                                            ? (selectedProperty.ownerId === me.playerId ? 'You' : game.players.find(pl => pl.playerId === selectedProperty.ownerId)?.username) 
                                            : 'Bank'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                                    <span className="text-slate-500">Mortgage Status:</span>
                                    <span className={`font-semibold ${selectedProperty.mortgaged ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                                        {selectedProperty.mortgaged ? 'Mortgaged' : 'Active'}
                                    </span>
                                </div>

                                {/* Rent Breakdown for properties */}
                                {selectedProperty.rent ? (
                                    <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 mt-3">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Rent Rates</p>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Base Rent:</span>
                                            <span className="font-medium text-white">{formatMoney(selectedProperty.rent[0])}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">With 1 House:</span>
                                            <span className="font-medium text-white">{formatMoney(selectedProperty.rent[1])}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">With 2 Houses:</span>
                                            <span className="font-medium text-white">{formatMoney(selectedProperty.rent[2])}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">With 3 Houses:</span>
                                            <span className="font-medium text-white">{formatMoney(selectedProperty.rent[3])}</span>
                                        </div>
                                        <div className="flex justify-between text-emerald-400 font-semibold">
                                            <span>With Hotel:</span>
                                            <span>{formatMoney(selectedProperty.rent[4])}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 mt-3">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Rent rates</p>
                                        {selectedProperty.type === 'UTILITY' && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Utility Rent:</span>
                                                <span className="font-medium text-white">{selectedProperty.diceMultiplier}x Dice Roll</span>
                                            </div>
                                        )}
                                        {selectedProperty.type === 'TRANSPORT' && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Transport Rent:</span>
                                                <span className="font-medium text-white">{formatMoney(selectedProperty.baseRent)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Build / Mortgage Costs */}
                                <div className="grid grid-cols-2 gap-2 mt-3 pt-1 text-[10px]">
                                    <div className="bg-slate-950/20 p-2 rounded border border-slate-800/40">
                                        <span className="text-slate-500 block">Mortgage Value</span>
                                        <span className="text-white font-bold text-xs">{formatMoney(selectedProperty.price / 2)}</span>
                                    </div>
                                    {selectedProperty.housePrice && (
                                        <div className="bg-slate-950/20 p-2 rounded border border-slate-800/40">
                                            <span className="text-slate-500 block">Build Cost (H/Hotel)</span>
                                            <span className="text-white font-bold text-[9.5px] leading-tight mt-0.5 block">
                                                H: {formatMoney(selectedProperty.housePrice)} <br/> Hot: {formatMoney(selectedProperty.hotelPrice)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                             {/* Interactive Upgrade Buttons for Owner */}
                             {liveSelectedProperty && liveSelectedProperty.ownerId === me.playerId && (
                                 <div className="mt-6 space-y-2 border-t border-slate-800 pt-4">
                                     <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Manage estate</p>
                                     
                                     {/* Build Info/Warning */}
                                     {!liveSelectedProperty.mortgaged && (
                                         <div className="text-[10px] text-slate-400 mt-1 leading-normal">
                                             {!canBuildOnSelected ? (
                                                 <p className="text-amber-400/90 font-medium">
                                                     {!isMyTurn ? "Wait for your turn to build." :
                                                      !hasRolled ? "Roll the dice first." :
                                                      !isStandingOnSelected ? "You must land on this property to build." :
                                                      ownedInGroup < 3 ? `You need majority ownership (at least 3 active properties in ${liveSelectedProperty.group}).` :
                                                      me.hasBuiltHouseThisTurn ? "Only 1 house/hotel can be built per landing." : ""}
                                                 </p>
                                             ) : (
                                                 <p className="text-emerald-400/90 font-medium">
                                                     You can build 1 house/hotel now.
                                                 </p>
                                             )}
                                         </div>
                                     )}

                                     <div className="grid grid-cols-2 gap-2 mt-2">
                                         {/* Build Houses */}
                                         {canBuildOnSelected && liveSelectedProperty.developmentLevel < 3 && !liveSelectedProperty.mortgaged && (
                                             <button 
                                                 onClick={() => { handleBuildHouse(liveSelectedProperty.propertyId); setSelectedProperty(null); }}
                                                 className="flex items-center justify-center gap-1 bg-purple-600 text-white rounded-lg py-2 text-xs font-semibold hover:bg-purple-500 cursor-pointer col-span-2"
                                             >
                                                 <HomeIcon className="h-3.5 w-3.5" />
                                                 Build House
                                             </button>
                                         )}

                                         {/* Build Hotel */}
                                         {canBuildOnSelected && liveSelectedProperty.developmentLevel === 3 && !liveSelectedProperty.mortgaged && (
                                             <button 
                                                 onClick={() => { handleBuildHotel(liveSelectedProperty.propertyId); setSelectedProperty(null); }}
                                                 className="flex items-center justify-center gap-1 bg-purple-600 text-white rounded-lg py-2 text-xs font-semibold hover:bg-purple-500 cursor-pointer col-span-2"
                                             >
                                                 <Building2 className="h-3.5 w-3.5" />
                                                 Build Hotel
                                             </button>
                                         )}

                                         {/* Sell House */}
                                         {liveSelectedProperty.developmentLevel > 0 && liveSelectedProperty.developmentLevel <= 3 && (
                                             <button 
                                                 onClick={() => { handleSellHouse(liveSelectedProperty.propertyId); setSelectedProperty(null); }}
                                                 className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg py-2 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                                             >
                                                 Sell House
                                             </button>
                                         )}

                                         {/* Sell Hotel */}
                                         {liveSelectedProperty.developmentLevel === 4 && (
                                             <button 
                                                 onClick={() => { handleSellHotel(liveSelectedProperty.propertyId); setSelectedProperty(null); }}
                                                 className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg py-2 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                                             >
                                                 Sell Hotel
                                             </button>
                                         )}

                                         {/* Mortgage / Unmortgage */}
                                         {!liveSelectedProperty.mortgaged ? (
                                             liveSelectedProperty.developmentLevel === 0 && (
                                                 <button 
                                                     onClick={() => { handleMortgage(liveSelectedProperty.propertyId); setSelectedProperty(null); }}
                                                     className="flex items-center justify-center gap-1 border border-red-500/30 bg-red-950/10 text-red-400 rounded-lg py-2 text-xs font-semibold hover:bg-red-500 hover:text-white cursor-pointer"
                                                 >
                                                     <Lock className="h-3.5 w-3.5" />
                                                     Mortgage
                                                 </button>
                                             )
                                         ) : (
                                             <button 
                                                 onClick={() => { handleUnmortgage(liveSelectedProperty.propertyId); setSelectedProperty(null); }}
                                                 className="flex items-center justify-center gap-1 border border-emerald-500/30 bg-emerald-950/10 text-emerald-400 rounded-lg py-2 text-xs font-semibold hover:bg-emerald-500 hover:text-white cursor-pointer"
                                             >
                                                 <Unlock className="h-3.5 w-3.5" />
                                                 Unmortgage
                                             </button>
                                         )}
                                     </div>
                                 </div>
                             )}

                            <button 
                                onClick={() => setSelectedProperty(null)}
                                className="mt-6 w-full rounded-lg bg-slate-800 py-2.5 text-xs font-semibold text-slate-400 hover:text-white text-center cursor-pointer"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Asset Liquidation Mode (Recovery Overlay Modal) */}
            {isRecovering && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-40 p-4">
                    <div className="glass-premium border border-yellow-500/30 rounded-3xl p-8 max-w-md w-full text-center glow-primary">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400 mx-auto border border-yellow-500/30">
                            <ShieldAlert className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-white">Asset Liquidation</h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Your balance is currently <span className="text-red-400 font-bold">₹{me.balance}</span>. 
                            You must sell houses/hotels or mortgage properties to recover a positive balance before you can continue your turn.
                        </p>

                        <div className="mt-6 space-y-3">
                            <button 
                                onClick={() => setActiveTab('assets')}
                                className="w-full rounded-lg bg-yellow-500 px-4 py-3 text-xs font-bold text-black hover:bg-yellow-400 transition-colors cursor-pointer"
                            >
                                Sell Assets / Mortgage Properties
                            </button>
                            
                            <p className="text-[10px] text-slate-500">
                                If you have no houses to sell and no properties left to mortgage, you can end your turn to declare bankruptcy.
                            </p>

                            <button 
                                onClick={handleEndTurn}
                                className="w-full rounded-lg border border-red-500/30 bg-red-950/15 py-3 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                            >
                                Declare Bankruptcy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
