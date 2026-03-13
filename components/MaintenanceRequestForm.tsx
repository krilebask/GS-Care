
import React, { useState } from 'react';
import { ServiceType, RequestStatus, MaintenanceRequest } from '../types';
import { Save } from 'lucide-react';

interface Props {
  onSubmit: (req: MaintenanceRequest) => void;
}

const MaintenanceRequestForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    category: 'Fasilitas Umum' as const,
    requesterName: '',
    function: '',
    requesterPhone: '',
    workDate: '',
    detail: ''
  });

  const categories = [
    'Fasum',
    'Electrical',
    'Civil',
    'AC',
    'Housekeeping'
  ];

  const categoryMap: Record<string, any> = {
    'Fasum': 'Fasilitas Umum',
    'Electrical': 'Electrical maintenance',
    'Civil': 'Civil Maintenance',
    'AC': 'AC Maintenance',
    'Housekeeping': 'House Keeping'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: any = {
      ...formData,
      type: ServiceType.MAINTENANCE,
      status: RequestStatus.REQUESTED,
      createdAt: new Date().toISOString(),
    };
    onSubmit(newRequest);
  };

  const inputClasses = "w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600";
  const labelClasses = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-1 mb-1.5 block truncate";

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm space-y-6 transition-colors font-sans">
      <div className="space-y-3">
        <label className={labelClasses}>Kategori Pekerjaan</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, category: categoryMap[cat] }))}
              className={`px-3 py-2 rounded-xl border-2 text-[10px] font-bold transition-all uppercase tracking-wider ${
                formData.category === categoryMap[cat] 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className={labelClasses}>Nama Pemesan</label>
          <input
            required
            type="text"
            className={inputClasses}
            placeholder="Nama anda..."
            value={formData.requesterName}
            onChange={e => setFormData(prev => ({ ...prev, requesterName: e.target.value }))}
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

        <div>
          <label className={labelClasses}>No. HP Pemesan</label>
          <input
            required
            type="tel"
            className={inputClasses}
            placeholder="08..."
            value={formData.requesterPhone}
            onChange={e => setFormData(prev => ({ ...prev, requesterPhone: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClasses}>Tgl. Kerja</label>
          <input
            required
            type="date"
            className={inputClasses}
            value={formData.workDate}
            onChange={e => setFormData(prev => ({ ...prev, workDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>Detail Pekerjaan</label>
        <textarea
          required
          rows={4}
          className={`w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none`}
          placeholder="Jelaskan perbaikan yang diperlukan..."
          value={formData.detail}
          onChange={e => setFormData(prev => ({ ...prev, detail: e.target.value }))}
        />
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          type="submit"
          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          <Save size={16} />
          Submit Request
        </button>
      </div>
    </form>
  );
};

export default MaintenanceRequestForm;
