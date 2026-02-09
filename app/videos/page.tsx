"use client";

import React from 'react';
import { Play } from 'lucide-react';

export default function VideosPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="bg-black text-white rounded-[1.5rem] p-8 mb-8">
        <h1 className="text-3xl font-black uppercase">Training Hub</h1>
        <p className="text-gray-400 font-mono text-sm mt-2">TECHNICAL VIDEO BRIEFINGS FOR MECHANICS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[1, 2, 3, 4, 5, 6].map((i) => (
           <div key={i} className="group cursor-pointer">
             <div className="bg-gray-200 aspect-video rounded-2xl mb-4 relative overflow-hidden">
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                   <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                      <Play className="text-white fill-white ml-1" />
                   </div>
                </div>
                {/* Time Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                   14:20
                </div>
             </div>
             
             <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
               Module {i}: Advanced Battery Diagnostics
             </h3>
             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <span>UPDATED 2 DAYS AGO</span>
                <span>•</span>
                <span>2.4K VIEWS</span>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}
