import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks';
import { makeStyles } from '@material-ui/core';
import { Localizer as l } from '../../tools/Utils';
import { useTranslation } from 'react-i18next';
import Murupolku from '../common/Murupolku';
import { useParams } from 'react-router-dom';
import LoadingCircle from '../common/LoadingCircle';
import superagent from 'superagent';
import Lomake from '#/src/components/valintaperusteet/Lomake';
import Kuvaus, { KuvausSisallysluettelo } from '#/src/components/valintaperusteet/Kuvaus';
import Liiteet, {
  LiitteetSisallysluettelo,
} from '#/src/components/valintaperusteet/Liitteet';
import Grid from '@material-ui/core/Grid';
import Valintakokeet, {
  ValintakokeetSisallysluettelo,
} from '#/src/components/valintaperusteet/Valintakokeet';
import Sora from '#/src/components/valintaperusteet/Sora';
import Sisallysluottelo from '#/src/components/valintaperusteet/Sisallysluettelo';
import { isEmpty, concat } from 'lodash';
import Paluu from '#/src/components/valintaperusteet/Paluu';

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

const getValintaperusteet = async (urlStore, oid) => {
  return fetchUrl(oid, urlStore.urls.url('konfo-backend.valintaperusteet', oid));
};
const getHakukohde = async (urlStore, oid) => {
  return fetchUrl(oid, urlStore.urls.url('konfo-backend.hakukohde', oid));
};
const getHaku = async (urlStore, oid) => {
  return fetchUrl(oid, urlStore.urls.url('konfo-backend.haku', oid));
};
const getToteutus = async (urlStore, oid) => {
  return fetchUrl(oid, urlStore.urls.url('konfo-backend.toteutus', oid));
};

/*const getOppilaitos = async (urlStore, oid) => {
  return superagent
    .get(urlStore.urls.url('konfo-backend.oppilaitos', oid))
    .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
    .then((res) => res.body)
    .catch((error) => console.log(error));
};*/

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
  const { urlStore } = useStores();
  const { t } = useTranslation();
  const [valintaperuste, setValintaperuste] = useState();
  const [hakukohde, setHakukohde] = useState();
  const [toteutus, setToteutus] = useState();
  const [haku, setHaku] = useState();

  useEffect(() => {
    async function getData() {
      const v = getValintaperusteet(urlStore, valintaperusteOid);
      const h = await getHakukohde(urlStore, hakukohdeOid);
      setHakukohde(h);
      const hk = await getHaku(urlStore, h.hakuOid);
      setHaku(hk);
      setToteutus(await getToteutus(urlStore, h.toteutus.oid));
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
    urlStore,
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
            { name: t('koulutus.hakutulos'), link: 'hakuStore.createHakuUrl' },
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
          <Sisallysluottelo>
            {[
              (l) => l(t('valintaperuste.kuvaus')),
              KuvausSisallysluettelo(kuvaus),
              ValintakokeetSisallysluettelo(
                concat(hakukohde.valintakokeet, valintaperuste.valintakokeet)
              ),
              (ll) =>
                valintaperuste.sorakuvaus
                  ? ll(l.localize(valintaperuste.sorakuvaus.nimi))
                  : null,
              (l) =>
                !isEmpty(hakukohde.liitteet) ? l(t('valintaperuste.liitteet')) : null,
              LiitteetSisallysluettelo(hakukohde.liitteet),
            ]}
          </Sisallysluottelo>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Kuvaus kuvaus={kuvaus} valintatavat={valintatavat} />
          <Valintakokeet
            valintakokeet={concat(hakukohde.valintakokeet, valintaperuste.valintakokeet)}
          />
          {valintaperuste.sorakuvaus ? <Sora {...valintaperuste.sorakuvaus} /> : null}
          <Liiteet {...hakukohde} />
          <Paluu paluuLinkki={paluuLinkki} />
        </Grid>
      </Grid>
    </>
  );
};

export default observer(Valintaperusteet);
