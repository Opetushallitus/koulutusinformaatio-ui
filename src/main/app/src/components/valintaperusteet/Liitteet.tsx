import React from 'react';

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { localize, localizeOsoite } from '#/src/tools/localization';
import { formatDateString, toId } from '#/src/tools/Utils';
import { Koodi, Translateable } from '#/src/types/common';
import { Liite } from '#/src/types/ValintaperusteTypes';

type OsoiteProps = {
  toimitusaika: string;
  sahkoposti: string;
  osoite: Translateable;
  postinumero?: Koodi;
};

const OsoiteComponent = ({
  toimitusaika,
  sahkoposti,
  osoite,
  postinumero,
}: OsoiteProps) => {
  const { t } = useTranslation();
  return (
    <Grid item container xs={12}>
      <Grid item xs={12}>
        <Box m={1}>
          <Divider />
        </Box>
      </Grid>
      {postinumero && (
        <>
          <Grid item xs={2}></Grid>
          <Grid item xs={10}>
            <Box m={1}>
              <Typography variant="h5">{t('valintaperuste.toimituspaikka')}</Typography>
              <Typography variant="body1">
                {`${sahkoposti} - ${localizeOsoite(osoite, postinumero)}`}
              </Typography>
            </Box>
          </Grid>
        </>
      )}
      <Grid item xs={2}></Grid>
      <Grid item xs={10}>
        <Box m={1}>
          <Typography variant="h5">
            {t('valintaperuste.toimitettava-viimeistään')}
          </Typography>
          <Typography variant="body1">{formatDateString(toimitusaika)}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

const FileIcon = withStyles(() => ({
  root: {
    color: colors.brandGreen,
    marginTop: 12,
  },
}))(InsertDriveFileOutlinedIcon);

const LiiteComponent = ({ nimi, kuvaus }: Liite) => (
  <>
    <Grid item container xs={2} justify="flex-end">
      <FileIcon />
    </Grid>
    <Grid item xs={10}>
      <Box m={1}>
        <Typography variant="h5">{localize(nimi)}</Typography>
        <LocalizedHTML data={kuvaus} />
      </Box>
    </Grid>
  </>
);

const tyypeittain = (liitteet: Array<Liite>) =>
  _.sortBy(
    Object.entries(_.groupBy(liitteet || [], (liite) => localize(liite.tyyppi.nimi))),
    _.first
  );

export const LiitteetSisallysluettelo = (liitteet: Array<Liite>) => (Lnk: any) => {
  const tyyppiJaLiite = tyypeittain(liitteet);
  return tyyppiJaLiite.map(([tyyppi]) => Lnk(tyyppi));
};

type Props = {
  liitteet: Array<Liite>;
};

const liiteAsOsoite = ({
  toimitusaika,
  toimitustapa,
  toimitusosoite: { sahkoposti, osoite: { osoite, postinumero } = {} as any } = {} as any,
}: Liite) => ({ toimitusaika, toimitustapa, sahkoposti, osoite, postinumero });

export const Liitteet = ({ liitteet }: Props) => {
  const { t } = useTranslation();
  const tyyppiJaLiite = tyypeittain(liitteet);

  return (
    <Grid item container direction="column" xs={12}>
      <Box py={4}>
        <Divider />
      </Box>
      <Typography id={toId(t('valintaperuste.liitteet'))} variant="h2">
        {t('valintaperuste.liitteet')}
      </Typography>
      {tyyppiJaLiite.map(([tyyppi, liitteet]) => {
        const yhteisetOsoitteet = _.uniqWith(liitteet.map(liiteAsOsoite), _.isEqual);
        const jaettuOsoite = yhteisetOsoitteet.length === 1;

        return (
          <div key={`liitteet-${tyyppi}`}>
            <Box py={2}>
              <Typography id={toId(tyyppi)} variant="h4">
                {tyyppi}
              </Typography>
            </Box>
            <Card elevation={2}>
              <CardContent>
                <Grid container>
                  {liitteet.map((liite, index) => (
                    <React.Fragment key={`liite-${index}`}>
                      <LiiteComponent {...liite} />
                      {!jaettuOsoite && <OsoiteComponent {...liiteAsOsoite(liite)} />}
                    </React.Fragment>
                  ))}
                </Grid>
                {jaettuOsoite && <OsoiteComponent {..._.head(yhteisetOsoitteet)!} />}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </Grid>
  );
};
