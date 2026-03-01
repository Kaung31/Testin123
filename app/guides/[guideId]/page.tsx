"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft, Wrench, Clock, AlertTriangle, CheckCircle2,
  Lightbulb, Package, PlayCircle, ChevronRight, Timer,
  Shield, Zap, ArrowRight
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GuideTool   { name: string }
interface GuidePart   { name: string; sku: string }
interface GuideStep {
  order:   number;
  title:   string;
  desc:    string;
  tools?:  string;
  parts?:  string;
  warning?: string;
  tip?:    string;
  image?:  string;
}
interface GuideData {
  id:          string;
  title:       string;
  model:       string;
  difficulty:  string;
  time:        string;
  category:    string;
  description: string;
  videoUrl:    string;
  tools:       GuideTool[];
  parts:       GuidePart[];
  steps:       GuideStep[];
}

// ─── Difficulty config ────────────────────────────────────────────────────────
const DIFFICULTY: Record<string, { dot: string; badge: string; label: string }> = {
  Easy:   { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Easy' },
  Medium: { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-200',     label: 'Medium' },
  Hard:   { dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-200',           label: 'Hard' },
};

// ─── Tool icon map ────────────────────────────────────────────────────────────
function ToolIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  const icon =
    n.includes('hex')      ? '⬡' :
    n.includes('flathead') ? '⊕' :
    n.includes('phillips') ? '✛' :
    n.includes('plier')    ? '⋔' :
    n.includes('knife')    ? '∕' :
    n.includes('heat')     ? '◉' :
    n.includes('glove')    ? '○' :
    n.includes('hook')     ? '↩' : '⊙';
  return (
    <span className="font-mono text-[11px] font-black text-slate-400 leading-none select-none">
      {icon}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GuideDetailPage() {
  const params    = useParams();
  const guideId   = params.guideId as string;

  const [guide, setGuide]             = useState<GuideData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted]     = useState<Set<number>>(new Set());
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Fetch guide JSON from /public/guides/
  useEffect(() => {
    if (!guideId) return;
    setLoading(true);
    fetch(`/guides/${guideId}.json`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then((data: GuideData) => { setGuide(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [guideId]);

  // ── Scroll active step into view
  useEffect(() => {
    const el = stepRefs.current[currentStep];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [currentStep]);

  const goToStep = (idx: number) => {
    setCompleted(prev => new Set([...prev, currentStep]));
    setCurrentStep(idx);
  };

  // ── States
  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">Loading guide…</p>
      </div>
    </div>
  );

  if (notFound || !guide) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Wrench size={28} className="text-slate-400" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-1">Guide not found</h1>
      <p className="text-slate-500 mb-6 text-sm">Make sure the JSON file exists at <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">/public/guides/{guideId}.json</code></p>
      <Link href="/guides" className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
        <ChevronLeft size={16} /> Back to Guides
      </Link>
    </div>
  );

  const diff        = DIFFICULTY[guide.difficulty] ?? DIFFICULTY.Medium;
  const totalSteps  = guide.steps.length;
  const progress    = Math.round(((currentStep + 1) / totalSteps) * 100);
  const isDone      = currentStep === totalSteps - 1;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Back nav ── */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 mb-6 group text-sm font-semibold transition-colors"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Guides
        </Link>

        {/* ══════════════════════════════════════════════════════════════
            HEADER CARD
        ══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 mb-6 shadow-sm">

          {/* Top row: tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${diff.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
              {diff.label}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
              <Zap size={10} /> {guide.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
              <Clock size={10} /> {guide.time}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
              {guide.model}
            </span>
          </div>

          {/* Title + description */}
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-2">
            {guide.title}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mb-6">
            {guide.description}
          </p>

          {/* Progress strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-xs font-black text-blue-600">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Step dots */}
            <div className="flex gap-1 pt-1 flex-wrap">
              {guide.steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? 'bg-blue-500 w-6'
                      : completed.has(i)
                      ? 'bg-emerald-400 w-3'
                      : 'bg-slate-200 w-3 hover:bg-slate-300'
                  }`}
                  title={`Step ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            BODY: STEPS + SIDEBAR
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Steps column ── */}
          <div className="lg:col-span-2 space-y-3">

            {/* Video (if available) */}
            {guide.videoUrl && (
              <div className="bg-slate-900 rounded-3xl overflow-hidden">
                <div className="flex items-center gap-2 px-6 pt-5 pb-3">
                  <PlayCircle size={18} className="text-blue-400" />
                  <span className="text-sm font-bold text-white">Video Tutorial</span>
                </div>
                <div className="aspect-video">
                  <video controls className="w-full h-full" src={guide.videoUrl}>
                    Your browser does not support video.
                  </video>
                </div>
              </div>
            )}

            {/* Step cards */}
            {guide.steps.map((step, index) => {
              const isActive    = index === currentStep;
              const isCompleted = completed.has(index);
              const isFuture    = !isActive && !isCompleted;

              return (
                <div
                  key={step.order}
                  ref={el => { stepRefs.current[index] = el; }}
                  onClick={() => !isActive && setCurrentStep(index)}
                  className={`rounded-3xl border-2 transition-all duration-300 scroll-mt-6 ${
                    isActive
                      ? 'border-blue-500 bg-white shadow-lg shadow-blue-500/8'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/40 cursor-pointer hover:border-emerald-300'
                      : 'border-slate-200 bg-white cursor-pointer hover:border-slate-300'
                  }`}
                >
                  {/* Card header — always visible */}
                  <div className="flex items-center gap-4 p-5">
                    {/* Step number badge */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-base transition-all ${
                      isActive
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isCompleted && !isActive
                        ? <CheckCircle2 size={18} />
                        : step.order
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-base leading-tight ${
                        isActive ? 'text-slate-900' : isFuture ? 'text-slate-400' : 'text-slate-700'
                      }`}>
                        {step.title}
                      </p>
                      {/* Show tools tag inline on collapsed steps */}
                      {!isActive && step.tools && (
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                          🔧 {step.tools}
                        </p>
                      )}
                    </div>

                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform ${isActive ? 'rotate-90 text-blue-500' : 'text-slate-300'}`}
                    />
                  </div>

                  {/* ── Expanded content (active step only) ── */}
                  {isActive && (
                    <div className="px-5 pb-5 space-y-4">
                      {/* Divider */}
                      <div className="h-px bg-slate-100" />

                      {/* Description */}
                      <p className="text-slate-700 text-sm leading-relaxed">{step.desc}</p>

                      {/* Step image */}
                      {step.image && (
                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                          <img src={step.image} alt={step.title} className="w-full h-auto object-cover" />
                        </div>
                      )}

                      {/* Warning */}
                      {step.warning && (
                        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                          <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                            <AlertTriangle size={15} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-red-600 uppercase tracking-wider mb-0.5">Warning</p>
                            <p className="text-sm text-red-700 leading-relaxed">{step.warning}</p>
                          </div>
                        </div>
                      )}

                      {/* Tip */}
                      {step.tip && (
                        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                          <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                            <Lightbulb size={15} className="text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-amber-600 uppercase tracking-wider mb-0.5">Pro Tip</p>
                            <p className="text-sm text-amber-800 leading-relaxed">{step.tip}</p>
                          </div>
                        </div>
                      )}

                      {/* Tools used this step */}
                      {step.tools && (
                        <div className="flex items-center gap-2">
                          <Wrench size={13} className="text-slate-400 shrink-0" />
                          <span className="text-xs text-slate-500 font-semibold">{step.tools}</span>
                        </div>
                      )}

                      {/* Navigation buttons */}
                      <div className="flex gap-3 pt-1">
                        {index > 0 && (
                          <button
                            onClick={e => { e.stopPropagation(); goToStep(index - 1); }}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                          >
                            ← Previous
                          </button>
                        )}
                        {!isDone ? (
                          <button
                            onClick={e => { e.stopPropagation(); goToStep(index + 1); }}
                            className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            Next Step <ArrowRight size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={e => { e.stopPropagation(); setCompleted(prev => new Set([...prev, index])); }}
                            className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={15} /> Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Completion banner */}
            {completed.size === totalSteps && (
              <div className="bg-emerald-500 rounded-3xl p-6 text-white text-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={36} className="mx-auto mb-3 opacity-90" />
                <p className="text-xl font-black mb-1">Repair Complete!</p>
                <p className="text-emerald-100 text-sm">All {totalSteps} steps finished successfully.</p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Tools card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Wrench size={14} className="text-blue-600" />
                </div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
                  Tools Required
                </h3>
                <span className="ml-auto text-xs font-bold bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center">
                  {guide.tools.length}
                </span>
              </div>
              <div className="space-y-2">
                {guide.tools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                    <div className="w-8 h-8 bg-white rounded-xl border border-slate-200 flex items-center justify-center group-hover:border-blue-200 transition-colors shadow-sm">
                      <ToolIcon name={tool.name} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{tool.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Parts card */}
            {guide.parts.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Package size={14} className="text-purple-600" />
                  </div>
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
                    Parts Required
                  </h3>
                  <span className="ml-auto text-xs font-bold bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center">
                    {guide.parts.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {guide.parts.map((part, i) => (
                    <div key={i} className="p-3 bg-purple-50 rounded-2xl border border-purple-100 hover:border-purple-300 transition-colors">
                      <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{part.name}</p>
                      <p className="text-[11px] font-mono font-bold text-purple-500">{part.sku}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety card */}
            <div className="bg-slate-900 rounded-3xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-slate-400" />
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Safety</p>
              </div>
              <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
                <p>Always power off before starting any repair.</p>
                <p>Use anti-static protection near electronics.</p>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500 mb-3">Related</p>
              <div className="space-y-2">
                <Link href="/parts" className="flex items-center justify-between text-sm text-blue-700 font-bold hover:text-blue-900 transition-colors">
                  <span>Check Parts Warranty</span>
                  <ArrowRight size={13} />
                </Link>
                <Link href="/error-codes" className="flex items-center justify-between text-sm text-blue-700 font-bold hover:text-blue-900 transition-colors">
                  <span>View Error Codes</span>
                  <ArrowRight size={13} />
                </Link>
                <Link href="/videos" className="flex items-center justify-between text-sm text-blue-700 font-bold hover:text-blue-900 transition-colors">
                  <span>Video Tutorials</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
