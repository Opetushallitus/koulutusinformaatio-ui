import axios from 'axios';
import { urls } from 'oph-urls-js';
import { Common as C, Localizer as l } from '#/src/tools/Utils';

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

export const getEperusteKuvaus = (uri) =>
  get(urls.url('konfo-backend.eperuste.kuvaus', uri));

export const getKoulutusJarjestajat = (oid, tuleva) =>
  get(
    urls.url('konfo-backend.koulutus.jarjestajat', oid) + (tuleva ? '?tuleva=true' : '')
  );

export const getSuositellutKoulutukset = (requestParams) => {
  return client
    .get(urls.url('konfo-backend.suosittelu'), {
      params: C.cleanRequestParams(requestParams),
    })
    .then((response) => response.data);
};

export const getOppilaitos = (oid) => {
  return client
    .get(urls.url('konfo-backend.oppilaitos', oid))
    .then((response) => response.data);
};

export const getOppilaitosOsa = (oid) => {
  return client
    .get(urls.url('konfo-backend.oppilaitosOsa', oid))
    .then((response) => response.data);
};

export const getOppilaitosTarjonta = ({ oid, requestParams }) => {
  return client
    .get(urls.url('konfo-backend.oppilaitos.tarjonta', oid), {
      params: C.cleanRequestParams(requestParams),
    })
    .then((response) => response.data);
};

export const getOppilaitosOsaTarjonta = ({ oid, requestParams }) => {
  return client
    .get(urls.url('konfo-backend.oppilaitosOsa.tarjonta', oid), {
      params: C.cleanRequestParams(requestParams),
    })
    .then((response) => response.data);
};

export const getToteutus = (oid) => get(urls.url('konfo-backend.toteutus', oid));

export const searchAPI = {
  getKoulutukset(requestParams) {
    return client
      .get(urls.url('konfo-backend.search.koulutukset'), {
        params: { lng: l.getLanguage(), ...C.cleanRequestParams(requestParams) },
      })
      .then((response) => response.data);
  },
  getOppilaitokset(requestParams) {
    return client
      .get(urls.url('konfo-backend.search.oppilaitokset'), {
        params: { lng: l.getLanguage(), ...C.cleanRequestParams(requestParams) },
      })
      .then((response) => response.data);
  },
};
