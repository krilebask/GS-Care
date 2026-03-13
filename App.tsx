
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Car, 
  Wrench, 
  LayoutDashboard, 
  FileText, 
  ChevronRight,
  Sun,
  Moon,
  Loader2
} from 'lucide-react';
import { ServiceType, SubMenu, AnyRequest, RequestStatus } from './types';
import DashboardView from './components/DashboardView';
import MessRequestForm from './components/MessRequestForm';
import KRPRequestForm from './components/KRPRequestForm';
import MaintenanceRequestForm from './components/MaintenanceRequestForm';
import { supabase, supabaseConfigured } from './src/supabase';
import { sendWhatsAppNotification } from './src/services/whatsappService';

const App: React.FC = () => {
  const [activeService, setActiveService] = useState<ServiceType>(ServiceType.MESS);
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenu>(SubMenu.DASHBOARD);
  const [requests, setRequests] = useState<AnyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!supabaseConfigured) {
      setIsLoading(false);
      return;
    }

    fetchRequests();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'requests',
        },
        (payload) => {
          console.log('Change received!', payload);
          if (payload.eventType === 'INSERT') {
            setRequests((prev) => [payload.new as AnyRequest, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setRequests((prev) =>
              prev.map((req) => (req.id === payload.new.id ? (payload.new as AnyRequest) : req))
            );
          } else if (payload.eventType === 'DELETE') {
            setRequests((prev) => prev.filter((req) => req.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    if (!supabaseConfigured) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setRequests(data as AnyRequest[]);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRequest = async (newRequest: AnyRequest) => {
    if (!supabaseConfigured) {
      // Fallback for demo if not configured
      setRequests(prev => [newRequest, ...prev]);
      setActiveSubMenu(SubMenu.DASHBOARD);
      return;
    }
    try {
      const { error } = await supabase
        .from('requests')
        .insert([newRequest]);

      if (error) {
        console.error('Supabase Insert Error:', error);
        throw new Error(error.message || 'Gagal menyimpan ke database');
      }
      
      // Send WhatsApp Notification via Fonnte
      sendWhatsAppNotification(newRequest);
      
      setActiveSubMenu(SubMenu.DASHBOARD);
    } catch (error: any) {
      console.error('Error adding request:', error);
      alert(`Gagal menambah request: ${error.message || 'Cek koneksi database'}\n\nPastikan tabel "requests" sudah dibuat di Supabase.`);
    }
  };

  const handleUpdateStatus = async (id: string, status: RequestStatus) => {
    if (!supabaseConfigured) {
      setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
      return;
    }
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      // Real-time subscription will handle the UI update
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  const currentServiceRequests = requests.filter(req => req.type === activeService);

  const getServiceIcon = (type: ServiceType, size = 20) => {
    switch (type) {
      case ServiceType.MESS: return <Building2 size={size} />;
      case ServiceType.KRP: return <Car size={size} />;
      case ServiceType.MAINTENANCE: return <Wrench size={size} />;
    }
  };

  const getDisplayName = (type: ServiceType) => {
    return type === ServiceType.MAINTENANCE ? 'Maint.' : type;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans scrollbar-hide">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen transition-colors scrollbar-hide">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h1 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">General Service</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {[ServiceType.MESS, ServiceType.KRP, ServiceType.MAINTENANCE].map((service) => (
            <button
              key={service}
              onClick={() => {
                setActiveService(service);
                setActiveSubMenu(SubMenu.DASHBOARD);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeService === service 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {getServiceIcon(service)}
                {getDisplayName(service)}
              </div>
              {activeService === service && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 uppercase tracking-wider"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0 scrollbar-hide">
        
        {/* Fixed Top Header */}
        <div className="sticky top-0 z-40">
            <header className="h-16 lg:h-18 flex items-center justify-between px-6 lg:px-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <div className="lg:hidden w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white mr-1">
                    {getServiceIcon(activeService, 16)}
                    </div>
                    <h2 className="text-md lg:text-lg font-black tracking-tight">{getDisplayName(activeService)}</h2>
                    <span className="text-slate-300 dark:text-slate-700 mx-2">/</span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">{activeSubMenu}</span>
                </div>

                <div className="lg:hidden flex items-center gap-2">
                    <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 text-slate-400 dark:text-slate-500"
                    >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            {/* Dashboard / Request Tab Switcher - Fixed under Header */}
            <div className="bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md px-4 lg:px-10 py-3 lg:py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto flex justify-center lg:justify-start">
                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-[1rem] transition-colors w-full sm:w-80">
                    {[SubMenu.DASHBOARD, SubMenu.REQUEST].map((sub) => (
                        <button
                        key={sub}
                        onClick={() => setActiveSubMenu(sub)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[0.75rem] text-[10px] font-black transition-all ${
                            activeSubMenu === sub 
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                        >
                        {sub === SubMenu.DASHBOARD ? <LayoutDashboard size={12} /> : <FileText size={12} />}
                        {sub.toUpperCase()}
                        </button>
                    ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {!supabaseConfigured && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-amber-800 dark:text-amber-200">
                <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                  <Wrench size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Database Belum Terhubung</p>
                  <p className="text-[9px] font-medium opacity-80">Silakan atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Settings.</p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold text-xs uppercase tracking-widest">Memuat Data...</p>
              </div>
            ) : activeSubMenu === SubMenu.DASHBOARD ? (
              <DashboardView 
                requests={currentServiceRequests} 
                onUpdateStatus={handleUpdateStatus} 
              />
            ) : (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeService === ServiceType.MESS && <MessRequestForm onSubmit={handleAddRequest} />}
                {activeService === ServiceType.KRP && <KRPRequestForm onSubmit={handleAddRequest} />}
                {activeService === ServiceType.MAINTENANCE && <MaintenanceRequestForm onSubmit={handleAddRequest} />}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Simplified Mobile Bottom Navigation - Distribute Evenly */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 z-40 transition-colors">
        {[ServiceType.MESS, ServiceType.KRP, ServiceType.MAINTENANCE].map((service) => (
          <button
            key={service}
            onClick={() => {
              setActiveService(service);
              setActiveSubMenu(SubMenu.DASHBOARD);
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-all h-full ${
              activeService === service ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeService === service ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
              {getServiceIcon(service, 20)}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{getDisplayName(service)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
