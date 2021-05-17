export const MUI_BREAKPOINTS = {
  MIN_XL: '(min-width:1920px)',
  MIN_LG: '(min-width:1280px)',
  MIN_MD: '(min-width:960px)',
  MIN_SM: '(min-width:600px)',
  MIN_XS_400: '(min-width:400px)',
} as const;

export const YHTEISHAKU_KOODI_URI = 'hakutapa_01';

export const FILTER_TYPES = {
  KOULUTUSALA: 'koulutusala',
  KOULUTUSTYYPPI: 'koulutustyyppi',
  KOULUTUSTYYPPI_MUU: 'koulutustyyppi-muu',
  OPETUSKIELI: 'opetuskieli',
  KUNTA: 'kunta',
  MAAKUNTA: 'maakunta',
  OPETUSTAPA: 'opetustapa',
  VALINTATAPA: 'valintatapa',
  HAKUKAYNNISSA: 'hakukaynnissa',
  HAKUTAPA: 'hakutapa',
  YHTEISHAKU: 'yhteishaku',
  POHJAKOULUTUSVAATIMUS: 'pohjakoulutusvaatimus',

  SIJAINTI: 'sijainti', // TODO: Poista tämä kun konfo-backend ei enää käytä sijaintirajainta vaan kunta + maakunta
} as const;

export const FILTER_TYPES_ARR = [
  'opetuskieli',
  'koulutusala',
  'koulutustyyppi',
  'kunta',
  'maakunta',
  'opetustapa',
  'valintatapa',
  'hakukaynnissa',
  'hakutapa',
  'yhteishaku',
  'pohjakoulutusvaatimus',
] as const;

// TODO: konfo-backend haluaa turhaan kunta + maakunta rajaimet yhtenä könttinä (sijainti), se pitäisi purkaa sieltä
// Tämän voi poistaa sitten kun konfo-backend ottaa vastaan maakunta + kunta rajaimet
export const FILTER_TYPES_ARR_FOR_KONFO_BACKEND = [
  'opetuskieli',
  'koulutusala',
  'koulutustyyppi',
  'sijainti',
  'opetustapa',
  'valintatapa',
  'hakukaynnissa',
  'hakutapa',
  'yhteishaku',
  'pohjakoulutusvaatimus',
] as const;

export const DRAWER_WIDTH = 330;

export const LANG_NAME_BY_CODE = {
  fi: 'suomi',
  sv: 'ruotsi',
  en: 'englanti',
} as const;

export const KOULUTUS_TYYPPI = {
  AMM: 'amm',
  AMM_TUTKINNON_OSA: 'amm-tutkinnon-osa',
  AMM_OSAAMISALA: 'amm-osaamisala',
} as const;

export const HAKULOMAKE_TYYPPI = {
  EI_SAHKOISTA: 'ei sähköistä',
  MUU: 'muu',
} as const;

export const TOP_BAR_HEIGHT = 90;

// Search related
export const pageSizeArray = [5, 10, 20, 30, 50];
export const pageSortArray = ['score_desc', 'name_asc', 'name_desc'];
