import { Link } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { defaultLanguage, supportedLanguages } from '#/src/tools/i18n';

const localizeHref = (href: string, lng: string) =>
  _.first(href) === '/' ? `/${lng + href}` : `/${lng}/${href}`;

type Props = {
  to: string;
  component?: any;
  children?: React.ReactNode;
  [key: string]: any;
};

export const LocalizedLink = ({ children, to, component, ...rest }: Props) => {
  const { i18n } = useTranslation();
  const currentLng = i18n.language;
  const linkLng = supportedLanguages.includes(currentLng) ? currentLng : defaultLanguage;
  const usedTo = localizeHref(to, linkLng);

  return (
    <Link to={usedTo} {...rest} component={component}>
      {children}
    </Link>
  );
};
