const leftPad = (value: string, length: number) => {
  while (value.length < length) {
    value = '0' + value;
  }

  return value;
};

export const formatTime = (time: number) => {
  //console.log('ft', time);
  const duration = Math.floor(time);
  const hours = Math.floor(duration / 360000);
  const minutes = Math.floor((duration - (hours * 360000)) / 60000);
  const seconds = Math.floor((duration - (hours * 360000) - (minutes * 60000)) / 1000);
  const ms = duration - (hours * 360000) - (minutes * 60000) - (seconds * 1000);

  return `${leftPad(`${hours}`, 2)}h ` +
    `${leftPad(`${minutes}`, 2)}m ` +
    `${leftPad(`${seconds}`, 2)}s ` +
    `${leftPad(`${ms}`, 3)}ms`;
};
