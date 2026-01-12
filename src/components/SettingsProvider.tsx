import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  SettingsData
} from "../utils/storage";

type SettingsContextValue = {
  settings: SettingsData;
  updateSettings: (updates: Partial<SettingsData>) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveSettings(settings);
    }
  }, [isLoaded, settings]);

  const updateSettings = (updates: Partial<SettingsData>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return context;
};
