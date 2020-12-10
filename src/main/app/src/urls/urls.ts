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

const devBaseUrl =
  process.env.REACT_APP_DEV_BASE_URL || 'https://beta.hahtuvaopintopolku.fi';

const development = {
  'konfo-backend.base-url': `${devBaseUrl}`,
  'konfo-backend.old-oppija': '/',
  'konfo-backend.search.koulutukset': `${devBaseUrl}/konfo-backend/search/koulutukset`,
  'konfo-backend.suosittelu': 'https://beta.testiopintopolku.fi/konfo-backend/suosittelu',
  'konfo-backend.search.oppilaitokset': `${devBaseUrl}/konfo-backend/search/oppilaitokset`,
  'konfo-backend.koulutus': `${devBaseUrl}/konfo-backend/koulutus/`,
  'konfo-backend.koulutus.kuvaus': `${devBaseUrl}/konfo-backend/kuvaus/`,
  'konfo-backend.eperuste.kuvaus': `${devBaseUrl}/konfo-backend/eperuste/$1`,
  'konfo-backend.tutkinnonosat.kuvaus': `${devBaseUrl}/konfo-backend/tutkinnonosa/$1`,
  'konfo-backend.valintaperusteet': `${devBaseUrl}/konfo-backend/valintaperuste/$1`,
  'konfo-backend.toteutus': `${devBaseUrl}/konfo-backend/toteutus/$1`,
  'konfo-backend.oppilaitos': `${devBaseUrl}/konfo-backend/oppilaitos/$1`,
  'konfo-backend.oppilaitosOsa': `${devBaseUrl}/konfo-backend/oppilaitoksen-osa/$1`,
  'konfo-backend.palaute': `${devBaseUrl}/konfo-backend/palaute`,
  'konfo-backend.hakukohde': `${devBaseUrl}/konfo-backend/hakukohde/$1`,
  'konfo-backend.haku': `${devBaseUrl}/konfo-backend/haku/$1`,
  'konfo-backend.koulutus.jarjestajat': `${devBaseUrl}/konfo-backend/search/koulutus/$1/jarjestajat`,
  'konfo-backend.oppilaitos.tarjonta': `${devBaseUrl}/konfo-backend/search/oppilaitos/$1/tarjonta`,
  'konfo-backend.oppilaitosOsa.tarjonta': `${devBaseUrl}/konfo-backend/search/oppilaitoksen-osa/$1/tarjonta`,
  'eperusteet-service.eperuste.kuvaus':
    'https://eperusteet.hahtuvaopintopolku.fi/#/$1/esitys/$2/reformi/tutkinnonosat/$3',
  'kartta.base-url': 'https://hkp.maanmittauslaitos.fi',
  'kartta.publish-url':
    'https://hkp.maanmittauslaitos.fi/hkp/published/$1/277da693-ae10-4508-bc5a-d6ced2056fd0',
};

export { production, development };
