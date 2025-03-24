
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const ClientTaxForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    employmentIncome: '',
    interestIncome: '',
    dividends: '',
    workDeductions: '',
    donationsDeductions: '',
    otherDeductions: '',
    medicareLevyExemption: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const totalSteps = 3;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handlePrevStep = () => {
    setStep(Math.max(1, step - 1));
  };
  
  const handleNextStep = () => {
    setStep(Math.min(totalSteps, step + 1));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Progress saved",
        description: "Your tax form information has been saved"
      });
      setIsSaving(false);
    }, 1000);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Tax return submitted",
        description: "Your tax form has been submitted to your agent for review"
      });
      setIsSaving(false);
    }, 1500);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-card">
      {/* Progress indicator */}
      <div className="border-b border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">2023-2024 Tax Return</h2>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleSave} disabled={isSaving}>
            <Save size={16} className="mr-1.5" />
            <span>{isSaving ? 'Saving...' : 'Save Progress'}</span>
          </Button>
        </div>
        
        <div className="w-full flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center"
              style={{ width: `${100 / totalSteps}%` }}
            >
              <div 
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 ${
                  i + 1 === step ? 'bg-blue-accent text-white' : 
                  i + 1 < step ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i + 1 < step ? <CheckCircle size={14} className="sm:text-base" /> : i + 1}
              </div>
              <div className="text-xs text-center hidden sm:block">
                {i === 0 ? 'Income Details' : 
                 i === 1 ? 'Deductions' : 'Review & Submit'}
              </div>
              <div className="text-xs text-center sm:hidden">
                {i === 0 ? 'Income' : 
                 i === 1 ? 'Deduct' : 'Review'}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className="bg-blue-accent h-2 rounded-full transition-all" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Form content */}
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-gray-900">Income Details</h3>
              <p className="text-gray-600 text-sm">
                Please enter all sources of income for the 2023-2024 financial year.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label htmlFor="employmentIncome" className="text-sm font-medium text-gray-700">
                      Employment Income (Salary & Wages)
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <HelpCircle size={14} className="text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Include all salary, wages, and allowances from your employment. 
                            This should match your payment summary.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id="employmentIncome"
                      name="employmentIncome"
                      type="number"
                      value={formData.employmentIncome}
                      onChange={handleInputChange}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label htmlFor="interestIncome" className="text-sm font-medium text-gray-700">
                      Interest Income
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <HelpCircle size={14} className="text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Interest earned from bank accounts, term deposits, and other investments.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id="interestIncome"
                      name="interestIncome"
                      type="number"
                      value={formData.interestIncome}
                      onChange={handleInputChange}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label htmlFor="dividends" className="text-sm font-medium text-gray-700">
                      Dividends
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <HelpCircle size={14} className="text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Include all dividend payments received from shares, including franked amounts.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id="dividends"
                      name="dividends"
                      type="number"
                      value={formData.dividends}
                      onChange={handleInputChange}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-light rounded-lg">
                <p className="text-sm text-blue-accent">
                  <strong>Visa Specific Note:</strong> As a 482 Visa holder, remember that your 
                  worldwide income may be taxable in Australia if you're considered a resident for tax purposes.
                </p>
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-gray-900">Deductions</h3>
              <p className="text-gray-600 text-sm">
                Enter any deductions you're claiming for the 2023-2024 financial year.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label htmlFor="workDeductions" className="text-sm font-medium text-gray-700">
                      Work-Related Expenses
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <HelpCircle size={14} className="text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Work-related expenses including clothing, tools, home office, and professional development.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id="workDeductions"
                      name="workDeductions"
                      type="number"
                      value={formData.workDeductions}
                      onChange={handleInputChange}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label htmlFor="donationsDeductions" className="text-sm font-medium text-gray-700">
                      Donations
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <HelpCircle size={14} className="text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Charitable donations to registered organizations.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id="donationsDeductions"
                      name="donationsDeductions"
                      type="number"
                      value={formData.donationsDeductions}
                      onChange={handleInputChange}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label htmlFor="otherDeductions" className="text-sm font-medium text-gray-700">
                      Other Deductions
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <HelpCircle size={14} className="text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Other tax deductions not covered in the categories above.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id="otherDeductions"
                      name="otherDeductions"
                      type="number"
                      value={formData.otherDeductions}
                      onChange={handleInputChange}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-blue-light rounded-lg">
                  <p className="text-sm text-blue-accent">
                    <strong>Remember:</strong> You need to keep receipts for all deductions claimed 
                    for at least 5 years after submitting your return.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-gray-900">Review & Submit</h3>
              <p className="text-gray-600 text-sm">
                Please review your information before submitting to your tax agent.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Income Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Employment Income:</span>
                      <span className="font-medium">${formData.employmentIncome || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Interest Income:</span>
                      <span className="font-medium">${formData.interestIncome || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dividends:</span>
                      <span className="font-medium">${formData.dividends || '0.00'}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                      <span>Total Income:</span>
                      <span>
                        ${(parseFloat(formData.employmentIncome || '0') + 
                          parseFloat(formData.interestIncome || '0') + 
                          parseFloat(formData.dividends || '0')).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Deductions Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Work-Related Expenses:</span>
                      <span className="font-medium">${formData.workDeductions || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Donations:</span>
                      <span className="font-medium">${formData.donationsDeductions || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Other Deductions:</span>
                      <span className="font-medium">${formData.otherDeductions || '0.00'}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                      <span>Total Deductions:</span>
                      <span>
                        ${(parseFloat(formData.workDeductions || '0') + 
                          parseFloat(formData.donationsDeductions || '0') + 
                          parseFloat(formData.otherDeductions || '0')).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-700">
                    <strong>Submission Note:</strong> Your tax agent will review your information 
                    and may contact you for additional details or supporting documents.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-6 flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            disabled={step === 1}
          >
            <ChevronLeft size={16} className="mr-1.5" />
            <span>Previous</span>
          </Button>
          
          {step < totalSteps ? (
            <Button 
              type="button"
              className="bg-blue-accent hover:bg-blue-accent/90"
              onClick={handleNextStep}
            >
              <span>Continue</span>
              <ChevronRight size={16} className="ml-1.5" />
            </Button>
          ) : (
            <Button 
              type="submit"
              className="bg-blue-accent hover:bg-blue-accent/90"
              disabled={isSaving}
            >
              {isSaving ? 'Submitting...' : 'Submit to Agent'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ClientTaxForm;
