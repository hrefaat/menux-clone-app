import React from 'react';
import { 
  ScanLine, 
  Zap, 
  BarChart, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  Smartphone,
  ChefHat
} from 'lucide-react';
import { ViewMode } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onDemoToggle: (mode: ViewMode) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onDemoToggle }) => {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
              M
            </div>
            <span className="text-xl font-bold tracking-tight">MenuX</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-500">
            <a href="#features" className="hover:text-orange-600 transition">Features</a>
            <a href="#pricing" className="hover:text-orange-600 transition">Pricing</a>
            <button onClick={onGetStarted} className="text-slate-900 hover:text-orange-600 transition">Login</button>
            <button 
              onClick={onGetStarted}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition shadow-xl shadow-slate-900/10"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-bold text-sm border border-orange-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              v2.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              The Future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Contactless Dining</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
              Create beautiful, contactless digital menus in minutes. Update prices instantly, track analytics, and boost sales with MenuX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 transition shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
               >
                 Start Free Trial <ArrowRight size={20} />
               </button>
               <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-600">Try Demo:</span>
                  <button onClick={() => onDemoToggle('DASHBOARD')} className="text-sm font-semibold text-orange-600 hover:underline">Admin View</button>
                  <span className="text-slate-300">|</span>
                  <button onClick={() => onDemoToggle('CUSTOMER_PREVIEW')} className="text-sm font-semibold text-orange-600 hover:underline">Customer View</button>
               </div>
            </div>
          </div>

          <div className="relative animate-in slide-in-from-right duration-700 delay-100 hidden lg:block">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl -z-10"></div>
             <div className="relative mx-auto w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 w-full h-full bg-slate-50">
                    {/* Mini mock content for hero */}
                    <div className="bg-orange-500 h-32 p-6 flex items-end">
                        <h2 className="text-white font-bold text-2xl">Burger & Co.</h2>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="h-24 rounded-xl bg-white shadow-sm p-3 flex gap-3">
                            <div className="w-20 bg-slate-200 rounded-lg"></div>
                            <div className="flex-1 space-y-2 py-2">
                                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                                <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                        <div className="h-24 rounded-xl bg-white shadow-sm p-3 flex gap-3">
                            <div className="w-20 bg-slate-200 rounded-lg"></div>
                            <div className="flex-1 space-y-2 py-2">
                                <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                                <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to run a modern restaurant</h2>
                <p className="text-slate-500 text-lg">Powerful tools packed into a simple, elegant interface.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: ScanLine, title: "Instant QR Generation", desc: "Create custom QR codes that match your brand identity instantly." },
                    { icon: Zap, title: "Real-time Updates", desc: "Change prices and items on the fly. No reprints needed." },
                    { icon: BarChart, title: "Smart Analytics", desc: "Track views, popular items, and customer behavior." },
                    { icon: Globe, title: "Multi-language", desc: "Automatically translate your menu for international tourists." }
                ].map((f, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                            <f.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Simple, transparent pricing</h2>
             <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                 {/* Free Tier */}
                 <div className="p-8 rounded-3xl border border-slate-200 hover:border-orange-200 transition bg-white">
                     <h3 className="text-xl font-bold mb-2">Starter</h3>
                     <div className="text-4xl font-bold mb-6">$0<span className="text-base font-medium text-slate-400">/mo</span></div>
                     <ul className="space-y-4 mb-8">
                         {['1 Menu', 'Basic QR Code', '100 Scans/mo'].map(item => (
                             <li key={item} className="flex items-center gap-3 text-slate-600">
                                 <CheckCircle size={18} className="text-green-500" /> {item}
                             </li>
                         ))}
                     </ul>
                     <button className="w-full py-3 rounded-xl border-2 border-slate-100 font-bold hover:border-slate-900 transition">Start Free</button>
                 </div>
                 
                 {/* Pro Tier */}
                 <div className="p-8 rounded-3xl border-2 border-orange-500 bg-white relative shadow-2xl shadow-orange-500/10 scale-105">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">MOST POPULAR</div>
                     <h3 className="text-xl font-bold mb-2 text-orange-600">Business</h3>
                     <div className="text-4xl font-bold mb-6">$29<span className="text-base font-medium text-slate-400">/mo</span></div>
                     <ul className="space-y-4 mb-8">
                         {['Unlimited Menus', 'Custom Branding', 'Unlimited Scans', 'Analytics Dashboard', 'Priority Support'].map(item => (
                             <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                                 <CheckCircle size={18} className="text-orange-500" /> {item}
                             </li>
                         ))}
                     </ul>
                     <button className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-500/30">Get Started</button>
                 </div>

                 {/* Enterprise Tier */}
                 <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50">
                     <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                     <div className="text-4xl font-bold mb-6">$99<span className="text-base font-medium text-slate-400">/mo</span></div>
                     <ul className="space-y-4 mb-8">
                         {['Multiple Locations', 'API Access', 'White Label', 'Dedicated Account Manager'].map(item => (
                             <li key={item} className="flex items-center gap-3 text-slate-600">
                                 <CheckCircle size={18} className="text-slate-400" /> {item}
                             </li>
                         ))}
                     </ul>
                     <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition">Contact Sales</button>
                 </div>
             </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold">M</div>
                 <span className="text-white font-bold text-lg">MenuX</span>
              </div>
              <div className="flex gap-8 text-sm">
                  <a href="#" className="hover:text-white">Privacy</a>
                  <a href="#" className="hover:text-white">Terms</a>
                  <a href="#" className="hover:text-white">Twitter</a>
                  <a href="#" className="hover:text-white">Instagram</a>
              </div>
              <div className="text-xs opacity-50">
                  © 2024 MenuX Inc. All rights reserved.
              </div>
          </div>
      </footer>
    </div>
  );
};
