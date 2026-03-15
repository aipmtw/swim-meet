import React, { useState, useRef } from 'react';
import { parseCSV } from '../utils/csvParser';

export default function CsvImporter({ title, description, templateUrl, expectedHeaders, onImport, lang }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [imported, setImported] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setImported(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = parseCSV(ev.target.result);
        if (result.rows.length === 0) {
          setError(lang === 'zh' ? '檔案無資料列' : 'No data rows found');
          return;
        }
        // Validate headers
        if (expectedHeaders) {
          const missing = expectedHeaders.filter((h) => !result.headers.includes(h));
          if (missing.length > 0) {
            setError(
              (lang === 'zh' ? '缺少欄位：' : 'Missing columns: ') + missing.join(', ')
            );
            return;
          }
        }
        setData(result);
      } catch (err) {
        setError((lang === 'zh' ? '解析錯誤：' : 'Parse error: ') + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (data && onImport) {
      onImport(data.rows);
      setImported(true);
    }
  };

  const handleClear = () => {
    setData(null);
    setError(null);
    setImported(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        {templateUrl && (
          <a
            href={templateUrl}
            download
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {lang === 'zh' ? '下載範本 CSV' : 'Download Template CSV'}
          </a>
        )}
      </div>
      {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}

      <div className="flex items-center gap-3 mb-3">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFile}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {data && !imported && (
          <button
            onClick={handleImport}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            {lang === 'zh' ? `匯入 ${data.rows.length} 筆` : `Import ${data.rows.length} rows`}
          </button>
        )}
        {data && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
          >
            {lang === 'zh' ? '清除' : 'Clear'}
          </button>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3">{error}</div>
      )}

      {imported && (
        <div className="text-sm text-green-700 bg-green-50 p-2 rounded mb-3">
          {lang === 'zh' ? '匯入成功！' : 'Import successful!'}
        </div>
      )}

      {data && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {data.headers.map((h) => (
                  <th key={h} className="border border-gray-200 px-2 py-1 text-left font-medium text-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.slice(0, 20).map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {data.headers.map((h) => (
                    <td key={h} className="border border-gray-200 px-2 py-1 text-gray-600">
                      {row[h]}
                    </td>
                  ))}
                </tr>
              ))}
              {data.rows.length > 20 && (
                <tr>
                  <td colSpan={data.headers.length} className="text-center text-gray-400 py-2 text-xs">
                    {lang === 'zh'
                      ? `... 共 ${data.rows.length} 筆，僅顯示前 20 筆`
                      : `... ${data.rows.length} total rows, showing first 20`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
