import { BigNumber } from 'bignumber.js'
export const dateFormatter = (timestamp: string, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  const tsStr = String(timestamp).trim()

  if (!/^\d+$/.test(tsStr)) {
    if (tsStr === 'undefined') {
      return null
    }
    return tsStr
  }

  let msStr = tsStr
  if (tsStr.length === 10) {
    msStr = tsStr + '000'
  } else if (tsStr.length < 10 || tsStr.length > 16) {
    return tsStr
  }

  const totalMs = new BigNumber(msStr)
  const msPerSecond = new BigNumber(1000)
  const msPerMinute = msPerSecond.multipliedBy(60)
  const msPerHour = msPerMinute.multipliedBy(60)
  const msPerDay = msPerHour.multipliedBy(24)

  const baseDate = new Date(0)
  let remainingMs = totalMs

  const days = remainingMs.dividedBy(msPerDay).integerValue()
  remainingMs = remainingMs.minus(days.multipliedBy(msPerDay))

  const hours = remainingMs.dividedBy(msPerHour).integerValue()
  remainingMs = remainingMs.minus(hours.multipliedBy(msPerHour))

  const minutes = remainingMs.dividedBy(msPerMinute).integerValue()
  remainingMs = remainingMs.minus(minutes.multipliedBy(msPerMinute))

  const seconds = remainingMs.dividedBy(msPerSecond).integerValue()
  const ms = remainingMs.minus(seconds.multipliedBy(msPerSecond))

  const date = new Date(baseDate)
  date.setUTCDate(baseDate.getUTCDate() + days.toNumber())
  date.setUTCHours(hours.toNumber())
  date.setUTCMinutes(minutes.toNumber())
  date.setUTCSeconds(seconds.toNumber())
  date.setUTCMilliseconds(ms.toNumber())

  if (isNaN(date.getTime())) {
    return tsStr
  }

  const year = date.getFullYear().toString()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const localHours = String(date.getHours()).padStart(2, '0')
  const localMinutes = String(date.getMinutes()).padStart(2, '0')
  const localSeconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', localHours)
    .replace('mm', localMinutes)
    .replace('ss', localSeconds)
}
