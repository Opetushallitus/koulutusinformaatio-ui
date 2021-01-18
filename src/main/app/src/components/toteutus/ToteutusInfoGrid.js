import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import EuroIcon from '@material-ui/icons/Euro';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ScheduleIcon from '@material-ui/icons/Schedule';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import { makeStyles } from '@material-ui/styles';
import { format } from 'date-fns';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Localizer as l } from '#/src/tools/Utils';
import { InfoGrid } from '../common/InfoGrid';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

const suunniteltuKesto = (t, vuosi, kk) => {
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

const localizeMap = (v) => l.localize(v);

export const ToteutusInfoGrid = (props) => {
  const classes = useStyles();
  const {
    kielet,
    opetuskieletKuvaus,
    laajuus,
    aloitus,
    suunniteltuKestoVuodet,
    suunniteltuKestoKuukaudet,
    suunniteltuKestoKuvaus,
    opetusaika,
    opetusaikaKuvaus,
    opetustapa,
    opetustapaKuvaus,
    maksullisuus,
    maksullisuusKuvaus,
    apuraha,
    apurahaKuvaus,
  } = props;
  const { t } = useTranslation();

  const kieliString = kielet?.map(localizeMap).join('\n') ?? '';
  const laajuusString = !laajuus.includes(undefined)
    ? laajuus.map(localizeMap).join(' ')
    : t('koulutus.ei-laajuutta');
  const kestoString = suunniteltuKesto(
    t,
    suunniteltuKestoVuodet,
    suunniteltuKestoKuukaudet
  );

  const aloitusString = aloitus[0]
    ? format(new Date(aloitus[1]), 'd.M.y')
    : `${l.localize(aloitus[2])} ${aloitus[3]}`;
  const opetusAikaString = opetusaika?.map(localizeMap).join('\n') ?? '';
  const opetustapaString = opetustapa?.map(localizeMap).join('\n') ?? '';
  const maksullisuusString = maksullisuus ? `${maksullisuus} €` : t('toteutus.ei-maksua');
  const apurahaString = apuraha ? `${apuraha} €` : t('toteutus.ei-apurahaa');

  const perustiedotData = [];

  perustiedotData.push(
    {
      icon: <ChatBubbleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetuskieli'),
      text: kieliString,
      modalText: !_.isEmpty(opetuskieletKuvaus) && (
        <LocalizedHTML data={opetuskieletKuvaus} noMargin />
      ),
    },
    {
      icon: <TimelapseIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutuksen-laajuus'),
      text: laajuusString,
    },
    {
      icon: <ScheduleIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.suunniteltu-kesto'),
      text: kestoString,
      modalText: !_.isEmpty(suunniteltuKestoKuvaus) && (
        <LocalizedHTML data={suunniteltuKestoKuvaus} noMargin />
      ),
    },
    {
      icon: <FlagOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.alkaa'),
      text: aloitusString,
    },
    {
      icon: <HourglassEmptyOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetusaika'),
      text: opetusAikaString,
      modalText: !_.isEmpty(opetusaikaKuvaus) && (
        <LocalizedHTML data={opetusaikaKuvaus} noMargin />
      ),
    },
    {
      icon: <MenuBookIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetustapa'),
      text: opetustapaString,
      modalText: !_.isEmpty(opetustapaKuvaus) && (
        <LocalizedHTML data={opetustapaKuvaus} noMargin />
      ),
    },
    {
      icon: <EuroIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.maksullisuus'),
      text: maksullisuusString,
      modalText: !_.isEmpty(maksullisuusKuvaus) && (
        <LocalizedHTML data={maksullisuusKuvaus} noMargin />
      ),
    },
    {
      icon: 'ApurahaIcon',
      title: t('toteutus.apuraha'),
      text: apurahaString,
      modalText: !_.isEmpty(apurahaKuvaus) && (
        <LocalizedHTML data={apurahaKuvaus} noMargin />
      ),
    }
  );

  return <InfoGrid heading={t('koulutus.tiedot')} gridData={perustiedotData} />;
};
