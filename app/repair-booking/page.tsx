"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Upload, Calendar } from 'lucide-react';

// Types
interface FormData {
  scooterModel: string;
  purchaseDate: string;
  serialNumber: string;
  underWarranty: boolean | null;
  hadAccident: boolean | null;
  issueCategories: string[];
  selectedErrorCodes: string[];
  selectedDamageParts: string[];
  selectedPerformanceIssues: string[];
  otherDescription: string;
  scooterRideable: boolean | null;
  fixAllIssues: boolean;
  selectedIssues: string[];
  photos: File[];
  serviceType: string;
  preferredDate: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  paymentOption: string;
}

interface CostItem {
  item: string;
  cost: number;
}

interface CostEstimate {
  total: number;
  items: CostItem[];
  isWarranty: boolean | null;
}

// Steps in the repair booking process
const STEPS = [
  'Scooter Info',
  'Issue Type',
  'Details',
  'Photos',
  'Booking',
  'Contact',
  'Summary'
];

// Scooter models
const SCOOTER_MODELS = [
  'Pure Air Gen 3',
  'Pure Air Pro',
  'Pure Air Gen 4',
  'Pure Air Pro Gen 4',
  'Pure Advance',
  'Air Go'
];

// Error codes with descriptions
const ERROR_CODES = [
  { code: 'E1', name: 'Brake Error', severity: 'high' },
  { code: 'E2', name: 'Throttle Error', severity: 'high' },
  { code: 'F2', name: 'Throttle Error (Startup)', severity: 'high' },
  { code: 'E3', name: 'Communication Error', severity: 'critical' },
  { code: 'E4', name: 'Motor Overcurrent', severity: 'high' },
  { code: 'E7', name: 'Motor Hall Sensor', severity: 'high' },
  { code: 'E13', name: 'Battery Comms Error', severity: 'high' },
];

// Physical damage options
const DAMAGE_PARTS = [
  'Tyre(s)',
  'Mudguard(s)',
  'Handlebar',
  'Stem (steering column)',
  'Brake(s)',
  'Other'
];

// Performance issues
const PERFORMANCE_ISSUES = [
  'Noise when turning (bearing issue)',
  'Slow acceleration',
  'Battery draining fast',
  'Other performance issue'
];

export default function RepairBookingPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    scooterModel: '',
    purchaseDate: '',
    serialNumber: '',
    underWarranty: null,
    hadAccident: null,
    issueCategories: [],
    selectedErrorCodes: [],
    selectedDamageParts: [],
    selectedPerformanceIssues: [],
    otherDescription: '',
    scooterRideable: null,
    fixAllIssues: true,
    selectedIssues: [],
    photos: [],
    serviceType: '',
    preferredDate: '',
    timeSlot: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    paymentOption: '',
  });

  // Calculate warranty status based on purchase date
  const calculateWarrantyStatus = (purchaseDate: string): boolean | null => {
    if (!purchaseDate) return null;
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const monthsDiff = (now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsDiff <= 12;
  };

  // Calculate estimated cost
  const calculateEstimatedCost = (): CostEstimate => {
    let total = 0;
    const items: CostItem[] = [];
    
    const isWarranty = formData.underWarranty && !formData.hadAccident;
    
    if (!isWarranty) {
      total += 40;
      items.push({ item: 'Diagnostic Fee', cost: 40 });
    }
    
    formData.selectedDamageParts.forEach((part: string) => {
      if (part === 'Tyre(s)') {
        total += 40;
        items.push({ item: 'Tyre Replacement', cost: 40 });
      } else if (part === 'Mudguard(s)') {
        total += 35;
        items.push({ item: 'Mudguard Replacement', cost: 35 });
      }
    });
    
    if (formData.serviceType === 'collection') {
      total += 20;
      items.push({ item: 'Collection Fee', cost: 20 });
    }
    
    return { total, items, isWarranty };
  };

  const updateFormData = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'purchaseDate') {
      const warranty = calculateWarrantyStatus(value);
      setFormData(prev => ({ ...prev, underWarranty: warranty }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removePhoto = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const nextStep = (): void => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const cost = calculateEstimatedCost();
    
    const emailData = {
      ...formData,
      estimatedCost: cost,
      submittedAt: new Date().toISOString(),
    };
    
    try {
      const response = await fetch('/api/repair-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });
      
      if (response.ok) {
        alert('Booking submitted successfully! You will receive a confirmation email shortly.');
      } else {
        alert('Error submitting booking. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting booking. Please try again.');
    }
  };

  const renderStepContent = (): JSX.Element => {
    switch (currentStep) {
      case 0: // Scooter Info
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Scooter Information</h2>
            
            <div>
              <label className="block font-semibold mb-2">Scooter Model *</label>
              <select
                value={formData.scooterModel}
                onChange={(e) => updateFormData('scooterModel', e.target.value)}
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              >
                <option value="">Select your model</option>
                {SCOOTER_MODELS.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Purchase Date *</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => updateFormData('purchaseDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              />
              {formData.underWarranty !== null && (
                <p className={`mt-2 text-sm ${formData.underWarranty ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.underWarranty ? '✓ Within 12-month warranty' : '✗ Outside warranty period'}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2">Serial Number (optional)</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => updateFormData('serialNumber', e.target.value)}
                placeholder="Found on underside of scooter"
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Has the scooter been in an accident? *</label>
              <div className="flex gap-4">
                <button
                  onClick={() => updateFormData('hadAccident', true)}
                  className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${
                    formData.hadAccident === true
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 hover:border-red-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateFormData('hadAccident', false)}
                  className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${
                    formData.hadAccident === false
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 hover:border-green-300'
                  }`}
                >
                  No
                </button>
              </div>
              {formData.hadAccident === true && (
                <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">⚠️ Accident damage is not covered by warranty</p>
                </div>
              )}
            </div>
          </div>
        );

      case 1: // Issue Type
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">What issues are you experiencing?</h2>
            <p className="text-slate-600">Select all that apply</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Error Code', 'Physical Damage', 'Performance/Noise', 'Not sure/Other'].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    const current = formData.issueCategories;
                    if (current.includes(category)) {
                      updateFormData('issueCategories', current.filter(c => c !== category));
                    } else {
                      updateFormData('issueCategories', [...current, category]);
                    }
                  }}
                  className={`p-6 border-2 rounded-2xl font-semibold text-left transition-all ${
                    formData.issueCategories.includes(category)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>
                    {formData.issueCategories.includes(category) && (
                      <Check className="text-blue-600" size={24} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2: // Details
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Issue Details</h2>
            
            {formData.issueCategories.includes('Error Code') && (
              <div>
                <label className="block font-semibold mb-3">Select Error Codes</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ERROR_CODES.map(error => (
                    <button
                      key={error.code}
                      onClick={() => {
                        const current = formData.selectedErrorCodes;
                        if (current.includes(error.code)) {
                          updateFormData('selectedErrorCodes', current.filter(c => c !== error.code));
                        } else {
                          updateFormData('selectedErrorCodes', [...current, error.code]);
                        }
                      }}
                      className={`p-4 border-2 rounded-xl font-bold transition-all ${
                        formData.selectedErrorCodes.includes(error.code)
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-slate-200 hover:border-red-300'
                      }`}
                    >
                      {error.code}
                      <p className="text-xs font-normal mt-1">{error.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.issueCategories.includes('Physical Damage') && (
              <div>
                <label className="block font-semibold mb-3">Damaged Parts</label>
                <div className="space-y-2">
                  {DAMAGE_PARTS.map(part => (
                    <label key={part} className="flex items-center p-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedDamageParts.includes(part)}
                        onChange={(e) => {
                          const current = formData.selectedDamageParts;
                          if (e.target.checked) {
                            updateFormData('selectedDamageParts', [...current, part]);
                          } else {
                            updateFormData('selectedDamageParts', current.filter(p => p !== part));
                          }
                        }}
                        className="mr-3 w-5 h-5"
                      />
                      <span>{part}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formData.issueCategories.includes('Performance/Noise') && (
              <div>
                <label className="block font-semibold mb-3">Performance Issues</label>
                <div className="space-y-2">
                  {PERFORMANCE_ISSUES.map(issue => (
                    <label key={issue} className="flex items-center p-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedPerformanceIssues.includes(issue)}
                        onChange={(e) => {
                          const current = formData.selectedPerformanceIssues;
                          if (e.target.checked) {
                            updateFormData('selectedPerformanceIssues', [...current, issue]);
                          } else {
                            updateFormData('selectedPerformanceIssues', current.filter(i => i !== issue));
                          }
                        }}
                        className="mr-3 w-5 h-5"
                      />
                      <span>{issue}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formData.issueCategories.includes('Not sure/Other') && (
              <div>
                <label className="block font-semibold mb-3">Describe the issue</label>
                <textarea
                  value={formData.otherDescription}
                  onChange={(e) => updateFormData('otherDescription', e.target.value)}
                  placeholder="Please describe what's happening with your scooter..."
                  rows={4}
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold mb-2">Is the scooter still rideable? *</label>
              <div className="flex gap-4">
                <button
                  onClick={() => updateFormData('scooterRideable', true)}
                  className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${
                    formData.scooterRideable === true
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 hover:border-green-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateFormData('scooterRideable', false)}
                  className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${
                    formData.scooterRideable === false
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 hover:border-red-300'
                  }`}
                >
                  No
                </button>
              </div>
              {formData.scooterRideable === false && (
                <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 flex items-start gap-2">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <span>⚠️ Do not ride the scooter. We recommend collection service.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Photos
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Upload Photos</h2>
            <p className="text-slate-600">Please upload photos of your scooter (optional but recommended)</p>
            
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
              <Upload className="mx-auto mb-4 text-slate-400" size={48} />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <span className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 inline-block">
                  Choose Photos
                </span>
              </label>
              <p className="text-sm text-slate-500 mt-2">JPG or PNG, max 5MB each</p>
            </div>

            {formData.photos.length > 0 && (
              <div>
                <p className="font-semibold mb-3">{formData.photos.length} photo(s) selected</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4: // Booking
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Booking Details</h2>
            
            <div>
              <label className="block font-semibold mb-3">Service Type *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateFormData('serviceType', 'drop-off')}
                  className={`p-6 border-2 rounded-2xl font-semibold transition-all ${
                    formData.serviceType === 'drop-off'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-2">🏪</div>
                  <div className="font-bold mb-1">Drop-off at Workshop</div>
                  <div className="text-sm opacity-70">Bring your scooter to us</div>
                </button>
                <button
                  onClick={() => updateFormData('serviceType', 'collection')}
                  className={`p-6 border-2 rounded-2xl font-semibold transition-all ${
                    formData.serviceType === 'collection'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-2">🚚</div>
                  <div className="font-bold mb-1">Collection Service</div>
                  <div className="text-sm opacity-70">We pick up (+£20 fee)</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Preferred Date *</label>
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => updateFormData('preferredDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>

            {formData.serviceType === 'drop-off' && (
              <div>
                <label className="block font-semibold mb-2">Time Slot</label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => updateFormData('timeSlot', e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                >
                  <option value="">Select time slot</option>
                  <option value="09:00-10:00">09:00 - 10:00</option>
                  <option value="10:00-11:00">10:00 - 11:00</option>
                  <option value="11:00-12:00">11:00 - 12:00</option>
                  <option value="14:00-15:00">14:00 - 15:00</option>
                  <option value="15:00-16:00">15:00 - 16:00</option>
                  <option value="16:00-17:00">16:00 - 17:00</option>
                </select>
              </div>
            )}
          </div>
        );

      case 5: // Contact
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            
            <div>
              <label className="block font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => updateFormData('customerName', e.target.value)}
                placeholder="John Smith"
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => updateFormData('customerEmail', e.target.value)}
                placeholder="john@example.com"
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => updateFormData('customerPhone', e.target.value)}
                placeholder="07123456789"
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>

            {formData.serviceType === 'collection' && (
              <>
                <div>
                  <label className="block font-semibold mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => updateFormData('addressLine1', e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => updateFormData('addressLine2', e.target.value)}
                    placeholder="Apartment, suite, etc."
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="London"
                      className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Postal Code *</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => updateFormData('postalCode', e.target.value)}
                      placeholder="SW1A 1AA"
                      className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 6: // Summary
        const cost = calculateEstimatedCost();
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Booking Summary</h2>
            
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Scooter Details</h3>
                <p className="text-sm text-slate-600">Model: {formData.scooterModel}</p>
                <p className="text-sm text-slate-600">Purchase Date: {formData.purchaseDate}</p>
                <p className={`text-sm font-semibold ${cost.isWarranty ? 'text-green-600' : 'text-red-600'}`}>
                  {cost.isWarranty ? '✓ Under Warranty' : '✗ Out of Warranty'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Issues Reported</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.issueCategories.map(cat => (
                    <span key={cat} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Service Type</h3>
                <p className="text-sm text-slate-600">
                  {formData.serviceType === 'drop-off' ? '🏪 Drop-off at Workshop' : '🚚 Collection Service'}
                </p>
                <p className="text-sm text-slate-600">Date: {formData.preferredDate}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-sm text-slate-600">{formData.customerName}</p>
                <p className="text-sm text-slate-600">{formData.customerEmail}</p>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Estimated Cost</h3>
              {cost.isWarranty ? (
                <div>
                  <p className="text-green-600 font-bold text-xl">£0 - Covered by Warranty</p>
                  <p className="text-sm text-slate-600 mt-2">Subject to inspection approval</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cost.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.item}</span>
                      <span className="font-semibold">£{item.cost}</span>
                    </div>
                  ))}
                  <div className="border-t-2 border-blue-300 pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-blue-600">£{cost.total}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">*Final cost confirmed after inspection</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Step content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {index < currentStep ? <Check size={20} /> : index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </p>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
          )}
          
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all"
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
            >
              Submit Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
