import axios from 'axios';
import { urls } from 'oph-urls-js';
import qs from 'query-string';
import { Common as C, Localizer as l } from '#/src/tools/Utils';

const client = axios.create({
  headers: { 'Caller-Id': '1.2.246.562.10.00000000001.konfoui' },
});

const get = async (url, config = {}) => {
  const response = await client.get(url, config);
  return response.data;
};

// TODO: Why is this ' + oid' and not '(..., oid)' ? needs fixing to urls
export const getKoulutus = (oid, draft) =>
  get(urls.url('konfo-backend.koulutus') + oid, draft ? { params: { draft: true } } : {});

// TODO: Why is this ' + oid' and not '(..., oid)' ? needs fixing to urls
export const getKoulutusKuvaus = (uri) =>
  get(urls.url('konfo-backend.koulutus.kuvaus') + uri);

export const getEperusteKuvaus = (uri) =>
  get(urls.url('konfo-backend.eperuste.kuvaus', uri));

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

export const getOppilaitos = (oid) => get(urls.url('konfo-backend.oppilaitos', oid));

export const getOppilaitosOsa = (oid) =>
  get(urls.url('konfo-backend.oppilaitosOsa', oid));

export const getOppilaitosTarjonta = ({ oid, requestParams }) =>
  get(urls.url('konfo-backend.oppilaitos.tarjonta', oid), {
    params: C.cleanRequestParams(requestParams),
  });

export const getOppilaitosOsaTarjonta = ({ oid, requestParams }) =>
  get(urls.url('konfo-backend.oppilaitosOsa.tarjonta', oid), {
    params: C.cleanRequestParams(requestParams),
  });

export const getToteutus = (oid, draft) =>
  get(urls.url('konfo-backend.toteutus', oid), draft ? { params: { draft: true } } : {});

export const getToteutusOsaamisalaKuvaus = ({ ePerusteId, requestParams }) => {
  return client
    .get(urls.url('konfo-backend.kuvaus.osaamisalat', ePerusteId), {
      params: C.cleanRequestParams(requestParams),
    })
    .then((response) => response.data);
};

export const getHakukohde = (oid, draft) =>
  get(urls.url('konfo-backend.hakukohde', oid), draft ? { params: { draft: true } } : {});

export const getValintaperuste = (oid, draft) =>
  get(
    urls.url('konfo-backend.valintaperusteet', oid),
    draft ? { params: { draft: true } } : {}
  );

export const searchAPI = {
  getKoulutukset(requestParams) {
    return get(urls.url('konfo-backend.search.koulutukset'), {
      params: { lng: l.getLanguage(), ...C.cleanRequestParams(requestParams) },
    });
  },
  getOppilaitokset(requestParams) {
    return get(urls.url('konfo-backend.search.oppilaitokset'), {
      params: { lng: l.getLanguage(), ...C.cleanRequestParams(requestParams) },
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
