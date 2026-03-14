import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Header({ activeTab, onTabChange, lastUpdated }) {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Title */}
          <div className="flex items-center gap-4">
            <a href="https://aipm.com.tw/" className="text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition no-underline">← aipm.com.tw</a>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-sm text-gray-500">{t('subtitle')}</p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Navigation tabs */}
            <nav className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['live', 'results', 'awards', 'lstrslt'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t(tab)}
                </button>
              ))}
            </nav>

            {/* Update time */}
            {lastUpdated && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                {t('updated')}: {lastUpdated}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
