import { urls } from 'oph-urls-js';

const CALLER_ID = '1.2.246.562.10.00000000001.konfoui';

// TODO: Add all missing urls to spring boot wrapper and remove production url overrides from here
const production = {
  'konfo-backend.base-url': '/',
  'konfo-backend.old-oppija': '/',
  'konfo-backend.search.koulutukset': '/konfo-backend/search/koulutukset',
  'konfo-backend.search.oppilaitokset': '/konfo-backend/search/oppilaitokset',
  'konfo-backend.koulutus': '/konfo-backend/koulutus/',
  'konfo-backend.suosittelu': '/konfo-backend/suosittelu',
  'konfo-backend.toteutus': '/konfo-backend/toteutus/$1',
  'konfo-backend.valintaperusteet': '/konfo-backend/valintaperuste/$1',
  'konfo-backend.oppilaitos': '/konfo-backend/oppilaitos/$1',
  'konfo-backend.oppilaitosOsa': '/konfo-backend/oppilaitoksen-osa/$1',
  'konfo-backend.palaute': '/konfo-backend/palaute',
  'konfo-backend.koulutus.jarjestajat': '/konfo-backend/search/koulutus/$1/jarjestajat',
  'konfo-backend.oppilaitos.tarjonta': '/konfo-backend/search/oppilaitos/$1/tarjonta',
  'konfo-backend.oppilaitosOsa.tarjonta':
    '/konfo-backend/search/oppilaitoksen-osa/$1/tarjonta',
  'konfo-backend.hakukohde': '/konfo-backend/hakukohde/$1',
  'konfo-backend.haku': '/konfo-backend/haku/$1',
  'konfo-backend.koulutus.kuvaus': '/konfo-backend/kuvaus/',
  'konfo-backend.eperuste.kuvaus': '/konfo-backend/eperuste/$1',
  'kartta.base-url': 'https://hkp.maanmittauslaitos.fi',
  'kartta.publish-url':
    'https://hkp.maanmittauslaitos.fi/hkp/published/$1/277da693-ae10-4508-bc5a-d6ced2056fd0',
};

const development = {
  ...production,
  'konfo-backend.old-oppija': '/',
  'konfo-backend.content': 'https://konfo-content.untuvaopintopolku.fi/$1',
  'konfo-backend.suosittelu': 'https://beta.testiopintopolku.fi/konfo-backend/suosittelu',
  'eperusteet-service.eperuste.kuvaus':
    'https://eperusteet.hahtuvaopintopolku.fi/#/$1/esitys/$2/reformi/tutkinnonosat/$3',
  'kartta.base-url': 'https://hkp.maanmittauslaitos.fi',
  'kartta.publish-url':
    'https://hkp.maanmittauslaitos.fi/hkp/published/$1/277da693-ae10-4508-bc5a-d6ced2056fd0',
};

export const configureUrls = async () => {
  const { NODE_ENV } = process.env;
  urls.addCallerId(CALLER_ID);
  if (['development', 'test'].includes(NODE_ENV)) {
    urls.addProperties(development);
  } else {
    await urls.load('/konfo/rest/config/frontProperties');
    urls.addOverrides(production);
  }
};
