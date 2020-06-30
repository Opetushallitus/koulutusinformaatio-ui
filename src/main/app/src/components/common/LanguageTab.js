import React, { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const LanguageTab = () => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const handleChange = (event, newValue) => {
    if (newValue !== language) {
      i18n.changeLanguage(newValue);
      setLanguage(newValue);
    }
  };

  return (
    <Tabs
      value={language}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleChange}>
      <Tab label={t('kielivalinta.suomi').toUpperCase()} value="fi" />
      <Tab label={t('kielivalinta.ruotsi').toUpperCase()} value="sv" />
      <Tab label={t('kielivalinta.englanti').toUpperCase()} value="en" />
    </Tabs>
  );
};

export default LanguageTab;
