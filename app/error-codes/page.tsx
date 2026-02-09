"use client";

import React, { useState } from 'react';
import { Search, AlertTriangle, Zap, ArrowRight } from 'lucide-react';

export default function ErrorCodesPage() {
  const [search, setSearch] = useState("");

  const errors = [
    { code: 'E1', title: 'Brake Hall Fault', severity: 'HIGH', desc: 'Signal disrupted between Brake Lever and VCU.', fix: 'Check VCU connector.' },
    { code: 'E2', title: 'Throttle Fault', severity: 'HIGH', desc: 'Error detected on Throttle input.', fix: 'Verify throttle return spring.' },
    { code: 'E3', title: 'Comms Failure', severity: 'CRITICAL', desc: 'UART Data connection lost (VCU-MCU).', fix: 'Inspect stem cable pins.' },
    { code: 'E7', title: 'Motor Phase', severity: 'HIGH', desc: 'Hall sensor feedback missing.', fix: 'Check motor connector.' },
    { code: 'E13', title: 'BMS Signal', severity: 'MEDIUM', desc: 'Battery Management System timeout.', fix: 'Check battery terminal.' },
  ];

  const filtered = errors.filter(e => e.code.includes(search.toUpperCase()) || e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Search Module */}
      <div className="bg-black text-white rounded-[1.5rem] p-8 mb-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-white/10 rounded-xl">
             <AlertTriangle className="text-orange-500" size={32} />
           </div>
           <div>
             <h1 className="text-2xl font-bold uppercase tracking-wide">Diagnostics DB</h1>
             <p className="text-gray-400 text-sm font-mono">GEN 3 / ADVANCE PROTOCOLS</p>
           </div>
        </div>
        <div className="relative w-full md:w-96">
           <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
           <input 
             type="text" 
             placeholder="ENTER ERROR CODE (E.G. E07)"
             className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white font-mono placeholder:text-gray-600 focus:outline-none focus:bg-white/20 transition-all uppercase"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {/* The Grid */}
      <div className="grid gap-3">
        {filtered.map((err) => (
          <div key={err.code} className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-500 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6">
            
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center font-mono text-2xl font-bold text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
              {err.code}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                 <h3 className="font-bold text-lg uppercase">{err.title}</h3>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                   err.severity === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                 }`}>
                   {err.severity}
                 </span>
              </div>
              <p className="text-gray-500 text-sm">{err.desc}</p>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 group-hover:bg-white group-hover:shadow-lg transition-all">
               <Zap size={16} className="text-gray-400" />
               <span className="text-sm font-medium">Fix: {err.fix}</span>
               <ArrowRight size={16} className="text-gray-300 group-hover:text-orange-500 ml-2" />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
