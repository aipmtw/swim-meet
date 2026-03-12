import React, { useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { generateLSTRslt, parseLSTRslt } from '../data/lstrslt';

export default function LSTRsltViewer({ simData, allEvents }) {
  const { lang } = useLanguage();
  const [showParsed, setShowParsed] = useState(false);

  const rawText = useMemo(() => generateLSTRslt(simData, allEvents), [simData, allEvents]);
  const parsedRecords = useMemo(() => parseLSTRslt(rawText), [rawText]);
  const lineCount = rawText ? rawText.split('\n').filter((l) => l.trim()).length : 0;

  const handleDownload = () => {
    const blob = new Blob([rawText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LSTRslt.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!rawText) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-6 text-center text-sm text-gray-400">
        {lang === 'zh' ? '尚無成績資料，請先執行模擬' : 'No result data yet. Run simulation first.'}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-gray-800">LSTRslt.txt</span>
          <span className="text-xs text-gray-500">
            {lineCount} {lang === 'zh' ? '筆紀錄' : 'records'}
            {parsedRecords.length < lineCount && (
              <span className="text-orange-500 ml-1">
                ({lineCount - parsedRecords.length} {lang === 'zh' ? '筆無效 lap=0' : 'invalid lap=0'})
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowParsed(!showParsed)}
            className="px-3 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50"
          >
            {showParsed
              ? (lang === 'zh' ? '原始格式' : 'Raw Text')
              : (lang === 'zh' ? '解析檢視' : 'Parsed View')}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {lang === 'zh' ? '下載 LSTRslt.txt' : 'Download LSTRslt.txt'}
          </button>
        </div>
      </div>

      {/* Content */}
      {!showParsed ? (
        <pre className="p-4 text-xs text-gray-700 font-mono max-h-96 overflow-auto whitespace-pre-wrap bg-gray-900 text-green-400">
          {rawText}
        </pre>
      ) : (
        <div className="overflow-x-auto max-h-96 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-left text-gray-600 border-b">
                <th className="px-3 py-2 font-medium">event</th>
                <th className="px-3 py-2 font-medium">heat</th>
                <th className="px-3 py-2 font-medium">lap</th>
                <th className="px-3 py-2 font-medium">lane</th>
                <th className="px-3 py-2 font-medium">rank</th>
                <th className="px-3 py-2 font-medium">result</th>
              </tr>
            </thead>
            <tbody>
              {parsedRecords.map((r, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-1.5">{r.event}</td>
                  <td className="px-3 py-1.5">{r.heat}</td>
                  <td className="px-3 py-1.5">{r.lap}</td>
                  <td className="px-3 py-1.5">{r.lane}</td>
                  <td className="px-3 py-1.5 font-semibold">{r.rank}</td>
                  <td className="px-3 py-1.5 font-bold">{r.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
