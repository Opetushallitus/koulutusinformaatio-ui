import { Box, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import _fp from 'lodash/fp';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import { NotFound } from '#/src/NotFound';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { Localizer as l } from '#/src/tools/Utils';
import { Translateable } from '#/src/types/common';
import {
  PageData,
  PreviewPageData,
  useValintaperustePageData,
  useValintaperustePreviewPageData,
} from './hooks';
import { Kuvaus, KuvausSisallysluettelo, ValintatavatSisallysluettelo } from './Kuvaus';
import { Liitteet, LiitteetSisallysluettelo } from './Liitteet';
import { Paluu } from './Paluu';
import { Sisallysluettelo } from './Sisallysluettelo';
import { Sora } from './Sora';
import { Valintakokeet, ValintakokeetSisallysluettelo } from './Valintakokeet';
import { Sisalto } from './ValintaperusteTypes';

const useStyles = makeStyles(() => ({
  container: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
}));

const Row: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid container direction="row" justify="center" className={classes.container}>
      <Grid item xs={12} sm={12} md={10}>
        {children}
      </Grid>
    </Grid>
  );
};

type ContentProps = {
  hakukohde?: any;
  kuvaus: Translateable;
  sisalto: Sisalto;
  valintakokeet: any;
  valintaperuste: any;
  valintatavat: any;
  yleiskuvaukset: any;
};

const ValintaperusteContent = ({
  hakukohde,
  kuvaus,
  sisalto,
  valintakokeet,
  valintaperuste,
  valintatavat,
  yleiskuvaukset,
}: ContentProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={12} md={3}>
        {/* TODO: Refactor Sisallysluettelo, this is really complex to read */}
        {/* e.g. just give a precalculated bunch of ids to the component */}
        <Sisallysluettelo>
          {[
            (l: any) => l(t('valintaperuste.kuvaus')),
            // Links to any kuvaus or sisalto subtitles given in HTML-string
            KuvausSisallysluettelo(kuvaus, 'kuvaus-sisallysluettelo'),
            ...(sisalto?.length > 0
              ? sisalto.map((s, i) => KuvausSisallysluettelo(s.data, `sisalto-${i}`))
              : []),

            ValintatavatSisallysluettelo(valintatavat),
            ValintakokeetSisallysluettelo(valintakokeet),
            (l: any) =>
              valintaperuste.sorakuvaus
                ? l(t('valintaperuste.hakijan-terveydentila-ja-toimintakyky'))
                : null,
            (l: any) =>
              !_fp.isEmpty(hakukohde?.liitteet) ? l(t('valintaperuste.liitteet')) : null,
            LiitteetSisallysluettelo(hakukohde?.liitteet),
          ]}
        </Sisallysluettelo>
      </Grid>
      <Grid item xs={12} md={6}>
        <Kuvaus kuvaus={kuvaus} sisalto={sisalto} valintatavat={valintatavat} />
        {valintakokeet.length > 0 && (
          <Valintakokeet yleiskuvaukset={yleiskuvaukset} valintakokeet={valintakokeet} />
        )}
        {valintaperuste.sorakuvaus && <Sora {...valintaperuste.sorakuvaus} />}
        <Liitteet liitteet={hakukohde?.liitteet} />
      </Grid>
    </>
  );
};

export const ValintaperustePreviewPage = () => {
  const classes = useStyles();
  const { valintaperusteId } = useParams<{ valintaperusteId: string }>();
  const { t } = useTranslation();

  const {
    data = {} as PreviewPageData,
    isFetching,
    error,
  } = useValintaperustePreviewPageData({
    valintaperusteId,
  });
  const { valintaperuste } = data;

  const {
    metadata: { kuvaus, sisalto, valintakokeidenYleiskuvaus, valintatavat },
    valintakokeet,
  } = valintaperuste || { metadata: { kuvaus: {}, valintatavat: [] } };
  const yleiskuvaukset = {
    valintaperuste: valintakokeidenYleiskuvaus,
  };

  return isFetching ? (
    <LoadingCircle />
  ) : !error ? (
    <Grid
      container
      direction="row"
      spacing={0}
      justify="flex-start"
      className={classes.container}>
      <Grid item xs={12} md={3} />
      <Grid item xs={12} md={6}>
        <Box pb={2}>
          <Typography variant="h1" component="h1">
            {t('lomake.valintaperusteet')}
          </Typography>
        </Box>
        <Box pb={2}>
          <Divider />
        </Box>
      </Grid>
      <Grid item xs={12} md={3} />
      <ValintaperusteContent
        {...{
          kuvaus,
          sisalto,
          valintakokeet,
          valintaperuste,
          valintatavat,
          yleiskuvaukset,
        }}
      />
    </Grid>
  ) : (
    <NotFound />
  );
};

export const ValintaperustePage = () => {
  const classes = useStyles();
  const { hakukohdeOid } = useParams<{ hakukohdeOid: string }>();
  const { t } = useTranslation();
  const hakuUrl = useSelector(getHakuUrl);

  const { data = {} as PageData, isFetching, error } = useValintaperustePageData({
    hakukohdeOid,
  });
  const { valintaperuste, koulutus, toteutus, hakukohde } = data;

  const {
    metadata: { kuvaus, sisalto, valintakokeidenYleiskuvaus, valintatavat },
  } = valintaperuste || { metadata: { kuvaus: {}, valintatavat: [] } };
  const toteutusLink = toteutus && `/toteutus/${toteutus.oid}`;

  // TODO: when kouta-ui is refactored to use inheritance modify this to not use valintaperuste valintakokeet here
  const valintakokeet =
    _fp.concat(hakukohde?.valintakokeet, valintaperuste?.valintakokeet) || [];
  const yleiskuvaukset = {
    hakukohde: hakukohde?.metadata?.valintakokeidenYleiskuvaus,
    valintaperuste: valintakokeidenYleiskuvaus,
  };

  return isFetching ? (
    <LoadingCircle />
  ) : !error ? (
    <>
      <Row>
        <Murupolku
          path={[
            { name: t('haku.otsikko'), link: hakuUrl.url },
            { name: l.localize(koulutus?.nimi), link: `/koulutus/${koulutus?.oid}` },
            { name: l.localize(toteutus?.nimi), link: toteutusLink },
            { name: l.localize(valintaperuste?.nimi) },
          ]}
        />
      </Row>
      <Grid
        container
        direction="row"
        spacing={0}
        justify="flex-start"
        className={classes.container}>
        <Grid item xs={12} md={3} />
        <Grid item xs={12} md={6}>
          <Paluu paluuLinkki={toteutusLink} />
          <Box pb={2}>
            <Typography variant="h1" component="h1">
              {t('lomake.valintaperusteet')}
            </Typography>
          </Box>
          <Box pb={2}>
            <Divider />
          </Box>
        </Grid>
        <Grid item xs={12} md={3} />
        <ValintaperusteContent
          {...{
            hakukohde,
            kuvaus,
            sisalto,
            valintakokeet,
            valintaperuste,
            valintatavat,
            yleiskuvaukset,
          }}
        />
      </Grid>
    </>
  ) : (
    <NotFound />
  );
};
