import { makeStyles } from '@material-ui/core';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';

const useStyles = makeStyles({
  arrow: {
    display: 'inline-flex',
    fontSize: '12px',
  },
  link: {
    paddingTop: '10px',
    paddingBottom: '10px',
  },
});

type Props = {
  paluuLinkki: string;
};

export const Paluu = ({ paluuLinkki }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.link}>
      <LocalizedLink
        component={RouterLink}
        color="secondary"
        aria-label={t('lomake.palaa-esittelyyn')}
        to={paluuLinkki}>
        <ArrowBackIos className={classes.arrow} />
        {t('lomake.palaa-esittelyyn')}
      </LocalizedLink>
    </div>
  );
};
