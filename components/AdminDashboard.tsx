import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  QrCode, 
  Settings, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit3, 
  Smartphone, 
  Upload,
  Check,
  X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Category, MenuItem, RestaurantConfig } from '../types';
import { CustomerMenu } from './CustomerMenu';

// Analytics Mock Data
const CHART_DATA = [
  { name: 'Mon', views: 400, orders: 240 },
  { name: 'Tue', views: 300, orders: 139 },
  { name: 'Wed', views: 200, orders: 980 },
  { name: 'Thu', views: 278, orders: 390 },
  { name: 'Fri', views: 189, orders: 480 },
  { name: 'Sat', views: 239, orders: 380 },
  { name: 'Sun', views: 349, orders: 430 },
];

interface AdminDashboardProps {
  categories: Category[];
  items: MenuItem[];
  config: RestaurantConfig;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setConfig: React.Dispatch<React.SetStateAction<RestaurantConfig>>;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  categories, items, config, setCategories, setItems, setConfig, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MENU' | 'QR' | 'SETTINGS'>('MENU');
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  // --- Handlers ---
  const handleAddItem = () => {
    setEditingItem({
      id: `item_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      categoryId: categories[0]?.id || '',
      image: 'https://picsum.photos/400/300',
      tags: []
    });
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.name) return;
    
    setItems(prev => {
      const exists = prev.find(i => i.id === editingItem.id);
      if (exists) {
        return prev.map(i => i.id === editingItem.id ? editingItem as MenuItem : i);
      }
      return [...prev, editingItem as MenuItem];
    });
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
        setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleUpdateConfig = (key: keyof RestaurantConfig, value: string) => {
      setConfig(prev => ({ ...prev, [key]: value }));
  };

  // --- Components ---

  const SidebarItem = ({ icon: Icon, label, tab }: { icon: any, label: string, tab: string }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === tab 
          ? 'bg-orange-50 text-orange-600 font-medium' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
        <div className="flex items-center gap-2 px-2 mb-8 mt-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-bold tracking-tight">MenuX</span>
        </div>

        <div className="space-y-1 flex-1">
          <SidebarItem icon={Utensils} label="Menu Builder" tab="MENU" />
          <SidebarItem icon={QrCode} label="QR Customizer" tab="QR" />
          <SidebarItem icon={BarChart3} label="Analytics" tab="DASHBOARD" />
          <SidebarItem icon={Settings} label="Settings" tab="SETTINGS" />
        </div>

        <button onClick={onLogout} className="mt-auto px-4 py-3 text-left text-sm text-slate-500 hover:text-red-500 transition">
          Log Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex relative">
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {activeTab === 'MENU' && 'Menu Builder'}
                    {activeTab === 'QR' && 'QR Design Studio'}
                    {activeTab === 'DASHBOARD' && 'Performance Overview'}
                    {activeTab === 'SETTINGS' && 'Restaurant Settings'}
                </h1>
                <p className="text-slate-500">Manage your digital presence in real-time.</p>
            </div>

            {/* Tab: Menu Builder */}
            {activeTab === 'MENU' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="font-medium text-slate-600">Categories: {categories.length} • Items: {items.length}</span>
                        <button 
                            onClick={handleAddItem}
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-900/20"
                        >
                            <Plus size={18} /> Add New Item
                        </button>
                    </div>

                    {/* Item List Grouped by Category */}
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-slate-800">{cat.name}</h3>
                                <button className="text-slate-400 hover:text-slate-600"><Edit3 size={16}/></button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {items.filter(i => i.categoryId === cat.id).map(item => (
                                    <div key={item.id} className="p-4 flex gap-4 items-center group hover:bg-slate-50 transition">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900">{item.name}</h4>
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">{tag}</span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
                                        </div>
                                        <div className="font-bold text-slate-900 mr-4">{config.currency}{item.price.toFixed(2)}</div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => setEditingItem(item)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                                {items.filter(i => i.categoryId === cat.id).length === 0 && (
                                    <div className="p-8 text-center text-slate-400 text-sm">No items in this category.</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tab: QR Builder */}
            {activeTab === 'QR' && (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Primary Color</label>
                            <div className="flex gap-3">
                                {['#F97316', '#8B5CF6', '#3B82F6', '#10B981', '#EF4444', '#000000'].map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => handleUpdateConfig('qrColor', c)}
                                        className={`w-10 h-10 rounded-full border-2 ${config.qrColor === c ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">Background Color</label>
                             <input 
                                type="color" 
                                value={config.qrBgColor} 
                                onChange={(e) => handleUpdateConfig('qrBgColor', e.target.value)}
                                className="w-full h-12 p-1 rounded-xl cursor-pointer"
                            />
                        </div>
                        <div className="pt-4">
                            <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition">
                                Download .PNG
                            </button>
                        </div>
                    </div>
                    <div className="w-64 h-64 bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-center border border-slate-100" style={{ backgroundColor: config.qrBgColor }}>
                        {/* Simulated QR Code */}
                         <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path fill={config.qrColor} d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" />
                            <path fill={config.qrColor} d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" />
                            <path fill={config.qrColor} d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" />
                            <rect x="50" y="10" width="5" height="5" fill={config.qrColor} />
                            <rect x="10" y="50" width="5" height="5" fill={config.qrColor} />
                            <rect x="55" y="55" width="20" height="20" rx="2" fill={config.qrColor} opacity="0.8" />
                            <rect x="45" y="45" width="10" height="10" fill={config.qrColor} />
                            <rect x="80" y="50" width="10" height="10" fill={config.qrColor} />
                            <rect x="50" y="80" width="10" height="10" fill={config.qrColor} />
                        </svg>
                    </div>
                </div>
            )}

            {/* Tab: Dashboard/Analytics */}
            {activeTab === 'DASHBOARD' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Total Scans', val: '1,245', change: '+12%', color: 'text-blue-600' },
                            { label: 'Orders Placed', val: '843', change: '+5.4%', color: 'text-green-600' },
                            { label: 'Revenue', val: '$12.4k', change: '+18%', color: 'text-orange-600' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-bold text-slate-900">{stat.val}</span>
                                    <span className={`text-sm font-bold mb-1.5 ${stat.color}`}>{stat.change}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-80">
                         <h3 className="font-bold text-lg text-slate-800 mb-6">Activity Overview</h3>
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="views" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                         </ResponsiveContainer>
                    </div>
                </div>
            )}
            
            </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="w-[400px] bg-slate-100 border-l border-slate-200 hidden xl:flex items-center justify-center p-8 sticky top-0 h-screen">
            <div className="relative w-full max-w-[320px] aspect-[9/19] bg-slate-900 rounded-[3rem] shadow-2xl border-[8px] border-slate-900 overflow-hidden ring-4 ring-slate-200">
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900 z-50 flex items-center justify-between px-6">
                    <div className="text-[10px] text-white font-medium">9:41</div>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                    </div>
                </div>
                {/* Screen Content */}
                <div className="absolute inset-0 pt-6 bg-slate-50 overflow-hidden">
                    <CustomerMenu categories={categories} items={items} config={config} previewMode={true} />
                </div>
                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-100/20 rounded-full z-50"></div>
            </div>
            <div className="absolute bottom-8 text-slate-400 text-sm font-medium flex items-center gap-2">
                <Smartphone size={16} /> Live Preview
            </div>
        </div>

      </main>

      {/* Item Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Edit Item</h3>
                    <button onClick={() => setEditingItem(null)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                        <input 
                            value={editingItem.name}
                            onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition"
                            placeholder="e.g. Smash Burger"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                        <textarea 
                            value={editingItem.description}
                            onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition"
                            placeholder="Ingredients..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price</label>
                            <input 
                                type="number"
                                value={editingItem.price}
                                onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition"
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                            <select 
                                value={editingItem.categoryId}
                                onChange={e => setEditingItem({...editingItem, categoryId: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition"
                            >
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                    <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition">Cancel</button>
                    <button onClick={handleSaveItem} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold shadow-lg hover:opacity-90 transition">Save Changes</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};