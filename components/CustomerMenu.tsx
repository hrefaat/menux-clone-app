import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { RestaurantData, MenuItem, CartItem } from '../types';
import { 
  ShoppingBag, Search, X, Plus, Minus, Star, Clock, 
  ChevronLeft, Check, Phone, User, Utensils, Bike, ShoppingCart, Loader2 
} from 'lucide-react';

export const CustomerMenu = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutType, setCheckoutType] = useState<'DELIVERY' | 'PICKUP' | 'DINE_IN'>('DELIVERY');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '', table: '' });
  
  // Item Modal
  const [quantity, setQuantity] = useState(1);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'restaurants', id), (doc) => {
      if (doc.exists()) {
        const rData = doc.data() as RestaurantData;
        setData(rData);
        if (rData.categories.length > 0) setActiveCategory(rData.categories[0].id);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  // Scroll Spy
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !data) return;
    const handleScroll = () => {
      const scrollPosition = container.scrollTop + 220;
      for (const cat of data.categories) {
        const el = sectionRefs.current[cat.id];
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveCategory(cat.id);
          break;
        }
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [data]);

  const addToCart = () => {
    if (!selectedItem) return;
    setCart(prev => [...prev, { ...selectedItem, quantity }]);
    setSelectedItem(null);
    setQuantity(1);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleWhatsApp = () => {
    if (!data) return;
    
    const typeLabel = { DELIVERY: 'توصيل', PICKUP: 'استلام', DINE_IN: 'محلي' }[checkoutType];
    let msg = `*طلب جديد من القائمة الرقمية*\n`;
    msg += `--------------------------------\n`;
    msg += `*النوع:* ${typeLabel}\n`;
    msg += `*الاسم:* ${customerInfo.name}\n`;
    msg += `*الهاتف:* ${customerInfo.phone}\n`;
    if (checkoutType === 'DELIVERY') msg += `*العنوان:* ${customerInfo.address}\n`;
    if (checkoutType === 'DINE_IN') msg += `*الطاولة:* ${customerInfo.table}\n`;
    msg += `--------------------------------\n`;
    cart.forEach(i => msg += `${i.quantity}x ${i.name}\n`);
    msg += `--------------------------------\n`;
    msg += `*المجموع: ${cartTotal} ر.س*`;

    window.open(`https://wa.me/${data.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" size={40} /></div>;
  if (!data) return <div className="h-screen flex items-center justify-center text-slate-500">المطعم غير موجود</div>;

  return (
    <div dir="rtl" className="bg-slate-50 font-sans h-screen flex flex-col overflow-hidden relative text-slate-900">
      
      {/* Scroll Container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-32 no-scrollbar scroll-smooth">
        
        {/* Header */}
        <div className="relative h-48 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover opacity-80" alt="Cover" />
        </div>

        {/* Info Card */}
        <div className="relative mx-4 -mt-16 mb-4 bg-white rounded-2xl shadow-xl p-4 flex items-start gap-4 z-20">
          <div className="w-16 h-16 rounded-full border-2 border-white shadow-md bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
            {data.logo ? <img src={data.logo} className="w-full h-full object-cover" /> : <Utensils />}
          </div>
          <div className="flex-1 pt-1">
            <h1 className="text-xl font-bold truncate">{data.name}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">مفتوح الآن</span>
              <span className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor"/> 4.8</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50 py-3 px-4 flex gap-2 overflow-x-auto no-scrollbar">
          {data.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sectionRefs.current[cat.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveCategory(cat.id);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${activeCategory === cat.id ? 'bg-orange-600 text-white' : 'bg-white text-slate-500'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="px-4 py-4 space-y-6">
          {data.categories.map(cat => {
            const items = data.items.filter(i => i.categoryId === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id} ref={el => sectionRefs.current[cat.id] = el} className="scroll-mt-36">
                <h2 className="text-xl font-bold mb-3 px-1">{cat.name}</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                  {items.map(item => (
                    <div key={item.id} onClick={() => setSelectedItem(item)} className="flex gap-4 p-4 active:bg-slate-50 transition cursor-pointer">
                      <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                        <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md text-slate-900"><Plus size={16}/></div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-bold text-base">{item.name}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                        </div>
                        <div className="text-orange-600 font-bold">{item.price} ر.س</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cart Button */}
      {cart.length > 0 && !isCheckoutOpen && !selectedItem && (
        <div className="absolute bottom-6 left-4 right-4 z-30 animate-in slide-in-from-bottom-4">
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-slate-900 text-white rounded-xl p-4 shadow-xl flex items-center justify-between active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-3 py-1.5 rounded-lg font-bold text-sm">{cart.reduce((a,b)=>a+b.quantity,0)}</div>
              <span className="font-medium text-slate-200">عناصر بالسلة</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <span>{cartTotal} ر.س</span>
              <ChevronLeft size={20}/>
            </div>
          </button>
        </div>
      )}

      {/* Item Modal */}
      {selectedItem && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedItem(null)}></div>
          <div className="bg-white w-full rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom max-h-[90vh] flex flex-col relative overflow-hidden">
             <button onClick={() => setSelectedItem(null)} className="absolute top-4 left-4 z-10 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white"><X size={18}/></button>
             <div className="h-64 shrink-0 relative">
               <img src={selectedItem.image} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-6 right-6 text-white">
                 <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                 <p className="opacity-90">{selectedItem.price} ر.س</p>
               </div>
             </div>
             <div className="p-6 flex-1 overflow-y-auto">
               <p className="text-slate-500 leading-relaxed">{selectedItem.description}</p>
             </div>
             <div className="p-4 border-t border-slate-100 bg-white">
               <div className="flex gap-4">
                 <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-2">
                   <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-10 h-10 flex items-center justify-center text-slate-600"><Minus size={20}/></button>
                   <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                   <button onClick={() => setQuantity(quantity+1)} className="w-10 h-10 flex items-center justify-center text-slate-600"><Plus size={20}/></button>
                 </div>
                 <button onClick={addToCart} className="flex-1 bg-orange-600 text-white rounded-xl font-bold text-lg shadow-xl py-3">
                   إضافة {selectedItem.price * quantity} ر.س
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="absolute inset-0 z-50 bg-slate-50 flex flex-col animate-in slide-in-from-bottom">
           <div className="bg-white px-6 py-4 shadow-sm z-10 flex items-center justify-between">
             <h2 className="text-xl font-bold">إتمام الطلب</h2>
             <button onClick={() => setIsCheckoutOpen(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><X size={20}/></button>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-6">
             <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex">
                {[
                  { id: 'DELIVERY', icon: Bike, label: 'توصيل' },
                  { id: 'PICKUP', icon: ShoppingBag, label: 'استلام' },
                  { id: 'DINE_IN', icon: Utensils, label: 'محلي' }
                ].map((type) => (
                  <button key={type.id} onClick={() => setCheckoutType(type.id as any)} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-bold transition ${checkoutType === type.id ? 'bg-orange-50 text-orange-600' : 'text-slate-400'}`}>
                    <type.icon size={20} />{type.label}
                  </button>
                ))}
             </div>
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
               <h3 className="font-bold flex items-center gap-2"><User size={18} className="text-slate-400"/> بيانات العميل</h3>
               <input placeholder="الاسم" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
               <input placeholder="رقم الهاتف" type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
               {checkoutType === 'DELIVERY' && <textarea placeholder="العنوان بالتفصيل" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24" />}
               {checkoutType === 'DINE_IN' && <input placeholder="رقم الطاولة" value={customerInfo.table} onChange={e => setCustomerInfo({...customerInfo, table: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />}
             </div>
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
               <h3 className="font-bold flex items-center gap-2 mb-4"><ShoppingCart size={18} className="text-slate-400"/> ملخص الطلب</h3>
               {cart.map((item, i) => (
                 <div key={i} className="flex justify-between border-b border-slate-50 py-2 last:border-0">
                   <div className="flex gap-2">
                     <span className="font-bold text-orange-600">{item.quantity}x</span>
                     <span>{item.name}</span>
                   </div>
                   <span className="font-bold">{item.price * item.quantity}</span>
                 </div>
               ))}
               <div className="flex justify-between font-bold text-lg pt-4 mt-2 border-t border-slate-100">
                 <span>المجموع</span>
                 <span>{cartTotal} ر.س</span>
               </div>
             </div>
           </div>
           <div className="p-4 bg-white border-t border-slate-100">
             <button onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:brightness-105 transition">
               <Phone size={20} /> إرسال عبر واتساب
             </button>
           </div>
        </div>
      )}
    </div>
  );
};
