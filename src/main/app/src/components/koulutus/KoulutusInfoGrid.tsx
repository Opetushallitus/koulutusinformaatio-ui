import { makeStyles } from '@material-ui/core';
import ExtensionOutlinedIcon from '@material-ui/icons/ExtensionOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import { Localizer as l } from '#/src/tools/Utils';
import { Translateable } from '#/src/types/common';
import InfoGrid from '../common/InfoGrid';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

const hasNimike = (tyyppi: string) =>
  tyyppi !== KOULUTUS_TYYPPI.AMM_TUTKINNON_OSA &&
  tyyppi !== KOULUTUS_TYYPPI.AMM_OSAAMISALA;

type Props = {
  nimikkeet: Array<Translateable>;
  koulutustyyppi: string;
  laajuus: Array<Translateable | undefined>;
};

export const KoulutusInfoGrid = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { nimikkeet, koulutustyyppi, laajuus } = props;

  const perustiedotData = [];
  if (hasNimike(koulutustyyppi)) {
    const nimikeString = nimikkeet
      ? nimikkeet.map((nimikeObj) => l.localize(nimikeObj)).join('\n')
      : t('koulutus.ei-tutkintonimiketta');
    perustiedotData.push({
      icon: <SchoolOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.tutkintonimikkeet'),
      text: nimikeString,
    });
  }

  const laajuusString = !laajuus.includes(undefined)
    ? laajuus.map((elem) => l.localize(elem)).join(' ')
    : t('koulutus.ei-laajuutta');
  const koulutusTyyppiString = koulutustyyppi
    ? t(`koulutus.tyyppi-${koulutustyyppi}`)
    : '';

  perustiedotData.push({
    icon: <ExtensionOutlinedIcon className={classes.koulutusInfoGridIcon} />,
    title: t('koulutus.koulutustyyppi'),
    text: koulutusTyyppiString,
  });
  perustiedotData.push({
    icon: <TimelapseIcon className={classes.koulutusInfoGridIcon} />,
    title: t('koulutus.koulutuksen-laajuus'),
    text: laajuusString,
  });

  return (
    <InfoGrid heading={t('koulutus.tiedot')} gridData={perustiedotData} {...props} />
  );
};
