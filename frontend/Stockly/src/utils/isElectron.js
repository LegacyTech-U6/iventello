export function isElectron() {
  return !!(window && window.process && window.process.type)
}
