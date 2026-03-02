import { useState } from 'react';
import { X, Save, Wifi } from 'lucide-react';

interface SettingsPanelProps {
  esp32Url: string;
  setEsp32Url: (url: string) => void;
  onClose: () => void;
}

export default function SettingsPanel({ esp32Url, setEsp32Url, onClose }: SettingsPanelProps) {
  const [inputValue, setInputValue] = useState(esp32Url);

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      setEsp32Url(trimmed);
    }
    onClose();
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div className="settings-title">
          <Wifi size={16} />
          <span>ESP32 Connection</span>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close settings">
          <X size={18} />
        </button>
      </div>

      <div className="settings-body">
        <label className="settings-label" htmlFor="esp32-url">
          Device URL
        </label>
        <input
          id="esp32-url"
          className="settings-input"
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="http://192.168.4.1/data"
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <p className="settings-hint">
          Default: http://192.168.4.1/data
        </p>
      </div>

      <div className="settings-footer">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={14} />
          Save & Connect
        </button>
      </div>
    </div>
  );
}
