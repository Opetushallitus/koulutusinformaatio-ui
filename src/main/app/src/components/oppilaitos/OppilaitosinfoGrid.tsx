import React from 'react';

import { makeStyles } from '@material-ui/core';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import HomeWorkOutlinedIcon from '@material-ui/icons/HomeWorkOutlined';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { InfoGrid } from '#/src/components/common/InfoGrid';
import { Localizer as l, condArray } from '#/src/tools/Utils';
import { Koodi } from '#/src/types/common';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

type Props = {
  className?: string;
  opiskelijoita: number;
  kotipaikat: Array<Koodi>;
  opetuskieli: Array<Koodi>;
  koulutusohjelmia: number;
  toimipisteita?: number;
};

export const OppilaitosinfoGrid = ({
  className,
  opiskelijoita,
  kotipaikat,
  opetuskieli,
  koulutusohjelmia,
  toimipisteita,
}: Props) => {
  const classes = useStyles();
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
    ...condArray(!_fp.isNil(toimipisteita), {
      icon: <HomeWorkOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.toimipisteita'),
      text: _fp.toString(toimipisteita),
    }),
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
      className={className}
    />
  );
};
