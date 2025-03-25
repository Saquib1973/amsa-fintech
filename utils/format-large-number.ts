export const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) {
    return `$${(num / 1e12).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}T`
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}B`
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}M`
  }
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
