import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  Typography,
  withStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { groupBy, sortBy, first, uniq, isEmpty } from 'lodash';
import { Localizer as l } from '#/src/tools/Utils';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
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
const Osoite = ({ toimitusaika, sahkoposti, osoite, postinumero }) => {
  const { t } = useTranslation();
  return (
    <>
      <Grid item xs={12}>
        <Box m={1}>
          <Divider />
        </Box>
      </Grid>
      {postinumero ? (
        <>
          <Grid item xs={2}></Grid>
          <Grid item xs={10}>
            <Box m={1}>
              <Typography variant="h5">{t('valintaperuste.toimituspaikka')}</Typography>
              <Typography variant="body1">
                {`${sahkoposti} - ${l.localizeOsoite(osoite, postinumero)}`}
              </Typography>
            </Box>
          </Grid>
        </>
      ) : null}
      <Grid item xs={2}></Grid>
      <Grid item xs={10}>
        <Box m={1}>
          <Typography variant="h5">
            {t('valintaperuste.toimitettava-viimeistään')}
          </Typography>
          <Typography variant="body1">
            {formatHakuaika(new Date(Date.parse(toimitusaika)), t('lomake.klo'))}
          </Typography>
        </Box>
      </Grid>
    </>
  );
};

const FileIcon = withStyles((theme) => ({
  root: {
    color: colors.green,
  },
}))(InsertDriveFileOutlinedIcon);

const Liite = (liite) => {
  return (
    <>
      <Grid item xs={2}>
        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
          <Box m={1}>
            <FileIcon />
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={10}>
        <Box m={1}>
          <Typography variant="h5">{l.localize(liite.nimi)}</Typography>
          <Typography variant="body1">{l.localize(liite.kuvaus)}</Typography>
        </Box>
      </Grid>
    </>
  );
};
const tyypeittain = (liitteet) =>
  sortBy(
    Object.entries(groupBy(liitteet || [], (liite) => l.localize(liite.tyyppi.nimi))),
    first
  );

export const LiitteetSisallysluettelo = (liitteet) => (Lnk) => {
  const tyyppiJaLiite = tyypeittain(liitteet);
  return !isEmpty(tyyppiJaLiite)
    ? tyyppiJaLiite.map(([tyyppi]) => {
        return Lnk(tyyppi);
      })
    : null;
};

const Liitteet = ({ liitteet }) => {
  const { t } = useTranslation();
  const tyyppiJaLiite = tyypeittain(liitteet);

  return !isEmpty(tyyppiJaLiite) ? (
    <>
      <Box py={2}>
        <Typography id={hyphenated(t('valintaperuste.liitteet'))} variant="h2">
          {t('valintaperuste.liitteet')}
        </Typography>
        <Spacer />
      </Box>
      {tyyppiJaLiite.map(([tyyppi, liitteet]) => {
        const liiteAsOsoite = ({
          toimitusaika,
          toimitustapa,
          toimitusosoite: { sahkoposti, osoite: { osoite, postinumero } = {} } = {},
        }) => ({ toimitusaika, toimitustapa, sahkoposti, osoite, postinumero });

        const yhteisetOsoitteet = uniq(liitteet.map(liiteAsOsoite));
        const jaettuOsoite = yhteisetOsoitteet.length === 1;
        return (
          <div key={`liitteet-${tyyppi}`}>
            <Box py={2}>
              <Typography id={hyphenated(tyyppi)} variant="h4">
                {tyyppi}
              </Typography>
            </Box>
            <Card elevation={2}>
              <CardContent>
                {liitteet.map((liite, index) => {
                  return (
                    <Grid container key={`liite-${index}`}>
                      <Liite {...liite} />
                      {!jaettuOsoite ? <Osoite {...liiteAsOsoite(liite)} /> : null}
                    </Grid>
                  );
                })}
                {jaettuOsoite ? <Osoite {...first(yhteisetOsoitteet)} /> : null}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </>
  ) : null;
};

export default Liitteet;
