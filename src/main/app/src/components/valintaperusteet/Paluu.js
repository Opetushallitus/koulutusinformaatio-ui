import ArrowForwardIosIcon from '@material-ui/icons/ArrowBackIos';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import LocalizedLink from '#/src/components/common/LocalizedLink';
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

const Paluu = ({ paluuLinkki }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.link}>
      <LocalizedLink
        component={RouterLink}
        color="secondary"
        aria-label={t('lomake.palaa-esittelyyn')}
        to={paluuLinkki}>
        <ArrowForwardIosIcon className={classes.arrow} />
        {t('lomake.palaa-esittelyyn')}
      </LocalizedLink>
    </div>
  );
};

export default Paluu;
