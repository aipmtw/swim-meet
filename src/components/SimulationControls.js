import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function SimulationControls({
  isRunning,
  onStart,
  onStop,
  onReset,
  onNextEvent,
  onSimulateAll,
  currentEvent,
  totalEvents,
  speed,
  onSpeedChange,
  swimmerRange,
  onSwimmerRangeChange,
}) {
  const { t, lang } = useLanguage();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-blue-800">{t('simulation')}</span>
          {isRunning && (
            <span className="flex items-center gap-1.5 text-sm text-blue-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              {t('simRunning')} Event {currentEvent} / {totalEvents}
            </span>
          )}
          {!isRunning && (
            <span className="text-sm text-gray-500">
              {t('simStopped')} — Event {currentEvent} / {totalEvents}
            </span>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Manual: Next Event button */}
        <button
          onClick={onNextEvent}
          disabled={isRunning || currentEvent > totalEvents}
          className="px-4 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {lang === 'zh' ? '下一場' : 'Next Event'}
        </button>

        {/* Auto simulation */}
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={currentEvent > totalEvents}
            className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {lang === 'zh' ? '自動模擬' : 'Auto Simulate'}
          </button>
        ) : (
          <button
            onClick={onStop}
            className="px-4 py-1.5 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            {t('stopSim')}
          </button>
        )}

        {/* Simulate all at once */}
        <button
          onClick={onSimulateAll}
          disabled={isRunning}
          className="px-4 py-1.5 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {lang === 'zh' ? '一次模擬全部' : 'Simulate All'}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {t('resetSim')}
        </button>

        {/* Speed control */}
        <div className="flex items-center gap-2 ml-4">
          <label className="text-xs text-gray-600">
            {lang === 'zh' ? '速度' : 'Speed'}:
          </label>
          <select
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1"
            disabled={isRunning}
          >
            <option value={5000}>1x (5s)</option>
            <option value={3000}>2x (3s)</option>
            <option value={1500}>3x (1.5s)</option>
            <option value={800}>5x (0.8s)</option>
            <option value={300}>10x (0.3s)</option>
          </select>
        </div>
      </div>

      {/* Swimmer count range */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <label className="text-xs font-medium text-gray-600">
          {lang === 'zh' ? '每場報名人數區間' : 'Swimmers per event'}:
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">{lang === 'zh' ? '最少' : 'Min'}</span>
          <input
            type="number"
            min={1}
            max={swimmerRange.max}
            value={swimmerRange.min}
            onChange={(e) => {
              const val = Math.max(1, Math.min(Number(e.target.value), swimmerRange.max));
              onSwimmerRangeChange({ ...swimmerRange, min: val });
            }}
            disabled={isRunning}
            className="w-16 text-sm border border-gray-300 rounded px-2 py-1 text-center disabled:opacity-50"
          />
          <span className="text-gray-400">—</span>
          <span className="text-xs text-gray-500">{lang === 'zh' ? '最多' : 'Max'}</span>
          <input
            type="number"
            min={swimmerRange.min}
            max={60}
            value={swimmerRange.max}
            onChange={(e) => {
              const val = Math.max(swimmerRange.min, Math.min(Number(e.target.value), 60));
              onSwimmerRangeChange({ ...swimmerRange, max: val });
            }}
            disabled={isRunning}
            className="w-16 text-sm border border-gray-300 rounded px-2 py-1 text-center disabled:opacity-50"
          />
          <span className="text-xs text-gray-400 ml-1">
            {lang === 'zh'
              ? `(${Math.ceil(swimmerRange.min / 6)}~${Math.ceil(swimmerRange.max / 6)} 組/Round)`
              : `(${Math.ceil(swimmerRange.min / 6)}~${Math.ceil(swimmerRange.max / 6)} rounds)`}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full bg-blue-100 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(((currentEvent - 1) / totalEvents) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
