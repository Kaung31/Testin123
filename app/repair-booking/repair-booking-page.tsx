"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Upload, Calendar } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Scooter Info
    scooterModel: '',
    purchaseDate: '',
    serialNumber: '',
    
    // Warranty & Accident
    underWarranty: null,
    hadAccident: null,
    
    // Step 2: Issue Type
    issueCategories: [],
    
    // Step 3: Details
    selectedErrorCodes: [],
    selectedDamageParts: [],
    selectedPerformanceIssues: [],
    otherDescription: '',
    scooterRideable: null,
    
    // Repair selection
    fixAllIssues: true,
    selectedIssues: [],
    
    // Step 4: Photos
    photos: [],
    
    // Step 5: Booking
    serviceType: '', // 'drop-off' or 'collection'
    preferredDate: '',
    timeSlot: '',
    
    // Step 6: Contact
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    
    // Payment
    paymentOption: '', // 'now' or 'later'
  });

  // Calculate warranty status based on purchase date
  const calculateWarrantyStatus = (purchaseDate) => {
    if (!purchaseDate) return null;
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const monthsDiff = (now - purchase) / (1000 * 60 * 60 * 24 * 30);
    return monthsDiff <= 12;
  };

  // Calculate estimated cost
  const calculateEstimatedCost = () => {
    let total = 0;
    const items = [];
    
    // Check warranty
    const isWarranty = formData.underWarranty && !formData.hadAccident;
    
    if (!isWarranty) {
      total += 40; // Diagnostic fee
      items.push({ item: 'Diagnostic Fee', cost: 40 });
    }
    
    // Add part costs (non-warranty)
    formData.selectedDamageParts.forEach(part => {
      if (part === 'Tyre(s)') {
        total += 40;
        items.push({ item: 'Tyre Replacement', cost: 40 });
      } else if (part === 'Mudguard(s)') {
        total += 35;
        items.push({ item: 'Mudguard Replacement', cost: 35 });
      }
    });
    
    // Collection fee
    if (formData.serviceType === 'collection') {
      total += 20;
      items.push({ item: 'Collection Fee', cost: 20 });
    }
    
    return { total, items, isWarranty };
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate warranty when purchase date changes
    if (field === 'purchaseDate') {
      const warranty = calculateWarrantyStatus(value);
      setFormData(prev => ({ ...prev, underWarranty: warranty }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Prepare email data
    const cost = calculateEstimatedCost();
    
    const emailData = {
      ...formData,
      estimatedCost: cost,
      submittedAt: new Date().toISOString(),
    };
    
    try {
      // Send to API endpoint (you'll need to create this)
      const response = await fetch('/api/repair-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });
      
      if (response.ok) {
        alert('Booking submitted successfully! You will receive a confirmation email shortly.');
        // Reset form or redirect
      } else {
        alert('Error submitting booking. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting booking. Please try again.');
    }
  };

  const renderStepContent = () => {
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

      // Continue with remaining steps...
      // (Photos, Booking, Contact, Summary)
      // Due to length, I'll create these in separate files

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
