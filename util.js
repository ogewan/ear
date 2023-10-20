function msToTime(duration, showDays = false) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = 0;
  let days = 0;
  if (showDays) {
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    days = Math.floor((duration / (1000 * 60 * 60 * 24)));
  } else {
    hours = Math.floor((duration / (1000 * 60 * 60)));
  }

  let formatted = `${seconds} sec`;
  if (minutes > 0) formatted = `${minutes} min ${formatted}`;
  if (hours > 0) formatted = `${hours} hr ${formatted}`;
  if (days > 0) formatted = `${days} day ${formatted}`;

  return formatted;
}

module.exports = {msToTime};
