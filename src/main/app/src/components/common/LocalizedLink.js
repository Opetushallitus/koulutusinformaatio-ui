import React from 'react';
import { Link } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, defaultLanguage } from '#/src/tools/i18n';

const LocalizedLink = (props) => {
  const { i18n } = useTranslation();
  const { to, ...rest } = props;
  const currentLng = i18n.language;
  const linkLng = supportedLanguages.includes(currentLng) ? currentLng : defaultLanguage;
  const localizedTo = `/${linkLng + to}`;
  return <Link to={localizedTo} {...rest}></Link>;
};

export default LocalizedLink;
