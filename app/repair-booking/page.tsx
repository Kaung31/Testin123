"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Upload, MapPin, Wrench, ShieldAlert, Info, Settings2 } from 'lucide-react';

// --- Types & Data ---
interface IssueDef {
  id: string;
  name: string;
  category: string;
  isWearPart: boolean;
  basePrice: number;
}

const AVAILABLE_ISSUES: IssueDef[] = [
  { id: 'e1', name: 'E1 / E2 Error Code (Throttle/Brake)', category: 'Error Code', isWearPart: false, basePrice: 40 },
  { id: 'e3', name: 'E3 / E4 Error Code (Motor/Comms)', category: 'Error Code', isWearPart: false, basePrice: 50 },
  { id: 'tyre', name: 'Tyre / Inner Tube Puncture', category: 'Physical Damage', isWearPart: true, basePrice: 35 },
  { id: 'mudguard', name: 'Broken Mudguard', category: 'Physical Damage', isWearPart: true, basePrice: 35 },
  { id: 'brakes', name: 'Brake Pads / Cables', category: 'Physical Damage', isWearPart: true, basePrice: 20 },
  { id: 'grips', name: 'Handlebar Grips / Bungs', category: 'Physical Damage', isWearPart: true, basePrice: 15 },
  { id: 'stem', name: 'Bent Handlebar / Stem', category: 'Physical Damage', isWearPart: false, basePrice: 45 },
  { id: 'bearings', name: 'Wheel Noise / Bearings', category: 'Performance', isWearPart: true, basePrice: 30 },
  { id: 'battery', name: 'Battery Draining Fast', category: 'Performance', isWearPart: false, basePrice: 60 },
];

const SCOOTER_MODELS = ['Pure Air Gen 3', 'Pure Air Pro', 'Pure Air Gen 4', 'Pure Air Pro Gen 4', 'Pure Advance', 'Air Go'];
const STEPS = ['Scooter Info', 'Report Issues', 'Repair Plan & Quote', 'Photos & Contact', 'Booking', 'Review'];

export default function RepairBookingPage() {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    model: '',
    serialNumber: '',
    purchaseDate: '',
    hadAccident: null as boolean | null,
    issueCategories: [] as string[],
    reportedIssues: [] as IssueDef[], // What is actually broken
    fixAll: true as boolean | null,   // Do they want everything fixed?
    selectedRepairs: [] as IssueDef[],// What they are actually paying to fix
    otherDescription: '',
    rideable: null as boolean | null,
    photos: [] as File[],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: '' as 'drop-off' | 'collection' | '',
    bookingDate: '',
    timeSlot: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    paymentOption: '' as 'pay-now' | 'pay-later' | '',
  });

  // --- Logic & Calculations ---
  
  // 1. Warranty Check
  const isWarrantyValid = useMemo(() => {
    if (!formData.purchaseDate) return false;
    const months = (new Date().getTime() - new Date(formData.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
    return months <= 12 && formData.hadAccident === false;
  }, [formData.purchaseDate, formData.hadAccident]);

  // 2. Sync "Selected Repairs" if "Fix All" is true
  useEffect(() => {
    if (formData.fixAll) {
      setFormData(prev => ({ ...prev, selectedRepairs: prev.reportedIssues }));
    }
  }, [formData.fixAll, formData.reportedIssues]);

  // 3. Cost Estimate Calculator
  const costEstimate = useMemo(() => {
    let partsTotal = 0;
    const items: { name: string; cost: number; reason: string }[] = [];
    const requiresDiagnosticFee = !isWarrantyValid;

    // We only charge for the items they SELECTED to repair
    formData.selectedRepairs.forEach(issue => {
      const isChargeable = !isWarrantyValid || issue.isWearPart;
      
      if (isChargeable && issue.basePrice > 0) {
        partsTotal += issue.basePrice;
        items.push({ 
          name: issue.name, 
          cost: issue.basePrice, 
          reason: issue.isWearPart ? 'Wear & Tear exclusion' : 'Out of Warranty' 
        });
      } else if (!isChargeable) {
        items.push({ name: issue.name, cost: 0, reason: 'Covered by Warranty' });
      }
    });

    const diagnosticFee = requiresDiagnosticFee ? 20 : 0;
    const collectionFee = formData.serviceType === 'collection' ? 20 : 0;
    
    if (diagnosticFee > 0) items.push({ name: 'Diagnostic Fee', cost: diagnosticFee, reason: 'Required for non-warranty' });
    if (collectionFee > 0) items.push({ name: 'Courier Collection', cost: collectionFee, reason: 'Service Fee' });

    const total = partsTotal + diagnosticFee + collectionFee;
    const depositRequired = diagnosticFee + collectionFee;

    return { total, items, depositRequired, partsTotal };
  }, [formData.selectedRepairs, isWarrantyValid, formData.serviceType]);

  // --- Handlers ---
  const update = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      issueCategories: prev.issueCategories.includes(cat)
        ? prev.issueCategories.filter(c => c !== cat)
        : [...prev.issueCategories, cat]
    }));
  };

  const toggleReportedIssue = (issue: IssueDef) => {
    setFormData(prev => {
      const exists = prev.reportedIssues.some(i => i.id === issue.id);
      return {
        ...prev,
        reportedIssues: exists 
          ? prev.reportedIssues.filter(i => i.id !== issue.id)
          : [...prev.reportedIssues, issue]
      };
    });
  };

  const toggleSelectedRepair = (issue: IssueDef) => {
    setFormData(prev => {
      const exists = prev.selectedRepairs.some(i => i.id === issue.id);
      return {
        ...prev,
        selectedRepairs: exists 
          ? prev.selectedRepairs.filter(i => i.id !== issue.id)
          : [...prev.selectedRepairs, issue]
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/repair-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedTotal: costEstimate.total,
          depositRequired: costEstimate.depositRequired,
          isWarranty: isWarrantyValid,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (response.ok) alert('Booking submitted successfully!');
      else alert('Error submitting booking.');
    } catch (error) {
      alert('Error submitting booking. Please try again.');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.model && formData.purchaseDate && formData.hadAccident !== null;
      case 1: return formData.reportedIssues.length > 0 && formData.rideable !== null;
      case 2: return formData.selectedRepairs.length > 0;
      case 3: return formData.customerName && formData.customerEmail;
      case 4: 
        if (!formData.serviceType || !formData.bookingDate) return false;
        if (formData.serviceType === 'drop-off') return !!formData.timeSlot;
        return formData.addressLine1 && formData.city && formData.postalCode;
      case 5: return formData.paymentOption !== '';
      default: return true;
    }
  };

  // --- Step Rendering ---
  const renderStep = () => {
    switch (step) {
      case 0: // SCOOTER INFO
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">1. Scooter & Warranty Check</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2">Scooter Model *</label>
                <select value={formData.model} onChange={e => update('model', e.target.value)} className="w-full p-4 border-2 rounded-xl focus:border-blue-500 bg-white">
                  <option value="">Select your model</option>
                  {SCOOTER_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-2">Serial Number (optional)</label>
                <input type="text" value={formData.serialNumber} onChange={e => update('serialNumber', e.target.value)} placeholder="Found under the deck" className="w-full p-4 border-2 rounded-xl" />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Purchase Date *</label>
              <input type="date" value={formData.purchaseDate} max={new Date().toISOString().split('T')[0]} onChange={e => update('purchaseDate', e.target.value)} className="w-full p-4 border-2 rounded-xl" />
            </div>

            <div>
              <label className="block font-bold mb-2">Has your scooter been in a crash or dropped? *</label>
              <div className="flex gap-4">
                <button onClick={() => update('hadAccident', true)} className={`flex-1 p-4 border-2 rounded-xl font-bold transition-all ${formData.hadAccident === true ? 'border-red-500 bg-red-50 text-red-700' : 'hover:bg-slate-50'}`}>Yes</button>
                <button onClick={() => update('hadAccident', false)} className={`flex-1 p-4 border-2 rounded-xl font-bold transition-all ${formData.hadAccident === false ? 'border-green-500 bg-green-50 text-green-700' : 'hover:bg-slate-50'}`}>No</button>
              </div>
            </div>
            
            {formData.purchaseDate && formData.hadAccident !== null && (
              <div className={`p-4 rounded-xl border flex gap-3 ${isWarrantyValid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                {isWarrantyValid ? <Check className="mt-0.5 shrink-0" /> : <ShieldAlert className="mt-0.5 shrink-0" />}
                <div>
                  <h4 className="font-bold">{isWarrantyValid ? 'Warranty Active' : 'Warranty Expired or Voided'}</h4>
                  <p className="text-sm mt-1">
                    {isWarrantyValid 
                      ? 'Manufacturing defects will be repaired free of charge (excluding wear & tear items).' 
                      : 'Repairs will be chargeable. We will quote you upfront.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 1: // REPORT ISSUES
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">2. What issues are you experiencing?</h2>
            <div className="flex flex-wrap gap-3">
              {['Error Code', 'Physical Damage', 'Performance', 'Other'].map(cat => (
                <button key={cat} onClick={() => toggleCategory(cat)} className={`px-5 py-3 border-2 rounded-full font-bold transition-all ${formData.issueCategories.includes(cat) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {formData.issueCategories.length > 0 && (
              <div className="space-y-3 mt-6 pt-6 border-t">
                <h3 className="font-bold text-lg mb-4">Select all issues that apply:</h3>
                {AVAILABLE_ISSUES.filter(i => formData.issueCategories.includes(i.category)).map(issue => {
                  const isSelected = formData.reportedIssues.some(s => s.id === issue.id);
                  return (
                    <label key={issue.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleReportedIssue(issue)} className="w-6 h-6 accent-blue-600 mr-4" />
                      <span className="font-bold">{issue.name}</span>
                    </label>
                  );
                })}
                {formData.issueCategories.includes('Other') && (
                  <textarea value={formData.otherDescription} onChange={e => update('otherDescription', e.target.value)} placeholder="Describe the issue..." rows={3} className="w-full p-4 border-2 rounded-xl mt-4" />
                )}
              </div>
            )}

            <div className="bg-slate-100 p-4 rounded-xl mt-6">
              <label className="block font-bold mb-3">Is the scooter still rideable? *</label>
              <div className="flex gap-4">
                <button onClick={() => update('rideable', true)} className={`flex-1 p-3 border-2 rounded-xl font-bold bg-white ${formData.rideable === true ? 'border-blue-500 text-blue-700' : 'border-transparent'}`}>Yes</button>
                <button onClick={() => update('rideable', false)} className={`flex-1 p-3 border-2 rounded-xl font-bold bg-white ${formData.rideable === false ? 'border-red-500 text-red-700' : 'border-transparent'}`}>No</button>
              </div>
            </div>
          </div>
        );

      case 2: // REPAIR PLAN & QUOTE
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">3. Your Repair Plan</h2>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Settings2 className="text-blue-600"/> Do you want us to fix all reported issues?</h3>
              <div className="flex gap-4 mb-6">
                <button onClick={() => update('fixAll', true)} className={`flex-1 p-4 border-2 rounded-xl font-bold transition-all ${formData.fixAll === true ? 'border-blue-600 bg-blue-100 text-blue-800' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'}`}>Yes, fix everything</button>
                <button onClick={() => update('fixAll', false)} className={`flex-1 p-4 border-2 rounded-xl font-bold transition-all ${formData.fixAll === false ? 'border-blue-600 bg-blue-100 text-blue-800' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'}`}>No, let me choose</button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-500 mb-2">{formData.fixAll ? 'Issues included in your quote:' : 'Uncheck the issues you do NOT want to pay for:'}</p>
                
                {formData.reportedIssues.map(issue => {
                  const isChargeable = !isWarrantyValid || issue.isWearPart;
                  const isSelected = formData.selectedRepairs.some(s => s.id === issue.id);

                  return (
                    <label key={issue.id} className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${!formData.fixAll ? 'cursor-pointer hover:border-blue-300' : ''} ${isSelected ? 'border-blue-400 bg-white' : 'border-slate-200 bg-slate-100 opacity-60'}`}>
                      <div className="flex items-center gap-3">
                        {!formData.fixAll && <input type="checkbox" checked={isSelected} onChange={() => toggleSelectedRepair(issue)} className="w-5 h-5 accent-blue-600" />}
                        <div>
                          <p className={`font-bold ${!isSelected ? 'line-through text-slate-500' : ''}`}>{issue.name}</p>
                          {isSelected && isChargeable && <p className="text-xs text-amber-600 font-semibold mt-1"><Info size={12} className="inline mb-0.5"/> {issue.isWearPart ? 'Wear part (Not covered)' : 'Out of Warranty'}</p>}
                        </div>
                      </div>
                      <div className="font-black text-lg">
                        {isSelected ? (isChargeable ? `£${issue.basePrice}` : <span className="text-green-600">Free</span>) : '—'}
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t-2 border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-600">Estimated Parts Total</span>
                <span className="font-black text-2xl text-blue-700">£{costEstimate.partsTotal}</span>
              </div>
            </div>
          </div>
        );

      case 3: // PHOTOS & CONTACT
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">4. Photos & Contact Details</h2>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">
              <Upload className="mx-auto mb-3 text-slate-400" size={32} />
              <p className="text-sm font-semibold mb-3 text-slate-600">Upload photos of the scooter (Front, Sides, Damage)</p>
              <input type="file" multiple onChange={e => update('photos', Array.from(e.target.files || []))} className="hidden" id="photo-upload" />
              <label htmlFor="photo-upload" className="cursor-pointer bg-slate-800 text-white px-5 py-2 rounded-lg font-bold hover:bg-slate-700 inline-block">Choose Files</label>
              {formData.photos.length > 0 && <p className="text-green-600 font-bold mt-3">{formData.photos.length} files attached</p>}
            </div>
            <div className="space-y-4 pt-4">
              <input type="text" placeholder="Full Name *" value={formData.customerName} onChange={e => update('customerName', e.target.value)} className="w-full p-4 border-2 rounded-xl" />
              <input type="email" placeholder="Email Address *" value={formData.customerEmail} onChange={e => update('customerEmail', e.target.value)} className="w-full p-4 border-2 rounded-xl" />
              <input type="tel" placeholder="Phone Number (optional)" value={formData.customerPhone} onChange={e => update('customerPhone', e.target.value)} className="w-full p-4 border-2 rounded-xl" />
            </div>
          </div>
        );

      case 4: // BOOKING
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">5. Service Booking</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => update('serviceType', 'drop-off')} className={`p-6 border-2 rounded-2xl text-left transition-all ${formData.serviceType === 'drop-off' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                <MapPin className="mb-3 text-blue-600" size={32} />
                <h3 className="font-bold text-lg">Workshop Drop-off</h3>
                <p className="text-sm text-slate-500 mt-1">Bring it to our HQ.</p>
              </button>
              <button onClick={() => update('serviceType', 'collection')} className={`p-6 border-2 rounded-2xl text-left transition-all ${formData.serviceType === 'collection' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                <Wrench className="mb-3 text-blue-600" size={32} />
                <h3 className="font-bold text-lg">Courier Collection</h3>
                <p className="text-sm text-slate-500 mt-1">£20 Pickup fee (+£20 return).</p>
              </button>
            </div>
            {formData.serviceType && (
              <div className="space-y-4 mt-6">
                <div>
                  <label className="block font-bold mb-2">{formData.serviceType === 'drop-off' ? 'Drop-off Date *' : 'Pickup Date *'}</label>
                  <input type="date" value={formData.bookingDate} onChange={e => update('bookingDate', e.target.value)} className="w-full p-4 border-2 rounded-xl" />
                </div>
                {formData.serviceType === 'drop-off' && (
                  <select value={formData.timeSlot} onChange={e => update('timeSlot', e.target.value)} className="w-full p-4 border-2 rounded-xl">
                    <option value="">Select Time Slot *</option>
                    <option>Morning (09:00 - 12:00)</option>
                    <option>Afternoon (12:00 - 17:00)</option>
                  </select>
                )}
                {formData.serviceType === 'collection' && (
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border">
                    <input type="text" placeholder="Address Line 1 *" value={formData.addressLine1} onChange={e => update('addressLine1', e.target.value)} className="col-span-2 p-3 border rounded-lg" />
                    <input type="text" placeholder="City *" value={formData.city} onChange={e => update('city', e.target.value)} className="p-3 border rounded-lg" />
                    <input type="text" placeholder="Postcode *" value={formData.postalCode} onChange={e => update('postalCode', e.target.value)} className="p-3 border rounded-lg" />
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 5: // REVIEW
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">6. Final Review</h2>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">Scooter</p>
                  <p className="font-black text-lg">{formData.model}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-500">Warranty</p>
                  <p className={`font-black text-lg ${isWarrantyValid ? 'text-green-600' : 'text-red-600'}`}>
                    {isWarrantyValid ? 'Active' : 'Void/Expired'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-2">Approved Repair Quote</p>
                {costEstimate.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700">{item.name} <span className="text-xs text-slate-400 block sm:inline">({item.reason})</span></span>
                    <span className="font-bold whitespace-nowrap">{item.cost === 0 ? <span className="text-green-600">Covered</span> : `£${item.cost}`}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-slate-200">
                  <span className="font-black text-lg">Total Estimated Cost</span>
                  <span className="font-black text-2xl text-blue-700">£{costEstimate.total}</span>
                </div>
              </div>
            </div>
            {costEstimate.depositRequired > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
                <h4 className="font-black text-blue-900 mb-1">Deposit Required: £{costEstimate.depositRequired}</h4>
                <p className="text-sm text-blue-800 mb-4">Secures your booking (covers Diagnostics / Courier if applicable).</p>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <button onClick={() => update('paymentOption', 'pay-now')} className={`flex-1 py-3 px-4 rounded-lg font-bold border-2 transition-all ${formData.paymentOption === 'pay-now' ? 'border-blue-600 bg-blue-600 text-white' : 'border-blue-300 text-blue-700 hover:bg-blue-100'}`}>Pay Now</button>
                  <button onClick={() => update('paymentOption', 'pay-later')} className={`flex-1 py-3 px-4 rounded-lg font-bold border-2 transition-all ${formData.paymentOption === 'pay-later' ? 'border-slate-600 bg-slate-600 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}>Pay on Completion</button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 text-slate-900 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-400">Step {step + 1} of {STEPS.length}</span>
            <span className="text-sm font-bold text-blue-600 hidden sm:inline">{STEPS[step]}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-full flex-1 border-r border-white transition-all duration-300 ${i <= step ? 'bg-blue-500' : 'bg-transparent'}`} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-6 md:p-10 mb-6 border border-slate-100 min-h-[400px]">
          {renderStep()}
        </div>
        <div className="flex gap-4">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="px-5 py-4 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all flex items-center gap-2">
              <ChevronLeft size={20} /> <span className="hidden sm:inline">Back</span>
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${canProceed() ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' : 'bg-slate-100 text-slate-400'}`}>
              Continue <ChevronRight size={20} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canProceed()} className={`flex-1 px-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${canProceed() ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300'}`}>
              {formData.paymentOption === 'pay-now' ? `Pay £${costEstimate.depositRequired} & Book` : 'Confirm Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
