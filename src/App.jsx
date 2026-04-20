import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";

// --- ՎՃԱՐՄԱՆ ՊԱՏՈՒՀԱՆ (PaymentModal) ---
const PaymentModal = ({ work, onClose }) => {
  const myTelegramUsername = "Montemigichian"; // <-- ԳՐԻՐ ՔՈ ՏԵԼԵԳՐԱՄԻ ԱՆՈՒՆԸ ԱՅՍՏԵՂ
  const message = encodeURIComponent(`Բարև ձեզ, ես վճարել եմ "${work.title}" ռեֆերատի համար (${work.price} ֏): Կցում եմ կտրոնը:`);
  const telegramUrl = `https://t.me/${myTelegramUsername}?text=${message}`;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-[32px] max-w-sm w-full text-center relative shadow-2xl animate-[fadeInUp_0.3s_ease-out]">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors text-xl">✕</button>
        
        <div className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block border border-indigo-500/20 tracking-widest">
          Քայլ 1. Վճարում
        </div>
        <h2 className="text-2xl font-black mb-1 text-white">QR Վճարում</h2>
        <p className="text-slate-400 text-sm mb-6 font-medium">Փոխանցեք <span className="text-white font-bold">{work.price.toLocaleString()} ֏</span></p>
        
        <div className="bg-white p-4 rounded-2xl mb-8 inline-block shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <img src="/my-qr-code.png" alt="QR Code" className="w-48 h-48" />
        </div>

        <div className="border-t border-slate-700/50 pt-6">
          <div className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block border border-indigo-500/20 tracking-widest">
            Քայլ 2. Հաստատում
          </div>
          <p className="text-slate-400 text-xs mb-5 leading-relaxed">Վճարումից հետո սեղմեք կոճակը և ուղարկեք կտրոնի նկարը ֆայլը ստանալու համար։</p>
          <a 
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            Ուղարկել կտրոնը (Telegram)
          </a>
        </div>
      </div>
    </div>
  );
};

// --- ՌԵՖԵՐԱՏԻ ՔԱՐՏ (WorkCard) ---
const WorkCard = ({ work, delay, onBuy }) => (
  <div 
    className="bg-[#1e293b] p-6 rounded-[28px] border border-slate-700 shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col group opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex justify-between items-center mb-4">
      <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">
        {work.category}
      </span>
    </div>
    <h3 className="text-xl font-bold text-slate-100 mb-3 leading-tight group-hover:text-indigo-400 transition-colors duration-300">
      {work.title}
    </h3>
    <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">{work.description}</p>
    <div className="flex justify-between items-center mt-auto pt-5 border-t border-slate-700/50">
      <span className="text-xl font-black text-white">{work.price.toLocaleString()} ֏</span>
      <button 
        onClick={() => onBuy(work)}
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
      >
        Գնել
      </button>
    </div>
  </div>
);

// --- ԳԼԽԱՎՈՐ ԷՋ (Home) ---
const Home = ({ works, loading }) => {
  const [selectedWork, setSelectedWork] = useState(null);

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-slate-200">
      <nav className="bg-[#0f172a]/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-indigo-500 uppercase tracking-tighter">
            Student<span className="text-white">Hub</span>
          </Link>
          <div className="hidden sm:block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Հայաստանի Ուսանողական Հարթակ</div>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white leading-[0.9]">
          Գնիր գիտելիքը <br/> <span className="text-indigo-500 font-serif italic font-normal text-4xl md:text-6xl">հանգիստ պայմաններում</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg leading-relaxed">Լավագույն ռեֆերատները և կուրսային աշխատանքները հասանելի մեկ վայրում։</p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {works.map((work, index) => (
              <WorkCard key={work.id} work={work} delay={(index + 1) * 80} onBuy={(w) => setSelectedWork(w)} />
            ))}
          </div>
        )}
      </main>

      {selectedWork && <PaymentModal work={selectedWork} onClose={() => setSelectedWork(null)} />}
    </div>
  );
};

// --- ԼՈԳԻՆ ԷՋ ---
const Login = ({ setIsAuth }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const handleLogin = (e) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'monte2026') { setIsAuth(true); } 
    else { alert("Սխալ տվյալներ:"); }
  };
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-[#1e293b] p-10 rounded-[32px] border border-slate-700 shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-black mb-8 text-white tracking-tighter">ADMIN <span className="text-indigo-500 font-serif italic font-normal">Login</span></h2>
        <div className="space-y-4">
          <input className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white transition-all" placeholder="Մուտքանուն" onChange={(e) => setUser(e.target.value)} />
          <input className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white transition-all" type="password" placeholder="Գաղտնաբառ" onChange={(e) => setPass(e.target.value)} />
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95">Մուտք</button>
        </div>
      </form>
    </div>
  );
};

// --- ԱԴՄԻՆԻ ՊԱՆԵԼ ---
const AdminPanel = ({ works, fetchWorks, setIsAuth }) => {
  const [formData, setFormData] = useState({ title: '', price: '', category: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "works"), { ...formData, price: Number(formData.price), createdAt: new Date() });
      setFormData({ title: '', price: '', category: '', description: '' });
      fetchWorks();
      alert("Հաջողությամբ ավելացվեց բազայում:");
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Վստա՞հ եք, որ ուզում եք ջնջել այս նյութը:")) {
      await deleteDoc(doc(db, "works", id));
      fetchWorks();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Admin <span className="text-indigo-500">Panel</span></h1>
          <div className="flex gap-4">
            <Link to="/" className="bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all">Կայք</Link>
            <button onClick={() => setIsAuth(false)} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all">Ելք</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e293b] p-8 rounded-[32px] border border-slate-700 shadow-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-[#0f172a] border border-slate-700 p-4 rounded-xl outline-none focus:border-indigo-500 text-white" placeholder="Ռեֆերատի Վերնագիր" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            <input className="bg-[#0f172a] border border-slate-700 p-4 rounded-xl outline-none focus:border-indigo-500 text-white" placeholder="Գինը (֏)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            <input className="bg-[#0f172a] border border-slate-700 p-4 rounded-xl outline-none focus:border-indigo-500 text-white md:col-span-2" placeholder="Բաժին (օր.՝ Իրավագիտություն)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
            <textarea className="bg-[#0f172a] border border-slate-700 p-4 rounded-xl outline-none focus:border-indigo-500 text-white md:col-span-2 h-24" placeholder="Համառոտ նկարագրություն..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95">Ավելացնել Բազայում</button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Առկա նյութեր ({works.length})</h2>
          {works.map(w => (
            <div key={w.id} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex justify-between items-center group hover:border-slate-600 transition-all">
              <div>
                <p className="font-bold text-slate-100">{w.title}</p>
                <p className="text-sm text-indigo-400 font-medium">{w.price.toLocaleString()} ֏ • {w.category}</p>
              </div>
              <button onClick={() => handleDelete(w.id)} className="opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-500 p-2 px-4 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Ջնջել</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- ՀԻՄՆԱԿԱՆ APP ---
function App() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "works"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorks(data);
    } catch (err) { console.error("Error fetching works:", err); }
    setLoading(false);
  };

  useEffect(() => { fetchWorks(); }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home works={works} loading={loading} />} />
        <Route 
          path="/admin" 
          element={isAuth ? <AdminPanel works={works} fetchWorks={fetchWorks} setIsAuth={setIsAuth} /> : <Login setIsAuth={setIsAuth} />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </>
  );
}

export default App;