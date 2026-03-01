"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Wrench, Clock, Zap, ChevronRight } from 'lucide-react';

interface GuideIndex {
  id: string;
  title: string;
  model: string;
  difficulty: string;
  time: string;
  category: string;
  description: string;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Hard:   'bg-red-50 text-red-700 border-red-200',
};

const DIFFICULTY_DOT: Record<string, string> = {
  Easy:   'bg-emerald-500',
  Medium: 'bg-amber-500',
  Hard:   'bg-red-500',
};

export default function GuidesPage() {
  const [guides, setGuides]                   = useState<GuideIndex[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch('/guides/index.json')
      .then(r => r.json())
      .then((data: GuideIndex[]) => { setGuides(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(guides.map(g => g.category))).sort()];

  const filtered = guides.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
                        g.description.toLowerCase().includes(search.toLowerCase());
    const matchCat    = selectedCategory === "All" || g.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <BookOpen className="text-blue-500" size={28} />
            <h1 className="text-3xl font-black text-slate-900">Repair Guides</h1>
          </div>
          <p className="text-slate-500 text-sm ml-10">Step-by-step procedures for every repair</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search guides…"
            className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 text-sm font-medium"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(guide => {
              const diffStyle = DIFFICULTY_STYLES[guide.difficulty] ?? DIFFICULTY_STYLES.Medium;
              const diffDot   = DIFFICULTY_DOT[guide.difficulty] ?? DIFFICULTY_DOT.Medium;
              return (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.id}`}
                  className="group bg-white border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/8 p-6 rounded-3xl transition-all block"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base leading-tight flex-1">
                      {guide.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${diffStyle}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${diffDot}`} />
                      {guide.difficulty}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-2">{guide.description}</p>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                      <Clock size={10} /> {guide.time}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold border border-blue-100">
                      <Zap size={10} /> {guide.category}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-medium">{guide.model}</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}

            {filtered.length === 0 && !loading && (
              <div className="col-span-2 text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Wrench className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="text-slate-600 font-bold">No guides found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
