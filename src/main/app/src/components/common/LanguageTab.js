import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useLanguageState } from '#/src/hooks';
import { supportedLanguages } from '#/src/tools/i18n';
import { LANG_NAME_BY_CODE } from '#/src/constants';

const LanguageTab = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useLanguageState();
  const handleChange = (event, newValue) => {
    setLanguage(newValue);
  };

  return (
    <Tabs
      value={language}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleChange}>
      {supportedLanguages.map((langCode) => (
        <Tab
          label={t(`kielivalinta.${LANG_NAME_BY_CODE[langCode]}`).toUpperCase()}
          value={langCode}
        />
      ))}
    </Tabs>
  );
};

export default LanguageTab;
