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
  'konfo-backend.palaute': '/konfo-backend/palaute',
  'konfo-backend.koulutus.jarjestajat': '/konfo-backend/search/koulutus/$1/jarjestajat',
  'konfo-backend.oppilaitos.tarjonta': '/konfo-backend/search/oppilaitos/$1/tarjonta',
  'konfo-backend.hakukohde': '/konfo-backend/hakukohde/$1',
  'konfo-backend.haku': '/konfo-backend/haku/$1',
  'konfo-backend.koulutus.kuvaus': '/konfo-backend/kuvaus/',
  'konfo-backend.eperuste.kuvaus': '/konfo-backend/eperuste/$1',
  'kartta.base-url': 'https://hkp.maanmittauslaitos.fi',
  'kartta.publish-url':
    'https://hkp.maanmittauslaitos.fi/hkp/published/$1/277da693-ae10-4508-bc5a-d6ced2056fd0',
};

const development = {
  'konfo-backend.base-url': 'https://beta.hahtuvaopintopolku.fi',
  'konfo-backend.old-oppija': '/',
  'konfo-backend.search.koulutukset':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/search/koulutukset',
  'konfo-backend.suosittelu': 'https://beta.testiopintopolku.fi/konfo-backend/suosittelu',
  'konfo-backend.search.oppilaitokset':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/search/oppilaitokset',
  'konfo-backend.koulutus': 'https://beta.hahtuvaopintopolku.fi/konfo-backend/koulutus/',
  'konfo-backend.koulutus.kuvaus':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/kuvaus/',
  'konfo-backend.eperuste.kuvaus':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/eperuste/$1',
  'konfo-backend.tutkinnonosat.kuvaus':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/tutkinnonosa/$1',
  'konfo-backend.valintaperusteet':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/valintaperuste/$1',
  'konfo-backend.toteutus':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/toteutus/$1',
  'konfo-backend.oppilaitos':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/oppilaitos/$1',
  'konfo-backend.palaute': 'https://beta.hahtuvaopintopolku.fi/konfo-backend/palaute',
  'konfo-backend.hakukohde':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/hakukohde/$1',
  'konfo-backend.haku': 'https://beta.hahtuvaopintopolku.fi/konfo-backend/haku/$1',
  'konfo-backend.koulutus.jarjestajat':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/search/koulutus/$1/jarjestajat',
  'konfo-backend.oppilaitos.tarjonta':
    'https://beta.hahtuvaopintopolku.fi/konfo-backend/search/oppilaitos/$1/tarjonta',
  'eperusteet-service.eperuste.kuvaus':
    'https://eperusteet.hahtuvaopintopolku.fi/#/$1/esitys/$2/reformi/tutkinnonosat/$3',
  'kartta.base-url': 'https://hkp.maanmittauslaitos.fi',
  'kartta.publish-url':
    'https://hkp.maanmittauslaitos.fi/hkp/published/$1/277da693-ae10-4508-bc5a-d6ced2056fd0',
};

export { production, development };
