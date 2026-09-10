import React, { useState } from 'react';
import {
  Armchair,
  UtensilsCrossed,
  Luggage,
  Sparkles,
  User,
  X,
  Check,
  ChevronDown,
  ShieldCheck,
  Accessibility,
  ConciergeBell,
  Eye,
  Ear,
  Baby,
  Dog,
  Package,
  HeartPulse,
  Wheat,
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export interface PricingValues {
  serviceCharge: string;
  markupBase: string;
  markupTax: string;
}

export interface BookingPricingData {
  seat: string;
  meal: string[];
  baggage: string;
  ssr: string[];
  total: number;
  serviceCharge: string;
  markupBase: string;
  markupTax: string;
}

export interface SeatMealPricingPanelProps {
  onBack?: () => void;
  onHold?: (data: BookingPricingData) => void;
  onBook?: (data: BookingPricingData) => void;
  onConfirm?: (data: ConfirmedSelections) => void;
}

export interface ConfirmedSelections {
  passengers: PassengerAncillary[];
  total: number;
  serviceCharge: string;
  markupBase: string;
  markupTax: string;
}

export interface AncillarySeat {
  id: string;
  type: 'Window' | 'Middle' | 'Aisle';
  price: number;
  premium: boolean;
}

export type MealCategory = 'vegetarian' | 'nonveg' | 'vegan' | 'special';
export type MealDietary = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain';

export interface AncillaryMeal {
  id: string;
  label: string;
  short: string;
  description: string;
  emoji: string;
  imageUrl: string;
  dietary: MealDietary;
  category: MealCategory;
  price: number;
}

export interface AncillaryBaggage {
  id: string;
  weight: number;
  description: string;
  price: number;
}

export interface AncillarySsr {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  icon: React.FC<{ className?: string }>;
}

export interface PassengerAncillary {
  id: string;
  name: string;
  type: string;
  seat: AncillarySeat | null;
  meals: AncillaryMeal[];
  baggage: AncillaryBaggage | null;
  ssr: AncillarySsr[];
}

type ServiceTab = 'seat' | 'meal' | 'baggage' | 'ssr';

/* ---------- Data ---------- */

const INCLUDED_BAGGAGE_KG = 15;

const PASSENGER_SEEDS = [
  { id: 'P1', name: 'Siddhesh', type: 'Adult' },
  { id: 'P2', name: 'Rahul', type: 'Adult' },
];

const MEALS: AncillaryMeal[] = [
  { id: 'paneer-tikka', label: 'Paneer Tikka Masala with Jeera Rice', short: 'Paneer Tikka', description: 'Paneer in rich spiced gravy, served with jeera rice', emoji: '🍛', imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 350 },
  { id: 'veg-biryani', label: 'Vegetable Biryani with Raita', short: 'Veg Biryani', description: 'Aromatic rice layered with garden vegetables', emoji: '🥘', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 350 },
  { id: 'dal-tadka', label: 'Dal Tadka with Steamed Rice', short: 'Dal Tadka', description: 'Classic yellow dal tempered with spices', emoji: '🍲', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 300 },
  { id: 'veg-pulao', label: 'Veg Pulao with Mixed Vegetable Curry', short: 'Veg Pulao', description: 'Fragrant rice with seasonal vegetables', emoji: '🍛', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 300 },
  { id: 'aloo-paratha', label: 'Aloo Paratha with Curd', short: 'Aloo Paratha', description: 'Stuffed potato flatbread served with curd', emoji: '🫓', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 250 },
  { id: 'masala-dosa', label: 'Masala Dosa with Coconut Chutney', short: 'Masala Dosa', description: 'Crispy crepe with spiced potato filling', emoji: '🥞', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 250 },
  { id: 'chicken-biryani', label: 'Chicken Biryani with Raita', short: 'Chicken Biryani', description: 'Spiced basmati rice with tender chicken', emoji: '🍛', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=260&fit=crop&auto=format', dietary: 'Non-Vegetarian', category: 'nonveg', price: 400 },
  { id: 'butter-chicken', label: 'Butter Chicken with Jeera Rice', short: 'Butter Chicken', description: 'Creamy tomato gravy with butter chicken', emoji: '🍗', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=260&fit=crop&auto=format', dietary: 'Non-Vegetarian', category: 'nonveg', price: 450 },
  { id: 'chicken-tikka', label: 'Chicken Tikka with Vegetable Rice', short: 'Chicken Tikka', description: 'Chargrilled chicken tikka with rice', emoji: '🍢', imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=260&fit=crop&auto=format', dietary: 'Non-Vegetarian', category: 'nonveg', price: 400 },
  { id: 'chicken-curry', label: 'Chicken Curry with Steamed Rice', short: 'Chicken Curry', description: 'Homestyle chicken curry with rice', emoji: '🍗', imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&h=260&fit=crop&auto=format', dietary: 'Non-Vegetarian', category: 'nonveg', price: 380 },
  { id: 'veg-sandwich', label: 'Vegetable Sandwich', short: 'Veg Sandwich', description: 'Fresh veggies in a toasted sandwich', emoji: '🥪', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 200 },
  { id: 'paneer-sandwich', label: 'Paneer Sandwich', short: 'Paneer Sandwich', description: 'Grilled sandwich with spiced paneer', emoji: '🥪', imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 220 },
  { id: 'idli-sambar', label: 'Idli with Sambar', short: 'Idli Sambar', description: 'Steamed rice cakes with lentil sambar', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 200 },
  { id: 'poha-tea', label: 'Poha with Tea', short: 'Poha', description: 'Flattened rice tossed with spices', emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'vegetarian', price: 150 },
  { id: 'omelette', label: 'Masala Omelette with Bread', short: 'Omelette', description: 'Spiced omelette with toasted bread', emoji: '🍳', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=260&fit=crop&auto=format', dietary: 'Non-Vegetarian', category: 'nonveg', price: 200 },
  { id: 'vegan-bowl', label: 'Vegan Vegetable Rice Bowl', short: 'Vegan Bowl', description: 'Plant-based protein bowl with rice', emoji: '🥗', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=260&fit=crop&auto=format', dietary: 'Vegan', category: 'vegan', price: 350 },
  { id: 'jain-meal', label: 'Jain Vegetable Meal', short: 'Jain Meal', description: 'Vegetarian meal without onion or garlic', emoji: '🥗', imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=260&fit=crop&auto=format', dietary: 'Jain', category: 'special', price: 350 },
  { id: 'gluten-free', label: 'Gluten-Free Meal', short: 'Gluten-Free', description: 'Wholesome gluten-free selection', emoji: '🌾', imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'special', price: 350 },
  { id: 'kids-meal', label: 'Kids Meal', short: 'Kids Meal', description: 'Mini portions kids will love', emoji: '🍱', imageUrl: 'https://images.unsplash.com/photo-1607252651460-e786b2e3dec0?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'special', price: 250 },
  { id: 'low-cal', label: 'Low-Calorie Meal', short: 'Low-Cal Meal', description: 'Grilled proteins with steamed vegetables', emoji: '🥗', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=260&fit=crop&auto=format', dietary: 'Vegetarian', category: 'special', price: 320 },
];

const MEAL_TABS: { id: 'all' | MealCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'nonveg', label: 'Non-Veg' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'special', label: 'Special' },
];

const BAGGAGE_OPTIONS: AncillaryBaggage[] = [
  { id: 'BAG05', weight: 5, description: 'Extra checked baggage', price: 750 },
  { id: 'BAG10', weight: 10, description: 'Extra checked baggage', price: 1400 },
  { id: 'BAG15', weight: 15, description: 'Extra checked baggage', price: 2000 },
  { id: 'BAG20', weight: 20, description: 'Extra checked baggage', price: 2600 },
  { id: 'BAG25', weight: 25, description: 'Extra checked baggage', price: 3200 },
  { id: 'BAG30', weight: 30, description: 'Extra checked baggage', price: 3800 },
];

const SSRS: AncillarySsr[] = [
  { id: 'ssr-wchr', code: 'WCHR', name: 'Wheelchair Assistance', description: 'Airport wheelchair assistance', price: 0, icon: Accessibility },
  { id: 'ssr-wchc', code: 'WCHC', name: 'Wheelchair to Aircraft', description: 'Assistance up to the aircraft', price: 0, icon: Accessibility },
  { id: 'ssr-maas', code: 'MAAS', name: 'Meet & Assist', description: 'Assistance at the airport', price: 500, icon: ConciergeBell },
  { id: 'ssr-blnd', code: 'BLND', name: 'Visual Assistance', description: 'Assistance for visually impaired', price: 0, icon: Eye },
  { id: 'ssr-deaf', code: 'DEAF', name: 'Hearing Assistance', description: 'Assistance for hearing-impaired', price: 0, icon: Ear },
  { id: 'ssr-inft', code: 'INFT', name: 'Infant Assistance', description: 'Travelling with an infant', price: 0, icon: Baby },
  { id: 'ssr-umnr', code: 'UMNR', name: 'Unaccompanied Minor', description: 'Children travelling alone', price: 1500, icon: User },
  { id: 'ssr-petc', code: 'PETC', name: 'Pet in Cabin', description: 'Pet travel in cabin', price: 3000, icon: Dog },
  { id: 'ssr-avih', code: 'AVIH', name: 'Pet in Hold', description: 'Pet in checked baggage', price: 4000, icon: Package },
  { id: 'ssr-jain', code: 'JAIN', name: 'Jain Meal', description: 'Jain special meal request', price: 350, icon: UtensilsCrossed },
  { id: 'ssr-dbml', code: 'DBML', name: 'Diabetic Meal', description: 'Diabetic-friendly special meal', price: 350, icon: HeartPulse },
  { id: 'ssr-gfml', code: 'GFML', name: 'Gluten-Free Meal', description: 'Gluten-free special meal', price: 350, icon: Wheat },
];

type SeatCell = AncillarySeat & {
  row: number;
  col: number;
  colLetter: string;
  occupied: boolean;
};

const ROW_COLS = ['A', 'B', 'C', 'D', 'E', 'F'];

const buildSeatMap = (): SeatCell[] => {
  const cells: SeatCell[] = [];
  for (let row = 1; row <= 12; row++) {
    const premium = row <= 2;
    ROW_COLS.forEach((colLetter, i) => {
      const type: AncillarySeat['type'] =
        colLetter === 'A' || colLetter === 'F' ? 'Window' : colLetter === 'C' || colLetter === 'D' ? 'Aisle' : 'Middle';
      const occupied = (row * 11 + i * 7) % 6 === 0 || (row === 5 && colLetter === 'C');
      cells.push({
        id: `${row}${colLetter}`,
        type,
        price: premium ? 750 : 450,
        premium,
        occupied,
        row,
        col: i,
        colLetter,
      });
    });
  }
  return cells;
};

const SEAT_MAP = buildSeatMap();

/* ---------- Meal Image ---------- */

const MealImage: React.FC<{ meal: AncillaryMeal; selected?: boolean; isLight: boolean }> = ({ meal, selected, isLight }) => {
  const [imgError, setImgError] = useState(false);
  if (imgError || !meal.imageUrl) {
    return (
      <div className={`flex h-[90px] w-full items-center justify-center rounded-t-[10px] bg-gradient-to-b transition-colors duration-300 ${isLight ? 'from-[#f8f5f2] to-[#f0ece8]' : 'from-[#16233f] to-[#122844]'}`}>
        <span className="text-[36px] leading-none">{meal.emoji}</span>
      </div>
    );
  }
  return (
    <div className={`relative h-[90px] w-full overflow-hidden rounded-t-[10px] transition-colors duration-300 ${isLight ? 'bg-[#f0ece8]' : 'bg-[#16233f]'}`}>
      <img src={meal.imageUrl} alt={meal.label} className="h-full w-full object-cover" onError={() => setImgError(true)} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
      {selected && (
        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] text-white shadow">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </div>
  );
};

/* ---------- Dietary Badge ---------- */

const DietaryBadge: React.FC<{ dietary: MealDietary; isLight: boolean }> = ({ dietary, isLight }) => {
  const isVeg = dietary === 'Vegetarian';
  const isNonVeg = dietary === 'Non-Vegetarian';
  return (
    <span className="inline-flex items-center gap-1">
      {isVeg || isNonVeg ? (
        <span className={`flex h-3 w-3 items-center justify-center rounded-[2px] border-[1.5px] ${isVeg ? 'border-[#22a354]' : 'border-[#db3a34]'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isVeg ? 'bg-[#22a354]' : 'bg-[#db3a34]'}`} />
        </span>
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${dietary === 'Vegan' ? 'bg-[#4a8f2f]' : 'bg-[#b8860b]'}`} />
      )}
      <span className={`text-[9.5px] font-medium transition-colors duration-300 ${isLight ? 'text-[#666]' : 'text-[#9baec7]'}`}>{dietary}</span>
    </span>
  );
};

/* ---------- Main Component ---------- */

export const SeatMealPricingPanel: React.FC<SeatMealPricingPanelProps> = ({ onBack, onHold, onBook, onConfirm }) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ServiceTab>('seat');
  const [passengers, setPassengers] = useState<PassengerAncillary[]>(() =>
    PASSENGER_SEEDS.map((p) => ({ ...p, seat: null, meals: [], baggage: null, ssr: [] })),
  );
  const [activePassengerId, setActivePassengerId] = useState('P1');
  const [draftSeat, setDraftSeat] = useState<AncillarySeat | null>(null);
  const [draftMeals, setDraftMeals] = useState<AncillaryMeal[]>([]);
  const [draftBaggage, setDraftBaggage] = useState<AncillaryBaggage | null>(null);
  const [mealTab, setMealTab] = useState<'all' | MealCategory>('all');
  const [error, setError] = useState('');
  const [serviceCharge, setServiceCharge] = useState<string>('');
  const [markupBase, setMarkupBase] = useState<string>('');
  const [markupTax, setMarkupTax] = useState<string>('');

  const activePassenger = passengers.find((p) => p.id === activePassengerId) ?? passengers[0];

  const updateActivePassenger = (patch: Partial<PassengerAncillary>) =>
    setPassengers((prev) => prev.map((p) => (p.id === activePassenger.id ? { ...p, ...patch } : p)));

  const allConfigured = passengers.every((p) => !!p.seat && p.meals.length > 0);
  const ancillaryTotal = passengers.reduce(
    (sum, p) =>
      sum + (p.seat?.price ?? 0) + p.meals.reduce((s, m) => s + m.price, 0) + (p.baggage?.price ?? 0) + p.ssr.reduce((s, x) => s + x.price, 0),
    0,
  );

  const openModal = () => {
    setActiveTab('seat');
    setDraftSeat(null);
    setDraftMeals([]);
    setDraftBaggage(null);
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDraftSeat(null);
    setDraftMeals([]);
    setDraftBaggage(null);
    setError('');
  };

  /* --- Tab nav helpers --- */
  const TABS: { id: ServiceTab; icon: React.ReactNode; label: string; done: boolean }[] = [
    { id: 'seat', icon: <Armchair className="h-3.5 w-3.5" />, label: 'Seat', done: !!activePassenger.seat },
    { id: 'meal', icon: <UtensilsCrossed className="h-3.5 w-3.5" />, label: 'Meal', done: activePassenger.meals.length > 0 },
    { id: 'baggage', icon: <Luggage className="h-3.5 w-3.5" />, label: 'Baggage', done: !!activePassenger.baggage },
    { id: 'ssr', icon: <Sparkles className="h-3.5 w-3.5" />, label: 'SSR', done: activePassenger.ssr.length > 0 },
  ];

  const switchTab = (tab: ServiceTab) => {
    // When switching away from seat, save draft
    if (activeTab === 'seat' && draftSeat) {
      updateActivePassenger({ seat: draftSeat });
      setDraftSeat(null);
    }
    // When switching away from meal, save draft
    if (activeTab === 'meal' && draftMeals.length > 0) {
      updateActivePassenger({ meals: draftMeals });
      setDraftMeals([]);
    }
    // When switching away from baggage, save draft
    if (activeTab === 'baggage' && draftBaggage) {
      updateActivePassenger({ baggage: draftBaggage });
      setDraftBaggage(null);
    }
    setActiveTab(tab);
    setError('');
  };

  /* --- Meal helpers --- */
  const openMealDraft = () => setDraftMeals([...activePassenger.meals]);
  const toggleDraftMeal = (meal: AncillaryMeal) => {
    setDraftMeals((prev) => {
      const exists = prev.some((m) => m.id === meal.id);
      return exists ? prev.filter((m) => m.id !== meal.id) : [...prev, meal];
    });
  };
  const removeMeal = (id: string) => {
    updateActivePassenger({ meals: activePassenger.meals.filter((m) => m.id !== id) });
  };

  /* --- Baggage helpers --- */
  const removeBaggage = () => {
    updateActivePassenger({ baggage: null });
    setDraftBaggage(null);
  };

  /* --- SSR helpers --- */
  const toggleSsr = (ssr: AncillarySsr) => {
    const already = activePassenger.ssr.some((x) => x.id === ssr.id);
    const next = already ? activePassenger.ssr.filter((x) => x.id !== ssr.id) : [...activePassenger.ssr, ssr];
    updateActivePassenger({ ssr: next });
  };

  /* --- Confirm all --- */
  const confirmContinue = () => {
    // Apply pending drafts to passengers snapshot
    const resolved = passengers.map((p) => {
      if (p.id !== activePassengerId) return p;
      return {
        ...p,
        seat: (activeTab === 'seat' && draftSeat) ? draftSeat : p.seat,
        meals: (activeTab === 'meal' && draftMeals.length > 0) ? draftMeals : p.meals,
        baggage: (activeTab === 'baggage' && draftBaggage) ? draftBaggage : p.baggage,
      };
    });
    setPassengers(resolved);
    setDraftSeat(null);
    setDraftMeals([]);
    setDraftBaggage(null);
    setError('');
    closeModal();
    onConfirm?.({
      passengers: resolved,
      total: resolved.reduce(
        (sum, p) =>
          sum + (p.seat?.price ?? 0) + p.meals.reduce((s, m) => s + m.price, 0) + (p.baggage?.price ?? 0) + p.ssr.reduce((s, x) => s + x.price, 0),
        0,
      ),
      serviceCharge,
      markupBase,
      markupTax,
    });
  };

  /* --- Book all --- */
  const handleBook = () => {
    onBook?.(formData);
    // Confirm the ancillary selections into the parent (keeps the fare summary
    // in sync) before opening the review page in a new tab.
    confirmContinue();
    window.open('/review-trip?bookingId=TRV-2024-8894X', '_blank');
  };

  const formData: BookingPricingData = {
    seat: activePassenger.seat?.id ?? '',
    meal: activePassenger.meals.map((m) => m.short),
    baggage: activePassenger.baggage ? `${activePassenger.baggage.weight} KG` : '',
    ssr: activePassenger.ssr.map((s) => s.code),
    total: ancillaryTotal,
    serviceCharge,
    markupBase,
    markupTax,
  };

  const handleNumericInput =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '' || /^\d*\.?\d*$/.test(val)) setter(val);
    };

  /* --- Current seat (draft or saved) --- */
  const currentSeat = draftSeat ?? activePassenger.seat;
  const currentMeals = draftMeals.length > 0 ? draftMeals : activePassenger.meals;
  const currentBaggage = draftBaggage ?? activePassenger.baggage;

  const rowsOf = (row: number) => SEAT_MAP.filter((s) => s.row === row);

  return (
    <div className={`w-full rounded-lg border p-6 transition-colors duration-300 ${isLight ? 'border-[#eeeeee] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
      <h2 className={`text-[18px] font-bold leading-[22px] transition-colors duration-300 ${isLight ? 'text-[#292929]' : 'text-white'}`}>ANCILLARY</h2>
      <div className={`my-[14px] h-px w-full transition-colors duration-300 ${isLight ? 'bg-[#eeeeee]' : 'bg-[#29466e]'}`} />

      {allConfigured ? (
        <div className={`flex items-center justify-between gap-2 rounded-[6px] border px-3 py-2.5 transition-colors duration-300 ${isLight ? 'border-[#9fdcb1] bg-[#f1fbf5]' : 'border-[#16A34A]/30 bg-[#16A34A]/10'}`}>
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <div className={`text-[12px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Ancillaries Selected</div>
              <div className={`text-[11px] transition-colors duration-300 ${isLight ? 'text-[#22a354]' : 'text-[#34d399]'}`}>{passengers.length} passengers &middot; ₹{ancillaryTotal.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <button type="button" onClick={openModal} className={`shrink-0 cursor-pointer rounded-[5px] border px-3 py-1.5 text-[11px] font-semibold transition-colors ${isLight ? 'border-[#004B7C] text-[#004B7C] hover:bg-[#E1EFFB]' : 'border-[#7CC0FF] text-[#7CC0FF] hover:bg-[#2593fc]/20'}`}>
            Edit
          </button>
        </div>
      ) : (
        <button type="button" onClick={openModal} className={`flex h-[38px] w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] border text-[12px] font-semibold uppercase tracking-wide text-white transition-all ${isLight ? 'border-[#004B7C] bg-[#004B7C] hover:bg-[#003E67] active:bg-[#003052]' : 'border-[#2593fc] bg-[#2593fc] hover:bg-[#d4af37] active:bg-[#b8922b]'}`}>
          <Armchair className="h-4 w-4" />
          Ancillary
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Pricing Controls */}
      <div className="mt-[18px]">
        <h2 className={`text-[18px] font-bold leading-[22px] transition-colors duration-300 ${isLight ? 'text-[#292929]' : 'text-white'}`}>PRICING CONTROLS</h2>
        <div className={`my-[14px] h-px w-full transition-colors duration-300 ${isLight ? 'bg-[#eeeeee]' : 'bg-[#29466e]'}`} />
      </div>
      <div className="flex flex-col gap-[10px]">
        {[
          { label: 'Override Service Charge', value: serviceCharge, set: setServiceCharge },
          { label: 'Markup on Base', value: markupBase, set: setMarkupBase },
          { label: 'Markup on Tax', value: markupTax, set: setMarkupTax },
        ].map((f) => (
          <div key={f.label}>
            <label className={`mb-[4px] block text-[10px] font-medium transition-colors duration-300 ${isLight ? 'text-[#333]' : 'text-[#9baec7]'}`}>{f.label}</label>
            <div className="relative">
              <span className={`pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-[11px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>₹</span>
              <input type="text" inputMode="decimal" value={f.value} onChange={handleNumericInput(f.set)} placeholder="0" className={`h-[33px] w-full rounded-[4px] border-none pl-[26px] pr-[13px] text-[11px] outline-none transition-colors duration-300 placeholder:text-[#aaa] ${isLight ? 'bg-[#f4f1f1] text-[#333]' : 'bg-white/[0.05] text-white placeholder:text-[#7e93b3]'}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-[18px] flex gap-[5px]">
        <button type="button" onClick={onBack} className={`h-[30px] flex-1 cursor-pointer rounded-[5px] border-none text-[10px] font-semibold transition-colors ${isLight ? 'bg-[#e9e7e7] text-[#222] hover:bg-[#dddbdb]' : 'bg-white/[0.06] text-[#9baec7] hover:bg-white/[0.12]'}`}>Back</button>
        <button type="button" onClick={() => onHold?.(formData)} className={`h-[30px] flex-1 cursor-pointer rounded-[5px] border-none text-[10px] font-semibold transition-colors ${isLight ? 'bg-[#e6e4e4] text-[#222] hover:bg-[#d9d7d7]' : 'bg-white/[0.06] text-[#9baec7] hover:bg-white/[0.12]'}`}>Hold</button>
        <button type="button" onClick={handleBook} className={`h-[30px] flex-1 cursor-pointer rounded-[5px] border-none text-[10px] font-semibold text-white transition-colors ${isLight ? 'bg-[#005b96] hover:bg-[#004a7d]' : 'bg-[#2593fc] hover:bg-[#d4af37]'}`}>Book</button>
      </div>

      {/* ==================== MODAL ==================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0f1b3a]/50 backdrop-blur-[2px]" onClick={closeModal} />

          {/* Modal container */}
          <div className={`relative flex w-full max-w-[700px] flex-col overflow-hidden rounded-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] transition-colors duration-300 ${isLight ? 'bg-white' : 'bg-[#0d1b2a]'}`} style={{ maxHeight: '85vh' }}>

            {/* ── Header ── */}
            <div className={`flex shrink-0 items-center justify-between border-b px-5 py-3.5 transition-colors duration-300 ${isLight ? 'border-[#f0f0f0]' : 'border-[#29466e]'}`}>
              <div>
                <h3 className={`text-[16px] font-bold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Customize Your Journey</h3>
                <p className={`text-[11px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#9baec7]'}`}>Choose your seat, meal, baggage and special services.</p>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close" className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors ${isLight ? 'border-[#eee] text-[#777] hover:bg-[#f5f5f5] hover:text-[#171717]' : 'border-[#315073] text-[#7CC0FF] hover:border-[#d4af37]/70 hover:text-[#f0c265]'}`}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Tab Bar ── */}
            <div className={`flex shrink-0 gap-1 border-b px-5 pt-3 pb-0 transition-colors duration-300 ${isLight ? 'border-[#f0f0f0]' : 'border-[#29466e]'}`}>
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => switchTab(tab.id)}
                    className={`flex items-center gap-1.5 rounded-t-[8px] px-3.5 py-2 text-[11.5px] font-semibold transition-all duration-150 ${
                      active ? (isLight ? 'bg-[#004B7C] text-white shadow-[0_-2px_6px_rgba(0,75,124,0.1)]' : 'bg-[#d4af37] text-[#0B132B]') : (isLight ? 'text-[#888] hover:bg-[#f5f5f5] hover:text-[#555]' : 'text-[#9baec7] hover:bg-white/[0.04] hover:text-white')
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.done && !active && <Check className="h-3 w-3 text-[#22c55e]" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            {/* ── Passenger Selector ── */}
            <div className={`flex shrink-0 items-center gap-2 border-b px-5 py-2.5 transition-colors duration-300 ${isLight ? 'border-[#f0f0f0]' : 'border-[#29466e]'}`}>
              <span className={`text-[10px] font-semibold uppercase tracking-wide transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>Passenger</span>
              <div className="flex gap-1.5">
                {passengers.map((p) => {
                  const active = p.id === activePassengerId;
                  const done = !!p.seat && p.meals.length > 0;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        // Save drafts before switching
                        if (activeTab === 'seat' && draftSeat) { updateActivePassenger({ seat: draftSeat }); setDraftSeat(null); }
                        if (activeTab === 'meal' && draftMeals.length > 0) { updateActivePassenger({ meals: draftMeals }); setDraftMeals([]); }
                        if (activeTab === 'baggage' && draftBaggage) { updateActivePassenger({ baggage: draftBaggage }); setDraftBaggage(null); }
                        setActivePassengerId(p.id);
                        setDraftSeat(null);
                        setDraftMeals([]);
                        setDraftBaggage(null);
                      }}
                      className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold transition-colors ${
                        active ? (isLight ? 'border-[#004B7C] bg-[#004B7C] text-white' : 'border-[#d4af37] bg-[#d4af37] text-[#0B132B]') : (isLight ? 'border-[#ddd] bg-white text-[#555] hover:border-[#004B7C]' : 'border-[#315073] bg-[#0d1b2a] text-[#9baec7] hover:border-[#d4af37]')
                      }`}
                    >
                      <User className="h-3 w-3" />
                      {p.name}
                      {done && <Check className="h-3 w-3 text-[#22c55e]" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">

              {/* ════════════ SEAT TAB ════════════ */}
              {activeTab === 'seat' && (
                <div>
                  <p className={`mb-2 text-[12px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Select Your Seat</p>

                  {/* ── Airplane + Inline Legend ── */}
                  <div className="mb-3 flex items-start justify-center gap-3 sm:gap-5">
                    {/* Airplane SVG + Seats */}
                    <div className="relative mx-auto sm:mx-0" style={{ width: '100%', maxWidth: 400 }}>
                      <svg viewBox="0 0 340 640" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
                        {/* Fuselage body */}
                        <path d="M170 8 C170 8, 148 35, 132 65 L122 80 L112 100 L108 120 L106 540 L112 570 L125 595 L145 615 L170 625 L195 615 L215 595 L228 570 L234 540 L232 120 L228 100 L218 80 L208 65 C192 35, 170 8, 170 8Z" fill={isLight ? '#e8ecf0' : '#1c2b45'} stroke={isLight ? '#c8d0da' : '#2a3a52'} strokeWidth="2" />
                        {/* Nose accent */}
                        <path d="M170 8 C168 18, 155 40, 140 60 L170 52 L200 60 C185 40, 172 18, 170 8Z" fill={isLight ? '#dde3eb' : '#17253c'} />
                        {/* Cockpit windows */}
                        <ellipse cx="155" cy="58" rx="5" ry="3" fill={isLight ? '#a0b0c4' : '#4a5a75'} opacity="0.7" />
                        <ellipse cx="185" cy="58" rx="5" ry="3" fill={isLight ? '#a0b0c4' : '#4a5a75'} opacity="0.7" />
                        <text x="170" y="48" textAnchor="middle" fontSize="7" fontWeight="bold" fill={isLight ? '#8a9bb0' : '#7e93b3'} letterSpacing="1.5">COCKPIT</text>
                        {/* Left wing */}
                        <path d="M108 260 L14 290 L8 305 L14 320 L108 350" fill={isLight ? '#d4dce6' : '#1c2b45'} stroke={isLight ? '#b8c4d2' : '#2a3a52'} strokeWidth="1.5" />
                        <path d="M108 290 L24 300" stroke={isLight ? '#b8c4d2' : '#2a3a52'} strokeWidth="0.5" opacity="0.5" />
                        <path d="M108 320 L24 315" stroke={isLight ? '#b8c4d2' : '#2a3a52'} strokeWidth="0.5" opacity="0.5" />
                        {/* Right wing */}
                        <path d="M232 260 L326 290 L332 305 L326 320 L232 350" fill={isLight ? '#d4dce6' : '#1c2b45'} stroke={isLight ? '#b8c4d2' : '#2a3a52'} strokeWidth="1.5" />
                        <path d="M232 290 L316 300" stroke={isLight ? '#b8c4d2' : '#2a3a52'} strokeWidth="0.5" opacity="0.5" />
                        <path d="M232 320 L316 315" stroke={isLight ? '#b8c4d2' : '#2a3a52'} strokeWidth="0.5" opacity="0.5" />
                        {/* Left cabin windows */}
                        {[130, 160, 190, 220, 250, 280, 310, 340, 370, 400, 430, 460, 490, 520].map((y) => (
                          <ellipse key={`lw${y}`} cx="102" cy={y} rx="2.5" ry="4" fill={isLight ? '#a8b8cc' : '#3f5069'} opacity="0.5" />
                        ))}
                        {/* Right cabin windows */}
                        {[130, 160, 190, 220, 250, 280, 310, 340, 370, 400, 430, 460, 490, 520].map((y) => (
                          <ellipse key={`rw${y}`} cx="238" cy={y} rx="2.5" ry="4" fill={isLight ? '#a8b8cc' : '#3f5069'} opacity="0.5" />
                        ))}
                        {/* Tail vertical stabilizer */}
                        <path d="M170 610 L170 635 L162 632 L158 625 L170 610Z" fill={isLight ? '#c8d0da' : '#24334d'} stroke={isLight ? '#b0bcc9' : '#2f415c'} strokeWidth="1" />
                        <path d="M170 610 L170 635 L178 632 L182 625 L170 610Z" fill={isLight ? '#d0d8e2' : '#2c3d58'} stroke={isLight ? '#b0bcc9' : '#2f415c'} strokeWidth="1" />
                        {/* Tail horizontal stabilizers */}
                        <path d="M140 590 L110 600 L108 606 L115 608 L145 598Z" fill={isLight ? '#d4dce6' : '#1c2b45'} stroke={isLight ? '#b8c4d2' : '#2a3a52'} strokeWidth="1" />
                        <path d="M200 590 L230 600 L232 606 L225 608 L195 598Z" fill={isLight ? '#d4dce6' : '#1c2b45'} stroke={isLight ? '#b8c4d2' : '#2a3a52'} strokeWidth="1" />
                      </svg>

                      {/* Seat grid overlay */}
                      <div className="absolute left-1/2 top-[22%] flex -translate-x-1/2 flex-col" style={{ width: '52%' }}>
                        {/* Column headers */}
                        <div className="mb-1 flex items-center justify-center">
                          <div className="flex w-[100px] justify-around">
                            {['A', 'B', 'C'].map((c) => (
                              <span key={c} className={`w-[28px] text-center text-[7px] font-bold transition-colors duration-300 ${isLight ? 'text-[#8a9bb0]' : 'text-[#7e93b3]'}`}>{c}</span>
                            ))}
                          </div>
                          <div className="w-[20px]" />
                          <div className="flex w-[100px] justify-around">
                            {['D', 'E', 'F'].map((c) => (
                              <span key={c} className={`w-[28px] text-center text-[7px] font-bold transition-colors duration-300 ${isLight ? 'text-[#8a9bb0]' : 'text-[#7e93b3]'}`}>{c}</span>
                            ))}
                          </div>
                        </div>

                        {/* Seat rows */}
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((row) => {
                          const isExitRow = row === 5;
                          return (
                            <React.Fragment key={row}>
                              {isExitRow && (
                                <div className="my-0.5 flex items-center gap-1">
                                  <div className="h-px flex-1 bg-[#e74c3c]/25" />
                                  <span className="flex items-center gap-0.5 text-[6px] font-bold uppercase tracking-wider text-[#e74c3c]">
                                    <svg viewBox="0 0 12 12" fill="none" className="h-2 w-2 text-[#e74c3c]" stroke="currentColor" strokeWidth="1.5"><path d="M6 1v10M1 6h10" /></svg>
                                    EXIT
                                  </span>
                                  <div className="h-px flex-1 bg-[#e74c3c]/25" />
                                </div>
                              )}
                              <div className="flex items-center justify-center">
                                <div className="flex items-center justify-around">
                                  {rowsOf(row).filter((s) => s.col <= 2).map((s) => (
                                    <SeatBtn key={s.id} cell={s} selected={currentSeat?.id === s.id} onClick={() => setDraftSeat({ id: s.id, type: s.type, price: s.price, premium: s.premium })} isLight={isLight} />
                                  ))}
                                </div>
                                <div className="mx-1 flex w-[20px] flex-col items-center justify-center">
                                  <span className={`text-[7px] font-bold transition-colors duration-300 ${isLight ? 'text-[#aab4c2]' : 'text-[#7e93b3]'}`}>{row}</span>
                                </div>
                                <div className="flex items-center justify-around">
                                  {rowsOf(row).filter((s) => s.col >= 3).map((s) => (
                                    <SeatBtn key={s.id} cell={s} selected={currentSeat?.id === s.id} onClick={() => setDraftSeat({ id: s.id, type: s.type, price: s.price, premium: s.premium })} isLight={isLight} />
                                  ))}
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Inline Seat Status Legend (right side on desktop, bottom on mobile) ── */}
                    <div className="sticky top-4 z-10 hidden shrink-0 flex-col gap-3 pt-16 sm:flex">
                      <span className={`text-[8px] font-bold uppercase tracking-wider transition-colors duration-300 ${isLight ? 'text-[#aab4c2]' : 'text-[#7e93b3]'}`}>Seat Status</span>
                      {[
                        { label: 'Available', render: () => <span className={`flex h-[18px] w-[18px] items-end justify-center rounded-b-[4px] rounded-t-[3px] border transition-colors duration-300 ${isLight ? 'border-[#d0d7e2] bg-white' : 'border-[#2a3a52] bg-[#1c3a5f]'}`}><span className={`mb-px h-[5px] w-[12px] rounded-[2px] transition-colors duration-300 ${isLight ? 'bg-[#e2e8f0]' : 'bg-[#27507c]'}`} /></span> },
                        { label: 'Selected', render: () => <span className="flex h-[18px] w-[18px] items-end justify-center rounded-b-[4px] rounded-t-[3px] border border-[#22c55e] bg-[#22c55e]"><span className="mb-px h-[5px] w-[12px] rounded-[2px] bg-white/40" /></span> },
                        { label: 'Occupied', render: () => <span className={`flex h-[18px] w-[18px] items-end justify-center rounded-b-[4px] rounded-t-[3px] border transition-colors duration-300 ${isLight ? 'border-[#ddd] bg-[#ececec]' : 'border-[#374151] bg-[#2a2f3a]'}`}><span className={`mb-px h-[5px] w-[12px] rounded-[2px] transition-colors duration-300 ${isLight ? 'bg-[#ddd]' : 'bg-[#3d4350]'}`} /></span> },
                        { label: 'Premium', render: () => <span className={`flex h-[18px] w-[18px] items-end justify-center rounded-b-[4px] rounded-t-[3px] border border-[#d4af37]/60 transition-colors duration-300 ${isLight ? 'bg-[#fef9e7]' : 'bg-[#d4af37]/25'}`}><span className="mb-px h-[5px] w-[12px] rounded-[2px] bg-[#d4af37]/30" /></span> },
                      ].map((l) => (
                        <span key={l.label} className="flex items-center gap-2">
                          {l.render()}
                          <span className={`text-[10px] font-medium transition-colors duration-300 ${isLight ? 'text-[#666]' : 'text-[#9baec7]'}`}>{l.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mobile legend (shown below airplane on small screens) */}
                  <div className="mb-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:hidden">
                    {[
                      { label: 'Available', render: () => <span className={`flex h-[14px] w-[14px] items-end justify-center rounded-b-[3px] rounded-t-[2px] border transition-colors duration-300 ${isLight ? 'border-[#d0d7e2] bg-white' : 'border-[#2a3a52] bg-[#1c3a5f]'}`}><span className={`mb-px h-[4px] w-[9px] rounded-[2px] transition-colors duration-300 ${isLight ? 'bg-[#e2e8f0]' : 'bg-[#27507c]'}`} /></span> },
                      { label: 'Selected', render: () => <span className="flex h-[14px] w-[14px] items-end justify-center rounded-b-[3px] rounded-t-[2px] border border-[#22c55e] bg-[#22c55e]"><span className="mb-px h-[4px] w-[9px] rounded-[2px] bg-white/40" /></span> },
                      { label: 'Occupied', render: () => <span className={`flex h-[14px] w-[14px] items-end justify-center rounded-b-[3px] rounded-t-[2px] border transition-colors duration-300 ${isLight ? 'border-[#ddd] bg-[#ececec]' : 'border-[#374151] bg-[#2a2f3a]'}`}><span className={`mb-px h-[4px] w-[9px] rounded-[2px] transition-colors duration-300 ${isLight ? 'bg-[#ddd]' : 'bg-[#3d4350]'}`} /></span> },
                      { label: 'Premium', render: () => <span className={`flex h-[14px] w-[14px] items-end justify-center rounded-b-[3px] rounded-t-[2px] border border-[#d4af37]/60 transition-colors duration-300 ${isLight ? 'bg-[#fef9e7]' : 'bg-[#d4af37]/25'}`}><span className="mb-px h-[4px] w-[9px] rounded-[2px] bg-[#d4af37]/30" /></span> },
                    ].map((l) => (
                      <span key={l.label} className="flex items-center gap-1">
                        {l.render()}
                        <span className={`text-[8.5px] transition-colors duration-300 ${isLight ? 'text-[#888]' : 'text-[#9baec7]'}`}>{l.label}</span>
                      </span>
                    ))}
                  </div>

                  {/* ── Selected seat info ── */}
                  {currentSeat && (
                    <div className={`flex items-center justify-between rounded-[8px] border px-3 py-2 transition-colors duration-300 ${isLight ? 'border-[#e8f0fe] bg-[#f7faff]' : 'border-[#29466e] bg-white/[0.03]'}`}>
                      <div className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-[#22c55e]" strokeWidth={3} />
                        <div>
                          <span className={`text-[11.5px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Seat {currentSeat.id}</span>
                          <span className={`ml-1.5 text-[10px] transition-colors duration-300 ${isLight ? 'text-[#888]' : 'text-[#9baec7]'}`}>{currentSeat.type}{currentSeat.premium ? ' · Premium' : ''}</span>
                        </div>
                      </div>
                      <span className={`text-[12px] font-bold transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]'}`}>₹{currentSeat.price.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {!currentSeat && (
                    <p className={`py-2 text-center text-[11px] transition-colors duration-300 ${isLight ? 'text-[#bbb]' : 'text-[#7e93b3]'}`}>Tap a seat inside the cabin to select it</p>
                  )}
                </div>
              )}

              {/* ════════════ MEAL TAB ════════════ */}
              {activeTab === 'meal' && (
                <div>
                  {/* Selection badge */}
                  {currentMeals.length > 0 && (
                    <div className={`mb-3 flex items-center gap-2 rounded-[8px] border px-3 py-1.5 transition-colors duration-300 ${isLight ? 'border-[#9fdcb1] bg-[#f1fbf5]' : 'border-[#16A34A]/30 bg-[#16A34A]/10'}`}>
                      <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#22c55e] text-[9px] font-bold text-white">{currentMeals.length}</span>
                      <span className={`text-[11px] font-medium transition-colors duration-300 ${isLight ? 'text-[#128a4a]' : 'text-[#34d399]'}`}>{currentMeals.length} dish{currentMeals.length > 1 ? 'es' : ''} &middot; ₹{currentMeals.reduce((s, m) => s + m.price, 0).toLocaleString('en-IN')}</span>
                      <button type="button" onClick={() => { setDraftMeals([...activePassenger.meals]); }} className={`ml-auto text-[10px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#004B7C] hover:underline' : 'text-[#7CC0FF] hover:underline'}`}>Edit</button>
                    </div>
                  )}

                  {/* Category pills */}
                  <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
                    {MEAL_TABS.map((tab) => (
                      <button key={tab.id} type="button" onClick={() => setMealTab(tab.id)} className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-[10.5px] font-semibold transition-colors ${mealTab === tab.id ? (isLight ? 'bg-[#004B7C] text-white' : 'bg-[#d4af37] text-[#0B132B]') : (isLight ? 'bg-[#f0f0f0] text-[#555] hover:bg-[#e5e5e5]' : 'bg-white/[0.06] text-[#9baec7] hover:bg-white/[0.12]')}`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Meal grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {MEALS.filter((m) => mealTab === 'all' || m.category === mealTab).map((m) => {
                      const isSel = currentMeals.some((dm) => dm.id === m.id);
                      const isDraft = draftMeals.some((dm) => dm.id === m.id);
                      const selected = isDraft || isSel;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            if (isSel && !isDraft) {
                              // Directly remove saved meal
                              removeMeal(m.id);
                            } else {
                              // Toggle in draft
                              if (draftMeals.length === 0) openMealDraft();
                              toggleDraftMeal(m);
                            }
                          }}
                          className={`group flex w-full cursor-pointer flex-col overflow-hidden rounded-[10px] border text-left transition-all duration-150 ${selected ? (isLight ? 'border-[#004B7C] shadow-[0_1px_6px_rgba(0,75,124,0.1)]' : 'border-[#d4af37] shadow-[0_1px_6px_rgba(212,175,55,0.15)]') : (isLight ? 'border-[#eee] hover:border-[#ccc]' : 'border-[#29466e] hover:border-[#315073]')}`}
                        >
                          <MealImage meal={m} selected={selected} isLight={isLight} />
                          <div className={`flex flex-1 flex-col p-2.5 transition-colors duration-300 ${isLight ? 'bg-white' : 'bg-[#0f172a]'}`}>
                            <span className={`text-[11px] font-semibold leading-tight line-clamp-2 transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{m.short}</span>
                            <span className={`mt-0.5 text-[9.5px] leading-tight line-clamp-1 transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>{m.description}</span>
                            <div className="mt-1.5"><DietaryBadge dietary={m.dietary} isLight={isLight} /></div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <span className={`text-[12px] font-bold transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]'}`}>₹{m.price.toLocaleString('en-IN')}</span>
                              {selected ? (
                                <span className="flex items-center gap-0.5 rounded-[5px] bg-[#22c55e]/10 px-2 py-0.5 text-[9.5px] font-semibold text-[#128a4a]">
                                  <Check className="h-2.5 w-2.5" strokeWidth={3} />Selected
                                </span>
                              ) : (
                                <span className={`rounded-[5px] border px-2 py-0.5 text-[9.5px] font-semibold transition-colors duration-300 ${isLight ? 'border-[#004B7C] text-[#004B7C]' : 'border-[#7CC0FF] text-[#7CC0FF]'}`}>+ Add</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ════════════ BAGGAGE TAB ════════════ */}
              {activeTab === 'baggage' && (
                <div>
                  {/* Included allowance */}
                  <div className={`mb-3 flex items-center justify-between rounded-[8px] border px-3 py-2 transition-colors duration-300 ${isLight ? 'border-[#eee] bg-[#f7f4f3]' : 'border-[#29466e] bg-white/[0.03]'}`}>
                    <div>
                      <div className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-[#9baec7]'}`}>Included baggage</div>
                      <div className={`text-[12px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{INCLUDED_BAGGAGE_KG} KG</div>
                    </div>
                    <span className={`text-[9.5px] font-medium transition-colors duration-300 ${isLight ? 'text-[#22a354]' : 'text-[#34d399]'}`}>Included in fare</span>
                  </div>

                  {/* Extra baggage grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {BAGGAGE_OPTIONS.map((b) => {
                      const isSel = (currentBaggage?.id) === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            if (isSel) { removeBaggage(); } else { updateActivePassenger({ baggage: { ...b } }); setDraftBaggage(null); }
                          }}
                          className={`flex w-full cursor-pointer flex-col rounded-[10px] border p-3 text-left transition-all duration-150 ${isSel ? (isLight ? 'border-[#004B7C] bg-[#f0f7fc] shadow-[0_1px_6px_rgba(0,75,124,0.1)]' : 'border-[#d4af37] bg-[#d4af37]/10 shadow-[0_1px_6px_rgba(212,175,55,0.15)]') : (isLight ? 'border-[#eee] bg-white hover:border-[#ccc]' : 'border-[#29466e] bg-[#0f172a] hover:border-[#d4af37]/60')}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[20px] leading-none">🧳</span>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[12px] font-bold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{b.weight} KG</div>
                              <div className={`text-[9.5px] transition-colors duration-300 ${isLight ? 'text-[#888]' : 'text-[#9baec7]'}`}>{b.description}</div>
                            </div>
                            {isSel && <Check className="h-4 w-4 shrink-0 text-[#22c55e]" strokeWidth={3} />}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className={`text-[12px] font-bold transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]'}`}>₹{b.price.toLocaleString('en-IN')}</span>
                            {isSel ? (
                              <span className="flex items-center gap-0.5 rounded-[5px] bg-[#22c55e]/10 px-2 py-0.5 text-[9.5px] font-semibold text-[#128a4a]">
                                <Check className="h-2.5 w-2.5" strokeWidth={3} />Selected
                              </span>
                            ) : (
                              <span className={`rounded-[5px] border px-2 py-0.5 text-[9.5px] font-semibold transition-colors duration-300 ${isLight ? 'border-[#004B7C] text-[#004B7C]' : 'border-[#7CC0FF] text-[#7CC0FF]'}`}>Select</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ════════════ SSR TAB ════════════ */}
              {activeTab === 'ssr' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {SSRS.map((s) => {
                    const added = activePassenger.ssr.some((x) => x.id === s.id);
                    return (
                      <div key={s.id} className={`flex flex-col rounded-[10px] border p-2.5 transition-colors ${added ? (isLight ? 'border-[#004B7C] bg-[#f0f7fc]' : 'border-[#d4af37] bg-[#d4af37]/10') : (isLight ? 'border-[#eee] bg-white' : 'border-[#29466e] bg-[#0f172a]')}`}>
                        <div className="flex items-start gap-2">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] transition-colors ${added ? (isLight ? 'bg-[#e1effb] text-[#004B7C]' : 'bg-[#2593fc]/20 text-[#7CC0FF]') : (isLight ? 'bg-[#f7f4f3] text-[#777]' : 'bg-white/[0.06] text-[#9baec7]')}`}>
                            <s.icon className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className={`text-[11px] font-semibold leading-tight transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{s.name}</div>
                            <div className={`text-[9.5px] leading-tight transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#9baec7]'}`}>{s.description}</div>
                            <div className="mt-0.5">
                              <span className={`text-[10.5px] font-semibold transition-colors duration-300 ${s.price === 0 ? (isLight ? 'text-[#22a354]' : 'text-[#34d399]') : (isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]')}`}>{s.price === 0 ? 'Free' : `₹${s.price.toLocaleString('en-IN')}`}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSsr(s)}
                          className={`mt-2 w-full cursor-pointer rounded-[6px] py-1.5 text-[10px] font-semibold transition-colors ${added ? 'bg-[#22c55e]/10 text-[#128a4a] hover:bg-[#22c55e]/20' : (isLight ? 'border border-[#004B7C] text-[#004B7C] hover:bg-[#E1EFFB]' : 'border border-[#7CC0FF] text-[#7CC0FF] hover:bg-[#2593fc]/20')}`}
                        >
                          {added ? <span className="flex items-center justify-center gap-1"><Check className="h-3 w-3" strokeWidth={3} />Added</span> : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Sticky Footer Summary ── */}
            <div className={`shrink-0 border-t px-5 py-3 transition-colors duration-300 ${isLight ? 'border-[#f0f0f0] bg-[#fafafa]' : 'border-[#29466e] bg-[#0b1626]'}`}>
              {/* Compact summary rows */}
              <div className="mb-2 space-y-1">
                {activePassenger.seat && (
                  <div className="flex items-center justify-between">
                    <span className={`text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#888]' : 'text-[#9baec7]'}`}>💺 Seat</span>
                    <span className={`text-[10.5px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{activePassenger.seat.id} · {activePassenger.seat.type} &nbsp; ₹{activePassenger.seat.price.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {activePassenger.meals.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className={`text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#888]' : 'text-[#9baec7]'}`}>🍱 Meal</span>
                    <span className={`text-[10.5px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{activePassenger.meals.map((m) => m.short).join(', ')} &nbsp; ₹{activePassenger.meals.reduce((s, m) => s + m.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {activePassenger.baggage && (
                  <div className="flex items-center justify-between">
                    <span className={`text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#888]' : 'text-[#9baec7]'}`}>🧳 Baggage</span>
                    <span className={`text-[10.5px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{activePassenger.baggage.weight} KG &nbsp; ₹{activePassenger.baggage.price.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {activePassenger.ssr.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className={`text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#888]' : 'text-[#9baec7]'}`}>🛎️ SSR</span>
                    <span className={`text-[10.5px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{activePassenger.ssr.map((s) => s.name).join(', ')} &nbsp; ₹{activePassenger.ssr.reduce((s, x) => s + x.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {!activePassenger.seat && activePassenger.meals.length === 0 && !activePassenger.baggage && activePassenger.ssr.length === 0 && (
                  <p className={`text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#ccc]' : 'text-[#7e93b3]'}`}>No selections yet</p>
                )}
              </div>

              {/* Total + Confirm */}
              <div className={`flex items-center justify-between border-t pt-2 transition-colors duration-300 ${isLight ? 'border-[#e5e5e5]' : 'border-[#29466e]'}`}>
                <div>
                  <span className={`text-[11px] font-bold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Total</span>
                  <span className={`ml-1 text-[14px] font-bold transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]'}`}>₹{ancillaryTotal.toLocaleString('en-IN')}</span>
                </div>
                {error && <span className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#dc2626]' : 'text-[#f87171]'}`}>{error}</span>}
                <button
                  type="button"
                  onClick={confirmContinue}
                  disabled={false}
                  className={`flex items-center gap-1.5 rounded-[6px] px-4 py-2 text-[11px] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#c9cdd2] ${isLight ? 'bg-[#004B7C] hover:bg-[#003E67]' : 'bg-[#2593fc] hover:bg-[#d4af37]'}`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Confirm &amp; Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Seat Button (airline-style) ---------- */

const SeatBtn: React.FC<{ cell: SeatCell; selected: boolean; isLight: boolean; onClick: () => void }> = ({ cell, selected, isLight, onClick }) => {
  if (cell.occupied) {
    return (
      <div className="flex w-[28px] flex-col items-center">
        <div className={`flex h-[8px] w-[18px] items-end justify-center rounded-t-[2px] transition-colors duration-300 ${isLight ? 'bg-[#ddd]' : 'bg-[#374151]'}`} />
        <button type="button" disabled className={`flex h-[20px] w-[28px] cursor-not-allowed items-center justify-center rounded-b-[3px] border text-[7px] font-bold transition-colors duration-300 ${isLight ? 'border-[#d0d0d0] bg-[#e8e8e8] text-[#bbb]' : 'border-[#374151] bg-[#2a2f3a] text-[#7e93b3]'}`}>
          {cell.id}
        </button>
      </div>
    );
  }

  const seatBg = selected
    ? 'border-[#22c55e] bg-[#22c55e] text-white shadow-[0_2px_6px_rgba(34,197,94,0.35)]'
    : cell.premium
      ? isLight
        ? 'border-[#d4af37]/70 bg-[#fef9e7] text-[#8a6d1f] hover:border-[#d4af37] hover:shadow-[0_1px_3px_rgba(212,175,55,0.2)]'
        : 'border-[#d4af37]/70 bg-[#d4af37]/20 text-[#f0c265] hover:border-[#d4af37] hover:bg-[#d4af37]/35'
      : isLight
        ? 'border-[#d0d7e2] bg-white text-[#555] hover:border-[#004B7C] hover:bg-[#E1EFFB] hover:shadow-[0_1px_3px_rgba(0,75,124,0.1)]'
        : 'border-[#1c3a5f] bg-[#1c3a5f] text-white/80 hover:border-[#2593fc] hover:bg-[#27507c]';

  const backrestBg = selected
    ? 'bg-white/30'
    : cell.premium
      ? 'bg-[#d4af37]/15'
      : isLight
        ? 'bg-[#e2e8f0]'
        : 'bg-[#27507c]';

  return (
    <div className="flex w-[28px] flex-col items-center">
      {/* Backrest */}
      <button
        type="button"
        onClick={onClick}
        className={`flex h-[8px] w-[18px] cursor-pointer items-end justify-center rounded-t-[2px] transition-all duration-150 ${backrestBg}`}
        aria-label={`Seat ${cell.id} - ${cell.type}${cell.premium ? ' Premium' : ''} - ₹${cell.price}`}
      />
      {/* Seat base */}
      <button
        type="button"
        onClick={onClick}
        className={`flex h-[20px] w-[28px] cursor-pointer items-center justify-center rounded-b-[3px] rounded-tr-[1px] border text-[7px] font-bold transition-all duration-150 ${seatBg}`}
      >
        {selected ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : cell.id}
      </button>
    </div>
  );
};

export default SeatMealPricingPanel;
