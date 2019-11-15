export const _isSingle = ()=>{
    return !localStorage.getItem("isSingle") || localStorage.getItem("isSingle") === "1" || localStorage.getItem("isSingle") === "true" ? 1 : 0;
}

export const _currentStore = ()=>{
  return localStorage.getItem("currentStore") || "27";
}

export const _lang = ()=>{
  return localStorage.getItem("lang") || "ja";
}

export const _currentVersion = ()=>{
  return localStorage.getItem("lastDefFileVer") || "undefined";
}

export const _goalBPI = ()=>{
  return Number(localStorage.getItem("goalBPI")) || 0;
}

export const _goalPercentage = ()=>{
  return Number(localStorage.getItem("goalPercentage")) || 0;
}

export const _currentTheme = ()=>{
  return localStorage.getItem("theme") || "light";
}

export const _currentStoreWithFullName = ()=>{
  const t:string = localStorage.getItem("currentStore") || "27";
  return t === "26" ? "26 Rootage" : "27 HEROIC VERSE"
}

export const _chartColor = ()=>{
  return _currentTheme() === "dark" ? "#eee" : "#333"
}