import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Utensils, QrCode, Settings, Plus, Trash2, Edit3, 
  LogOut, Save, Image as ImageIcon, Loader2 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { RestaurantData, MenuItem, Category } from '../types';

export const AdminDashboard = () => {
  const [data, setData] = useState<RestaurantData | null>(null);
  const [activeTab, setActiveTab] = useState<'MENU' | 'QR' | 'SETTINGS'>('MENU');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  // Auth Check & Data Fetch
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      // Real-time listener
      const unsubDoc = onSnapshot(doc(db, 'restaurants', user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as RestaurantData);
        }
        setLoading(false);
      });

      return () => unsubDoc();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // --- Handlers ---

  const saveData = async (newData: Partial<RestaurantData>) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'restaurants', auth.currentUser.uid), newData);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const handleAddItem = () => {
    if (!data) return;
    setEditingItem({
      id: `item_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      categoryId: data.categories[0]?.id || '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
      tags: []
    });
  };

  const handleSaveItem = async () => {
    if (!editingItem || !editingItem.name || !data) return;
    
    const newItem = editingItem as MenuItem;
    const existingIndex = data.items.findIndex(i => i.id === newItem.id);
    let newItems = [...data.items];
    
    if (existingIndex >= 0) {
      newItems[existingIndex] = newItem;
    } else {
      newItems.push(newItem);
    }

    await saveData({ items: newItems });
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (!data || !confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    await saveData({ items: data.items.filter(i => i.id !== id) });
  };

  const handleAddCategory = async () => {
    if (!data) return;
    const name = prompt('اسم القسم الجديد:');
    if (name) {
      const newCat: Category = { id: `cat_${Date.now()}`, name };
      await saveData({ categories: [...data.categories, newCat] });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!data || !confirm('سيتم حذف القسم وجميع العناصر بداخله. هل أنت متأكد؟')) return;
    await saveData({
      categories: data.categories.filter(c => c.id !== id),
      items: data.items.filter(i => i.categoryId !== id)
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" size={40} /></div>;
  if (!data) return null;

  return (
    <div dir="rtl" className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
           <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
           <h1 className="font-bold text-xl">MenuX</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('MENU')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'MENU' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Utensils size={20} /> إدارة القائمة
          </button>
          <button onClick={() => setActiveTab('QR')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'QR' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <QrCode size={20} /> رمز QR
          </button>
          <button onClick={() => setActiveTab('SETTINGS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'SETTINGS' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Settings size={20} /> الإعدادات
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={() => auth.signOut()} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition">
            <LogOut size={20} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* Menu Editor */}
        {activeTab === 'MENU' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">إدارة القائمة</h2>
                <p className="text-slate-500">قم بإضافة وتعديل الأقسام والوجبات</p>
              </div>
              <button onClick={handleAddItem} className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition shadow-lg shadow-orange-500/20">
                <Plus size={20} /> إضافة وجبة
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {data.categories.map(cat => (
                <div key={cat.id} className="bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 shrink-0">
                  <span className="font-bold">{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              ))}
              <button onClick={handleAddCategory} className="bg-slate-100 px-6 py-3 rounded-xl border border-slate-200 border-dashed text-slate-500 hover:bg-slate-200 flex items-center gap-2 shrink-0">
                <Plus size={16} /> قسم جديد
              </button>
            </div>

            <div className="space-y-6">
              {data.categories.map(cat => {
                const catItems = data.items.filter(i => i.categoryId === cat.id);
                return (
                  <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-bold text-lg">
                      {cat.name} ({catItems.length})
                    </div>
                    <div className="divide-y divide-slate-100">
                      {catItems.map(item => (
                        <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition group">
                          <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-slate-200" alt="" />
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900">{item.name}</h4>
                            <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
                            <div className="text-orange-600 font-bold mt-1">{item.price} ر.س</div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => setEditingItem(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit3 size={18}/></button>
                            <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                          </div>
                        </div>
                      ))}
                      {catItems.length === 0 && <div className="p-8 text-center text-slate-400">لا توجد عناصر في هذا القسم</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* QR Code */}
        {activeTab === 'QR' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold">رمز QR الخاص بمطعمك</h2>
            <p className="text-slate-500">امسح الرمز لتجربة القائمة الرقمية</p>
            
            <div className="bg-white p-4 rounded-2xl border-4 border-slate-900 inline-block shadow-2xl">
              <QRCodeSVG 
                value={`${window.location.origin}/menu/${auth.currentUser?.uid}`} 
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="pt-4">
              <a 
                href={`${window.location.origin}/menu/${auth.currentUser?.uid}`}
                target="_blank"
                rel="noreferrer"
                className="text-orange-600 font-bold hover:underline"
              >
                رابط القائمة المباشر
              </a>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'SETTINGS' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold border-b border-slate-100 pb-4">إعدادات المطعم</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">اسم المطعم</label>
                <input 
                  value={data.name}
                  onChange={(e) => saveData({ name: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">رقم الواتساب (مع رمز الدولة، مثال: 9665000000)</label>
                <input 
                  value={data.phone}
                  onChange={(e) => saveData({ phone: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl"
                  placeholder="9665xxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">رابط الشعار (URL)</label>
                <input 
                  value={data.logo}
                  onChange={(e) => saveData({ logo: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Item Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg">تفاصيل الوجبة</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600"><Settings size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <input 
                placeholder="اسم الوجبة"
                value={editingItem.name}
                onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-xl"
              />
              <textarea 
                placeholder="الوصف والمكونات..."
                value={editingItem.description}
                onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-xl h-24 resize-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number"
                  placeholder="السعر"
                  value={editingItem.price}
                  onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-slate-200 rounded-xl"
                />
                <select 
                  value={editingItem.categoryId}
                  onChange={e => setEditingItem({...editingItem, categoryId: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl"
                >
                  {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <input 
                placeholder="رابط الصورة"
                value={editingItem.image}
                onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-500"
              />
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg">إلغاء</button>
              <button onClick={handleSaveItem} className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
