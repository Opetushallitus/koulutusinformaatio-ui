import React from 'react';

import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import EuroIcon from '@material-ui/icons/Euro';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ScheduleIcon from '@material-ui/icons/Schedule';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import { makeStyles } from '@material-ui/styles';
import { TFunction } from 'i18next';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Localizer as l } from '#/src/tools/Utils';
import { Translateable } from '#/src/types/common';
import { Opetus } from '#/src/types/ToteutusTypes';

import { InfoGrid } from '../common/InfoGrid';
import { formatAloitus } from './utils';

const useStyles = makeStyles((theme: any) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

const suunniteltuKesto = (t: TFunction, vuosi?: number, kk?: number) => {
  if (!vuosi && !kk) {
    return t('koulutus.ei-kestoa');
  }

  return [
    vuosi && t('koulutus.kesto-vuosi', { count: vuosi }),
    kk && t('koulutus.kesto-kuukausi', { count: kk }),
  ]
    .filter(Boolean)
    .join('\n');
};

const localizeMap = (v: Translateable) => l.localize(v);

type Props = {
  laajuus: string;
  opetus: Opetus;
  hasHaku: boolean;
};

export const ToteutusInfoGrid = ({ laajuus, opetus = {}, hasHaku }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const kieliString = opetus.opetuskieli?.map(localizeMap).join('\n') ?? '';
  const kestoString = suunniteltuKesto(
    t,
    opetus.suunniteltuKestoVuodet,
    opetus.suunniteltuKestoKuukaudet
  );

  const opetusAikaString = opetus.opetusaika?.map(localizeMap).join('\n') ?? '';
  const opetustapaString = opetus.opetustapa?.map(localizeMap).join('\n') ?? '';
  const maksullisuusString = opetus.onkoMaksullinen
    ? `${opetus.maksunMaara} €`
    : t('toteutus.ei-maksua');
  const apurahaString = opetus.onkoStipendia
    ? `${opetus.stipendinMaara} €`
    : t('toteutus.ei-apurahaa');

  const perustiedotData = [];

  perustiedotData.push(
    {
      icon: <ChatBubbleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetuskieli'),
      text: kieliString,
      modalText: !_.isEmpty(opetus.opetuskieletKuvaus) && (
        <LocalizedHTML data={opetus.opetuskieletKuvaus!} noMargin />
      ),
    },
    {
      icon: <TimelapseIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutuksen-laajuus'),
      text: laajuus,
    },
    {
      icon: <ScheduleIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.suunniteltu-kesto'),
      text: kestoString,
      modalText: !_.isEmpty(opetus.suunniteltuKestoKuvaus) && (
        <LocalizedHTML data={opetus.suunniteltuKestoKuvaus!} noMargin />
      ),
    }
  );

  const { alkaaText, alkaaModalText, paattyyText } = !hasHaku
    ? formatAloitus(opetus.koulutuksenAlkamiskausiUUSI, t)
    : ({} as any);

  if (alkaaText) {
    perustiedotData.push({
      icon: <FlagOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.koulutus-alkaa'),
      text: alkaaText,
      modalText: alkaaModalText && <LocalizedHTML data={alkaaModalText} noMargin />,
    });
  }

  if (paattyyText) {
    perustiedotData.push({
      icon: <FlagOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.koulutus-paattyy'),
      text: paattyyText,
    });
  }

  perustiedotData.push(
    {
      icon: <HourglassEmptyOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetusaika'),
      text: opetusAikaString,
      modalText: !_.isEmpty(opetus.opetusaikaKuvaus) && (
        <LocalizedHTML data={opetus.opetusaikaKuvaus!} noMargin />
      ),
    },
    {
      icon: <MenuBookIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetustapa'),
      text: opetustapaString,
      modalText: !_.isEmpty(opetus.opetustapaKuvaus) && (
        <LocalizedHTML data={opetus.opetustapaKuvaus!} noMargin />
      ),
    },
    {
      icon: <EuroIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.maksullisuus'),
      text: maksullisuusString,
      modalText: !_.isEmpty(opetus.maksullisuusKuvaus) && (
        <LocalizedHTML data={opetus.maksullisuusKuvaus!} noMargin />
      ),
    },
    {
      icon: 'ApurahaIcon',
      title: t('toteutus.apuraha'),
      text: apurahaString,
      modalText: !_.isEmpty(opetus.apurahaKuvaus) && (
        <LocalizedHTML data={opetus.apurahaKuvaus!} noMargin />
      ),
    }
  );

  return <InfoGrid heading={t('koulutus.tiedot')} gridData={perustiedotData} />;
};
