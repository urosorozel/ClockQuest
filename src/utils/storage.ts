const STORAGE_KEY = "clockquest-progress-v1";
const SETTINGS_KEY = "clockquest-settings-v1";

export type ProgressData = {
  lessons: Record<string, { stars: number; completed: boolean }>;
  bestStreak: number;
  accuracy: number;
  totalAnswered: number;
  totalCorrect: number;
};

export type SettingsData = {
  showTicks: boolean;
  showNumbers: boolean;
  snapMode: "none" | "5" | "1";
  showDigital: boolean;
  soundOn: boolean;
};

export const defaultProgress: ProgressData = {
  lessons: {},
  bestStreak: 0,
  accuracy: 0,
  totalAnswered: 0,
  totalCorrect: 0
};

export const defaultSettings: SettingsData = {
  showTicks: true,
  showNumbers: true,
  snapMode: "5",
  showDigital: true,
  soundOn: false
};

export const loadProgress = (): ProgressData => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProgress;
  try {
    return { ...defaultProgress, ...JSON.parse(raw) } as ProgressData;
  } catch {
    return defaultProgress;
  }
};

export const saveProgress = (progress: ProgressData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const loadSettings = (): SettingsData => {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(raw) } as SettingsData;
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: SettingsData) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
