import React from 'react';
import InfoGrid from '../common/InfoGrid';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import EuroIcon from '@material-ui/icons/Euro';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Localizer as l } from '#/src/tools/Utils';
import { format } from 'date-fns';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import getUrls from 'get-urls';
import { nanoid } from 'nanoid';
import { Typography, Box } from '@material-ui/core';
import LocalizedLink from '../common/LocalizedLink';

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
const hasNimike = (tyyppi) =>
  tyyppi !== KOULUTUS_TYYPPI.AMM_TUTKINNON_OSA &&
  tyyppi !== KOULUTUS_TYYPPI.AMM_OSAAMISALA;

export const ToteutusInfoGrid = (props) => {
  const classes = useStyles();
  const {
    koulutusTyyppi,
    nimikkeet,
    kielet,
    laajuus,
    aloitus,
    suunniteltuKestoVuodet,
    suunniteltuKestoKuukaudet,
    suunniteltuKestoKuvaus,
    opetusaika,
    opetustapa,
    maksullisuus,
    apuraha,
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
  const SuunniteltuKestoKuvausWithLinks = () => {
    const strippedFromUrlsKuvaus = l
      .localize(suunniteltuKestoKuvaus)
      .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
      .trim();
    const linksArray = [];
    getUrls(l.localize(suunniteltuKestoKuvaus)).forEach((link) => {
      linksArray.push(
        <Typography component="p" variant="body2" key={nanoid()}>
          <LocalizedLink target="_blank" href={link}>
            {link}
          </LocalizedLink>
        </Typography>
      );
    });
    return (
      <>
        <Typography component="h5" variant="body2">
          {strippedFromUrlsKuvaus}
        </Typography>
        {linksArray.length > 0 && <Box style={{ marginTop: '5px' }}>{linksArray}</Box>}
      </>
    );
  };
  const aloitusString = aloitus[0]
    ? format(new Date(aloitus[1]), 'd.M.y')
    : `${l.localize(aloitus[2])} ${aloitus[3]}`;
  const opetusAikaString = opetusaika?.map(localizeMap).join('\n') ?? '';
  const opetustapaString = opetustapa?.map(localizeMap).join('\n') ?? '';
  const maksullisuusString = maksullisuus ? `${maksullisuus} €` : t('toteutus.ei-maksua');
  const apurahaString = apuraha ? `${apuraha} €` : t('toteutus.ei-apurahaa');

  const perustiedotData = [];

  if (hasNimike(koulutusTyyppi)) {
    const currentLanguage = l.getLanguage();
    const nimikeString = nimikkeet
      ? nimikkeet
          .filter((elem) => elem.kieli === currentLanguage)
          .map((elem) => elem.arvo)
          .join('\n')
      : t('koulutus.ei-tutkintonimiketta');

    perustiedotData.push({
      icon: <SchoolOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.tutkintonimikkeet'),
      text: nimikeString,
    });
  }

  perustiedotData.push(
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
      modalData: {
        icon: <InfoOutlined />,
        text: <SuunniteltuKestoKuvausWithLinks />,
      },
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
    }
  );

  return <InfoGrid heading={t('koulutus.tiedot')} gridData={perustiedotData} />;
};
