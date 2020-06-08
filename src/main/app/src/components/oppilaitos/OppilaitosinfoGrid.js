import React from 'react';
import InfoGrid from '#/src/components/common/InfoGrid';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import HomeWorkOutlinedIcon from '@material-ui/icons/HomeWorkOutlined';
import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { Localizer as l } from '#/src/tools/Utils';
import _fp from 'lodash/fp';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

const OppilaitosinfoGrid = (props) => {
  const classes = useStyles();
  const {
    opiskelijoita,
    kotipaikat,
    opetuskieli,
    koulutusohjelmia,
    toimipisteita,
  } = props;
  const { t } = useTranslation();
  const paikkakunnat = l.localizeSortedArrayToString(kotipaikat);
  const opetuskielet = _fp.compose(
    _fp.join(', '),
    _fp.map(_fp.capitalize),
    _fp.map(`nimi.${l.getLanguage()}`)
  )(opetuskieli);
  const perustiedotData = [
    {
      icon: <PublicOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.paikkakunta'),
      text: paikkakunnat,
    },
    {
      icon: <PeopleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.opiskelojoita'),
      text: _fp.toString(opiskelijoita),
    },
    {
      icon: <ChatBubbleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.opetuskielet'),
      text: opetuskielet,
    },
    {
      icon: <HomeWorkOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.toimipisteita'),
      text: _fp.toString(toimipisteita),
    },
    {
      icon: <SchoolOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.tutkintoon-johtavia-koulutuksia'),
      text: _fp.toString(koulutusohjelmia),
    },
  ];
  return (
    <InfoGrid
      heading={t('oppilaitos.perustiedot')}
      gridData={perustiedotData}
      {...props}
    />
  );
};

export default OppilaitosinfoGrid;
