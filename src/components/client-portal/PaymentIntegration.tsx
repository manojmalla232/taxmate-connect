import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Lock, CheckCircle, AlertCircle, DollarSign, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type PaymentMethod = 'credit-card' | 'bank-transfer' | 'paypal';

type Invoice = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
  paidDate?: string;
};

const PaymentIntegration: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  
  // Sample invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      description: 'Tax Return Preparation - FY 2023-2024',
      amount: 350,
      dueDate: '2024-09-15',
      status: 'unpaid'
    },
    {
      id: 'INV-2024-002',
      description: 'Tax Planning Consultation',
      amount: 150,
      dueDate: '2024-08-30',
      status: 'overdue'
    },
    {
      id: 'INV-2023-005',
      description: 'Tax Return Preparation - FY 2022-2023',
      amount: 320,
      dueDate: '2023-10-10',
      status: 'paid',
      paidDate: '2023-10-05'
    }
  ]);
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    } else {
      return digits;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow up to 3 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };
  
  const validateForm = () => {
    if (paymentMethod === 'credit-card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid 16-digit card number",
          variant: "destructive"
        });
        return false;
      }
      
      if (!cardName) {
        toast({
          title: "Missing cardholder name",
          description: "Please enter the cardholder name",
          variant: "destructive"
        });
        return false;
      }
      
      if (!expiryDate || expiryDate.length !== 5) {
        toast({
          title: "Invalid expiry date",
          description: "Please enter a valid expiry date (MM/YY)",
          variant: "destructive"
        });
        return false;
      }
      
      if (!cvv || cvv.length !== 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid 3-digit CVV",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handlePayment = (invoiceId: string) => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Update invoice status
      setInvoices(invoices.map(invoice => 
        invoice.id === invoiceId 
          ? { 
              ...invoice, 
              status: 'paid', 
              paidDate: new Date().toISOString().split('T')[0] 
            } 
          : invoice
      ));
      
      setIsProcessing(false);
      setShowConfirmation(true);
      
      // Reset form
      setCardNumber('');
      setCardName('');
      setExpiryDate('');
      setCvv('');
      
      toast({
        title: "Payment successful",
        description: `Your payment for invoice ${invoiceId} has been processed successfully`
      });
    }, 2000);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600">
            Paid
          </span>
        );
      case 'unpaid':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-600">
            Unpaid
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-50 text-red-600">
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Payments & Invoices</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your payments and view invoices</p>
      </div>
      
      <div className="p-6">
        {!showConfirmation ? (
          <div className="space-y-8">
            {/* Invoices list */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Invoices</h3>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.id} 
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{invoice.description}</h4>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Receipt size={14} className="mr-1" />
                          <span>{invoice.id}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar size={14} className="mr-1" />
                          <span>Due: {invoice.dueDate}</span>
                        </div>
                        {invoice.paidDate && (
                          <div className="flex items-center text-sm text-green-600 mt-1">
                            <CheckCircle size={14} className="mr-1" />
                            <span>Paid on {invoice.paidDate}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-xl font-semibold">${invoice.amount.toFixed(2)}</div>
                        {invoice.status !== 'paid' && (
                          <Button 
                            className="bg-blue-accent hover:bg-blue-accent/90"
                            disabled={isProcessing}
                            onClick={() => handlePayment(invoice.id)}
                          >
                            {isProcessing ? 'Processing...' : 'Pay Now'}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Payment form for unpaid invoices */}
                    {invoice.status !== 'paid' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <Select
                              value={paymentMethod}
                              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="credit-card">
                                  <div className="flex items-center">
                                    <CreditCard size={16} className="mr-2" />
                                    <span>Credit Card</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="bank-transfer">
                                  <div className="flex items-center">
                                    <DollarSign size={16} className="mr-2" />
                                    <span>Bank Transfer</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="paypal">
                                  <div className="flex items-center">
                                    <DollarSign size={16} className="mr-2" />
                                    <span>PayPal</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {paymentMethod === 'credit-card' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="card-number">
                                  Card Number
                                </label>
                                <div className="relative">
                                  <Input
                                    id="card-number"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    placeholder="1234 5678 9012 3456"
                                    className="pl-10"
                                    maxLength={19}
                                  />
                                  <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                              </div>
                              
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="card-name">
                                  Cardholder Name
                                </label>
                                <Input
                                  id="card-name"
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}
                                  placeholder="John Smith"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expiry-date">
                                  Expiry Date
                                </label>
                                <Input
                                  id="expiry-date"
                                  value={expiryDate}
                                  onChange={handleExpiryDateChange}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cvv">
                                  CVV
                                </label>
                                <div className="relative">
                                  <Input
                                    id="cvv"
                                    value={cvv}
                                    onChange={handleCvvChange}
                                    placeholder="123"
                                    className="pl-10"
                                    maxLength={3}
                                    type="password"
                                  />
                                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {paymentMethod === 'bank-transfer' && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-medium text-blue-700 mb-2">Bank Transfer Details</h4>
                              <p className="text-sm text-blue-600 mb-1">Account Name: TaxMate Connect Pty Ltd</p>
                              <p className="text-sm text-blue-600 mb-1">BSB: 123-456</p>
                              <p className="text-sm text-blue-600 mb-1">Account Number: 12345678</p>
                              <p className="text-sm text-blue-600 mb-1">Reference: {invoice.id}</p>
                              <p className="text-sm text-blue-600 mt-3">Please allow 1-2 business days for processing</p>
                            </div>
                          )}
                          
                          {paymentMethod === 'paypal' && (
                            <div className="text-center">
                              <Button className="bg-blue-500 hover:bg-blue-600">
                                Continue to PayPal
                              </Button>
                              <p className="text-xs text-gray-500 mt-2">You will be redirected to PayPal to complete your payment</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
            <Button
              onClick={() => setShowConfirmation(false)}
              className="bg-blue-accent hover:bg-blue-accent/90"
            >
              View Invoices
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentIntegration;