import React from 'react';
import { Link } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const LocalizedLink = (props) => {
  const { i18n } = useTranslation();
  const { to, ...rest } = props;
  const localizedTo = `/${i18n.language + to}`;
  return <Link to={localizedTo} {...rest}></Link>;
};

export default LocalizedLink;
