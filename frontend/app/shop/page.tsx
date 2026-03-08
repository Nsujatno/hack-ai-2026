'use client'

import { useState } from 'react'
import { ArrowLeft, Star, ShoppingBag, User, Palette } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// --- TYPES & DATA ---
interface PickableAttribute {
    id: string;
    label: string;
    val: string;
}

interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'top' | 'accessories' | 'clothes';
    apiValue: string; // The value to pass to Dicebear
    iconUrl: string; // URL for the shop grid preview
}

const GENDERS: PickableAttribute[] = [
    { id: 'male', label: 'Masculine', val: 'male' },
    { id: 'female', label: 'Feminine', val: 'female' },
]

const SKIN_COLORS: PickableAttribute[] = [
    { id: 'pale', label: 'Pale', val: 'ffdbb4' },
    { id: 'light', label: 'Light', val: 'edb98a' },
    { id: 'med', label: 'Medium', val: 'd08b5b' },
    { id: 'dark', label: 'Dark', val: 'ae5d29' },
    { id: 'deep', label: 'Deep', val: '614335' },
]

// Consistent palette for clothing items in shop previews
const CLOTHES_COLOR = '5199e4'   // indigo blue
const BASE_ICON_PARAMS = `top=shortFlat&topProbability=100&accessories=&accessoriesProbability=0&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18&clothesColor=${CLOTHES_COLOR}`

const SHOP_ITEMS: ShopItem[] = [
    // --- TOPS / HATS ---
    { 
        id: 'top_hat', name: 'Classic Hat', description: 'Timeless style.', price: 400, category: 'top', apiValue: 'hat', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=shophat&top=hat&topProbability=100&accessories=&accessoriesProbability=0&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18` 
    },
    { 
        id: 'top_hijab', name: 'Hijab', description: 'Traditional coverage.', price: 200, category: 'top', apiValue: 'hijab', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=shophijab&top=hijab&topProbability=100&accessories=&accessoriesProbability=0&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18` 
    },
    { 
        id: 'top_turban', name: 'Turban', description: 'Classic style.', price: 300, category: 'top', apiValue: 'turban', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=shopturban&top=turban&topProbability=100&accessories=&accessoriesProbability=0&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18` 
    },
    { 
        id: 'top_winterHat1', name: 'Winter Beanie', description: 'Keep coding warm.', price: 500, category: 'top', apiValue: 'winterHat1', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=shopwinter&top=winterHat1&topProbability=100&accessories=&accessoriesProbability=0&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18` 
    },

    // --- ACCESSORIES / GLASSES ---
    { 
        id: 'acc_sunglasses', name: 'Cool Shades', description: 'Block the haters.', price: 800, category: 'accessories', apiValue: 'sunglasses', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=shopshades&accessories=sunglasses&accessoriesProbability=100&accessoriesColor=65c9ff&top=shortFlat&topProbability=100&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18&clothing=shirtCrewNeck&clothesColor=${CLOTHES_COLOR}` 
    },
    { 
        id: 'acc_prescription01', name: 'Reader Specs', description: 'For the bookworm.', price: 300, category: 'accessories', apiValue: 'prescription01', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=shopspecs1&accessories=prescription01&accessoriesProbability=100&accessoriesColor=65c9ff&top=shortFlat&topProbability=100&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18&clothing=shirtCrewNeck&clothesColor=${CLOTHES_COLOR}` 
    },
    { 
        id: 'acc_prescription2', name: 'Nerd Specs', description: 'Read the docs.', price: 400, category: 'accessories', apiValue: 'prescription02', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=shopspecs2&accessories=prescription02&accessoriesProbability=100&accessoriesColor=65c9ff&top=shortFlat&topProbability=100&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18&clothing=shirtCrewNeck&clothesColor=${CLOTHES_COLOR}` 
    },
    { 
        id: 'acc_wayfarers', name: 'Wayfarers', description: 'Retro cool.', price: 600, category: 'accessories', apiValue: 'wayfarers', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=shopway&accessories=wayfarers&accessoriesProbability=100&accessoriesColor=65c9ff&top=shortFlat&topProbability=100&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18&clothing=shirtCrewNeck&clothesColor=${CLOTHES_COLOR}` 
    },
    { 
        id: 'acc_round', name: 'Round Glasses', description: 'Intellectual vibes.', price: 500, category: 'accessories', apiValue: 'round', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=shopround&accessories=round&accessoriesProbability=100&accessoriesColor=65c9ff&top=shortFlat&topProbability=100&facialHairProbability=0&skinColor=edb98a&hairColor=2c1b18&clothing=shirtCrewNeck&clothesColor=${CLOTHES_COLOR}` 
    },

    // --- CLOTHES ---
    { 
        id: 'clothes_blazerAndShirt', name: 'Power Blazer', description: 'Business casual.', price: 1200, category: 'clothes', apiValue: 'blazerAndShirt', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?${BASE_ICON_PARAMS}&clothing=blazerAndShirt` 
    },
    { 
        id: 'clothes_blazerAndSweater', name: 'Smart Sweater', description: 'Warm and sharp.', price: 900, category: 'clothes', apiValue: 'blazerAndSweater', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?${BASE_ICON_PARAMS}&clothing=blazerAndSweater` 
    },
    { 
        id: 'clothes_hoodie', name: 'Hacker Hoodie', description: 'Startup standard.', price: 700, category: 'clothes', apiValue: 'hoodie', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?${BASE_ICON_PARAMS}&clothing=hoodie` 
    },
    { 
        id: 'clothes_collarAndSweater', name: 'Collar Sweater', description: 'Classic comfort.', price: 600, category: 'clothes', apiValue: 'collarAndSweater', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?${BASE_ICON_PARAMS}&clothing=collarAndSweater` 
    },
    { 
        id: 'clothes_graphicShirt', name: 'Graphic Tee', description: 'Express yourself.', price: 400, category: 'clothes', apiValue: 'graphicShirt', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?${BASE_ICON_PARAMS}&clothing=graphicShirt` 
    },
    { 
        id: 'clothes_overall', name: 'Overalls', description: 'Build things right.', price: 500, category: 'clothes', apiValue: 'overall', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?${BASE_ICON_PARAMS}&clothing=overall` 
    },
    { 
        id: 'clothes_shirtCrewNeck', name: 'Crew Neck Tee', description: 'Everyday essential.', price: 250, category: 'clothes', apiValue: 'shirtCrewNeck', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?${BASE_ICON_PARAMS}&clothing=shirtCrewNeck` 
    },
    { 
        id: 'clothes_shirtVNeck', name: 'V-Neck Tee', description: 'Casual and clean.', price: 250, category: 'clothes', apiValue: 'shirtVNeck', 
        iconUrl: `https://api.dicebear.com/9.x/avataaars/svg?${BASE_ICON_PARAMS}&clothing=shirtVNeck` 
    },
]

export default function ShopPage() {
    const router = useRouter()

    // --- LOAD SAVED CONFIG FROM LOCALSTORAGE ---
    const loadConfig = () => {
        if (typeof window === 'undefined') return {}
        try { return JSON.parse(localStorage.getItem('skillDuelAvatarConfig') ?? '{}') } catch { return {} }
    }
    const saved = loadConfig()

    // --- STATE (initialised from saved config) ---
    const [xpBalance, setXpBalance] = useState(1250)
    const [ownedItems, setOwnedItems] = useState<string[]>(saved.ownedItems ?? ['clothes_hoodie'])

    // Avatar Base Customization
    const [gender, setGender] = useState(saved.gender ?? 'male')
    const [skinColor, setSkinColor] = useState(saved.skinColor ?? SKIN_COLORS[1].val)
    const [hairColor, setHairColor] = useState(saved.hairColor ?? '2c1b18')
    const [hairStyle, setHairStyle] = useState(saved.hairStyle ?? 'shortFlat')
    const [eyes, setEyes] = useState(saved.eyes ?? 'default')
    const [mouth, setMouth] = useState(saved.mouth ?? 'smile')
    const [facialHair, setFacialHair] = useState<string | null>(saved.facialHair ?? null)
    const [accessoryColors, setAccessoryColors] = useState<Record<string, string>>(saved.accessoryColors ?? {})
    const [hatColors, setHatColors] = useState<Record<string, string>>(saved.hatColors ?? {})
    const [clothesColor, setClothesColor] = useState(saved.clothesColor ?? CLOTHES_COLOR)

    // Which top values fully cover hair (no hair visible)
    const COVERING_TOPS = new Set(['hijab', 'turban'])

    // Get/set color for a specific accessory or hat item
    const getAccessoryColor = (itemId: string) => accessoryColors[itemId] ?? '65c9ff'
    const setAccessoryColor = (itemId: string, color: string) =>
        setAccessoryColors(prev => ({ ...prev, [itemId]: color }))
    const getHatColor = (itemId: string) => hatColors[itemId] ?? '3c4f5c'
    const setHatColor = (itemId: string, color: string) =>
        setHatColors(prev => ({ ...prev, [itemId]: color }))
    
    // Avatar Equipped Items (Mapped to DiceBear attributes)
    const [equippedItems, setEquippedItems] = useState<{
        top: string | null;
        accessories: string | null;
        clothes: string | null;
    }>(saved.equippedItems ?? {
        top: null,
        accessories: null,
        clothes: 'clothes_hoodie'
    })

    const [activeTab, setActiveTab] = useState<'base' | 'shop'>('base')
    const [shopCategoryFilter, setShopCategoryFilter] = useState<'all' | 'top' | 'clothes' | 'accessories'>('all')
    const [unlockedAppearance, setUnlockedAppearance] = useState<string[]>(saved.unlockedAppearance ?? [])
    // Key of the appearance option pending purchase confirmation
    const [pendingUnlock, setPendingUnlock] = useState<string | null>(null)
    // Item being previewed on the avatar before purchase (hover state)
    const [previewItem, setPreviewItem] = useState<ShopItem | null>(null)
    // Face expression being previewed (hover on eyes/mouth buttons)
    const [facePreview, setFacePreview] = useState<{ eyes?: string; mouth?: string } | null>(null)
    // Whether the avatar was just saved (briefly shows success state)
    const [justSaved, setJustSaved] = useState(false)
    const [confirmReset, setConfirmReset] = useState(false)

    const handleSaveAvatar = () => {
        const url = getAvatarUrl()
        const config = {
            gender, skinColor, hairColor, hairStyle,
            eyes, mouth, facialHair,
            accessoryColors, hatColors, clothesColor,
            equippedItems, ownedItems, unlockedAppearance,
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('skillDuelAvatarUrl', url)
            localStorage.setItem('skillDuelAvatarConfig', JSON.stringify(config))
        }
        setJustSaved(true)
        setTimeout(() => router.push('/dashboard'), 600)
    }

    const handleReset = () => {
        if (!confirmReset) {
            setConfirmReset(true)
            setTimeout(() => setConfirmReset(false), 3000) // auto-dismiss after 3s
            return
        }
        // Clear saved data
        if (typeof window !== 'undefined') {
            localStorage.removeItem('skillDuelAvatarUrl')
            localStorage.removeItem('skillDuelAvatarConfig')
        }
        // Reset all state to defaults
        setGender('male')
        setSkinColor(SKIN_COLORS[1].val)
        setHairColor('2c1b18')
        setHairStyle('shortFlat')
        setEyes('default')
        setMouth('smile')
        setFacialHair(null)
        setAccessoryColors({})
        setHatColors({})
        setClothesColor(CLOTHES_COLOR)
        // Keep equippedItems minimal but don't wipe purchases or XP unlocks
        setEquippedItems({ top: null, accessories: null, clothes: 'clothes_hoodie' })
        setConfirmReset(false)
    }

    // --- ACTIONS ---
    const handlePurchase = (item: ShopItem) => {
        if (xpBalance >= item.price && !ownedItems.includes(item.id)) {
            setXpBalance(prev => prev - item.price)
            setOwnedItems(prev => [...prev, item.id])
        }
    }

    const handleEquip = (item: ShopItem) => {
        if (ownedItems.includes(item.id)) {
            setEquippedItems(prev => ({
                ...prev,
                [item.category]: prev[item.category] === item.id ? null : item.id
            }))
        }
    }

    const filteredStore = SHOP_ITEMS.filter(item => shopCategoryFilter === 'all' || item.category === shopCategoryFilter)

    // Unlock a locked appearance option with XP
    const handleUnlockAppearance = (key: string, cost: number) => {
        if (xpBalance >= cost && !unlockedAppearance.includes(key)) {
            setXpBalance(prev => prev - cost)
            setUnlockedAppearance(prev => [...prev, key])
            setPendingUnlock(null)
        }
    }

    // --- AVATAR URL BUILDER ---
    // preview = a shop item to temporarily show on the avatar (for hover preview)
    // faceOvr = override eyes/mouth for hover-preview on face expression buttons
    const getAvatarUrl = (preview: ShopItem | null = null, faceOvr: { eyes?: string; mouth?: string } | null = null) => {
        const baseUrl = "https://api.dicebear.com/9.x/avataaars/svg"
        const params = new URLSearchParams()

        // Merge shop-item preview overrides
        const effectiveEquipped = {
            top: (preview?.category === 'top' ? preview.id : null) ?? equippedItems.top,
            accessories: (preview?.category === 'accessories' ? preview.id : null) ?? equippedItems.accessories,
            clothes: (preview?.category === 'clothes' ? preview.id : null) ?? equippedItems.clothes,
        }
        // Merge face overrides (hover preview on eyes/mouth buttons)
        const effectiveEyes = faceOvr?.eyes ?? eyes
        const effectiveMouth = faceOvr?.mouth ?? mouth

        params.append('seed', gender === 'male' ? 'Felix' : 'Aneka')
        params.append('skinColor', skinColor)
        params.append('hairColor', hairColor)
        params.append('eyes', effectiveEyes)
        params.append('mouth', effectiveMouth)
        // Male: bold straight brow → clearly masculine. Female: arched natural brow → clearly feminine
        params.append('eyebrows', gender === 'female' ? 'raisedExcitedNatural' : 'flatNatural')

        // Accessory color: per-equipped-item or preview fallback
        const equippedAccId = effectiveEquipped.accessories
        const resolvedAccColor = equippedAccId ? getAccessoryColor(equippedAccId) : '65c9ff'
        params.append('accessoriesColor', resolvedAccColor)
        params.append('accessoriesProbability', equippedAccId ? '100' : '0')

        // Facial hair (male only)
        if (gender === 'male' && facialHair) {
            params.append('facialHair', facialHair)
            params.append('facialHairProbability', '100')
            params.append('facialHairColor', hairColor)
        } else {
            params.append('facialHairProbability', '0')
        }

        // Top: use hat when equipped, otherwise the selected hair style
        if (effectiveEquipped.top) {
            const item = SHOP_ITEMS.find(i => i.id === effectiveEquipped.top)
            if (item) {
                params.append('top', item.apiValue)
                if (!COVERING_TOPS.has(item.apiValue)) {
                    params.append('hatColor', getHatColor(item.id))
                }
            }
        } else {
            // Use the hairStyle selection (male defaults shortFlat, female straight01)
            params.append('top', hairStyle)
        }
        params.append('topProbability', '100')

        // Accessories
        if (effectiveEquipped.accessories) {
            const item = SHOP_ITEMS.find(i => i.id === effectiveEquipped.accessories)
            if (item) params.append('accessories', item.apiValue)
        }

        // Clothing
        params.append('clothesColor', clothesColor)
        if (effectiveEquipped.clothes) {
            const item = SHOP_ITEMS.find(i => i.id === effectiveEquipped.clothes)
            if (item) params.append('clothing', item.apiValue)
        } else {
            params.append('clothing', 'shirtCrewNeck')
        }

        return `${baseUrl}?${params.toString()}`
    }

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/30 pb-20 font-sans">
            
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl inline-flex items-center gap-2 font-black text-slate-800 font-serif tracking-tight">
                            <ShoppingBag className="w-5 h-5 text-indigo-500" />
                            Avatar Shop
                        </h1>
                    </div>

                    <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl shadow-sm">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                        <span className="font-bold text-amber-600 font-mono text-lg tracking-tight">
                            {xpBalance.toLocaleString()} <span className="text-sm">XP</span>
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col lg:flex-row gap-8 items-start">
                
                {/* --- LEFT PANEL: THE AVATAR PREVIEW --- */}
                <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
                    
                    {/* Stage Preview Box */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 pt-8 pb-12 px-8 border border-slate-200 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-100 to-transparent"></div>
                        
                        {/* Preview badge */}
                        {(previewItem || facePreview) && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                                {previewItem ? `👁 Previewing: ${previewItem.name}` : '👁 Expression Preview'}
                            </div>
                        )}

                        <div className="relative w-full aspect-square mx-auto flex items-center justify-center p-4">
                            <img
                                src={getAvatarUrl(previewItem, facePreview)}
                                alt="Generated Avatar Preview"
                                className="w-full h-full object-contain relative z-10 drop-shadow-xl transition-all duration-300"
                            />
                        </div>
                        
                    </div>

                    {/* Save Avatar Button */}
                    <button
                        onClick={handleSaveAvatar}
                        disabled={justSaved}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                            justSaved
                            ? 'bg-emerald-500 text-white scale-[0.98] shadow-emerald-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-indigo-200'
                        }`}
                    >
                        {justSaved ? (
                            <>&#10003; Avatar Saved!</>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2M12 12V3m0 0L8 7m4-4 4 4" /></svg>
                                Save and Exit
                            </>
                        )}
                    </button>

                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className={`w-full py-3 rounded-2xl font-bold text-xs transition-all border-2 flex items-center justify-center gap-2 ${
                            confirmReset
                            ? 'border-red-400 bg-red-50 text-red-600 animate-pulse'
                            : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
                        }`}
                    >
                        {confirmReset ? '⚠️ Tap again to reset everything' : '↺ Reset to Default'}
                    </button>

                </div>

                {/* --- RIGHT PANEL: CUSTOMIZATION & STORE --- */}
                <div className="w-full flex-1 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-2 sm:p-4 border border-slate-200 min-h-[600px] flex flex-col">
                    
                    {/* Top Menu Tabs */}
                    <div className="flex p-2 bg-slate-100 rounded-2xl mb-6 mx-2 mt-2">
                        <button 
                            onClick={() => setActiveTab('base')}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                                activeTab === 'base' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <span className="flex items-center justify-center gap-2"><User className="w-4 h-4"/> Base Persona</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('shop')}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                                activeTab === 'shop' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                             <span className="flex items-center justify-center gap-2"><ShoppingBag className="w-4 h-4"/> Item Shop</span>
                        </button>
                    </div>

                    <div className="flex-1 px-5 pb-5 pt-2">
                        
                        {/* --- TAB: BASE PERSONA --- */}
                        {activeTab === 'base' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

                                {/* Form / Gender */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Base Presentment</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                {GENDERS.map(g => (
                                    <button key={g.id}
                                        onClick={() => {
                                            setGender(g.val)
                                            // Reset hair to the new gender's default
                                            setHairStyle(g.val === 'male' ? 'shortFlat' : 'straight01')
                                            setFacePreview(null)
                                        }}
                                        className={`py-3 rounded-2xl border-2 transition-all font-bold ${gender === g.val ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                                        {g.label}
                                    </button>
                                ))}
                                    </div>
                                </div>

                                {/* Skin Tone */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skin Tone</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {SKIN_COLORS.map(c => (
                                            <button key={c.id} onClick={() => setSkinColor(c.val)}
                                                style={{ backgroundColor: `#${c.val}` }}
                                                className={`w-10 h-10 rounded-full border-4 shadow-sm transition-all ${skinColor === c.val ? 'border-indigo-500 scale-110 ring-2 ring-indigo-300' : 'border-black/5 hover:scale-105'}`}
                                                title={c.label}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Hair Color */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hair Color</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            { val: '2c1b18', label: 'Black' },
                                            { val: '4a312c', label: 'Dark Brown' },
                                            { val: 'a55728', label: 'Brown' },
                                            { val: 'd6b370', label: 'Blonde' },
                                            { val: 'e8e1e1', label: 'Platinum' },
                                            { val: 'c93305', label: 'Red' },
                                            { val: 'f59797', label: 'Pastel Pink' },
                                        ].map(c => (
                                            <button key={c.val} onClick={() => setHairColor(c.val)}
                                                style={{ backgroundColor: `#${c.val}` }}
                                                className={`w-10 h-10 rounded-full border-4 shadow-sm transition-all ${hairColor === c.val ? 'border-indigo-500 scale-110 ring-2 ring-indigo-300' : 'border-black/5 hover:scale-105'}`}
                                                title={c.label}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Eyes */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Eyes</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {([  
                                            { val: 'default',   label: 'Default',   xpCost: 0 },
                                            { val: 'happy',     label: 'Happy',     xpCost: 0 },
                                            { val: 'wink',      label: 'Wink',      xpCost: 0 },
                                            { val: 'squint',    label: 'Squint',    xpCost: 0 },
                                            { val: 'surprised', label: 'Surprised', xpCost: 0 },
                                            { val: 'side',      label: 'Side',      xpCost: 0 },
                                            { val: 'closed',    label: 'Closed',    xpCost: 0 },
                                            { val: 'cry',       label: 'Cry',       xpCost: 0 },
                                            { val: 'winkWacky', label: 'Wacky Wink',xpCost: 500 },
                                            { val: 'eyeRoll',   label: 'Eye Roll',  xpCost: 500 },
                                            { val: 'hearts',    label: '❤️ Hearts',  xpCost: 800 },
                                            { val: 'xDizzy',    label: '💫 Dizzy',   xpCost: 1000 },
                                        ] as const).map(e => {
                                            const key = `eye_${e.val}`
                                            const isUnlocked = e.xpCost === 0 || unlockedAppearance.includes(key)
                                            const canAfford = xpBalance >= e.xpCost
                                            const isSelected = eyes === e.val
                                            const isPending = pendingUnlock === key
                                            if (isUnlocked) {
                                                return (
                                                    <button key={e.val}
                                                        onClick={() => setEyes(e.val)}
                                                        onMouseEnter={() => setFacePreview({ eyes: e.val })}
                                                        onMouseLeave={() => setFacePreview(null)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                                                        {e.label}
                                                    </button>
                                                )
                                            }
                                            // Locked — first click = pending confirm, second click = purchase
                                            return (
                                                <button key={e.val}
                                                    onClick={() => {
                                                        if (!canAfford) return
                                                        if (isPending) { handleUnlockAppearance(key, e.xpCost) }
                                                        else { setPendingUnlock(key) }
                                                    }}
                                                    onMouseEnter={() => setFacePreview({ eyes: e.val })}
                                                    onMouseLeave={() => { setFacePreview(null) }}
                                                    onBlur={() => pendingUnlock === key && setPendingUnlock(null)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                                                        isPending
                                                        ? 'border-amber-500 bg-amber-400 text-white animate-pulse'
                                                        : canAfford
                                                        ? 'border-amber-300 bg-amber-50 text-amber-700 border-dashed cursor-pointer'
                                                        : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                                                    }`}>
                                                    {isPending ? `✓ Confirm ${e.xpCost} XP` : `🔒 ${e.label}${canAfford ? '' : ` (${e.xpCost} XP)`}`}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Mouth */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mouth</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {([  
                                            { val: 'smile',      label: 'Smile',      xpCost: 0 },
                                            { val: 'default',    label: 'Default',    xpCost: 0 },
                                            { val: 'serious',    label: 'Serious',    xpCost: 0 },
                                            { val: 'twinkle',    label: 'Twinkle',    xpCost: 0 },
                                            { val: 'sad',        label: 'Sad',        xpCost: 0 },
                                            { val: 'concerned',  label: 'Concerned',  xpCost: 0 },
                                            { val: 'disbelief',  label: 'Disbelief',  xpCost: 0 },
                                            { val: 'eating',     label: '🍕 Eating',   xpCost: 400 },
                                            { val: 'tongue',     label: '👅 Tongue',   xpCost: 600 },
                                            { val: 'grimace',    label: '😬 Grimace',  xpCost: 600 },
                                            { val: 'screamOpen', label: '😱 Scream',   xpCost: 800 },

                                        ] as const).map(m => {
                                            const key = `mouth_${m.val}`
                                            const isUnlocked = m.xpCost === 0 || unlockedAppearance.includes(key)
                                            const canAfford = xpBalance >= m.xpCost
                                            const isSelected = mouth === m.val
                                            const isPending = pendingUnlock === key
                                            if (isUnlocked) {
                                                return (
                                                    <button key={m.val}
                                                        onClick={() => setMouth(m.val)}
                                                        onMouseEnter={() => setFacePreview({ mouth: m.val })}
                                                        onMouseLeave={() => setFacePreview(null)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                                                        {m.label}
                                                    </button>
                                                )
                                            }
                                            return (
                                                <button key={m.val}
                                                    onClick={() => {
                                                        if (!canAfford) return
                                                        if (isPending) { handleUnlockAppearance(key, m.xpCost) }
                                                        else { setPendingUnlock(key) }
                                                    }}
                                                    onMouseEnter={() => setFacePreview({ mouth: m.val })}
                                                    onMouseLeave={() => setFacePreview(null)}
                                                    onBlur={() => pendingUnlock === key && setPendingUnlock(null)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                                                        isPending
                                                        ? 'border-amber-500 bg-amber-400 text-white animate-pulse'
                                                        : canAfford
                                                        ? 'border-amber-300 bg-amber-50 text-amber-700 border-dashed cursor-pointer'
                                                        : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                                                    }`}>
                                                    {isPending ? `✓ Confirm ${m.xpCost} XP` : `🔒 ${m.label}${canAfford ? '' : ` (${m.xpCost} XP)`}`}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Facial Hair (male only) */}
                                {gender === 'male' && (
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Facial Hair</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { val: null, label: 'None' },
                                                { val: 'beardLight', label: 'Light Beard' },
                                                { val: 'beardMedium', label: 'Medium Beard' },
                                                { val: 'beardMajestic', label: 'Full Beard' },
                                                { val: 'moustacheFancy', label: 'Fancy Moustache' },
                                                { val: 'moustacheMagnum', label: 'Magnum Moustache' },
                                            ].map(f => (
                                                <button key={f.label} onClick={() => setFacialHair(f.val)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border-2 ${facialHair === f.val ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                                                    {f.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Color pickers for all equipped colorable items */}
                                {(() => {
                                    const COLOR_SWATCHES = [
                                        { val: '65c9ff', label: 'Sky Blue' },
                                        { val: '3c4f5c', label: 'Dark Slate' },
                                        { val: '929598', label: 'Silver' },
                                        { val: 'ff5c5c', label: 'Red' },
                                        { val: 'a7ffc4', label: 'Mint' },
                                        { val: 'ffffb1', label: 'Yellow' },
                                        { val: 'ff488e', label: 'Pink' },
                                        { val: 'ffffff', label: 'White' },
                                        { val: '262e33', label: 'Gunmetal' },
                                        { val: 'b1e2ff', label: 'Ice Blue' },
                                    ]
                                    const equippedTopItem = equippedItems.top
                                        ? SHOP_ITEMS.find(i => i.id === equippedItems.top)
                                        : null
                                    // Only show hat color for non-covering tops
                                    const showHatColor = equippedTopItem && !COVERING_TOPS.has(equippedTopItem.apiValue)
                                    const equippedAccItem = equippedItems.accessories
                                        ? SHOP_ITEMS.find(i => i.id === equippedItems.accessories)
                                        : null

                                    if (!showHatColor && !equippedAccItem) return null

                                    return (
                                        <div className="space-y-4">
                                            {showHatColor && equippedTopItem && (
                                                <div>
                                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                                        {equippedTopItem.name} Color
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {COLOR_SWATCHES.map(c => (
                                                            <button key={c.val}
                                                                onClick={() => setHatColor(equippedTopItem.id, c.val)}
                                                                style={{ backgroundColor: `#${c.val}` }}
                                                                className={`w-10 h-10 rounded-full border-4 shadow-sm transition-all ${getHatColor(equippedTopItem.id) === c.val ? 'border-indigo-500 scale-110 ring-2 ring-indigo-300' : 'border-black/10 hover:scale-105'}`}
                                                                title={c.label}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {equippedAccItem && (
                                                <div>
                                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                                        {equippedAccItem.name} Color
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {COLOR_SWATCHES.map(c => (
                                                            <button key={c.val}
                                                                onClick={() => setAccessoryColor(equippedAccItem.id, c.val)}
                                                                style={{ backgroundColor: `#${c.val}` }}
                                                                className={`w-10 h-10 rounded-full border-4 shadow-sm transition-all ${getAccessoryColor(equippedAccItem.id) === c.val ? 'border-indigo-500 scale-110 ring-2 ring-indigo-300' : 'border-black/10 hover:scale-105'}`}
                                                                title={c.label}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })()}                            {/* Hair Style */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hair Style</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(gender === 'male' ? [
                                            { val: 'shortFlat',            label: 'Flat' },
                                            { val: 'shortCurly',           label: 'Curly' },
                                            { val: 'shortRound',           label: 'Round' },
                                            { val: 'shortWaved',           label: 'Wavy' },
                                            { val: 'sides',                label: 'Sides' },
                                            { val: 'theCaesar',            label: 'Caesar' },
                                            { val: 'theCaesarAndSidePart', label: 'Caesar Side' },
                                            { val: 'dreads01',             label: 'Short Coils' },
                                            { val: 'dreads02',             label: 'Dreads' },
                                            { val: 'frizzle',              label: 'Frizzle' },
                                            { val: 'shaggy',               label: 'Shaggy' },
                                            { val: 'shaggyMullet',         label: 'Mullet' },
                                            { val: 'shavedSides',          label: 'Shaved Sides' },
                                            { val: 'bob',                  label: 'Bob' },
                                        ] : [
                                            { val: 'straight01',           label: 'Straight' },
                                            { val: 'straight02',           label: 'Straight II' },
                                            { val: 'straightAndStrand',    label: 'Strand' },
                                            { val: 'bigHair',              label: 'Big Hair' },
                                            { val: 'bun',                  label: 'Bun' },
                                            { val: 'curly',                label: 'Curly' },
                                            { val: 'curvy',                label: 'Curvy' },
                                            { val: 'fro',                  label: 'Afro' },
                                            { val: 'froBand',              label: 'Afro Band' },
                                            { val: 'dreads',               label: 'Dreads' },
                                            { val: 'longButNotTooLong',    label: 'Long' },
                                            { val: 'miaWallace',           label: 'Mia Wallace' },
                                            { val: 'frida',                label: 'Updo' },
                                            { val: 'bob',                  label: 'Bob' },
                                        ]).map(h => (
                                            <button key={h.val} onClick={() => setHairStyle(h.val)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                                                    hairStyle === h.val
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}>
                                                {h.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Clothes Color */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Clothing Color</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            { val: '5199e4', label: 'Indigo' },
                                            { val: 'ff5c5c', label: 'Red' },
                                            { val: '3c4f5c', label: 'Dark Slate' },
                                            { val: '065535', label: 'Forest' },
                                            { val: 'ff488e', label: 'Pink' },
                                            { val: 'a7ffc4', label: 'Mint' },
                                            { val: 'ffffb1', label: 'Yellow' },
                                            { val: '262e33', label: 'Gunmetal' },
                                            { val: '929598', label: 'Grey' },
                                            { val: 'ffffff', label: 'White' },
                                        ].map(c => (
                                            <button key={c.val}
                                                onClick={() => setClothesColor(c.val)}
                                                style={{ backgroundColor: `#${c.val}` }}
                                                className={`w-10 h-10 rounded-full border-4 shadow-sm transition-all ${
                                                    clothesColor === c.val
                                                    ? 'border-indigo-500 scale-110 ring-2 ring-indigo-300'
                                                    : 'border-black/10 hover:scale-105'
                                                }`}
                                                title={c.label}
                                            />
                                        ))}
                                    </div>
                                </div>


                            </div>
                        )}

                        {/* --- TAB: ITEM SHOP --- */}
                        {activeTab === 'shop' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
                                
                                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                    {(['all', 'top', 'clothes', 'accessories'] as const).map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => setShopCategoryFilter(filter)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-all ${
                                                shopCategoryFilter === filter
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                        >
                                            {filter === 'top' ? 'Headwear' : filter}
                                        </button>
                                    ))}
                                </div>

                                {/* Store Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                                    {filteredStore.map(item => {
                                        const isOwned = ownedItems.includes(item.id)
                                        const isEquipped = Object.values(equippedItems).includes(item.id)
                                        const canAfford = xpBalance >= item.price

                                        return (
                                            <div
                                                key={item.id}
                                                className="border border-slate-200 rounded-3xl p-5 flex flex-col bg-white hover:shadow-lg transition-all cursor-pointer"
                                                onMouseEnter={() => !isOwned && setPreviewItem(item)}
                                                onMouseLeave={() => setPreviewItem(null)}
                                            >
                                                
                                                <div className="bg-slate-50 w-full aspect-square rounded-2xl flex items-center justify-center p-2 mb-4 relative drop-shadow-sm border border-slate-100 overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-transparent"></div>
                                                    <img 
                                                        src={item.iconUrl} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-contain scale-[1.3] relative top-2"
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                                                    <p className="text-slate-500 text-sm mt-1 leading-tight">{item.description}</p>
                                                </div>

                                                <div className="mt-5 pt-5 border-t border-slate-100">
                                                    {isOwned ? (
                                                        <button 
                                                            onClick={() => handleEquip(item)}
                                                            className={`w-full py-2.5 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
                                                                isEquipped 
                                                                ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500 cursor-pointer shadow-sm' 
                                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border-2 border-transparent'
                                                            }`}
                                                        >
                                                            {isEquipped ? 'Equipped ✓' : 'Equip Item'}
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            disabled={!canAfford}
                                                            onClick={() => handlePurchase(item)}
                                                            className={`w-full py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-1.5 ${
                                                                canAfford 
                                                                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer' 
                                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            {canAfford ? `Buy for ${item.price} XP` : `Need ${item.price} XP`}
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        )
                                    })}
                                </div>
                                
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    )
}
