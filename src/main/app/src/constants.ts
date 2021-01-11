export const MUI_BREAKPOINTS = {
  MIN_XL: '(min-width:1920px)',
  MIN_LG: '(min-width:1280px)',
  MIN_MD: '(min-width:960px)',
  MIN_SM: '(min-width:600px)',
  MIN_XS_400: '(min-width:400px)',
} as const;

export const FILTER_TYPES = {
  KOULUTUSALA: 'koulutusala',
  KOULUTUSTYYPPI: 'koulutustyyppi',
  KOULUTUSTYYPPI_MUU: 'koulutustyyppi-muu',
  OPETUSKIELI: 'opetuskieli',
  SIJAINTI: 'sijainti',
  OPETUSTAPA: 'opetustapa',
} as const;

export const FILTER_TYPES_ARR = [
  'opetuskieli',
  'koulutusala',
  'koulutustyyppi',
  'sijainti',
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
