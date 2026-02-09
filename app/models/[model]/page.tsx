"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Bike, ChevronLeft, Wrench, Clock, AlertCircle, FileText, Zap, ArrowRight } from 'lucide-react';
import { guidesData } from '@/lib/guides-db';

export default function ModelDetailPage() {
  const params = useParams();
  const modelId = params.model as string;

  // --- FILTERING LOGIC FIXED ---
  // We check if the Guide's model includes the URL model ID (e.g., 'pure-air')
  const allGuides = Object.values(guidesData);
  
  const compatibleGuides = allGuides.filter(guide => {
    const guideModelLower = guide.model.toLowerCase().replace(/[^a-z0-9]/g, ''); // "pureairgen3pro"
    const paramModelLower = modelId.toLowerCase().replace(/[^a-z0-9]/g, '');     // "pureair"
    
    // If guide says "All Models", include it
    if (guide.model.includes('All')) return true;
    
    // Check if they match loosely
    return guideModelLower.includes(paramModelLower);
  });

  // Model Specs DB
  const modelSpecs: Record<string, any> = {
    'pure-air': { name: 'Pure Air', color: 'bg-blue-500', codes: ['E1', 'E2'] },
    'pure-pro': { name: 'Pure Pro', color: 'bg-purple-500', codes: ['E3', 'E7'] },
    'advance': { name: 'Pure Advance', color: 'bg-emerald-500', codes: ['E9', 'E4'] },
    'air-go': { name: 'Air Go', color: 'bg-orange-500', codes: ['E1', 'E5'] }
  };

  const model = modelSpecs[modelId] || modelSpecs['pure-air'];

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      <Link href="/models" className="inline-flex items-center gap-2 text-slate-500 hover:text-black mb-6 font-bold">
        <ChevronLeft size={20} /> Back to Models
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-200 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className={`w-32 h-32 ${model.color} rounded-3xl flex items-center justify-center shadow-xl`}>
          <Bike size={64} className="text-white" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 mb-2">{model.name}</h1>
          <p className="text-slate-500">Technical schematics and approved repair procedures.</p>
        </div>
        <div className="flex gap-2">
           {/* Quick Stats Pills */}
           <div className="px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm">
             {compatibleGuides.length} Guides
           </div>
           <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm">
             {model.codes.length} Common Errors
           </div>
        </div>
      </div>

      {/* COMPATIBLE GUIDES SECTION */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Wrench className="text-blue-500" /> Compatible Guides
        </h2>

        {compatibleGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compatibleGuides.map((guide) => (
              <Link 
                key={guide.id} 
                href={`/guides/${guide.id}`}
                className="group bg-white p-6 rounded-[2rem] border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    guide.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {guide.difficulty}
                  </span>
                  <ArrowRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={14}/> {guide.time}</span>
                  <span className="flex items-center gap-1"><FileText size={14}/> {guide.category}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Empty State if no guides found
          <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
             <Wrench className="mx-auto text-gray-300 mb-4" size={48} />
             <h3 className="text-xl font-bold text-gray-600">No Guides Found</h3>
             <p className="text-gray-400">There are no guides uploaded for this model yet.</p>
             <Link href="/guides" className="inline-block mt-4 text-blue-600 font-bold hover:underline">
               View All Guides instead
             </Link>
          </div>
        )}
      </div>

    </div>
  );
}
