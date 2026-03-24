"use client";

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Upload, Calendar, MapPin, Wrench, ShieldAlert } from 'lucide-react';

// --- Types ---
interface FormData {
  model: string;
  serialNumber: string;
  purchaseDate: string;
  hadAccident: boolean | null;
  issueCategories: string[];
  errorCodes: string[];
  damageParts: string[];
  noiseIssues: string[];
  otherDescription: string;
  rideable: boolean | null;
  fixAll: boolean | null;
  selectedRepairs: string[];
  photos: File[];
  serviceType: 'drop-off' | 'collection' | '';
  bookingDate: string;
  timeSlot: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentOption: 'pay-now' | 'pay-later' | '';
}

const STEPS = [
  'Scooter Info',
  'Warranty Check',
  'Issue Type',
  'Specifics',
  'Repair Plan',
  'Photos',
  'Booking',
  'Details',
  'Summary'
];

const SCOOTER_MODELS = ['Pure Air Gen 3', 'Pure Air Pro', 'Pure Air Gen 4', 'Pure Air Pro Gen 4', 'Pure Advance', 'Air Go'];
const ERROR_CODES = ['E1', 'E2', 'F2', 'E3', 'E4', 'E7', 'E13'];
const DAMAGE_PARTS = ['Tyre(s)', 'Mudguard(s)', 'Handlebar/Stem', 'Brake(s)'];
const NOISE_ISSUES = ['Noise when turning (bearing)', 'Battery/power issue', 'Electrical fault (no code)'];

// Base prices based on PDF estimates
const PRICE_MAP: Record<string, number> = {
  'Tyre(s)': 35,
  'Mudguard(s)': 35,
  'Handlebar/Stem': 40,
  'Brake(s)': 20,
  'Collection Fee': 20,
  'Diagnostic Fee': 20
};

// Items never covered by warranty
const EXCLUDED_FROM_WARRANTY = ['Tyre(s)', 'Mudguard(s)', 'Brake(s)'];

export default function RepairBookingPage() {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    model: '',
    serialNumber: '',
    purchaseDate: '',
    hadAccident: null,
    issueCategories: [],
    errorCodes: [],
    damageParts: [],
    noiseIssues: [],
    otherDescription: '',
    rideable: null,
    fixAll: true,
    selectedRepairs: [],
    photos: [],
    serviceType: '',
    bookingDate: '',
    timeSlot: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    paymentOption: ''
  });

  // --- Logic & Calculations ---
  
  // 1. Calculate Core Warranty (12 months AND no accidents)
  const isWarrantyValid = useMemo(() => {
    if (!formData.purchaseDate) return false;
    const purchase = new Date(formData.purchaseDate);
    const now = new Date();
    const diffMonths = (now.getFullYear() - purchase.getFullYear()) * 12 + (now.getMonth() - purchase.getMonth());
    
    // PDF Logic: Voided if > 12 months OR if crashed
    return diffMonths <= 12 && formData.hadAccident === false;
  }, [formData.purchaseDate, formData.hadAccident]);

  // 2. Aggregate all reported issues into a single array
  const allReportedIssues = useMemo(() => {
    return [
      ...formData.errorCodes.map(c => `Error: ${c}`),
      ...formData.damageParts,
      ...formData.noiseIssues,
      ...(formData.otherDescription ? ['Other Issue'] : [])
    ];
  }, [formData.errorCodes, formData.damageParts, formData.noiseIssues, formData.otherDescription]);

  // 3. Auto-select repairs if "Fix All" is true
  React.useEffect(() => {
    if (formData.fixAll) {
      setFormData(prev => ({ ...prev, selectedRepairs: allReportedIssues }));
    } else if (formData.fixAll === false && formData.selectedRepairs.length === allReportedIssues.length) {
       // Reset if they switch to "No"
       setFormData(prev => ({ ...prev, selectedRepairs: [] }));
    }
  }, [formData.fixAll, allReportedIssues]);

  // 4. Calculate Final Costs
  const costEstimate = useMemo(() => {
    let total = 0;
    const items: { name: string, cost: number, covered: boolean }[] = [];
    let requiresDiagnosticFee = !isWarrantyValid;

    formData.selectedRepairs.forEach(repair => {
      const baseCost = PRICE_MAP[repair] || 0;
      const isWearPart = EXCLUDED_FROM_WARRANTY.includes(repair);
      
      // If it's a wear part, or warranty is void, they pay for the part
      if (!isWarrantyValid || isWearPart) {
        if (baseCost > 0) {
          total += baseCost;
          items.push({ name: repair, cost: baseCost, covered: false });
        }
      } else {
        // Covered by warranty
        items.push({ name: repair, cost: 0, covered: true });
      }
    });

    // Add Diagnostic fee if out of warranty
    if (requiresDiagnosticFee) {
      total += PRICE_MAP['Diagnostic Fee'];
      items.push({ name: 'Diagnostic Fee', cost: PRICE_MAP['Diagnostic Fee'], covered: false });
    }

    // Add Collection fee if applicable
    if (formData.serviceType === 'collection') {
      total += PRICE_MAP['Collection Fee'];
      items.push({ name: 'Courier Collection', cost: PRICE_MAP['Collection Fee'], covered: false });
    }

    // Calculate Deposit (Diagnostic + Courier if applicable)
    let deposit = 0;
    if (requiresDiagnosticFee) deposit += 20;
    if (formData.serviceType === 'collection') deposit += 20;

    return { total, items, deposit };
  }, [formData.selectedRepairs, isWarrantyValid, formData.serviceType]);

  // --- Handlers ---

  const update = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value]
      };
    });
  };
  const handleSubmit = async () => {
    try {
      // Note: Make sure this URL matches your actual API route (e.g., '/api/repair-booking' or '/api/send')
      const response = await fetch('/api/repair-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedTotal: costEstimate.total,
          depositRequired: costEstimate.deposit,
          isWarranty: isWarrantyValid,
          submittedAt: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        alert('Booking submitted successfully! You will receive a confirmation email shortly.');
        // Optional: Redirect user or reset form here
      } else {
        alert('Error submitting booking. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting booking. Please try again.');
    }
  };

  // --- Validation ---
  const canProceed = () => {
    switch (step) {
      case 0: return formData.model !== '';
      case 1: return formData.purchaseDate !== '' && formData.hadAccident !== null;
      case 2: return formData.issueCategories.length > 0;
      case 3: 
        const hasSpecifics = formData.errorCodes.length > 0 || formData.damageParts.length > 0 || formData.noiseIssues.length > 0 || formData.otherDescription !== '';
        return hasSpecifics && formData.rideable !== null;
      case 4: return formData.selectedRepairs.length > 0;
      case 5: return true; // Photos optional
      case 6: 
        if (!formData.serviceType) return false;
        if (formData.serviceType === 'drop-off') return formData.bookingDate !== '' && formData.timeSlot !== '';
        return formData.bookingDate !== '' && formData.addressLine1 !== '' && formData.city !== '' && formData.postalCode !== '';
      case 7: return formData.customerName !== '' && formData.customerEmail !== '';
      case 8: return formData.paymentOption !== '';
      default: return true;
    }
  };

  const nextStep = () => {
    if (canProceed()) setStep(s => s + 1);
  };

  // --- Step Rendering ---
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">Scooter Identification</h2>
            <div>
              <label className="block font-semibold mb-2">Scooter Model *</label>
              <select value={formData.model} onChange={(e) => update('model', e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 bg-white">
                <option value="">Select your model</option>
                {SCOOTER_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Serial Number (optional)</label>
              <input type="text" value={formData.serialNumber} onChange={(e) => update('serialNumber', e.target.value)} placeholder="Found on underside of deck" className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500" />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">Warranty Check</h2>
            <div>
              <label className="block font-semibold mb-2">Purchase Date *</label>
              <input type="date" value={formData.purchaseDate} max={new Date().toISOString().split('T')[0]} onChange={(e) => update('purchaseDate', e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500" />
              <p className="text-sm text-slate-500 mt-2">Your 12-month warranty starts from this date.</p>
            </div>
            <div>
              <label className="block font-semibold mb-2">Has your scooter been in an accident or dropped? *</label>
              <div className="flex gap-4">
                <button onClick={() => update('hadAccident', true)} className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${formData.hadAccident === true ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:border-red-300'}`}>Yes</button>
                <button onClick={() => update('hadAccident', false)} className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${formData.hadAccident === false ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-green-300'}`}>No</button>
              </div>
              {formData.hadAccident === true && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl flex items-start gap-3 text-red-700">
                  <ShieldAlert className="shrink-0 mt-1" size={20} />
                  <p className="text-sm"><strong>Note:</strong> Damage from accidents, crashes, or drops is not covered by the manufacturer warranty.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">What problem(s) do you have?</h2>
            <p className="text-slate-600">Select all that apply</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Error Code', 'Physical Damage', 'Noise / Performance', 'Not Sure / Other'].map(cat => (
                <button key={cat} onClick={() => toggleArrayItem('issueCategories', cat)} className={`p-6 border-2 rounded-2xl font-semibold text-left flex justify-between items-center transition-all ${formData.issueCategories.includes(cat) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300'}`}>
                  <span>{cat}</span>
                  {formData.issueCategories.includes(cat) && <Check size={20} />}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">Issue Details</h2>
            
            {formData.issueCategories.includes('Error Code') && (
              <div className="space-y-3">
                <label className="block font-semibold">Select error codes from your display:</label>
                <div className="flex flex-wrap gap-3">
                  {ERROR_CODES.map(code => (
                    <button key={code} onClick={() => toggleArrayItem('errorCodes', code)} className={`px-5 py-3 border-2 rounded-xl font-bold transition-all ${formData.errorCodes.includes(code) ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200'}`}>
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.issueCategories.includes('Physical Damage') && (
              <div className="space-y-3">
                <label className="block font-semibold">Which parts are damaged?</label>
                <div className="grid grid-cols-2 gap-3">
                  {DAMAGE_PARTS.map(part => (
                    <label key={part} className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" checked={formData.damageParts.includes(part)} onChange={() => toggleArrayItem('damageParts', part)} className="w-5 h-5 mr-3 accent-blue-600" />
                      <div>
                        <span>{part}</span>
                        {EXCLUDED_FROM_WARRANTY.includes(part) && <p className="text-xs text-slate-500 mt-1">Not covered by warranty</p>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {(formData.issueCategories.includes('Noise / Performance') || formData.issueCategories.includes('Not Sure / Other')) && (
              <div className="space-y-3">
                <label className="block font-semibold">Describe the issue</label>
                <textarea value={formData.otherDescription} onChange={(e) => update('otherDescription', e.target.value)} placeholder="e.g. Wheels making noise when turning, battery dying fast..." rows={4} className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500" />
              </div>
            )}

            <div className="pt-4 border-t-2 border-slate-100">
              <label className="block font-semibold mb-3">Is the scooter still rideable? *</label>
              <div className="flex gap-4">
                <button onClick={() => update('rideable', true)} className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${formData.rideable === true ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>Yes</button>
                <button onClick={() => update('rideable', false)} className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${formData.rideable === false ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200'}`}>No</button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">Repair Plan</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <p className="font-semibold mb-4 text-lg">Do you want us to fix all reported issues?</p>
              <div className="flex gap-4 mb-6">
                <button onClick={() => update('fixAll', true)} className={`flex-1 p-3 border-2 rounded-xl font-semibold transition-all ${formData.fixAll === true ? 'border-blue-500 bg-blue-100 text-blue-700' : 'border-slate-200 bg-white'}`}>Yes, fix everything</button>
                <button onClick={() => update('fixAll', false)} className={`flex-1 p-3 border-2 rounded-xl font-semibold transition-all ${formData.fixAll === false ? 'border-slate-500 bg-slate-200 text-slate-800' : 'border-slate-200 bg-white'}`}>No, let me choose</button>
              </div>

              {!formData.fixAll && (
                <div className="space-y-3 animate-in fade-in">
                  <p className="text-sm font-medium text-slate-600 mb-2">Select the specific issues you'd like quoted:</p>
                  {allReportedIssues.map(issue => (
                    <label key={issue} className="flex items-center p-3 bg-white border rounded-lg cursor-pointer">
                      <input type="checkbox" checked={formData.selectedRepairs.includes(issue)} onChange={() => toggleArrayItem('selectedRepairs', issue)} className="w-5 h-5 mr-3 accent-blue-600" />
                      <span>{issue}</span>
                      {EXCLUDED_FROM_WARRANTY.includes(issue) && <span className="ml-auto text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded">Paid Part</span>}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">Upload Photos</h2>
            <p className="text-slate-600">Please upload photos to help diagnosis (Max 5MB each). Recommended views:</p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-4 list-disc pl-5">
              <li>Front view</li>
              <li>Rear view</li>
              <li>Sides (wheels)</li>
              <li>Under deck (serial sticker)</li>
            </ul>
            
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
              <Upload className="mx-auto mb-4 text-slate-400" size={40} />
              <input type="file" accept="image/*" multiple onChange={(e) => update('photos', Array.from(e.target.files || []))} className="hidden" id="photo-upload" />
              <label htmlFor="photo-upload" className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 inline-block">
                Select Images
              </label>
            </div>
            {formData.photos.length > 0 && <p className="font-semibold text-green-600">{formData.photos.length} files attached.</p>}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">Service Type & Booking</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => update('serviceType', 'drop-off')} className={`p-6 border-2 rounded-2xl text-left transition-all ${formData.serviceType === 'drop-off' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                <MapPin className={`mb-3 ${formData.serviceType === 'drop-off' ? 'text-blue-600' : 'text-slate-400'}`} size={32} />
                <h3 className="font-bold text-lg">Workshop Drop-off</h3>
                <p className="text-sm text-slate-500 mt-1">Bring your scooter to us</p>
              </button>
              <button onClick={() => update('serviceType', 'collection')} className={`p-6 border-2 rounded-2xl text-left transition-all ${formData.serviceType === 'collection' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                <Wrench className={`mb-3 ${formData.serviceType === 'collection' ? 'text-blue-600' : 'text-slate-400'}`} size={32} />
                <h3 className="font-bold text-lg">Courier Collection</h3>
                <p className="text-sm text-slate-500 mt-1">We pick up (£20 fee + £20 return)</p>
              </button>
            </div>

            {formData.serviceType && (
              <div className="space-y-4 pt-4 animate-in fade-in">
                <div>
                  <label className="block font-semibold mb-2">{formData.serviceType === 'drop-off' ? 'Drop-off Date *' : 'Pickup Date *'}</label>
                  <input type="date" value={formData.bookingDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => update('bookingDate', e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl" />
                </div>
                
                {formData.serviceType === 'drop-off' && (
                  <div>
                    <label className="block font-semibold mb-2">Time Slot *</label>
                    <select value={formData.timeSlot} onChange={(e) => update('timeSlot', e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl bg-white">
                      <option value="">Select a time</option>
                      <option>Morning (09:00 - 12:00)</option>
                      <option>Afternoon (12:00 - 17:00)</option>
                    </select>
                  </div>
                )}

                {formData.serviceType === 'collection' && (
                  <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-700">Collection Address</h4>
                    <input type="text" placeholder="Address Line 1 *" value={formData.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} className="w-full p-3 border rounded-lg" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="City *" value={formData.city} onChange={(e) => update('city', e.target.value)} className="w-full p-3 border rounded-lg" />
                      <input type="text" placeholder="Postcode *" value={formData.postalCode} onChange={(e) => update('postalCode', e.target.value)} className="w-full p-3 border rounded-lg" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">Your Details</h2>
            <div>
              <label className="block font-semibold mb-2">Full Name *</label>
              <input type="text" value={formData.customerName} onChange={(e) => update('customerName', e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Email Address *</label>
              <input type="email" value={formData.customerEmail} onChange={(e) => update('customerEmail', e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Phone Number</label>
              <input type="tel" value={formData.customerPhone} onChange={(e) => update('customerPhone', e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl" />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">Review & Confirm</h2>
            
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <p className="text-sm text-slate-500">Scooter</p>
                  <p className="font-bold text-lg">{formData.model}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Warranty Status</p>
                  {isWarrantyValid ? (
                    <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                      <Check size={14} /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-semibold">
                      <AlertCircle size={14} /> Expired / Void
                    </span>
                  )}
                </div>
              </div>

              <div className="border-b pb-4">
                <p className="text-sm text-slate-500 mb-2">Service Route</p>
                <p className="font-semibold">{formData.serviceType === 'drop-off' ? 'Workshop Drop-off' : 'Courier Collection'}</p>
                <p className="text-sm">{formData.bookingDate} {formData.timeSlot}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-3">Estimated Charges</p>
                <div className="space-y-2">
                  {costEstimate.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-700">{item.name}</span>
                      {item.covered ? (
                        <span className="text-green-600 font-semibold">Covered</span>
                      ) : (
                        <span className="font-medium">£{item.cost}</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-slate-100">
                  <span className="font-bold text-lg">Estimated Total</span>
                  <span className="font-bold text-xl text-blue-700">£{costEstimate.total}</span>
                </div>
              </div>
            </div>

            {costEstimate.deposit > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-1">Deposit Required: £{costEstimate.deposit}</h4>
                <p className="text-sm text-blue-800 mb-4">Required to secure your booking (Courier + Diagnostics).</p>
                
                <div className="flex gap-3">
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 text-slate-900 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-400">Step {step + 1} of {STEPS.length}</span>
            <span className="text-sm font-bold text-blue-600">{STEPS[step]}</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-full flex-1 border-r border-slate-300/30 transition-all duration-300 ${i <= step ? 'bg-blue-500' : 'bg-transparent'}`} />
            ))}
          </div>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 mb-6 border border-slate-100 min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation Footer */}
        <div className="flex gap-4">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
              <ChevronLeft size={20} /> Back
            </button>
          )}
          
          {step < STEPS.length - 1 ? (
            <button onClick={nextStep} disabled={!canProceed()} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${canProceed() ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
              Next Step <ChevronRight size={20} />
            </button>
          ) : (
            <button disabled={!canProceed()} className={`flex-1 px-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${canProceed() ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300 cursor-not-allowed'}`}>
              {formData.paymentOption === 'pay-now' ? `Pay £${costEstimate.deposit} & Book` : 'Confirm Booking'}
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={!canProceed()} 
              className={`flex-1 px-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${canProceed() ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300 cursor-not-allowed'}`}
            >
              {formData.paymentOption === 'pay-now' ? `Pay £${costEstimate.deposit} & Book` : 'Confirm Booking'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
