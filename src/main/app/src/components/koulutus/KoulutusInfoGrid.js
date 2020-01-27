import React from 'react';
import InfoGrid from '../common/InfoGrid';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import ExtensionOutlinedIcon from '@material-ui/icons/ExtensionOutlined';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Localizer as l } from '../../tools/Utils';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

const KoulutusInfoGrid = (props) => {
  const classes = useStyles();
  const { nimikkeet, koulutustyyppi, laajuus } = props;
  const { t } = useTranslation();
  const nimikeString = nimikkeet
    ? nimikkeet.map((nimikeObj) => l.localize(nimikeObj)).join('\n')
    : '';
  const laajuusString = laajuus.map((elem) => l.localize(elem)).join(' ');
  const koulutusTyyppiString = koulutustyyppi
    ? t(`koulutus.tyyppi-${koulutustyyppi}`)
    : '';
  const perustiedotData = [
    {
      icon: <SchoolOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.tutkintonimikkeet'),
      text: nimikeString,
    },
    {
      icon: <ExtensionOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutustyyppi'),
      text: koulutusTyyppiString,
    },
    {
      icon: <TimelapseIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutuksen-laajuus'),
      text: laajuusString,
    },
  ];
  return (
    <InfoGrid
      heading={t('koulutus.tiedot')}
      gridData={perustiedotData}
      {...props}
    />
  );
};

export default KoulutusInfoGrid;
