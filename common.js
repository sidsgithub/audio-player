// we need time hash to repain the waveforms according to the values.
const functionToCreateTimeHash = (audioElement) => {
  const timeHash = [];
  if (audioElement.buffered) {
    const duration = audioElement.duration;
    let timeValue = 0;
    for (let i = 0; i < 150; i++) {
      timeValue = timeValue + duration / 150;
      timeHash.push(Math.round(timeValue * 10000) / 10000);
    }
    return timeHash;
  }
};

export { functionToCreateTimeHash };
