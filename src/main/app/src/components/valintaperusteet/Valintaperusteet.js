import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { urls } from 'oph-urls-js';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import superagent from 'superagent';
import { makeStyles, Grid } from '@material-ui/core';

import { Localizer as l } from '#/src/tools/Utils';
import Murupolku from '#/src/components/common/Murupolku';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { getKoulutus } from '#/src/api/konfoApi';

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
const defaultObj = { metadata: { kuvaus: {}, valintatavat: [] } };
const handleResponse = (res) => {
  return res.body || defaultObj;
};
const handleError = (res) => {
  console.log(res);
  return defaultObj;
};
const fetchUrl = (oid, url) => {
  return oid
    ? superagent
        .get(url)
        .retry(2, (err, res) => false)
        .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
        .then(handleResponse, handleError)
    : Promise.resolve(defaultObj);
};

const getValintaperusteet = async (oid) => {
  return fetchUrl(oid, urls.url('konfo-backend.valintaperusteet', oid));
};
const getHakukohde = async (oid) => {
  return fetchUrl(oid, urls.url('konfo-backend.hakukohde', oid));
};
const getHaku = async (oid) => {
  return fetchUrl(oid, urls.url('konfo-backend.haku', oid));
};
const getToteutus = async (oid) => {
  return fetchUrl(oid, urls.url('konfo-backend.toteutus', oid));
};

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

const Valintaperusteet = () => {
  const classes = useStyles();
  const { hakukohdeOid, valintaperusteOid } = useParams();
  const { t } = useTranslation();
  const [valintaperuste, setValintaperuste] = useState();
  const [hakukohde, setHakukohde] = useState();
  const [toteutus, setToteutus] = useState();
  const [koulutus, setKoulutus] = useState();
  const [haku, setHaku] = useState();
  const hakuUrl = useSelector(getHakuUrl);

  useEffect(() => {
    async function getData() {
      const v = getValintaperusteet(valintaperusteOid);
      const h = await getHakukohde(hakukohdeOid);
      setHakukohde(h);
      const hk = await getHaku(h.hakuOid);
      setHaku(hk);
      const t = await getToteutus(h.toteutus.oid);
      setToteutus(t);
      const k = await getKoulutus(t?.koulutusOid);
      setKoulutus(k);
      setValintaperuste(await v);
    }

    getData();
  }, [
    setToteutus,
    hakukohdeOid,
    valintaperusteOid,
    setValintaperuste,
    setHakukohde,
    setHaku,
  ]);

  const loading = !valintaperuste || !hakukohde || !haku || !toteutus;
  const {
    metadata: { kuvaus, valintatavat },
  } = valintaperuste || { metadata: { kuvaus: {}, valintatavat: [] } };
  const paluuLinkki = hakukohde && `/toteutus/${hakukohde.toteutusOid}`;
  return loading ? (
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

export default observer(Valintaperusteet);
