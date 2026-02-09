"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Wrench, Clock, AlertTriangle, CheckCircle, Lightbulb, Package, PlayCircle } from 'lucide-react';
import { guidesData } from '@/lib/guides-db';

export default function GuideDetailPage() {
  const params = useParams();
  const guideId = params.guideId as string;
  const [currentStep, setCurrentStep] = useState(0);

  // Get the guide from database
  const guide = guidesData[guideId as keyof typeof guidesData];

  if (!guide) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Guide Not Found</h1>
          <p className="text-slate-600 mb-4">This repair guide doesn't exist.</p>
          <Link href="/guides" className="text-blue-600 font-bold hover:underline">← Back to Guides</Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/guides" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Back to Guides</span>
        </Link>

        {/* Guide Header */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{guide.title}</h1>
              <p className="text-slate-600 text-lg mb-4">{guide.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${getDifficultyColor(guide.difficulty)}`}>
                  {guide.difficulty}
                </span>
                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
                  {guide.category}
                </span>
                <span className="bg-slate-100 text-slate-700 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock size={14} /> {guide.time}
                </span>
                <span className="bg-purple-100 text-purple-700 text-sm font-bold px-3 py-1 rounded-full">
                  {guide.model}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-600">Progress: Step {currentStep + 1} of {guide.steps.length}</p>
              <p className="text-sm font-bold text-blue-600">{Math.round(((currentStep + 1) / guide.steps.length) * 100)}%</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / guide.steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section (if available) */}
            {guide.videoUrl && (
              <div className="bg-slate-900 rounded-3xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <PlayCircle size={24} />
                  Video Tutorial
                </h3>
                <div className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center">
                  <video 
                    controls 
                    className="w-full h-full rounded-xl"
                    src={guide.videoUrl}
                  >
                    Your browser does not support video.
                  </video>
                </div>
              </div>
            )}

            {/* Step Cards */}
            {guide.steps.map((step, index) => (
              <div
                key={step.order}
                id={`step-${step.order}`}
                className={`bg-white rounded-3xl border-2 p-6 transition-all scroll-mt-8 ${
                  index === currentStep 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 ${
                    index === currentStep ? 'bg-blue-500' : 'bg-slate-400'
                  }`}>
                    {step.order}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-700 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* NEW CODE (Renders the real image) */}
                {step.image && (
                  <div className="rounded-2xl overflow-hidden mb-4 border border-slate-200 shadow-sm">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Warning */}
                {step.warning && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-red-500 shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-red-700 text-sm mb-1">⚠️ WARNING</p>
                        <p className="text-red-600 text-sm">{step.warning}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tip */}
                {step.tip && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="text-blue-500 shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-blue-700 text-sm mb-1">💡 TIP</p>
                        <p className="text-blue-600 text-sm">{step.tip}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step Navigation */}
                <div className="flex gap-3 mt-4">
                  {index > 0 && (
                    <button
                      onClick={() => setCurrentStep(index - 1)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                    >
                      ← Previous
                    </button>
                  )}
                  {index < guide.steps.length - 1 ? (
                    <button
                      onClick={() => setCurrentStep(index + 1)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all flex-1"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <div className="flex-1 bg-emerald-100 border-2 border-emerald-300 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                      <CheckCircle size={20} />
                      Repair Complete!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar - Tools & Parts */}
          <div className="space-y-6">
            {/* Tools Needed */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Wrench className="text-blue-500" size={20} />
                Tools Required ({guide.tools.length})
              </h3>
              <div className="space-y-3">
                {guide.tools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                      🔧
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{tool.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Parts Required */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Package className="text-purple-500" size={20} />
                Parts Required ({guide.parts.length})
              </h3>
              <div className="space-y-3">
                {guide.parts.map((part, index) => (
                  <div key={index} className="p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
                    <p className="text-sm font-bold text-slate-900 mb-1">{part.name}</p>
                    <p className="text-xs text-purple-600 font-mono font-bold">{part.sku}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Related</h3>
              <div className="space-y-2">
                <Link href="/parts" className="block text-sm text-blue-600 hover:underline font-bold">
                  → Check Parts Warranty
                </Link>
                <Link href="/error-codes" className="block text-sm text-blue-600 hover:underline font-bold">
                  → View Error Codes
                </Link>
                <Link href="/videos" className="block text-sm text-blue-600 hover:underline font-bold">
                  → More Video Tutorials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
