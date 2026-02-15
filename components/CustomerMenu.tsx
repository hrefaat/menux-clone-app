import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Search, X, Plus, Minus, Star, Clock, 
  MapPin, ChevronRight, ChevronLeft, Check, Languages, 
  Phone, User, Home, Utensils, Bike, ShoppingCart 
} from 'lucide-react';
import { Category, MenuItem, RestaurantConfig, CartItem } from '../types';

interface CustomerMenuProps {
  categories: Category[];
  items: MenuItem[];
  config: RestaurantConfig;
  previewMode?: boolean;
}

// --- Localization & Mock Data ---

type Language = 'ar' | 'en';

const TRANSLATIONS = {
  ar: {
    search: "بحث في القائمة...",
    open: "مفتوح الآن",
    closed: "مغلق",
    mins: "دقيقة",
    chooseSize: "اختر الحجم",
    addOns: "إضافات",
    required: "مطلوب",
    addToOrder: "إضافة للطلب",
    viewOrder: "عرض الطلب",
    yourOrder: "ملخص الطلب",
    checkout: "إتمام الطلب",
    total: "المجموع",
    subtotal: "المجموع الفرعي",
    delivery: "توصيل",
    pickup: "استلام",
    dineIn: "محلي",
    name: "الاسم",
    phone: "رقم الهاتف",
    address: "العنوان",
    table: "رقم الطاولة",
    sendWhatsapp: "إرسال الطلب عبر واتساب",
    orderType: "طريقة الاستلام",
    customerInfo: "بيانات العميل",
    emptyCart: "السلة فارغة",
    currency: "ر.س",
    free: "مجاني",
    items: "عناصر",
    bestseller: "الأكثر مبيعاً"
  },
  en: {
    search: "Search menu...",
    open: "Open Now",
    closed: "Closed",
    mins: "mins",
    chooseSize: "Choose Size",
    addOns: "Add-ons",
    required: "Required",
    addToOrder: "Add to Order",
    viewOrder: "View Order",
    yourOrder: "Your Order",
    checkout: "Checkout",
    total: "Total",
    subtotal: "Subtotal",
    delivery: "Delivery",
    pickup: "Pickup",
    dineIn: "Dine-in",
    name: "Name",
    phone: "Phone Number",
    address: "Address",
    table: "Table Number",
    sendWhatsapp: "Send Order via WhatsApp",
    orderType: "Order Type",
    customerInfo: "Customer Info",
    emptyCart: "Cart is empty",
    currency: "SAR",
    free: "Free",
    items: "items",
    bestseller: "Bestseller"
  }
};

// Simulated Arabic Content Mapping for Demo
const ARABIC_CONTENT_MAP: Record<string, { name: string; desc: string }> = {
  'item_1': { name: 'برجر ترافل سماش', desc: 'قطعتين لحم، صوص ترافل، جبنة شيدر معتقة، بصل مكرمل' },
  'item_2': { name: 'تشيز برجر كلاسيك', desc: 'ربع باوند مع جبنة أمريكية، خس، طماطم، والصوص الخاص' },
  'item_3': { name: 'ساندوتش دجاج سبايسي', desc: 'صدر دجاج مقلي، كول سلو حار، مخلل، خبز بريوش' },
  'item_4': { name: 'بطاطس لوديد', desc: 'بطاطس مقلية مع صوص الجبنة، قطع بيكون، وبصل أخضر' },
  'item_5': { name: 'عصير ليمون كرافت', desc: 'ليمون طازج مع لمسة نعناع منعشة' },
  'cat_1': { name: 'الأكثر طلباً', desc: '' },
  'cat_2': { name: 'برجر', desc: '' },
  'cat_3': { name: 'أطباق جانبية', desc: '' },
  'cat_4': { name: 'مشروبات', desc: '' },
};

export const CustomerMenu: React.FC<CustomerMenuProps> = ({ categories, items, config, previewMode = false }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutType, setCheckoutType] = useState<'DELIVERY' | 'PICKUP' | 'DINE_IN'>('DELIVERY');
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', address: '', table: '' });

  // Modal State
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalOptions, setModalOptions] = useState<{ name: string; choice: string; price: number }[]>([]);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const t = TRANSLATIONS[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // --- Helpers ---
  
  const getLocalizedContent = (id: string, originalName: string, originalDesc?: string) => {
    if (lang === 'en') return { name: originalName, desc: originalDesc || '' };
    const mapped = ARABIC_CONTENT_MAP[id];
    return { name: mapped?.name || originalName, desc: mapped?.desc || originalDesc || '' };
  };

  // --- Logic ---

  useEffect(() => {
    if (selectedItem) {
      setModalQuantity(1);
      // Default modifier selection logic
      setModalOptions([
        { name: lang === 'ar' ? 'الحجم' : 'Size', choice: lang === 'ar' ? 'عادي' : 'Regular', price: 0 }
      ]);
    }
  }, [selectedItem, lang]);

  // Scroll Spy
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop + 220; 
      let currentId = activeCategory;
      for (const cat of categories) {
        const element = sectionRefs.current[cat.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentId = cat.id;
            break;
          }
        }
      }
      if (currentId !== activeCategory) setActiveCategory(currentId);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [categories, activeCategory]);

  const scrollToCategory = (catId: string) => {
    const element = sectionRefs.current[catId];
    if (element && scrollContainerRef.current) {
      const top = element.offsetTop - 180;
      scrollContainerRef.current.scrollTo({ top, behavior: 'smooth' });
      setActiveCategory(catId);
    }
  };

  const addToCart = () => {
    if (!selectedItem) return;
    setCart(prev => [...prev, { ...selectedItem, quantity: modalQuantity, selectedOptions: modalOptions }]);
    setSelectedItem(null);
  };

  const cartTotal = cart.reduce((sum, item) => {
      const opts = item.selectedOptions?.reduce((a, b) => a + b.price, 0) || 0;
      return sum + ((item.price + opts) * item.quantity);
  }, 0);

  const handleSendWhatsApp = () => {
    // Construct Message
    const orderTypeLabel = {
      'DELIVERY': t.delivery,
      'PICKUP': t.pickup,
      'DINE_IN': t.dineIn
    }[checkoutType];

    let message = `*${t.checkout} - ${config.name}*\n`;
    message += `--------------------------------\n`;
    message += `*${t.orderType}:* ${orderTypeLabel}\n`;
    message += `*${t.name}:* ${checkoutForm.name}\n`;
    message += `*${t.phone}:* ${checkoutForm.phone}\n`;
    if (checkoutType === 'DELIVERY') message += `*${t.address}:* ${checkoutForm.address}\n`;
    if (checkoutType === 'DINE_IN') message += `*${t.table}:* ${checkoutForm.table}\n`;
    message += `--------------------------------\n`;
    
    cart.forEach(item => {
      const content = getLocalizedContent(item.id, item.name);
      const opts = item.selectedOptions?.map(o => o.choice).join(', ');
      message += `${item.quantity}x ${content.name} ${opts ? `(${opts})` : ''}\n`;
    });
    
    message += `--------------------------------\n`;
    message += `*${t.total}: ${cartTotal.toFixed(2)} ${t.currency}*`;

    const encodedMsg = encodeURIComponent(message);
    const phone = "966500000000"; // Demo Number
    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
  };

  // Modifiers Data
  const MODIFIERS = [
    { 
      id: 'size', name: t.chooseSize, type: 'radio', required: true,
      options: [
        { label: lang === 'ar' ? 'عادي' : 'Regular', price: 0 },
        { label: lang === 'ar' ? 'كبير' : 'Large', price: 5 }
      ]
    },
    { 
      id: 'addons', name: t.addOns, type: 'checkbox', required: false,
      options: [
        { label: lang === 'ar' ? 'جبنة' : 'Cheese', price: 3 },
        { label: lang === 'ar' ? 'صوص' : 'Sauce', price: 2 }
      ]
    }
  ];

  const toggleOption = (modName: string, choice: string, price: number, type: string) => {
    setModalOptions(prev => {
        if (type === 'radio') return [...prev.filter(o => o.name !== modName), { name: modName, choice, price }];
        const exists = prev.find(o => o.name === modName && o.choice === choice);
        return exists 
          ? prev.filter(o => !(o.name === modName && o.choice === choice))
          : [...prev, { name: modName, choice, price }];
    });
  };

  return (
    <div dir={dir} className={`relative bg-slate-50 font-sans h-full flex flex-col ${previewMode ? 'overflow-hidden' : 'min-h-screen'}`}>
      
      {/* Floating Language Toggle */}
      <button 
        onClick={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')}
        className="absolute top-4 z-50 ltr:right-4 rtl:left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-white/30 transition"
      >
        <Languages size={20} />
      </button>

      {/* Main Scroll Container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-32 no-scrollbar">
        
        {/* 1. App-like Header */}
        <div className="relative h-48 bg-slate-900">
            <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop" 
                alt="Restaurant Cover" 
                className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Info Card - Overlapping */}
        <div className="relative mx-4 -mt-16 mb-4 bg-white rounded-2xl shadow-xl p-4 flex items-start gap-4 z-10">
             <div className="w-16 h-16 rounded-full border-2 border-white shadow-md flex items-center justify-center shrink-0 overflow-hidden bg-slate-100 text-slate-900 text-xl font-bold">
                 {config.logo.startsWith('http') ? <img src={config.logo} className="w-full h-full object-cover" /> : config.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0 pt-1">
                 <h1 className="text-xl font-bold text-slate-900 truncate">{config.name}</h1>
                 <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                     <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                         {t.open}
                     </span>
                     <span className="flex items-center gap-1">15-25 {t.mins}</span>
                     <span className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" /> 4.8
                     </span>
                 </div>
             </div>
        </div>

        {/* 2. Sticky Category Pills */}
        <div className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-3 px-4 flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => {
                const catContent = getLocalizedContent(cat.id, cat.name);
                return (
                  <button
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.id)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 snap-center shadow-sm ${
                          activeCategory === cat.id 
                          ? 'text-white scale-105' 
                          : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-100'
                      }`}
                      style={activeCategory === cat.id ? { backgroundColor: config.primaryColor } : {}}
                  >
                      {catContent.name}
                  </button>
                )
            })}
        </div>

        {/* 3. Product List */}
        <div className="px-4 py-2 space-y-6">
            {categories.map(cat => {
                const catItems = items.filter(i => i.categoryId === cat.id);
                if (catItems.length === 0) return null;
                const catContent = getLocalizedContent(cat.id, cat.name);
                
                return (
                    <div key={cat.id} ref={el => sectionRefs.current[cat.id] = el} className="scroll-mt-36">
                        <h2 className="text-xl font-bold text-slate-900 mb-3 px-1">{catContent.name}</h2>
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            {catItems.map((item) => {
                                const itemContent = getLocalizedContent(item.id, item.name, item.description);
                                return (
                                    <div 
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className="flex items-start gap-4 p-4 cursor-pointer active:bg-slate-50 transition"
                                    >
                                        {/* Image (Left in RTL, Right in LTR - handled by dir) */}
                                        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                                            <img src={item.image} alt={itemContent.name} className="w-full h-full object-cover" />
                                            {/* Add Button Overlay */}
                                            <div className="absolute bottom-1 right-1 rtl:right-auto rtl:left-1 bg-white rounded-full p-1 shadow-md text-slate-900">
                                                <Plus size={16} strokeWidth={3} />
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{itemContent.name}</h3>
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{itemContent.desc}</p>
                                            </div>
                                            <div className="mt-2 font-bold text-base" style={{ color: config.primaryColor }}>
                                                {item.price.toFixed(0)} <span className="text-xs font-medium text-slate-400">{t.currency}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* 5. Sticky Footer (Cart Summary) */}
      {cart.length > 0 && !selectedItem && !isCheckoutOpen && (
          <div className="absolute bottom-6 left-4 right-4 z-30 animate-in slide-in-from-bottom-4 fade-in duration-300">
              <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-slate-900 text-white rounded-xl p-4 shadow-xl shadow-slate-900/20 flex items-center justify-between active:scale-[0.98] transition-transform"
              >
                  <div className="flex items-center gap-3">
                      <div className="bg-white/20 px-3 py-1.5 rounded-lg font-bold text-sm">
                          {cart.reduce((acc, i) => acc + i.quantity, 0)}
                      </div>
                      <span className="font-medium text-slate-200">{t.viewOrder}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lg">
                      <span>{cartTotal.toFixed(0)} {t.currency}</span>
                      {lang === 'ar' ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
                  </div>
              </button>
          </div>
      )}

      {/* 4. Product Detail Modal (Bottom Sheet) */}
      {selectedItem && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => setSelectedItem(null)}></div>
            <div className="bg-white w-full rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col overflow-hidden relative">
                
                {/* Close */}
                <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 z-10 ltr:right-4 rtl:left-4 w-8 h-8 bg-black/20 hover:bg-black/30 backdrop-blur rounded-full flex items-center justify-center transition-colors text-white"
                >
                    <X size={18}/>
                </button>

                {/* Hero Image */}
                <div className="h-64 shrink-0 relative">
                    <img src={selectedItem.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 text-white">
                        <h2 className="text-2xl font-bold mb-1">{getLocalizedContent(selectedItem.id, selectedItem.name).name}</h2>
                        <div className="text-lg font-medium opacity-90">{selectedItem.price} {t.currency}</div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
                    <p className="text-slate-500 leading-relaxed text-sm">
                        {getLocalizedContent(selectedItem.id, selectedItem.name, selectedItem.description).desc}
                    </p>

                    {MODIFIERS.map((mod) => (
                        <div key={mod.id}>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-slate-900">{mod.name}</h3>
                                {mod.required && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold">{t.required}</span>}
                            </div>
                            <div className="space-y-2">
                                {mod.options.map(opt => {
                                    const isSelected = modalOptions.some(o => o.name === mod.name && o.choice === opt.label);
                                    return (
                                        <div 
                                            key={opt.label}
                                            onClick={() => toggleOption(mod.name, opt.label, opt.price, mod.type)}
                                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                                isSelected 
                                                ? 'border-orange-600 bg-orange-50 ring-1 ring-orange-600' 
                                                : 'border-slate-100 hover:border-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                    isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                                                }`}>
                                                    {isSelected && <Check size={12} strokeWidth={4} />}
                                                </div>
                                                <span className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{opt.label}</span>
                                            </div>
                                            <span className="text-sm text-slate-500">
                                                {opt.price === 0 ? t.free : `+${opt.price} ${t.currency}`}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                    <div className="h-24"></div>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-4 border-t border-slate-100 bg-white absolute bottom-0 w-full z-20">
                    <div className="flex gap-4">
                        {/* Stepper */}
                        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-2">
                            <button onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))} className="w-10 h-10 flex items-center justify-center text-slate-600 active:scale-90"><Minus size={20}/></button>
                            <span className="font-bold text-lg w-4 text-center">{modalQuantity}</span>
                            <button onClick={() => setModalQuantity(modalQuantity + 1)} className="w-10 h-10 flex items-center justify-center text-slate-600 active:scale-90"><Plus size={20}/></button>
                        </div>
                        {/* Add Button */}
                        <button 
                            onClick={addToCart}
                            className="flex-1 h-14 rounded-xl text-white font-bold text-lg shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-between px-6"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            <span>{t.addToOrder}</span>
                            <span>{((selectedItem.price + modalOptions.reduce((a,b)=>a+b.price,0)) * modalQuantity).toFixed(0)} {t.currency}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 6. Checkout / Cart Modal */}
      {isCheckoutOpen && (
          <div className="absolute inset-0 z-50 bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300">
              
              {/* Header */}
              <div className="bg-white px-6 py-4 shadow-sm z-10 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">{t.checkout}</h2>
                  <button onClick={() => setIsCheckoutOpen(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                      <X size={20} />
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  
                  {/* Order Type Tabs */}
                  <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex">
                      {[
                        { id: 'DELIVERY', icon: Bike, label: t.delivery },
                        { id: 'PICKUP', icon: ShoppingBag, label: t.pickup },
                        { id: 'DINE_IN', icon: Utensils, label: t.dineIn }
                      ].map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setCheckoutType(type.id as any)}
                            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-bold transition-all ${
                                checkoutType === type.id 
                                ? 'bg-orange-50 text-orange-600 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                              <type.icon size={20} />
                              {type.label}
                          </button>
                      ))}
                  </div>

                  {/* Customer Form */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <User size={18} className="text-slate-400"/> {t.customerInfo}
                      </h3>
                      <div className="space-y-3">
                          <input 
                              placeholder={t.name}
                              value={checkoutForm.name}
                              onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-right"
                          />
                          <input 
                              placeholder={t.phone}
                              type="tel"
                              value={checkoutForm.phone}
                              onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-right"
                          />
                          {checkoutType === 'DELIVERY' && (
                              <textarea 
                                  placeholder={t.address}
                                  value={checkoutForm.address}
                                  onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-right h-24 resize-none"
                              />
                          )}
                          {checkoutType === 'DINE_IN' && (
                              <input 
                                  placeholder={t.table}
                                  value={checkoutForm.table}
                                  onChange={e => setCheckoutForm({...checkoutForm, table: e.target.value})}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-right"
                              />
                          )}
                      </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                          <ShoppingCart size={18} className="text-slate-400"/> {t.yourOrder}
                      </h3>
                      <div className="space-y-4">
                          {cart.map((item, idx) => {
                              const itemContent = getLocalizedContent(item.id, item.name);
                              return (
                                <div key={idx} className="flex justify-between items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 bg-orange-100 text-orange-700 rounded text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{itemContent.name}</div>
                                            <div className="text-xs text-slate-500">
                                                {item.selectedOptions?.map(o => o.choice).join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-slate-900">
                                        {((item.price + (item.selectedOptions?.reduce((a,b)=>a+b.price,0)||0)) * item.quantity).toFixed(0)}
                                    </div>
                                </div>
                              )
                          })}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-lg font-bold text-slate-900">
                          <span>{t.total}</span>
                          <span>{cartTotal.toFixed(0)} {t.currency}</span>
                      </div>
                  </div>
              </div>

              {/* Submit Button */}
              <div className="p-4 bg-white border-t border-slate-100">
                  <button 
                      onClick={handleSendWhatsApp}
                      className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                      <Phone size={20} />
                      {t.sendWhatsapp}
                  </button>
              </div>
          </div>
      )}

    </div>
  );
};
