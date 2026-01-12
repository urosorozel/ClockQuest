import { useSettings } from "../components/SettingsProvider";

const SettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  return (
    <div className="page">
      <header className="page-header">
        <h1>Settings</h1>
        <p>Choose the helpers that feel good for you.</p>
      </header>

      <section className="settings-grid">
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.showTicks}
            onChange={(event) =>
              updateSettings({ showTicks: event.target.checked })
            }
          />
          Show minute marks
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.showNumbers}
            onChange={(event) =>
              updateSettings({ showNumbers: event.target.checked })
            }
          />
          Show numbers
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.showDigital}
            onChange={(event) =>
              updateSettings({ showDigital: event.target.checked })
            }
          />
          Show digital helper
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.soundOn}
            onChange={(event) =>
              updateSettings({ soundOn: event.target.checked })
            }
          />
          Sound on/off
        </label>
        <label className="select">
          Snap minutes
          <select
            value={settings.snapMode}
            onChange={(event) =>
              updateSettings({
                snapMode: event.target.value as "none" | "5" | "1"
              })
            }
          >
            <option value="none">No snap</option>
            <option value="5">5-minute steps</option>
            <option value="1">1-minute steps</option>
          </select>
        </label>
      </section>
    </div>
  );
};

export default SettingsPage;
