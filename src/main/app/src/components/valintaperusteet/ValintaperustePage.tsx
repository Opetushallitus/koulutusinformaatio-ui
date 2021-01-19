import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import _fp from 'lodash/fp';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getHakukohde,
  getKoulutus,
  getToteutus,
  getValintaperuste,
} from '#/src/api/konfoApi';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { Localizer as l } from '#/src/tools/Utils';
import { Kuvaus, KuvausSisallysluettelo, ValintatavatSisallysluettelo } from './Kuvaus';
import { Liitteet, LiitteetSisallysluettelo } from './Liitteet';
import { Paluu } from './Paluu';
import { Sisallysluettelo } from './Sisallysluettelo';
import { Sora } from './Sora';
import { Valintakokeet, ValintakokeetSisallysluettelo } from './Valintakokeet';

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

type PageDataProps = {
  hakukohdeOid: string;
};
type PageData = {
  valintaperuste: any;
  koulutus: any;
  toteutus: any;
  hakukohde: any;
};

const getValintaperustePageData = async ({ hakukohdeOid }: PageDataProps) => {
  // TODO: Backend should return most of the data using getValintaperuste()
  const hakukohde = await getHakukohde(hakukohdeOid);
  const { toteutus: hakukohdeToteutus, valintaperuste: hakukohdeValintaperuste } =
    hakukohde ?? {};
  const valintaperuste = await getValintaperuste(hakukohdeValintaperuste?.id);
  const toteutus = await getToteutus(hakukohdeToteutus?.oid);
  const koulutus = await getKoulutus(toteutus?.koulutusOid);

  return { koulutus, toteutus, hakukohde, valintaperuste };
};

const useValintaperustePageData = ({ hakukohdeOid }: PageDataProps) => {
  return useQuery<PageData>(
    ['getValintaperustePageData', { hakukohdeOid }],
    (_, props: PageDataProps) => getValintaperustePageData(props),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const ValintaperustePage = () => {
  const classes = useStyles();
  const { hakukohdeOid } = useParams<PageDataProps>();
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

  const valintakokeet =
    _fp.concat(hakukohde?.valintakokeet, valintaperuste?.valintakokeet) || [];
  const yleiskuvaukset = [
    hakukohde?.metadata?.valintakokeidenYleiskuvaus,
    valintakokeidenYleiskuvaus,
  ].filter(Boolean);

  return isFetching ? (
    <LoadingCircle />
  ) : (
    !error && (
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
          </Grid>
          <Grid item xs={12} md={3} />
          <Grid item xs={12} md={3}>
            {/* TODO: Refactor Sisallysluettelo, this is really complex to read */}
            {/* e.g. just give a precalculated bunch of ids to the component */}
            <Sisallysluettelo>
              {[
                (l: any) => l(t('valintaperuste.kuvaus')),
                // Links to any kuvaus or sisalto subtitles given in HTML-string
                KuvausSisallysluettelo(kuvaus, 'kuvaus-sisallysluettelo'),
                ...(sisalto?.length > 0
                  ? sisalto.map((s: any, i: number) =>
                      KuvausSisallysluettelo(s.data, `sisalto-${i}`)
                    )
                  : []),

                ValintatavatSisallysluettelo(valintatavat),
                ValintakokeetSisallysluettelo(valintakokeet),
                (ll: any) =>
                  valintaperuste.sorakuvaus
                    ? ll(t('valintaperuste.hakijan-terveydentila-ja-toimintakyky'))
                    : null,
                (l: any) =>
                  !_fp.isEmpty(hakukohde?.liitteet)
                    ? l(t('valintaperuste.liitteet'))
                    : null,
                LiitteetSisallysluettelo(hakukohde?.liitteet),
              ]}
            </Sisallysluettelo>
          </Grid>
          <Grid item xs={12} md={6}>
            <Kuvaus kuvaus={kuvaus} sisalto={sisalto} valintatavat={valintatavat} />
            {valintakokeet.length > 0 && (
              <Valintakokeet
                yleiskuvaukset={yleiskuvaukset}
                valintakokeet={valintakokeet}
              />
            )}
            {valintaperuste.sorakuvaus && <Sora {...valintaperuste.sorakuvaus} />}
            <Liitteet liitteet={hakukohde?.liitteet} />
          </Grid>
        </Grid>
      </>
    )
  );
};
