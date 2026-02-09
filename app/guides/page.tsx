"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Wrench } from 'lucide-react';
// IMPORT THE DATABASE
import { guidesData } from '@/lib/guides-db';

export default function GuidesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Battery", "Motor", "Brakes", "Electronics", "Mechanical", "Wheels", "Controls"];

  // CONVERT THE DB OBJECT INTO AN ARRAY
  const guides = Object.values(guidesData);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(search.toLowerCase()) ||
                         guide.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
            <BookOpen className="text-blue-500" size={36} />
            Repair Guides
          </h1>
          <p className="text-slate-600">Comprehensive step-by-step repair procedures</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search repair guides..." 
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`} 
              className="bg-white border-2 border-slate-200 hover:border-blue-500 p-6 rounded-3xl transition-all cursor-pointer group block"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex-1 text-lg">
                  {guide.title}
                </h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ml-2 ${getDifficultyColor(guide.difficulty)}`}>
                  {guide.difficulty}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4">{guide.description}</p>

              {/* Meta */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                  📋 {guide.steps.length} steps
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                  ⏱️ {guide.time}
                </span>
              </div>

              {/* Category & Tools */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-600">{guide.category}</span>
                  <span className="text-slate-500">🔧 {guide.tools.length} tools needed</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredGuides.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Wrench className="mx-auto text-slate-300 mb-2" size={48} />
            <p className="text-slate-500 font-bold">No guides found</p>
            <p className="text-sm text-slate-400">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
