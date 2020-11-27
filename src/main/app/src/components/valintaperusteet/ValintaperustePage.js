import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { makeStyles, Grid } from '@material-ui/core';
import { useQuery } from 'react-query';

import { Localizer as l } from '#/src/tools/Utils';
import Murupolku from '#/src/components/common/Murupolku';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';

import {
  getKoulutus,
  getToteutus,
  getHaku,
  getHakukohde,
  getValintaperuste,
} from '#/src/api/konfoApi';

import { Sisallysluettelo } from './Sisallysluettelo';
import { Lomake } from './Lomake';
import { Paluu } from './Paluu';
import { Liitteet, LiitteetSisallysluettelo } from './Liitteet';
import { Sora } from './Sora';
import { Valintakokeet, ValintakokeetSisallysluettelo } from './Valintakokeet';
import { Kuvaus, KuvausSisallysluettelo } from './Kuvaus';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
}));

const Row = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      spacing={2}
      justify="center"
      className={classes.container}>
      <Grid item xs={12} sm={12} md={10}>
        {children}
      </Grid>
    </Grid>
  );
};

const getValintaperustePageData = async ({ hakukohdeOid }) => {
  // TODO: Backend should return most of the data using getValintaperuste()
  const hakukohde = await getHakukohde(hakukohdeOid);
  const {
    hakuOid,
    toteutus: hakukohdeToteutus,
    valintaperuste: hakukohdeValintaperuste,
  } = hakukohde ?? {};
  const valintaperuste = await getValintaperuste(hakukohdeValintaperuste?.id);
  const haku = await getHaku(hakuOid);
  const toteutus = await getToteutus(hakukohdeToteutus?.oid);
  const koulutus = await getKoulutus(toteutus?.koulutusOid);

  return { koulutus, toteutus, haku, hakukohde, valintaperuste };
};

const useValintaperustePageData = ({ hakukohdeOid }) => {
  return useQuery(
    ['getValintaperustePageData', { hakukohdeOid }],
    (key, props) => getValintaperustePageData(props),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const ValintaperustePage = () => {
  const classes = useStyles();
  const { hakukohdeOid } = useParams();
  const { t } = useTranslation();
  const hakuUrl = useSelector(getHakuUrl);

  const { data = {}, isFetching } = useValintaperustePageData({
    hakukohdeOid,
  });
  const { valintaperuste, koulutus, toteutus, haku, hakukohde } = data;

  const {
    metadata: { kuvaus, valintatavat },
  } = valintaperuste || { metadata: { kuvaus: {}, valintatavat: [] } };
  const paluuLinkki = hakukohde && `/toteutus/${hakukohde.toteutusOid}`;
  return isFetching ? (
    <LoadingCircle />
  ) : (
    <>
      <Row>
        <Murupolku
          path={[
            { name: t('haku.otsikko'), link: hakuUrl.url },
            { name: l.localize(koulutus?.nimi), link: `/koulutus/${koulutus?.oid}` },
            { name: l.localize(toteutus?.nimi), link: `/toteutus/${toteutus?.oid}` },
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
        <Grid item xs={12} sm={12} md={3} />
        <Grid item xs={12} sm={12} md={6}>
          <Paluu paluuLinkki={paluuLinkki} />
          <Lomake haku={haku} hakukohde={hakukohde} paluuLinkki={paluuLinkki} />
        </Grid>
        <Grid item xs={12} sm={12} md={3} />
        <Grid item xs={12} sm={12} md={3}>
          <Sisallysluettelo>
            {[
              (l) => l(t('valintaperuste.kuvaus')),
              KuvausSisallysluettelo(kuvaus),
              ValintakokeetSisallysluettelo(
                _.concat(hakukohde.valintakokeet, valintaperuste.valintakokeet)
              ),
              (ll) =>
                valintaperuste.sorakuvaus
                  ? ll(l.localize(valintaperuste.sorakuvaus.nimi))
                  : null,
              (l) =>
                !_.isEmpty(hakukohde.liitteet) ? l(t('valintaperuste.liitteet')) : null,
              LiitteetSisallysluettelo(hakukohde.liitteet),
            ]}
          </Sisallysluettelo>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Kuvaus kuvaus={kuvaus} valintatavat={valintatavat} />
          <Valintakokeet
            valintakokeet={_.concat(
              hakukohde.valintakokeet,
              valintaperuste.valintakokeet
            )}
          />
          {valintaperuste.sorakuvaus ? <Sora {...valintaperuste.sorakuvaus} /> : null}
          <Liitteet {...hakukohde} />
          <Paluu paluuLinkki={paluuLinkki} />
        </Grid>
      </Grid>
    </>
  );
};
