import axios from 'axios';
import { urls } from 'oph-urls-js';
import { Common as C } from '#/src/tools/Utils';

const client = axios.create({
  headers: { 'Caller-Id': '1.2.246.562.10.00000000001.konfoui' },
});

const get = async (url) => {
  const response = await client.get(url);
  return response.data;
};

export const getKoulutus = (oid, draft) =>
  get(urls.url('konfo-backend.koulutus') + oid + (draft ? '?draft=true' : ''));

export const getKoulutusKuvaus = (uri) =>
  get(urls.url('konfo-backend.koulutus.kuvaus') + uri);

export const getKoulutusJarjestajat = (oid) =>
  get(urls.url('konfo-backend.koulutus.jarjestajat', oid));

export const getOppilaitos = (oid) => {
  return client
    .get(urls.url('konfo-backend.oppilaitos') + oid)
    .then((response) => response.data);
};

export const getOppilaitosTajonta = ({ oid, requestParams }) => {
  return client
    .get(urls.url('konfo-backend.oppilaitos.tarjonta', oid), {
      params: C.cleanRequestParams(requestParams),
    })
    .then((response) => response.data);
};
export const getToteutus = (oid) => get(urls.url('konfo-backend.toteutus') + oid);

export const searchAPI = {
  getKoulutukset(requestParams) {
    return client
      .get(urls.url('konfo-backend.search.koulutukset'), {
        params: C.cleanRequestParams(requestParams),
      })
      .then((response) => response.data);
  },
  getOppilaitokset(requestParams) {
    return client
      .get(urls.url('konfo-backend.search.oppilaitokset'), {
        params: C.cleanRequestParams(requestParams),
      })
      .then((response) => response.data);
  },
};
