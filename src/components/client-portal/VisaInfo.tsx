
import React from 'react';
import { File, ExternalLink, Info, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VisaInfoProps {
  visaType: string;
}

const VisaInfo: React.FC<VisaInfoProps> = ({ visaType }) => {
  // Information specific to different visa types
  const visaInfoMap: Record<string, {
    title: string;
    description: string;
    eligibility: Array<{ item: string; eligible: boolean }>;
    taxGuidelines: string[];
    links: Array<{ title: string; url: string }>;
  }> = {
    '482 Visa': {
      title: 'Temporary Skill Shortage (TSS) Visa (Subclass 482)',
      description: 'The 482 visa is a temporary visa that allows skilled workers to come to Australia to work in their nominated occupation for their approved sponsor. It has significant tax implications for the holder.',
      eligibility: [
        { item: 'Medicare Levy', eligible: true },
        { item: 'Low Income Tax Offset', eligible: true },
        { item: 'HELP/HECS Debt Repayments', eligible: false },
        { item: 'Foreign Income Exemptions', eligible: false }
      ],
      taxGuidelines: [
        'You are generally considered an Australian resident for tax purposes if you have been in Australia for more than 183 days in the income year.',
        'As a resident for tax purposes, you are required to declare all income earned both in Australia and overseas.',
        'The first $18,200 of your income is tax-free (tax-free threshold).',
        'You may be entitled to claim deductions for work-related expenses.',
        'If you maintain financial ties to your home country, you may be eligible for certain foreign income exemptions.'
      ],
      links: [
        { 
          title: 'ATO Guide for Foreign Residents', 
          url: 'https://www.ato.gov.au/Individuals/International-tax-for-individuals/In-detail/Residency/Foreign-Residents/' 
        },
        { 
          title: '482 Visa Holders Tax Guide', 
          url: 'https://www.ato.gov.au/Individuals/International-tax-for-individuals/' 
        }
      ]
    },
    'Student Visa': {
      title: 'Student Visa (Subclass 500)',
      description: 'The student visa allows international students to study in Australia at a registered educational institution. There are specific tax rules that apply to student visa holders.',
      eligibility: [
        { item: 'Medicare Levy', eligible: false },
        { item: 'Low Income Tax Offset', eligible: true },
        { item: 'Work Hour Restrictions', eligible: true },
        { item: 'Tax-Free Threshold', eligible: true }
      ],
      taxGuidelines: [
        'You are generally considered an Australian resident for tax purposes if you have been in Australia for more than 183 days in the income year.',
        'You can work up to 48 hours per fortnight while your course is in session.',
        'You are entitled to the tax-free threshold, meaning the first $18,200 of your income is tax-free.',
        'You generally don\'t have to pay the Medicare Levy if you\'re not eligible for Medicare benefits.',
        'You need to lodge a tax return if your income exceeds the tax-free threshold.'
      ],
      links: [
        { 
          title: 'ATO Guide for Students', 
          url: 'https://www.ato.gov.au/Individuals/International-tax-for-individuals/In-detail/Australian-study-and-training-support-loans/International-education-providers/' 
        },
        { 
          title: 'Student Visa Work Rights', 
          url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500' 
        }
      ]
    },
    'Working Holiday': {
      title: 'Working Holiday Visa (Subclass 417)',
      description: 'The Working Holiday visa is a temporary visa for young adults who want to holiday and work in Australia for up to 12 months. Working Holiday Makers are subject to special tax rates.',
      eligibility: [
        { item: 'Medicare Levy', eligible: false },
        { item: 'Special Working Holiday Tax Rate', eligible: true },
        { item: 'Tax-Free Threshold', eligible: false },
        { item: 'Superannuation Withdrawal', eligible: true }
      ],
      taxGuidelines: [
        'Working Holiday Makers are taxed at 15% on earnings up to $45,000, and then at regular foreign resident rates for amounts above that.',
        'You are not entitled to the tax-free threshold.',
        'You can generally access your superannuation when you leave Australia permanently.',
        'You need to declare worldwide income earned while an Australian resident for tax purposes.',
        'You need to provide your employer with your Tax File Number (TFN).'
      ],
      links: [
        { 
          title: 'Working Holiday Maker Tax Guide', 
          url: 'https://www.ato.gov.au/Individuals/International-tax-for-individuals/Coming-to-Australia/Working-holiday-makers/' 
        },
        { 
          title: 'Superannuation for Temporary Residents', 
          url: 'https://www.ato.gov.au/Individuals/Super/In-detail/Temporary-residents-and-super/Super-information-for-temporary-residents-departing-Australia/' 
        }
      ]
    },
    // Default information for other visa types
    'default': {
      title: 'Visa Tax Information',
      description: 'Tax implications vary based on your specific visa type and personal circumstances. Your tax agent can provide personalized guidance based on your situation.',
      eligibility: [
        { item: 'Medicare Levy', eligible: true },
        { item: 'Tax-Free Threshold', eligible: true },
        { item: 'Foreign Income Reporting', eligible: true }
      ],
      taxGuidelines: [
        'Your tax residency status determines how you\'re taxed in Australia.',
        'Generally, Australian residents are taxed on worldwide income, while foreign residents are taxed only on Australian-sourced income.',
        'Different visa types have different tax implications and eligibility for offsets and deductions.',
        'You may be subject to tax in both Australia and your home country, depending on tax treaties between the countries.',
        'Keeping detailed records of income and expenses is essential for accurate tax reporting.'
      ],
      links: [
        { 
          title: 'ATO Guide for Foreign Residents', 
          url: 'https://www.ato.gov.au/Individuals/International-tax-for-individuals/In-detail/Residency/Foreign-Residents/' 
        },
        { 
          title: 'Visa and Immigration Information', 
          url: 'https://immi.homeaffairs.gov.au/' 
        }
      ]
    }
  };

  // Get the appropriate info based on visa type, or use default if not found
  const info = visaInfoMap[visaType] || visaInfoMap['default'];

  return (
    <div className="bg-white rounded-xl shadow-card">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{info.title}</h2>
        <p className="text-gray-600 mt-1">{info.description}</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Eligibility</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-3">
                {info.eligibility.map((item, index) => (
                  <li key={index} className="flex items-start">
                    {item.eligible ? (
                      <CheckCircle size={18} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-gray-700">{item.item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Useful Resources</h3>
            <div className="space-y-3">
              {info.links.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <File size={18} className="text-blue-accent mr-3 flex-shrink-0" />
                  <span className="text-gray-700 flex-1">{link.title}</span>
                  <ExternalLink size={16} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Guidelines</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex mb-3">
                <Info size={18} className="text-blue-accent mt-0.5 mr-2 flex-shrink-0" />
                <h4 className="font-medium text-blue-800">Important Information for {visaType} Holders</h4>
              </div>
              <ul className="space-y-2">
                {info.taxGuidelines.map((guideline, index) => (
                  <li key={index} className="text-sm text-blue-700 pl-6 relative">
                    <span className="absolute left-0 top-2 w-2 h-2 rounded-full bg-blue-400"></span>
                    {guideline}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-4">
                  Tax regulations for visa holders can be complex. Your tax agent can provide 
                  personalized advice based on your specific circumstances.
                </p>
                <Button className="bg-blue-accent hover:bg-blue-accent/90">
                  Message Your Tax Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaInfo;
