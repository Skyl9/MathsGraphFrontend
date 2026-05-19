// SettingsPage.tsx
import React, { useState } from 'react';
import { Box, TextField, Switch, FormControlLabel, Typography } from '@mui/material';

interface Settings {
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    defaultLanguage: '',
    maintenanceMode: false
  });
/*
  useEffect(() => {
    nodeApi.getSettings()
      .then((data: Settings) => setSettings(data))
      .catch(console.error);
  }, []);*/

  const handleChange =
    (key: keyof Settings) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((s) => ({ ...s, [key]: e.target.value }));
    };

  const handleToggle = () => {
    setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }));
  };
/*
  const handleSave = async () => {
    try {
      await nodeApi.updateSettings(settings);
      alert('Paramètres sauvegardés');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    }
  };*/

  return (
    <Box component="form" sx={{ maxWidth: 600, display: 'grid', gap: 2 }}>
      <Typography variant="h5">Paramètres généraux</Typography>
      <TextField
        label="Nom du site"
        value={settings.siteName}
        onChange={handleChange('siteName')}
        fullWidth
      />
      <TextField
        label="Langue par défaut"
        value={settings.defaultLanguage}
        onChange={handleChange('defaultLanguage')}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            checked={settings.maintenanceMode}
            onChange={handleToggle}
          />
        }
        label="Mode maintenance"
      />

    </Box>
  );
};

export default SettingsPage;
