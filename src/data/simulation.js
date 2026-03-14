// Simulated swimmer data and result generation
const schools = [
  'Taipei American School', 'Morrison Academy', 'Kaohsiung American School',
  'Taichung International School', 'Dominican International School', 'Hsinchu International School',
];

const girlNames = [
  'Marry Huang', 'Sophia Lin', 'Emily Chen', 'Chloe Wang', 'Olivia Wu',
  'Ava Chang', 'Mia Tsai', 'Isabella Liu', 'Grace Lee', 'Hannah Hsu',
  'Lily Yang', 'Zoe Cheng',
];

const boyNames = [
  'Tom Chen', 'James Lin', 'Ethan Wang', 'Lucas Wu', 'Noah Chang',
  'Liam Tsai', 'Oliver Liu', 'William Lee', 'Benjamin Hsu', 'Henry Yang',
  'Daniel Cheng', 'Jack Kuo',
];

function randomTime(base, variance) {
  return +(base + (Math.random() - 0.3) * variance).toFixed(2);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate swimmers for a given event
// swimmerRange: { min, max } — user-configurable swimmer count per event
export function generateSwimmers(eventId, eventName, swimmerRange = { min: 6, max: 12 }) {
  const isGirls = eventName.includes('Girls') || eventName.includes('Mixed');
  const isBoys = eventName.includes('Boys') || eventName.includes('Mixed');
  const is50m = eventName.includes('50M') || eventName.includes('50m');
  const is100m = eventName.includes('100M') || eventName.includes('100m');
  const is200m = eventName.includes('200M') || eventName.includes('200m');
  const isIM100 = eventName.includes('IM 100M');
  const isIM200 = eventName.includes('IM 200M');
  const isRelay = eventName.toLowerCase().includes('relay');

  let baseTime = 25;
  if (is50m) baseTime = 38;
  if (is100m) baseTime = 75;
  if (is200m) baseTime = 150;
  if (isIM100) baseTime = 75;
  if (isIM200) baseTime = 150;
  if (isRelay) baseTime = 30;

  const names = isGirls && !isBoys ? girlNames : isBoys && !isGirls ? boyNames : [...girlNames.slice(0, 6), ...boyNames.slice(0, 6)];

  const { min, max } = swimmerRange;
  const range = Math.max(max - min + 1, 1);
  const count = isRelay ? Math.min(4, min) : Math.floor(Math.random() * range) + min;
  const swimmers = [];

  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const school = schools[i % schools.length];
    const referTime = Math.random() > 0.2 ? randomTime(baseTime, 6) : null;
    swimmers.push({ name, school, referTime });
  }

  // Sort by refer time (null last)
  swimmers.sort((a, b) => {
    if (a.referTime === null && b.referTime === null) return 0;
    if (a.referTime === null) return 1;
    if (b.referTime === null) return -1;
    return a.referTime - b.referTime;
  });

  return swimmers;
}

// Assign lanes and generate rounds
export function buildRounds(swimmers) {
  const laneMap = { 1: 4, 2: 3, 3: 5, 4: 2, 5: 6, 6: 1 };
  const totalRounds = Math.ceil(swimmers.length / 6);
  const rounds = [];

  for (let r = 0; r < totalRounds; r++) {
    const roundSwimmers = swimmers.slice(r * 6, (r + 1) * 6);
    const entries = roundSwimmers.map((sw, idx) => ({
      ...sw,
      lane: laneMap[idx + 1] || idx + 1,
    }));
    rounds.push({
      roundNum: r + 1,
      totalRounds,
      entries: entries.sort((a, b) => a.lane - b.lane),
    });
  }

  return rounds;
}

// Generate result time for a swimmer
export function generateResult(referTime) {
  const base = referTime || 28;
  return randomTime(base, 4);
}

// Build full simulation data for all events
// swimmerRange: { min, max } — user-configurable
export function buildSimulationData(events, swimmerRange = { min: 6, max: 12 }) {
  const data = {};
  events.forEach((ev) => {
    const swimmers = generateSwimmers(ev.id, ev.name, swimmerRange);
    const rounds = buildRounds(swimmers);
    data[ev.id] = {
      event: ev,
      rounds: rounds.map((round) => ({
        ...round,
        entries: round.entries.map((entry) => ({
          ...entry,
          result: null,
          rank: null,
        })),
      })),
    };
  });
  return data;
}

// Simulate results for one event (fill in results + ranks)
export function simulateEventResults(eventData) {
  return {
    ...eventData,
    rounds: eventData.rounds.map((round) => {
      const withResults = round.entries.map((entry) => ({
        ...entry,
        result: generateResult(entry.referTime),
      }));
      // Assign ranks
      const sorted = [...withResults].sort((a, b) => a.result - b.result);
      sorted.forEach((s, i) => { s.rank = i + 1; });
      return { ...round, entries: withResults };
    }),
  };
}
