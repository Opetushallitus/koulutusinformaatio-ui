import axios from 'axios';
import { urls } from 'oph-urls-js';
import _ from 'lodash';

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

export const searchAPI = {
  getKoulutukset(requestParams) {
    return client
      .get(urls.url('konfo-backend.search.koulutukset'), {
        params: _.pickBy(requestParams, _.identity),
      })
      .then((response) => response.data);
  },
  getOppilaitokset(requestParams) {
    return client
      .get(urls.url('konfo-backend.search.oppilaitokset'), {
        params: _.pickBy(requestParams, _.identity),
      })
      .then((response) => response.data);
  },
};
