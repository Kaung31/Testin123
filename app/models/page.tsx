"use client";

import React from 'react';
import Link from 'next/link';
import { Bike, ArrowUpRight, Gauge, Battery, Weight, ChevronRight } from 'lucide-react';

export default function ModelsPage() {
  const models = [
    {
      id: 'pure-air',
      name: 'Pure Air³',
      tag: 'GEN 3',
      desc: 'The gold standard for city commuting. Reliability meets IP65 water resistance.',
      imageColor: 'bg-blue-500',
      specs: { speed: '25 km/h', range: '30 km', weight: '16.9 kg' }
    },
    {
      id: 'pure-pro',
      name: 'Pure Air³ Pro',
      tag: 'PRO SERIES',
      desc: 'Enhanced hill climbing and acceleration with the 500W peak motor.',
      imageColor: 'bg-purple-500',
      specs: { speed: '25 km/h', range: '40 km', weight: '17.3 kg' }
    },
    {
      id: 'advance',
      name: 'Pure Advance',
      tag: 'FLEX SERIES',
      desc: 'Forward-facing riding position with active stabilization technology.',
      imageColor: 'bg-green-500',
      specs: { speed: '25 km/h', range: '40 km', weight: '16.2 kg' }
    },
    {
      id: 'air-go',
      name: 'Air Go',
      tag: 'LIGHTWEIGHT',
      desc: 'Ultra-portable design for last-mile journeys and public transport.',
      imageColor: 'bg-orange-500',
      specs: { speed: '20 km/h', range: '20 km', weight: '12.5 kg' }
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Module */}
      <div className="bg-white rounded-[1.5rem] p-8 mb-4 border border-gray-200 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Fleet Models</h1>
          <p className="font-mono text-gray-400 text-sm">/// SELECT_UNIT_FOR_SCHEMATICS</p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-3xl font-bold">04</div>
          <div className="text-xs font-mono text-gray-400 uppercase">Active Chassis</div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => (
          <Link
            key={model.id}
            href={`/models/${model.id}`}
            className="group bg-white rounded-[1.5rem] p-2 hover:bg-gray-50 transition-colors border border-gray-200 hover:border-black cursor-pointer"
          >
            <div className="bg-gray-100 rounded-[1rem] p-8 h-full flex flex-col justify-between relative overflow-hidden group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
              
              {/* Top Section */}
              <div className="flex justify-between items-start z-10 relative">
                <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {model.tag}
                </span>
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Middle Section (Content) */}
              <div className="py-8 z-10 relative">
                <h2 className="text-3xl font-black mb-2 uppercase">{model.name}</h2>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md">
                  {model.desc}
                </p>
              </div>

              {/* Bottom Specs */}
              <div className="grid grid-cols-3 gap-2 z-10 relative">
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                   <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Top Speed</div>
                   <div className="font-mono font-bold">{model.specs.speed}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                   <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Range</div>
                   <div className="font-mono font-bold">{model.specs.range}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                   <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Weight</div>
                   <div className="font-mono font-bold">{model.specs.weight}</div>
                </div>
              </div>

              {/* Decorative Abstract Blob */}
              <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full ${model.imageColor} opacity-5 blur-[80px] group-hover:opacity-10 transition-opacity`} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
