'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function MatchReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 border-l-4 border-primary pl-4">Match Reports</h1>
          <p className="text-neutral-500 mt-2">Generate and download standard reports across all competitions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Overall Registration Summary', desc: 'View complete metrics on total shooter registrations mapped across ongoing tournaments.', label: 'Download PDF' },
          { title: 'Fee Collection Report', desc: 'Financial overview of approved versus pending payments and gateway transactions.', label: 'Download CSV' },
          { title: 'Shooter Verification Audit', desc: 'A complete state-wise breakdown of user completion status and registration milestones.', label: 'Export Excel' },
        ].map(({ title, desc, label }) => (
          <div key={title} className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-neutral-800">{title}</h3>
              <FileText className="h-5 w-5 text-neutral-400 flex-shrink-0" />
            </div>
            <p className="text-sm text-neutral-500 mb-4">{desc}</p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              <Download className="h-4 w-4" /> {label}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-neutral-50 p-8 rounded-lg text-center border border-neutral-200">
        <h3 className="text-xl font-semibold mb-2">Need a Custom Report?</h3>
        <p className="text-neutral-500 max-w-xl mx-auto mb-4">
          If you need specific data slicing for an offline event committee, you can navigate to the respective Competition page to generate granular match-specific PDF exports.
        </p>
      </div>
    </div>
  );
}
