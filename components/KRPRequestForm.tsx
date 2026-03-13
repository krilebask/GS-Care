
import React, { useState } from 'react';
import { ServiceType, RequestStatus, KRPRequest } from '../types';
import { Save, Repeat } from 'lucide-react';

interface Props {
  onSubmit: (req: KRPRequest) => void;
}

const KRPRequestForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerCount: 1,
    function: '',
    passengerPhone: '',
    departureDate: '',
    departureTime: '',
    isRoundTrip: false,
    returnDate: '',
    returnTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: any = {
      ...formData,
      type: ServiceType.KRP,
      status: RequestStatus.REQUESTED,
      createdAt: new Date().toISOString(),
    };
    onSubmit(newRequest);
  };

  const inputClasses = "w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600";
  const labelClasses = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-1 mb-1.5 block truncate";

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm space-y-6 transition-colors font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className={labelClasses}>Nama Penumpang</label>
          <input
            required
            type="text"
            className={inputClasses}
            placeholder="Nama lengkap..."
            value={formData.passengerName}
            onChange={e => setFormData(prev => ({ ...prev, passengerName: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClasses}>Jml. Orang</label>
          <input
            required
            type="number"
            min="1"
            className={inputClasses}
            value={formData.passengerCount}
            onChange={e => setFormData(prev => ({ ...prev, passengerCount: parseInt(e.target.value) }))}
          />
        </div>

        <div>
          <label className={labelClasses}>No. HP Penumpang</label>
          <input
            required
            type="tel"
            className={inputClasses}
            placeholder="08..."
            value={formData.passengerPhone}
            onChange={e => setFormData(prev => ({ ...prev, passengerPhone: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClasses}>Fungsi / Dept.</label>
          <input
            required
            type="text"
            className={inputClasses}
            placeholder="Unit kerja..."
            value={formData.function}
            onChange={e => setFormData(prev => ({ ...prev, function: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex-1">
            <label className={labelClasses}>Tgl. Pergi</label>
            <input
              required
              type="date"
              className={inputClasses}
              value={formData.departureDate}
              onChange={e => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className={labelClasses}>Jam Pergi</label>
            <input
              required
              type="time"
              className={inputClasses}
              value={formData.departureTime}
              onChange={e => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-all ${formData.isRoundTrip ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-400'}`}>
            <Repeat size={18} />
          </div>
          <div>
            <h5 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest leading-none">Pulang Pergi?</h5>
            <p className="text-[9px] text-slate-400 font-medium mt-1">Aktifkan untuk rute kepulangan.</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, isRoundTrip: !prev.isRoundTrip }))}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${formData.isRoundTrip ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${formData.isRoundTrip ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      {formData.isRoundTrip && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex-1">
            <label className={labelClasses}>Tgl. Pulang</label>
            <input
              required={formData.isRoundTrip}
              type="date"
              className={inputClasses}
              value={formData.returnDate}
              onChange={e => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className={labelClasses}>Jam Pulang</label>
            <input
              required={formData.isRoundTrip}
              type="time"
              className={inputClasses}
              value={formData.returnTime}
              onChange={e => setFormData(prev => ({ ...prev, returnTime: e.target.value }))}
            />
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          type="submit"
          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          <Save size={16} />
          Submit KRP Request
        </button>
      </div>
    </form>
  );
};

export default KRPRequestForm;
