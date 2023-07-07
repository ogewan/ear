function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  let formatted = `${seconds} sec`
  if (minutes > 0) formatted = `${minutes} min ${formatted}`
  if (hours > 0) formatted = `${hours} hr ${formatted}`

  return formatted
}

module.exports = {msToTime}
