
import { toast } from "sonner";

export interface TaxReturn {
  id: number;
  clientName: string;
  clientId: number;
  taxYear: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
  submissionDate?: string;
  totalIncome: number;
  totalDeductions: number;
  taxPayable: number;
  refundAmount: number;
  notes?: string;
  documents: {
    id: number;
    name: string;
    uploadDate: string;
    size: string;
  }[];
  timeline: {
    date: string;
    action: string;
    user: string;
  }[];
  questions?: {
    id: number;
    question: string;
    timestamp: string;
  }[];
  visaType?: string;
  residencyStatus?: string;
}

// Mock data that would normally come from an API
const mockTaxReturns: TaxReturn[] = [
  {
    id: 1,
    clientId: 101,
    clientName: 'James Wilson',
    taxYear: '2023-2024',
    status: 'completed',
    dueDate: '2024-10-31',
    submissionDate: '2024-09-15',
    totalIncome: 85000,
    totalDeductions: 7500,
    taxPayable: 22100,
    refundAmount: 1200,
    visaType: '485 Graduate Visa',
    residencyStatus: 'Foreign Resident',
    documents: [
      { id: 1, name: 'Income Statement.pdf', uploadDate: '2024-08-10', size: '2.4 MB' },
      { id: 2, name: 'Work-related Expenses.pdf', uploadDate: '2024-08-12', size: '1.8 MB' },
      { id: 3, name: 'Visa Document.pdf', uploadDate: '2024-08-15', size: '3.1 MB' }
    ],
    notes: 'Client has a 485 visa. Eligible for foreign resident tax rates for part of the year.',
    timeline: [
      { date: '2024-08-10', action: 'Tax return created', user: 'John Agent' },
      { date: '2024-08-15', action: 'Documents uploaded', user: 'James Wilson' },
      { date: '2024-09-10', action: 'Tax calculation completed', user: 'John Agent' },
      { date: '2024-09-15', action: 'Submitted to ATO', user: 'John Agent' }
    ],
    questions: [
      {
        id: 1,
        question: 'Have you received income statements from all employers for this financial year?',
        timestamp: '2024-08-10 09:15'
      }
    ]
  },
  {
    id: 2,
    clientId: 102,
    clientName: 'Sarah Chen',
    taxYear: '2023-2024',
    status: 'in-progress',
    dueDate: '2024-10-31',
    totalIncome: 92000,
    totalDeductions: 4200,
    taxPayable: 25800,
    refundAmount: 0,
    visaType: '482 Temporary Skill Shortage',
    residencyStatus: 'Temporary Resident',
    documents: [
      { id: 4, name: 'Employment Contract.pdf', uploadDate: '2024-08-05', size: '1.7 MB' },
      { id: 5, name: 'Bank Statements.pdf', uploadDate: '2024-08-08', size: '3.5 MB' }
    ],
    notes: 'Client needs to provide additional documentation for overseas income.',
    timeline: [
      { date: '2024-08-01', action: 'Tax return created', user: 'John Agent' },
      { date: '2024-08-08', action: 'Documents uploaded', user: 'Sarah Chen' },
      { date: '2024-09-02', action: 'Requested additional documents', user: 'John Agent' }
    ],
    questions: [
      {
        id: 1,
        question: 'Do you have any overseas income to declare?',
        timestamp: '2024-08-01 10:30'
      }
    ]
  },
  {
    id: 3,
    clientId: 103,
    clientName: 'Robert Johnson',
    taxYear: '2023-2024',
    status: 'pending',
    dueDate: '2024-10-31',
    totalIncome: 68000,
    totalDeductions: 3100,
    taxPayable: 16400,
    refundAmount: 500,
    visaType: '500 Student Visa',
    residencyStatus: 'Foreign Resident',
    documents: [
      { id: 6, name: 'Student ID.pdf', uploadDate: '2024-08-20', size: '1.1 MB' }
    ],
    notes: 'Awaiting employment documentation from client.',
    timeline: [
      { date: '2024-08-15', action: 'Tax return created', user: 'John Agent' },
      { date: '2024-08-20', action: 'Initial documents uploaded', user: 'Robert Johnson' }
    ],
    questions: [
      {
        id: 1,
        question: 'Are you currently enrolled as a full-time student?',
        timestamp: '2024-08-15 14:20'
      }
    ]
  },
  {
    id: 4,
    clientId: 104,
    clientName: 'Emily Patel',
    taxYear: '2023-2024',
    status: 'completed',
    dueDate: '2024-10-31',
    submissionDate: '2024-09-05',
    totalIncome: 110000,
    totalDeductions: 9800,
    taxPayable: 32600,
    refundAmount: 2100,
    visaType: '189 Skilled Independent',
    residencyStatus: 'Resident',
    documents: [
      { id: 7, name: 'PAYG Summary.pdf', uploadDate: '2024-08-01', size: '2.2 MB' },
      { id: 8, name: 'Investment Income.pdf', uploadDate: '2024-08-03', size: '1.6 MB' },
      { id: 9, name: 'Visa Grant Notice.pdf', uploadDate: '2024-08-05', size: '1.3 MB' }
    ],
    notes: 'Client recently obtained PR. Eligible for full resident tax rates.',
    timeline: [
      { date: '2024-07-25', action: 'Tax return created', user: 'John Agent' },
      { date: '2024-08-05', action: 'Documents uploaded', user: 'Emily Patel' },
      { date: '2024-08-30', action: 'Tax calculation completed', user: 'John Agent' },
      { date: '2024-09-05', action: 'Submitted to ATO', user: 'John Agent' }
    ],
    questions: [
      {
        id: 1,
        question: 'Have you received your permanent residency this financial year?',
        timestamp: '2024-07-25 11:45'
      }
    ]
  },
  {
    id: 5,
    clientId: 105,
    clientName: 'Michael Scott',
    taxYear: '2023-2024',
    status: 'pending',
    dueDate: '2024-10-31',
    totalIncome: 76000,
    totalDeductions: 5300,
    taxPayable: 19600,
    refundAmount: 0,
    visaType: '417 Working Holiday',
    residencyStatus: 'Foreign Resident',
    documents: [],
    notes: 'Client needs to provide all documentation. Working holiday tax rates apply.',
    timeline: [
      { date: '2024-08-20', action: 'Tax return created', user: 'John Agent' }
    ],
    questions: [
      {
        id: 1,
        question: 'Are you on a working holiday visa for the entire financial year?',
        timestamp: '2024-08-20 15:10'
      }
    ]
  }
];

export const getTaxReturns = () => {
  // In a real app, this would be an API call
  return Promise.resolve(mockTaxReturns);
};

export const getTaxReturnById = (id: number) => {
  const taxReturn = mockTaxReturns.find(tr => tr.id === id);
  
  if (!taxReturn) {
    return Promise.reject(new Error('Tax return not found'));
  }
  
  return Promise.resolve(taxReturn);
};

export const createTaxReturn = (taxReturn: Omit<TaxReturn, 'id'>) => {
  // In a real app, this would be an API call
  // For demo purposes, we'll just pretend it was created
  toast.success('Tax return created successfully');
  return Promise.resolve({ ...taxReturn, id: Math.floor(Math.random() * 1000) });
};

export const updateTaxReturn = (id: number, updates: Partial<TaxReturn>) => {
  // In a real app, this would be an API call
  toast.success('Tax return updated successfully');
  return Promise.resolve({ id, ...updates });
};

export const uploadDocument = (taxReturnId: number, file: File) => {
  // In a real app, this would upload the file to storage
  // and create a document record
  toast.success(`Document "${file.name}" uploaded successfully`);
  return Promise.resolve({
    id: Math.floor(Math.random() * 1000),
    name: file.name,
    uploadDate: new Date().toISOString().split('T')[0],
    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
  });
};
