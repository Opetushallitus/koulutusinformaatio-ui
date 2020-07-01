import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { first, isEmpty } from 'lodash';
import { Localizer as l } from '#/src/tools/Utils';
import { colors } from '#/src/colors';
import Spacer from '#/src/components/common/Spacer';
import hyphenated from '#/src/components/valintaperusteet/hyphenated';

const formatHakuaika = (a, klo) => {
  const toString = (d) =>
    `${d.getDay()}.${d.getMonth()}.${d.getFullYear()} ${klo} ${String(
      d.getHours()
    ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${toString(a)}`;
};
const Osoite = ({ alkaa, paattyy, lisatietoja, osoite, postinumero }) => {
  const { t } = useTranslation();
  const postinumeroAsString = () => {
    return postinumero
      ? `, ${first(postinumero.koodiUri.replace('posti_', '').split('#'))} ${l.localize(
          postinumero.nimi
        )}`
      : null;
  };
  return (
    <>
      {postinumero ? (
        <>
          <Grid item xs={12}>
            <Box py={1}>
              <Typography variant="h5">{t('valintaperuste.osoite')}</Typography>
              <Typography variant="body1">
                {`${l.localize(osoite)}${postinumeroAsString()}`}
              </Typography>
            </Box>
          </Grid>
        </>
      ) : null}
      <Grid item xs={6}>
        <Box py={1}>
          <Typography variant="h5">{t('valintaperuste.alkaa')}</Typography>
          <Typography variant="body1">
            {formatHakuaika(new Date(Date.parse(alkaa)), t('lomake.klo'))}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box py={1}>
          <Typography variant="h5">{t('valintaperuste.paattyy')}</Typography>
          <Typography variant="body1">
            {formatHakuaika(new Date(Date.parse(paattyy)), t('lomake.klo'))}
          </Typography>
        </Box>
      </Grid>
      {!isEmpty(lisatietoja) ? (
        <>
          <Grid item xs={12}>
            <Box py={1}>
              <Typography variant="h5">{t('valintaperuste.lisatietoja')}</Typography>
            </Box>
            <Box py={1}>
              <Typography variant="body1">{l.localize(lisatietoja)}</Typography>
            </Box>
          </Grid>
        </>
      ) : null}
    </>
  );
};

export const ValintakokeetSisallysluettelo = (valintakokeet) => (Lnk) => {
  return !isEmpty(valintakokeet)
    ? valintakokeet.map(({ tyyppi: { nimi } }, index) => {
        return Lnk(l.localize(nimi), index + 1, true);
      })
    : null;
};

const Valintakokeet = ({ valintakokeet }) => {
  const { t } = useTranslation();
  return (
    <>
      <Box py={1}>
        <Typography variant="h2">{t('valintaperuste.valintakokeet')}</Typography>
        <Spacer />
      </Box>
      {valintakokeet.map(({ tyyppi: { nimi }, tilaisuudet }, index) => {
        return (
          <div key={`valintakoe-${index}`}>
            <Card
              elevation={1}
              style={{
                backgroundColor: colors.veryLightGrey,
                padding: '15px',
                marginBottom: '20px',
              }}>
              <CardContent>
                <Box py={2}>
                  <Typography
                    id={`${hyphenated(l.localize(nimi))}-${index + 1}`}
                    variant="h4">
                    {l.localize(nimi)}
                  </Typography>
                </Box>
                {tilaisuudet.map(
                  (
                    {
                      lisatietoja,
                      osoite: { osoite, postinumero },
                      aika: { alkaa, paattyy },
                    },
                    index
                  ) => {
                    return (
                      <Grid container key={`koetilaisuus-${index}`}>
                        <Osoite
                          osoite={osoite}
                          lisatietoja={lisatietoja}
                          postinumero={postinumero}
                          alkaa={alkaa}
                          paattyy={paattyy}
                        />
                      </Grid>
                    );
                  }
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </>
  );
};

export default Valintakokeet;