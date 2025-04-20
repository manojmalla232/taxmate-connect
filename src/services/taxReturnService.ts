import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type TaxReturnRow = Database['public']['Tables']['tax_returns']['Row'];

export interface TaxReturn {
  id: string;
  clientName: string;
  clientId: string;
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
    id: string;
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

// Get all tax returns for the current user
export async function getTaxReturns(userId: string) {
  const { data, error } = await supabase
    .from('tax_returns')
    .select('*')
    .eq('client_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Get a single tax return by id
export async function getTaxReturnById(id: string) {
  const { data, error } = await supabase
    .from('tax_returns')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Create a new tax return
export async function createTaxReturn(payload: Omit<TaxReturnRow, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('tax_returns')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update a tax return
export async function updateTaxReturn(id: string, updates: Partial<TaxReturnRow>) {
  const { data, error } = await supabase
    .from('tax_returns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Upload a document for a tax return
export async function uploadDocument(taxReturnId: string, file: File, uploaderId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${taxReturnId}/${Date.now()}.${fileExt}`;
  // Upload file to Supabase Storage (requires bucket setup)
  const { data: storageData, error: storageError } = await supabase.storage
    .from('documents')
    .upload(fileName, file);
  if (storageError) throw storageError;
  // Insert document record
  const { data, error } = await supabase
    .from('documents')
    .insert({
      file_name: file.name,
      file_url: storageData?.path || '',
      tax_return_id: taxReturnId,
      uploader_id: uploaderId,
      uploaded_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
