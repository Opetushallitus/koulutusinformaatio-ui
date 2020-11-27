import React from 'react';
import _ from 'lodash';
import { Link } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, defaultLanguage } from '#/src/tools/i18n';

const useRealToProp = (href, lng) => {
  if (href == null) {
    return href;
  } else if (_.first(href) === '/') {
    return `/${lng + href}`;
  } else {
    return `/${lng}/${href}`;
  }
};

const LocalizedLink = (props) => {
  const { i18n } = useTranslation();
  const { to, component: componentProp, ...rest } = props;
  const currentLng = i18n.language;
  const linkLng = supportedLanguages.includes(currentLng) ? currentLng : defaultLanguage;
  const realTo = useRealToProp(to, linkLng);
  return (
    <Link to={realTo} {...rest} component={_.isNil(realTo) ? undefined : componentProp} />
  );
};

export default LocalizedLink;
