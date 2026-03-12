// Generate LSTRslt.txt content from simulation data
// Format per the spec:
//   event=1, heat=0, lap=25, lane=1, rank=1, result=22.66

export function generateLSTRslt(simData, allEvents) {
  const lines = [];

  allEvents.forEach((ev) => {
    const eventData = simData[ev.id];
    if (!eventData) return;

    eventData.rounds.forEach((round) => {
      round.entries.forEach((entry) => {
        if (!entry.result) return; // no result yet, skip

        // Determine lap distance from event name
        let lap = 25;
        if (ev.name.includes('50M')) lap = 50;
        else if (ev.name.includes('100M')) lap = 100;
        else if (ev.name.includes('200M')) lap = 200;

        // Occasionally insert an invalid record (lap=0) for realism
        const isInvalid = Math.random() < 0.03;

        lines.push(
          `event=${ev.id}, ` +
          `heat=${round.roundNum - 1}, ` +
          `lap=${isInvalid ? 0 : lap}, ` +
          `lane=${entry.lane}, ` +
          `rank=${entry.rank || 0}, ` +
          `result=${isInvalid ? '0.00' : entry.result.toFixed(2)}`
        );
      });
    });
  });

  return lines.join('\n');
}

// Parse LSTRslt.txt content back into structured data
export function parseLSTRslt(text) {
  const records = [];
  const lines = text.split('\n').filter((l) => l.trim());

  for (const line of lines) {
    const parts = {};
    line.split(',').forEach((segment) => {
      const [key, val] = segment.split('=').map((s) => s.trim());
      if (key && val !== undefined) {
        parts[key] = isNaN(Number(val)) ? val : Number(val);
      }
    });

    // Skip invalid records (lap=0)
    if (parts.lap === 0) continue;

    records.push({
      event: parts.event,
      heat: parts.heat,
      lap: parts.lap,
      lane: parts.lane,
      rank: parts.rank,
      result: parts.result,
    });
  }

  return records;
}
