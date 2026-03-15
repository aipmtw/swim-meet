import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LSTRsltViewer from '../components/LSTRsltViewer';
import CsvImporter from '../components/CsvImporter';

const SECTIONS = [
  { key: 'school', labelZh: '學校資訊', labelEn: 'School Participate' },
  { key: 'individual_events', labelZh: '個人賽項目', labelEn: 'Individual Events' },
  { key: 'relay_events', labelZh: '團體賽項目', labelEn: 'Relay Events' },
  { key: 'registration', labelZh: '報名匯入', labelEn: 'Registration' },
  { key: 'events', labelZh: '賽程管理', labelEn: 'Events' },
  { key: 'lstrslt', labelZh: '原始資料', labelEn: 'LSTRslt Viewer' },
];

export default function AdminPortal({ simData, allEvents }) {
  const { lang } = useLanguage();
  const [activeSection, setActiveSection] = useState('school');
  const [importedData, setImportedData] = useState({
    schools: [],
    individualEvents: [],
    relayEvents: [],
    individualReg: [],
    relayReg: [],
    events: [],
  });

  const handleImport = (key, rows) => {
    setImportedData((prev) => ({ ...prev, [key]: rows }));
  };

  const basePath = process.env.PUBLIC_URL || '';

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {lang === 'zh' ? '管理後台 Admin Portal' : 'Admin Portal'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {lang === 'zh'
            ? 'CSV 批次匯入與管理工具'
            : 'CSV batch import and management tools'}
        </p>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200 pb-2">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-3 py-1.5 text-sm rounded-t transition-colors ${
              activeSection === s.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {lang === 'zh' ? s.labelZh : s.labelEn}
          </button>
        ))}
      </div>

      {/* 1. School Participate */}
      {activeSection === 'school' && (
        <CsvImporter
          title={lang === 'zh' ? '1. 參賽學校資訊 School Participate' : '1. School Participate'}
          description={
            lang === 'zh'
              ? '批次匯入參賽學校資訊：學校名稱、ES人數、MS人數、Total人數、教練名字、Email'
              : 'Batch import participating schools: School Name, ES Count, MS Count, Total, Coach Name, Email'
          }
          templateUrl={`${basePath}/templates/school_participate.csv`}
          expectedHeaders={['School Name', 'ES Count', 'MS Count', 'Total', 'Coach Name', 'Email']}
          onImport={(rows) => handleImport('schools', rows)}
          lang={lang}
        />
      )}

      {activeSection === 'school' && importedData.schools.length > 0 && (
        <DataSummary
          label={lang === 'zh' ? '已匯入學校' : 'Imported Schools'}
          count={importedData.schools.length}
          lang={lang}
        />
      )}

      {/* 2. Individual Events */}
      {activeSection === 'individual_events' && (
        <CsvImporter
          title={lang === 'zh' ? '2. 個人賽分組 Individual Events' : '2. Individual Events'}
          description={
            lang === 'zh'
              ? '批次匯入個人賽分組（ES/MS）、性別（Boys/Girls）及賽程名稱'
              : 'Batch import individual event categories by division (ES/MS), gender, and event name'
          }
          templateUrl={`${basePath}/templates/individual_events.csv`}
          expectedHeaders={['Division', 'Gender', 'Event Name']}
          onImport={(rows) => handleImport('individualEvents', rows)}
          lang={lang}
        />
      )}

      {activeSection === 'individual_events' && importedData.individualEvents.length > 0 && (
        <DataSummary
          label={lang === 'zh' ? '已匯入個人賽項目' : 'Imported Individual Events'}
          count={importedData.individualEvents.length}
          lang={lang}
        />
      )}

      {/* 3. Relay Events */}
      {activeSection === 'relay_events' && (
        <CsvImporter
          title={lang === 'zh' ? '3. 團體賽 Relay Events' : '3. Relay Events'}
          description={
            lang === 'zh'
              ? '批次匯入團體賽分組：ES Boys/Girls Team、MS Boys/Girls Team、ES/MS Mixed'
              : 'Batch import relay events by division: ES/MS Boys/Girls Team, Mixed'
          }
          templateUrl={`${basePath}/templates/relay_events.csv`}
          expectedHeaders={['Division', 'Events']}
          onImport={(rows) => handleImport('relayEvents', rows)}
          lang={lang}
        />
      )}

      {activeSection === 'relay_events' && importedData.relayEvents.length > 0 && (
        <DataSummary
          label={lang === 'zh' ? '已匯入團體賽項目' : 'Imported Relay Events'}
          count={importedData.relayEvents.length}
          lang={lang}
        />
      )}

      {/* 4. Registration */}
      {activeSection === 'registration' && (
        <>
          <CsvImporter
            title={
              lang === 'zh'
                ? '4a. 個人賽報名 Individual Registration'
                : '4a. Individual Registration'
            }
            description={
              lang === 'zh'
                ? '批次匯入個人賽報名：選手姓名、學校、性別、出生日期、比賽項目與參考成績（最多3項）'
                : 'Batch import individual registrations: name, school, gender, DOB, up to 3 events with reference scores'
            }
            templateUrl={`${basePath}/templates/individual_registration.csv`}
            expectedHeaders={['Family Name', 'Given Name', 'School', 'Gender', 'Date of Birth', 'Event 1']}
            onImport={(rows) => handleImport('individualReg', rows)}
            lang={lang}
          />

          {importedData.individualReg.length > 0 && (
            <DataSummary
              label={lang === 'zh' ? '已匯入個人報名' : 'Imported Individual Registrations'}
              count={importedData.individualReg.length}
              lang={lang}
            />
          )}

          <CsvImporter
            title={
              lang === 'zh'
                ? '4b. 團體賽報名 Relay Registration'
                : '4b. Relay Registration'
            }
            description={
              lang === 'zh'
                ? '批次匯入團體賽報名：分組、賽程、隊伍名稱、選手順序、參考成績'
                : 'Batch import relay registrations: division, event, team, name order, reference score'
            }
            templateUrl={`${basePath}/templates/relay_registration.csv`}
            expectedHeaders={['Division', 'Events', 'Team Name', 'Name Order', 'Ref Score']}
            onImport={(rows) => handleImport('relayReg', rows)}
            lang={lang}
          />

          {importedData.relayReg.length > 0 && (
            <DataSummary
              label={lang === 'zh' ? '已匯入團體報名' : 'Imported Relay Registrations'}
              count={importedData.relayReg.length}
              lang={lang}
            />
          )}
        </>
      )}

      {/* 5. Events */}
      {activeSection === 'events' && (
        <CsvImporter
          title={lang === 'zh' ? '5. 賽程批次匯入 Events' : '5. Events'}
          description={
            lang === 'zh'
              ? '批次匯入賽程：Event No、Event Name'
              : 'Batch import events: Event No, Event Name'
          }
          templateUrl={`${basePath}/templates/events_template.csv`}
          expectedHeaders={['Event No', 'Event Name']}
          onImport={(rows) => handleImport('events', rows)}
          lang={lang}
        />
      )}

      {activeSection === 'events' && importedData.events.length > 0 && (
        <DataSummary
          label={lang === 'zh' ? '已匯入賽程' : 'Imported Events'}
          count={importedData.events.length}
          lang={lang}
        />
      )}

      {/* LSTRslt Viewer */}
      {activeSection === 'lstrslt' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">LSTRslt.txt Viewer</h3>
          <LSTRsltViewer simData={simData} allEvents={allEvents} />
        </div>
      )}
    </div>
  );
}

function DataSummary({ label, count, lang }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm text-blue-800">
      {label}: <span className="font-semibold">{count}</span>{' '}
      {lang === 'zh' ? '筆資料' : 'records'}
    </div>
  );
}
