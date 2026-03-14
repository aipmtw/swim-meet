import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LSTRsltViewer from '../components/LSTRsltViewer';

export default function AdminPortal({ simData, allEvents }) {
  const { lang } = useLanguage();

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {lang === 'zh' ? '管理後台 Admin Portal' : 'Admin Portal'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {lang === 'zh'
            ? '管理工具與原始資料檢視'
            : 'Management tools and raw data viewer'}
        </p>
      </div>

      {/* LSTRslt.txt Viewer */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">LSTRslt.txt Viewer</h3>
        <LSTRsltViewer simData={simData} allEvents={allEvents} />
      </div>
    </div>
  );
}
