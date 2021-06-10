import React, { useMemo } from 'react';

import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { TFunction } from 'i18next';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { OskariKartta } from '#/src/components/common/OskariKartta';
import Spacer from '#/src/components/common/Spacer';
import { localize } from '#/src/tools/localization';
import { koodiUriToPostinumero } from '#/src/tools/utils';
import { Osoite, Yhteystiedot as YhteystiedotType } from '#/src/types/common';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 20,
  },
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
  info: {
    width: 230,
  },
  oskariMap: {
    height: 350,
    width: '100%',
    maxWidth: 625,
  },
  text: {
    color: colors.black,
    fontWeight: 600,
  },
}));

const toShownOsoite = (osoite?: Osoite) => {
  const lahiosoite = localize(osoite?.osoite);
  const postinumero = koodiUriToPostinumero(osoite?.postinumero?.koodiUri);
  const postitoimipaikka = _.capitalize(localize(osoite?.postinumero));

  return !lahiosoite && !postinumero && !postitoimipaikka
    ? null
    : _.trim(`${lahiosoite}, ${postinumero} ${postitoimipaikka}`, ', ');
};

const parseYhteystieto = (t: TFunction) => ({
  nimi,
  postiosoite: postiosoiteProp,
  kayntiosoite: kayntiosoiteProp,
  sahkoposti,
  puhelinnumero,
}: YhteystiedotType) => {
  const postiosoite = toShownOsoite(postiosoiteProp);
  const kayntiosoite = toShownOsoite(kayntiosoiteProp);

  return {
    nimi: localize(nimi),
    postiosoite,
    kayntiosoite,
    sahkoposti: localize(sahkoposti),
    puhelinnumero: localize(puhelinnumero),
    oskariOsoite: localize(kayntiosoiteProp?.osoite),
    oskariPostitoimipaikka: localize(kayntiosoiteProp?.postinumero),
  };
};

const YhteystietoRow = ({ title, text }: { title: string; text: string }) => (
  <Grid container spacing={1} alignItems="flex-start">
    <Grid item sm={4}>
      <Typography variant="body1" noWrap>
        {title}
      </Typography>
    </Grid>
    <Grid item sm={8}>
      <Typography variant="body1">{text}</Typography>
    </Grid>
  </Grid>
);

type Props = {
  id: string;
  heading?: string;
  yhteystiedot?: Array<YhteystiedotType>;
  hakijapalveluidenYhteystiedot?: YhteystiedotType;
};

export const hasYhteystiedot = (props: Props = {} as any) =>
  (props.yhteystiedot && props.yhteystiedot?.length > 0) ||
  !_.isEmpty(props.hakijapalveluidenYhteystiedot);

export const Yhteystiedot = ({
  id,
  heading,
  yhteystiedot,
  hakijapalveluidenYhteystiedot,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const localizedYhteystiedot = useMemo(
    () =>
      (yhteystiedot || [])
        .concat(hakijapalveluidenYhteystiedot as any) // TODO: undefined cannot be concated :I
        .filter(Boolean)
        .map(parseYhteystieto(t)),
    [t, hakijapalveluidenYhteystiedot, yhteystiedot]
  );

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      {heading && (
        <>
          <Typography variant="h2">{heading}</Typography>
          <Spacer />
        </>
      )}
      {localizedYhteystiedot.map(
        (
          {
            nimi,
            kayntiosoite,
            oskariOsoite,
            oskariPostitoimipaikka,
            postiosoite,
            puhelinnumero,
            sahkoposti,
          },
          i
        ) => (
          <Grid
            key={nimi}
            className={classes.container}
            container
            spacing={5}
            alignItems="center"
            justify="center">
            <Grid item container justify="center" sm={12} md={6}>
              <Paper style={{ padding: '40px', width: '100%', maxWidth: 600 }}>
                <Typography gutterBottom variant="h4">
                  {nimi || id}
                </Typography>
                {postiosoite && (
                  <YhteystietoRow
                    title={t('oppilaitos.postiosoite:')}
                    text={postiosoite}
                  />
                )}
                {kayntiosoite && (
                  <YhteystietoRow
                    title={t('oppilaitos.kayntiosoite:')}
                    text={kayntiosoite}
                  />
                )}
                {sahkoposti && (
                  <YhteystietoRow title={t('oppilaitos.sahkoposti:')} text={sahkoposti} />
                )}
                {puhelinnumero && (
                  <YhteystietoRow
                    title={t('oppilaitos.puhelinnumero:')}
                    text={puhelinnumero}
                  />
                )}
              </Paper>
            </Grid>
            {oskariOsoite && oskariPostitoimipaikka && (
              <Grid item container justify="center" md={6} sm={12}>
                <Box component="div" className={classes.oskariMap}>
                  <OskariKartta
                    id={`${i}-${nimi || id}`}
                    osoite={oskariOsoite}
                    postitoimipaikka={oskariPostitoimipaikka}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        )
      )}
    </Box>
  );
};
