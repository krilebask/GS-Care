
import React, { useState } from 'react';
import { 
  Inbox, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Calendar,
  User,
  MapPin,
  Tag
} from 'lucide-react';
import { AnyRequest, RequestStatus, ServiceType, MessRequest, KRPRequest, MaintenanceRequest } from '../types';

interface DashboardViewProps {
  requests: AnyRequest[];
  onUpdateStatus: (id: string, status: RequestStatus) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ requests, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);

  const getStatusCount = (status: RequestStatus) => {
    return requests.filter(req => req.status === status).length;
  };

  const filteredRequests = selectedStatus 
    ? requests.filter(req => req.status === selectedStatus)
    : requests;

  const StatusCard = ({ status, icon: Icon, colorClass, activeClass }: { status: RequestStatus, icon: any, colorClass: string, activeClass: string }) => {
    const isActive = selectedStatus === status;
    return (
      <button 
        onClick={() => setSelectedStatus(isActive ? null : status)}
        className={`flex-1 p-4 lg:p-5 rounded-[1.25rem] bg-white dark:bg-slate-900 border transition-all text-left group overflow-hidden ${
          isActive 
          ? `ring-2 ring-indigo-500/50 border-transparent shadow-lg ${activeClass}` 
          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 shadow-sm'
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : colorClass}`}>
            <Icon size={18} />
          </div>
          <span className={`text-xl lg:text-2xl font-black ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {getStatusCount(status)}
          </span>
        </div>
        <div>
          <h4 className={`font-bold tracking-tight text-[11px] lg:text-xs uppercase ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {status}
          </h4>
        </div>
      </button>
    );
  };

  const renderRequestDetails = (req: AnyRequest) => {
    const detailLabelClass = "text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest";
    const detailValueClass = "text-xs font-semibold text-slate-700 dark:text-slate-300";

    switch (req.type) {
      case ServiceType.MESS:
        const mess = req as MessRequest;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <p className={detailLabelClass}>Lokasi</p>
                    <p className={detailValueClass}>{mess.location}</p>
                </div>
                <div>
                    <p className={detailLabelClass}>Tamu</p>
                    <p className={detailValueClass}>{mess.guestName}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
               <Calendar size={12} className="text-slate-400" />
               <span className="text-[10px] font-medium text-slate-500">{mess.checkInDate} — {mess.checkOutDate}</span>
            </div>
          </div>
        );
      case ServiceType.KRP:
        const krp = req as KRPRequest;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <p className={detailLabelClass}>Penumpang</p>
                    <p className={detailValueClass}>{krp.passengerName}</p>
                </div>
                <div>
                    <p className={detailLabelClass}>Jumlah</p>
                    <p className={detailValueClass}>{krp.passengerCount} Orang</p>
                </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
               <Calendar size={12} className="text-slate-400" />
               <span className="text-[10px] font-medium text-slate-500">{krp.departureDate} @ {krp.departureTime}</span>
            </div>
          </div>
        );
      case ServiceType.MAINTENANCE:
        const main = req as MaintenanceRequest;
        return (
          <div className="space-y-3">
            <div>
               <p className={detailLabelClass}>Kategori</p>
               <p className={detailValueClass}>{main.category}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
               <p className="text-[10px] text-slate-500 dark:text-slate-400 italic leading-relaxed">"{main.detail}"</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 scrollbar-hide">
      {/* Interactive Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
          status={RequestStatus.REQUESTED} 
          icon={Inbox} 
          colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
          activeClass="bg-blue-600" 
        />
        <StatusCard 
          status={RequestStatus.ON_PROGRESS} 
          icon={RefreshCw} 
          colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" 
          activeClass="bg-amber-500" 
        />
        <StatusCard 
          status={RequestStatus.PENDING} 
          icon={Clock} 
          colorClass="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400" 
          activeClass="bg-rose-500" 
        />
        <StatusCard 
          status={RequestStatus.CLOSE} 
          icon={CheckCircle2} 
          colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" 
          activeClass="bg-emerald-500" 
        />
      </div>

      {/* Request Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((req) => (
          <div key={req.id} className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-md">#{req.id.slice(0, 5)}</span>
              <div className="relative">
                <select 
                    value={req.status}
                    onChange={(e) => onUpdateStatus(req.id, e.target.value as RequestStatus)}
                    className={`text-[10px] font-black rounded-lg pl-3 pr-2 py-1.5 outline-none appearance-none cursor-pointer shadow-sm transition-colors ${
                    req.status === RequestStatus.REQUESTED ? 'bg-blue-50 text-blue-600' :
                    req.status === RequestStatus.ON_PROGRESS ? 'bg-amber-50 text-amber-600' :
                    req.status === RequestStatus.PENDING ? 'bg-rose-50 text-rose-600' :
                    'bg-emerald-50 text-emerald-600'
                    }`}
                >
                    {Object.values(RequestStatus).map(s => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mb-5 flex-1">
              <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                {req.type === ServiceType.MAINTENANCE ? (req as MaintenanceRequest).requesterName : (req as any).requesterName}
              </h4>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">{req.function}</p>
            </div>

            <div className="pt-5 border-t border-slate-50 dark:border-slate-800/50">
              {renderRequestDetails(req)}
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto mb-4">
            <Inbox size={32} />
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">Tidak ada data</p>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
