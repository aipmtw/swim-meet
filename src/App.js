import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import Header from './components/Header';
import SimulationControls from './components/SimulationControls';
import LivePage from './pages/LivePage';
import ResultsPage from './pages/ResultsPage';
import AwardsPage from './pages/AwardsPage';
import LSTRsltViewer from './components/LSTRsltViewer';
import { allEvents } from './data/events';
import { buildSimulationData, simulateEventResults } from './data/simulation';

function AppContent() {
  const [activeTab, setActiveTab] = useState('live');
  const [swimmerRange, setSwimmerRange] = useState({ min: 6, max: 12 });
  const [simData, setSimData] = useState(() => buildSimulationData(allEvents, swimmerRange));
  const [isRunning, setIsRunning] = useState(false);
  const [currentEventIdx, setCurrentEventIdx] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [speed, setSpeed] = useState(3000);
  const timerRef = useRef(null);

  const updateTime = useCallback(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  // Simulate a single next event (returns new index)
  const simulateOne = useCallback((idx) => {
    if (idx >= allEvents.length) return idx;

    const eventId = allEvents[idx].id;
    setSimData((prev) => {
      const eventData = prev[eventId];
      if (!eventData) return prev;
      return { ...prev, [eventId]: simulateEventResults(eventData) };
    });
    updateTime();
    return idx + 1;
  }, [updateTime]);

  // Manual: simulate next single event
  const handleNextEvent = useCallback(() => {
    setCurrentEventIdx((prev) => simulateOne(prev));
  }, [simulateOne]);

  // Auto simulation
  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    // Immediately run one
    setCurrentEventIdx((prev) => simulateOne(prev));

    timerRef.current = setInterval(() => {
      setCurrentEventIdx((prev) => {
        if (prev >= allEvents.length) {
          setIsRunning(false);
          clearInterval(timerRef.current);
          timerRef.current = null;
          return prev;
        }
        return simulateOne(prev);
      });
    }, speed);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, speed, simulateOne]);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Simulate ALL remaining events at once
  const handleSimulateAll = useCallback(() => {
    setSimData((prev) => {
      const updated = { ...prev };
      for (let i = currentEventIdx; i < allEvents.length; i++) {
        const eventId = allEvents[i].id;
        if (updated[eventId]) {
          updated[eventId] = simulateEventResults(updated[eventId]);
        }
      }
      return updated;
    });
    setCurrentEventIdx(allEvents.length);
    updateTime();
  }, [currentEventIdx, updateTime]);

  // When swimmer range changes, regenerate data (only if not running)
  const handleSwimmerRangeChange = useCallback((newRange) => {
    setSwimmerRange(newRange);
  }, []);

  const handleReset = useCallback(() => {
    handleStop();
    setSimData(buildSimulationData(allEvents, swimmerRange));
    setCurrentEventIdx(0);
    setLastUpdated(null);
  }, [handleStop, swimmerRange]);

  const currentEventId = currentEventIdx < allEvents.length
    ? allEvents[currentEventIdx].id
    : allEvents.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} lastUpdated={lastUpdated} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <SimulationControls
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
          onNextEvent={handleNextEvent}
          onSimulateAll={handleSimulateAll}
          currentEvent={currentEventIdx < allEvents.length ? currentEventId : allEvents.length}
          totalEvents={allEvents.length}
          speed={speed}
          onSpeedChange={setSpeed}
          swimmerRange={swimmerRange}
          onSwimmerRangeChange={handleSwimmerRangeChange}
        />

        {activeTab === 'live' && (
          <LivePage simData={simData} activeSession={currentEventIdx < 23 ? 1 : 2} />
        )}
        {activeTab === 'results' && <ResultsPage simData={simData} />}
        {activeTab === 'awards' && <AwardsPage simData={simData} />}
        {activeTab === 'lstrslt' && <LSTRsltViewer simData={simData} allEvents={allEvents} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
