import React from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, Zap, BarChart, Smartphone, ChefHat, ArrowLeft } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div dir="rtl" className="bg-white min-h-screen font-sans text-slate-900">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">M</div>
            <span className="text-xl font-bold tracking-tight">MenuX</span>
          </div>
          <Link to="/login" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition">
            دخول / تسجيل
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 font-bold text-sm border border-orange-100">
            المنصة الأولى للمنيو الرقمي
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            حول قائمة مطعمك إلى <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">تجربة رقمية متكاملة</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            أنشئ منيو QR احترافي في دقائق، استقبل الطلبات عبر واتساب، وحدث الأسعار في أي وقت.
          </p>
          <div className="pt-4 flex justify-center gap-4">
             <Link to="/login" className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 transition shadow-xl shadow-orange-500/20 flex items-center gap-2">
               ابـدأ مجانـاً <ArrowLeft size={20} />
             </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[
                { icon: ScanLine, title: "رمز QR خاص", desc: "تصميم احترافي لرمز الاستجابة السريع يتماشى مع هوية مطعمك." },
                { icon: Smartphone, title: "واجهة تطبيق", desc: "تجربة مستخدم تشبه التطبيقات، سريعة وسهلة الاستخدام على الجوال." },
                { icon: Zap, title: "تحديث فوري", desc: "عدل الأسعار، أضف وجبات، وأخفِ الأصناف النافدة بضغطة زر." }
            ].map((f, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-4">
                        <f.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                    <p className="text-slate-500">{f.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center">
          <div className="mb-4 text-white font-bold text-2xl">MenuX</div>
          <p>© 2024 جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};
