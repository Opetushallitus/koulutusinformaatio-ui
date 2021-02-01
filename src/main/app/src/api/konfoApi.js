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

// TODO: hooks to calling code to give draft parameter
export const getOppilaitos = createEntityGetter('oppilaitos');

// TODO: hooks to calling code to give draft parameter
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
