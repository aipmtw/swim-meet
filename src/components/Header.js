import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Header({ activeTab, onTabChange, lastUpdated }) {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
              {['live', 'results', 'awards'].map((tab) => (
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

            {/* Time display */}
            <div className="flex flex-col text-sm text-gray-500">
              {lastUpdated && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                  {t('updated')}: {lastUpdated}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                {t('now')}: {currentTime}
              </div>
            </div>

            {/* Admin Portal link */}
            <button
              onClick={() => onTabChange('admin')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              {t('adminPortal')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
