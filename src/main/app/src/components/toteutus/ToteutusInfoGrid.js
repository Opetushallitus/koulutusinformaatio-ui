import React from 'react';
import InfoGrid from '../common/InfoGrid';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import EuroIcon from '@material-ui/icons/Euro';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Localizer as l } from '#/src/tools/Utils';
import { format } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

const suunniteltuKesto = (t, vuosi, kk) => {
  if (!vuosi && !kk) {
    return t('koulutus.ei-kestoa');
  } else {
    return [
      vuosi === '1'
        ? t('koulutus.kesto-vuosi')
        : vuosi
        ? t('koulutus.kesto-vuosia', { vuosi })
        : null,
      kk === '1'
        ? t('koulutus.kesto-kuukausi')
        : kk
        ? t('koulutus.kesto-kuukautta', { kk })
        : null,
    ].join('\n');
  }
};

const ToteutusInfoGrid = (props) => {
  const classes = useStyles();
  const {
    nimikkeet,
    kielet,
    laajuus,
    aloitus,
    suunniteltuKestoVuodet,
    suunniteltuKestoKuukaudet,
    opetusaika,
    opetustapa,
    maksullisuus,
    apuraha,
  } = props;
  const { t } = useTranslation();
  const currentLanguage = l.getLanguage();
  const nimikeString = nimikkeet
    ? nimikkeet
        .filter((elem) => elem.kieli === currentLanguage)
        .map((elem) => elem.arvo)
        .join('\n')
    : t('koulutus.ei-tutkintonimiketta');
  const kieliString = kielet
    ? kielet.map((kieliObj) => l.localize(kieliObj)).join('\n')
    : '';
  const laajuusString = !laajuus.includes(undefined)
    ? laajuus.map((elem) => l.localize(elem)).join(' ')
    : t('koulutus.ei-laajuutta');
  const kestoString = suunniteltuKesto(
    t,
    suunniteltuKestoVuodet,
    suunniteltuKestoKuukaudet
  );
  const aloitusString = aloitus[0]
    ? format(new Date(aloitus[1]), 'd.M.y')
    : `${l.localize(aloitus[2])} ${aloitus[3]}`;
  const opetusAikaString = opetusaika
    ? opetusaika.map((aikaObj) => l.localize(aikaObj)).join('\n')
    : '';
  const opetustapaString = opetustapa
    ? opetustapa.map((tapaObj) => l.localize(tapaObj)).join('\n')
    : '';
  const maksullisuusString = maksullisuus
    ? maksullisuus[0]
      ? `${maksullisuus[1]} €`
      : t('toteutus.ei-maksua')
    : '';
  const apurahaString = apuraha
    ? apuraha[0]
      ? `${apuraha[1]} €`
      : t('toteutus.ei-apurahaa')
    : '';

  const perustiedotData = [
    {
      icon: <SchoolOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.tutkintonimikkeet'),
      text: nimikeString,
    },
    {
      icon: <ChatBubbleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetuskieli'),
      text: kieliString,
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
    },
    {
      icon: <MenuBookIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetustapa'),
      text: opetustapaString,
    },
    {
      icon: <EuroIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.maksullisuus'),
      text: maksullisuusString,
    },
    {
      icon: 'ApurahaIcon',
      title: t('toteutus.apuraha'),
      text: apurahaString,
    },
  ];
  return <InfoGrid heading={t('koulutus.tiedot')} gridData={perustiedotData} />;
};

export default ToteutusInfoGrid;
