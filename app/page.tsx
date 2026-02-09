"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bike, AlertTriangle, BookOpen, CheckCircle2, TrendingUp, Wrench, PlayCircle, ArrowRight } from 'lucide-react';
import { guidesData } from '@/lib/guides-db';

export default function HomePage() {
  const [search, setSearch] = useState("");
  
  // Get recent guides from DB
  const recentGuides = Object.values(guidesData).slice(0, 4);

  const models = [
    { id: 'pure-air', name: 'Pure Air Gen 3', image: '/images/pure-air.png', guides: 12 },
    { id: 'pure-pro', name: 'Pure Air Pro', image: '/images/pure-pro.png', guides: 15 },
    { id: 'advance', name: 'Pure Advance', image: '/images/advance.png', guides: 18 },
    { id: 'air-go', name: 'Air Go', image: '/images/air-go.png', guides: 10 },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      
      {/* --- 3D HERO SECTION --- */}
      <div className="bg-black rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl text-white flex flex-col md:flex-row items-center min-h-[500px]">
        
        {/* Text Content */}
        <div className="relative z-20 flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span className="text-sm font-bold tracking-wider uppercase">Workshop OS v2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            REPAIR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              EXCELLENCE.
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Official diagnostic hub for Pure Electric Gen 3 & Advance Series. Access schematics, guides, and parts instantly.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/models" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2">
              Select Model <ArrowRight size={20} />
            </Link>
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Quick Search (E.g. E07)..." 
                className="bg-white/10 border border-white/20 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:bg-white/20 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 3D Scooter Animation Area */}
        <div className="flex-1 w-full relative h-[400px] md:h-[600px] flex items-center justify-center scooter-3d-container">
           {/* Background Glow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />
           
           {/* THE FLOATING SCOOTER */}
           {/* IMPORTANT: Upload a real scooter PNG to public/images/hero-scooter.png */}
           <div className="relative z-10 w-full max-w-lg">
             <img 
               src="/images/hero-scooter.png" 
               alt="Pure Electric Scooter" 
               className="w-full h-auto object-contain scooter-3d-model"
               // Fallback if image missing:
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 // FIXED: Check if parentElement exists before accessing it
                 if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<div class="text-center p-10 border-4 border-dashed border-white/20 rounded-xl"><p class="font-bold text-gray-500">UPLOAD /images/hero-scooter.png</p></div>';
                 }
               }}
             />
             {/* Shadow */}
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black/50 blur-xl rounded-full scooter-shadow" />
           </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold text-xs uppercase mb-2">Active Jobs</p>
          <p className="text-4xl font-black text-slate-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold text-xs uppercase mb-2">Avg Time</p>
          <p className="text-4xl font-black text-slate-900">28m</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold text-xs uppercase mb-2">Parts Stock</p>
          <p className="text-4xl font-black text-slate-900">94%</p>
        </div>
        <div className="bg-blue-600 p-6 rounded-[2rem] shadow-lg shadow-blue-200 text-white flex flex-col justify-center items-center cursor-pointer hover:bg-blue-700 transition-colors">
          <CheckCircle2 size={32} className="mb-2" />
          <p className="font-bold">System Normal</p>
        </div>
      </div>

      {/* --- RECENT GUIDES & MODELS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Guides</h2>
            <Link href="/guides" className="text-blue-600 font-bold hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentGuides.map((guide) => (
              <Link 
                key={guide.id}
                href={`/guides/${guide.id}`}
                className="group flex flex-col p-5 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all cursor-pointer border border-gray-100 hover:border-black"
              >
                <div className="flex justify-between items-start mb-2">
                   <span className="font-bold text-lg group-hover:text-white">{guide.title}</span>
                   <span className="text-xs font-bold bg-white px-2 py-1 rounded text-black">{guide.difficulty}</span>
                </div>
                <div className="flex justify-between items-end mt-auto opacity-60 text-sm">
                   <span>{guide.model}</span>
                   <span>{guide.time}</span>
                </div>
              </Link>
            ))}
            {recentGuides.length === 0 && (
              <div className="col-span-2 text-center py-10 text-gray-400">
                No guides found in database.
              </div>
            )}
          </div>
        </div>

        {/* Quick Models */}
        <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Select Chassis</h2>
          <div className="space-y-3">
             {models.map((m) => (
               <Link 
                 key={m.id} 
                 href={`/models/${m.id}`}
                 className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-md transition-all cursor-pointer group"
               >
                 <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                   <Bike size={24} />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900">{m.name}</p>
                   <p className="text-xs text-gray-500">{m.guides} Guides</p>
                 </div>
               </Link>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
