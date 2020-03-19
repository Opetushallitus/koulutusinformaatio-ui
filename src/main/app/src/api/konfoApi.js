import axios from 'axios';
import { urls } from 'oph-urls-js';

const client = axios.create({
  headers: { 'Caller-Id': '1.2.246.562.10.00000000001.konfoui' },
});

const get = async (url) => {
  const response = await client.get(url);
  return response.data;
};

export const getKoulutus = (oid) =>
  get(urls.url('konfo-backend.koulutus') + oid);

export const getKoulutusKuvaus = (uri) =>
  get(urls.url('konfo-backend.koulutus.kuvaus') + uri);

export const getKoulutusJarjestajat = (oid) =>
  get(urls.url('konfo-backend.koulutus.jarjestajat', oid));
