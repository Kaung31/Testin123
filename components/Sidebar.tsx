"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutTemplate, Bike, AlertTriangle, Layers, 
  Wrench, PlaySquare, Settings, Zap 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', icon: LayoutTemplate, label: 'HUB' },
    { href: '/models', icon: Bike, label: 'MODELS' },
    { href: '/error-codes', icon: AlertTriangle, label: 'ERRORS' },
    { href: '/parts', icon: Layers, label: 'PARTS' },
    { href: '/guides', icon: Wrench, label: 'GUIDES' },
    { href: '/videos', icon: PlaySquare, label: 'MEDIA' },
  ];

  return (
    <aside className="w-full md:w-24 bg-[#F3F4F6] border-r border-[#D1D5DB] flex flex-col items-center py-8 z-20">
      {/* Brand Icon */}
      <div className="mb-10 p-3 bg-black text-white rounded-xl shadow-lg">
        <Zap size={24} fill="currentColor" />
      </div>

      {/* Nav Items - Vertical on Desktop */}
      <nav className="flex-1 flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible w-full md:w-auto px-4 md:px-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-white text-black shadow-md scale-110'
                  : 'text-gray-400 hover:text-black hover:bg-white/50'
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              
              {/* Tooltip on Hover */}
              <span className="absolute left-14 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block z-50 pointer-events-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <button className="mt-auto text-gray-400 hover:text-black hover:rotate-90 transition-all p-3">
        <Settings size={20} />
      </button>
    </aside>
  );
}
