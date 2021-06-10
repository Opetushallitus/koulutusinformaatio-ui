import axios from 'axios';
import _ from 'lodash';
import { urls } from 'oph-urls-js';
import qs from 'query-string';

import { getLanguage } from '#/src/tools/localization';
import { Common as C } from '#/src/tools/utils';

const client = axios.create({
  headers: { 'Caller-Id': '1.2.246.562.10.00000000001.konfoui' },
});

const get = async (url, config = {}) => {
  const response = await client.get(url, config);
  return response.data;
};

const createEntityGetter = (entityName) => (oid, draft) =>
  get(
    urls.url(`konfo-backend.${entityName}`, oid),
    draft ? { params: { draft: true } } : {}
  );

export const getKoulutus = createEntityGetter('koulutus');

export const getKoulutusKuvaus = (ePerusteId) =>
  get(urls.url('konfo-backend.koulutus.kuvaus', ePerusteId));

export const getEperusteKuvaus = (ePerusteId) =>
  get(urls.url('konfo-backend.eperuste.kuvaus', ePerusteId));

export const getKoulutusJarjestajat = (oid, requestParams) =>
  get(urls.url('konfo-backend.koulutus.jarjestajat', oid), {
    params: C.cleanRequestParams({
      ...requestParams,
    }),
  });

export const getSuositellutKoulutukset = (requestParams) =>
  get(urls.url('konfo-backend.suosittelu'), {
    params: C.cleanRequestParams(requestParams),
  });

export const getOppilaitos = createEntityGetter('oppilaitos');

export const getOppilaitosOsa = createEntityGetter('oppilaitosOsa');

export const getOppilaitosTarjonta = ({ oid, requestParams }) =>
  get(urls.url('konfo-backend.oppilaitos.tarjonta', oid), {
    params: C.cleanRequestParams(requestParams),
  });

export const getOppilaitosOsaTarjonta = ({ oid, requestParams }) =>
  get(urls.url('konfo-backend.oppilaitosOsa.tarjonta', oid), {
    params: C.cleanRequestParams(requestParams),
  });

export const getToteutus = createEntityGetter('toteutus');

export const getToteutusOsaamisalaKuvaus = ({ ePerusteId, requestParams }) => {
  return client
    .get(urls.url('konfo-backend.kuvaus.osaamisalat', ePerusteId), {
      params: C.cleanRequestParams(requestParams),
    })
    .then((response) => response.data);
};

export const getHakukohde = createEntityGetter('hakukohde');

export const getValintaperuste = createEntityGetter('valintaperusteet');

export const searchAPI = {
  getKoulutukset(requestParams) {
    return get(urls.url('konfo-backend.search.koulutukset'), {
      params: { lng: getLanguage(), ...C.cleanRequestParams(requestParams) },
    });
  },
  getOppilaitokset(requestParams) {
    return get(urls.url('konfo-backend.search.oppilaitokset'), {
      params: { lng: getLanguage(), ...C.cleanRequestParams(requestParams) },
    });
  },
};

export const postClientError = (errorData) =>
  client.post('/konfo-backend/client-error', errorData);

export const sendPalaute = ({ arvosana, palaute }) =>
  client({
    method: 'post',
    url: urls.url('konfo-backend.palaute'),
    data: qs.stringify({
      arvosana,
      palaute,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

export const getContentfulManifest = () =>
  axios.get(urls.url('konfo-backend.content', 'manifest.json'));

function reduceToKeyValue(values = []) {
  return values.reduce((res, value) => {
    res[value.id] = value;
    if (value.url) {
      res[value.url] = value;
    }
    if (value.slug) {
      res[value.slug] = value;
    }
    if (value.sivu?.id) {
      res[value.sivu.id] = value;
    }
    return res;
  }, {});
}

export const getContentfulData = (manifest, lang) => {
  return Promise.all(
    _.map(manifest?.data, (v, key) => {
      if (v[lang] === undefined) {
        console.log(
          'Sisältöä valitulle kielelle ei löydy! ' + JSON.stringify(v) + ', key ' + key
        );
        return null;
      }
      const url = urls.url('konfo-backend.content', '') + v[lang];
      return axios.get(url).then((res) => {
        return { [key]: reduceToKeyValue(res?.data) };
      });
    })
  ).then((all) => {
    const contentfulData = Object.assign({}, ...all);
    const slugsToIds = Object.fromEntries(
      Object.values(contentfulData?.sivu).map((sivu) => [
        sivu.slug,
        { language: lang, id: sivu.id },
      ])
    );
    return { contentfulData, slugsToIds };
  });
};
