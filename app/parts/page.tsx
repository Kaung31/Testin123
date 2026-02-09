"use client";

import React, { useState } from 'react';
import { Layers, Search, CheckCircle2, XCircle, Box } from 'lucide-react';
import { warrantyData, findPartBySKU } from '@/lib/parts-data';

export default function PartsPage() {
  const [skuSearch, setSkuSearch] = useState("");
  const [result, setResult] = useState<any>(null);

  const checkSku = () => {
    setResult(findPartBySKU(skuSearch) || 'not-found');
  };

  const isWarrantable = (t: string) => t.includes('Warrantable');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      
      {/* Left Column: The Checker */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-200 sticky top-6 shadow-xl shadow-gray-200/50">
          <div className="mb-6">
            <h2 className="text-xl font-black uppercase mb-2">Warranty Check</h2>
            <p className="text-sm text-gray-500">Enter SKU to verify coverage status instantly.</p>
          </div>

          <div className="space-y-3">
             <input 
               className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-lg uppercase focus:outline-none focus:border-black transition-colors"
               placeholder="PSPUR..."
               value={skuSearch}
               onChange={(e) => setSkuSearch(e.target.value.toUpperCase())}
             />
             <button 
               onClick={checkSku}
               className="w-full bg-black text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform"
             >
               CHECK DATABASE
             </button>
          </div>

          {result && result !== 'not-found' && (
             <div className="mt-8 pt-8 border-t border-dashed border-gray-200">
               <div className={`p-4 rounded-xl mb-4 text-center border-2 ${isWarrantable(result.terms) ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <span className={`font-black uppercase text-xl ${isWarrantable(result.terms) ? 'text-green-600' : 'text-red-600'}`}>
                    {isWarrantable(result.terms) ? 'APPROVED' : 'REJECTED'}
                  </span>
               </div>
               <div className="space-y-2">
                 <p className="font-mono text-xs text-gray-400">SKU: {result.sku}</p>
                 <p className="font-bold leading-tight">{result.description}</p>
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Right Column: The List */}
      <div className="lg:col-span-2 space-y-3">
        {warrantyData.map((part) => (
          <div key={part.sku} className="bg-white p-5 rounded-2xl border border-gray-200 flex items-start gap-4 hover:border-blue-500 transition-colors group">
            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <Box className="text-gray-400 group-hover:text-blue-500" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                 <div>
                   <span className="font-mono text-xs text-blue-600 mb-1 block">{part.sku}</span>
                   <h3 className="font-bold text-sm text-gray-900">{part.description}</h3>
                 </div>
                 {isWarrantable(part.terms) ? 
                   <CheckCircle2 size={20} className="text-green-500" /> : 
                   <XCircle size={20} className="text-red-500" />
                 }
              </div>
              <div className="mt-2 flex gap-2">
                 <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">{part.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
