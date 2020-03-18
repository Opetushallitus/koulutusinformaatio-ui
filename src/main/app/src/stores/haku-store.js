import { observable, computed, action, runInAction, set } from 'mobx';
import { Localizer as l } from '../tools/Utils';

const emptyFilter = {
  koulutus: [],
  koulutustyyppi: [],
  koulutusala: [],
  kieli: [],
  opetuskieli: [],
  paikkakunta: '',
  sijainti: [],
  selectedsijainnit: [],
};

class HakuStore {
  @observable state = 'pending';
  @observable keyword = '';
  @observable koulutusResult = [];
  @observable koulutusCount = 0;
  @observable koulutusTotal = 0;
  @observable koulutusOffset = 0;
  @observable koulutusFilters = {
    opetusKieli: {},
    koulutusTyyppi: {},
    koulutusala: {},
    maakunta: {},
    kunta: {},
  };
  @observable oppilaitosResult = [];
  @observable oppilaitosCount = 0;
  @observable oppilaitosTotal = 0;
  @observable oppilaitosOffset = 0;
  @observable oppilaitosFilters = {
    opetusKieli: {},
    koulutusTyyppi: {},
    koulutusala: {},
    maakunta: {},
    kunta: {},
  };
  @observable toggle = 'koulutus';
  @observable paging = {
    pageOppilaitos: 1,
    pageKoulutus: 1,
    pageSize: 20,
  };
  @observable sort = 'asc';
  @observable filter = {
    koulutus: [],
    koulutustyyppi: [],
    koulutusala: [],
    kieli: [],
    opetuskieli: [],
    paikkakunta: '',
    sijainti: [],
    selectedsijainnit: [],
  };
  @observable pageSizeArray = [5, 10, 20, 30, 50];
  @observable showHakutulosFilters = false;

  constructor(rest) {
    this.rest = rest;
  }

  @action
  setAll = (keyword, search, toggleAction) => {
    const keywordChange = this.setKeyword(keyword);
    if (keywordChange) {
      this.searchAll(() => {
        if (!search.toggle) {
          const toggle =
            this.koulutusCount <= 0 && this.oppilaitosCount > this.koulutusCount
              ? 'oppilaitos'
              : 'koulutus';
          this.setToggle(toggle);
          if (toggleAction) {
            toggleAction(toggle);
          }
        } else {
          this.setToggle(search.toggle);
        }
      });
    }
  };

  @computed get keywordSet() {
    return !!(this.keyword && !(0 === this.keyword.length));
  }

  @action
  setKeyword = (keyword) => {
    const newKeyword = keyword ? keyword : '';
    const change = this.keyword !== newKeyword;
    this.keyword = newKeyword;
    return change;
  };

  @computed get filterSet() {
    return !!(
      this.filter.paikkakunta ||
      this.filter.koulutus.length ||
      this.filter.kieli.length
    );
  }

  @action
  setFilter = (filter) => {
    function compare(a1, a2) {
      return a1.length === a2.length && a1.every((v, i) => v === a2[i]);
    }

    //TODO check allowed values
    const koulutus = filter.koulutus ? filter.koulutus.split(',') : [];
    const kieli = filter.kieli ? filter.kieli.split(',') : [];
    const paikkakunta = filter.paikkakunta
      ? filter.paikkakunta.toLowerCase()
      : '';

    const change = !(
      this.filter.paikkakunta === paikkakunta &&
      compare(this.filter.koulutus, koulutus) &&
      compare(this.filter.kieli, kieli)
    );

    this.filter.koulutus = koulutus;
    this.filter.kieli = kieli;
    this.filter.paikkakunta = paikkakunta;

    return change;
  };

  @action
  setPaging = (paging) => {
    function pos(p, d) {
      return p > 0 ? p : d;
    }

    const pageOppilaitos = pos(Number(paging.pageOppilaitos), 1);
    const pageKoulutus = pos(Number(paging.pageKoulutus), 1);
    const pageSize = pos(Number(paging.pageSize), 20);

    const oppilaitosChange = this.paging.pageOppilaitos !== pageOppilaitos;
    const koulutusChange = this.paging.pageKoulutus !== pageKoulutus;
    const pageChange = this.paging.pageSize !== pageSize;

    this.paging.pageOppilaitos = pageOppilaitos;
    this.paging.pageKoulutus = pageKoulutus;
    this.paging.pageSize = pageSize;

    return {
      koulutus: pageChange || koulutusChange,
      oppilaitos: pageChange || oppilaitosChange,
    };
  };

  @action
  setKoulutusOffset = (offset) => {
    this.koulutusOffset = offset;
  };

  @action
  setOppilaitosOffset = (offset) => {
    this.oppilaitosOffset = offset;
  };

  @action
  setPagingPageKoulutus = (page) => {
    this.paging.pageKoulutus = page;
  };

  @action
  setPagingPageOppilaitos = (page) => {
    this.paging.pageOppilaitos = page;
  };

  @action
  setPagingPageSize = (newPageSize) => {
    this.paging.pageSize = newPageSize;
  };

  @action
  setToggle = (toggle) => {
    const newToggle =
      toggle && toggle.toLowerCase() === 'koulutus' ? 'koulutus' : 'oppilaitos';
    const change = this.toggle !== newToggle;
    this.toggle = newToggle;
    return change;
  };

  @action
  toggleSort = (newSort) => {
    const change = this.sort !== newSort;
    this.sort = newSort;
    return change;
  };

  @action
  setOpetusKieliFilter = (valitutOpetusKielet = []) => {
    const change = valitutOpetusKielet !== this.filter.opetuskieli;
    this.filter.opetuskieli = valitutOpetusKielet;
    return change;
  };

  @action
  setSijaintiFilter = (valitutSijainnit = []) => {
    const change = valitutSijainnit !== this.filter.sijainti;
    this.filter.sijainti = valitutSijainnit;
    return change;
  };

  @action
  setSelectedSijaintiFilter = (selectedSijainnit = []) => {
    const change = selectedSijainnit !== this.filter.selectedsijainnit;
    this.filter.selectedsijainnit = selectedSijainnit;
    return change;
  };

  @action
  setKoulutusTyyppiFilter = (valitutKoulutusTyypit = []) => {
    const change = valitutKoulutusTyypit !== this.filter.koulutustyyppi;
    this.filter.koulutustyyppi = valitutKoulutusTyypit;
    return change;
  };

  @action
  setKoulutusalaFilter = (valitutKoulutusAlat = []) => {
    const change = valitutKoulutusAlat !== this.filter.koulutusala;
    this.filter.koulutusala = valitutKoulutusAlat;
    return change;
  };

  @computed get toggleKoulutus() {
    return 'koulutus' === this.toggle;
  }

  @computed get hasKoulutusResult() {
    return this.koulutusResult ? 0 < this.koulutusResult.length : false;
  }

  @computed get hasOppilaitosResult() {
    return this.oppilaitosResult ? 0 < this.oppilaitosResult.length : false;
  }

  @computed get totalCount() {
    return this.koulutusCount + this.oppilaitosCount;
  }

  @computed get createHakuUrl() {
    /* Don't use searchParams() here, because in some cases it's not computed/updated correctly */
    return (
      '/haku' +
      (this.keywordSet ? '/' + this.keyword : '') +
      '?toggle=' +
      (this.toggleKoulutus ? 'koulutus' : 'oppilaitos') +
      '&kpage=' +
      this.paging.pageKoulutus +
      '&opage=' +
      this.paging.pageOppilaitos +
      '&pagesize=' +
      this.paging.pageSize +
      (this.filter.paikkakunta
        ? '&paikkakunta=' + this.filter.paikkakunta
        : '') +
      (this.filter.koulutus.length
        ? '&koulutustyyppi=' + this.filter.koulutus.join(',')
        : '') +
      (this.filter.kieli.length
        ? '&kieli=' + this.filter.kieli.join(',')
        : '') +
      (this.filter.opetuskieli.length
        ? '&opetuskieli=' + this.filter.opetuskieli.join(',')
        : '') +
      '&lng=' +
      l.getLanguage()
    );
  }

  // Ei käytössä missään?
  @computed get searchParams() {
    return (
      '?toggle=' +
      (this.toggleKoulutus ? 'koulutus' : 'oppilaitos') +
      '&kpage=' +
      this.paging.pageKoulutus +
      '&opage=' +
      this.paging.pageOppilaitos +
      '&pagesize=' +
      this.paging.pageSize +
      (this.filter.paikkakunta
        ? '&paikkakunta=' + this.filter.paikkakunta
        : '') +
      (this.filter.koulutus.length
        ? '&koulutustyyppi=' + this.filter.koulutus.join(',')
        : '') +
      (this.filter.kieli.length
        ? '&kieli=' + this.filter.kieli.join(',')
        : '') +
      '&lng=' +
      l.getLanguage()
    );
  }

  @computed get maxPageNumber() {
    if (this.toggleKoulutus) {
      return this.maxPageKoulutus;
    } else {
      return this.maxPageOppilaitos;
    }
  }

  @computed get maxPageKoulutus() {
    return Math.max(1, Math.ceil(this.koulutusCount / this.paging.pageSize));
  }

  @computed get maxPageOppilaitos() {
    return Math.max(1, Math.ceil(this.oppilaitosCount / this.paging.pageSize));
  }

  @computed get currentPageNumber() {
    if (this.toggleKoulutus) {
      return this.paging.pageKoulutus;
    } else {
      return this.paging.pageOppilaitos;
    }
  }

  @computed get maxPageSize() {
    if (this.toggleKoulutus) {
      return this.koulutusCount;
    } else {
      return this.oppilaitosCount;
    }
  }

  @action
  clearFilters = () => {
    set(this.filter, emptyFilter);
  };

  @action
  clearHaku = () => {
    this.keyword = '';
    this.filter.paikkakunta = '';
    this.filter.koulutus = [];
    this.filter.kieli = [];
    this.filter.opetuskieli = [];
    this.paging.pageOppilaitos = 1;
    this.paging.pageKoulutus = 1;
    this.paging.pageSize = 20;
    this.koulutusResult = [];
    this.koulutusCount = 0;
    this.oppilaitosResult = [];
    this.oppilaitosCount = 0;
    this.toggle = 'koulutus';
    this.sort = 'asc';
    this.koulutusOffset = 0;
    this.koulutusTotal = 0;
    this.oppilaitosOffset = 0;
    this.oppilaitosTotal = 0;
  };

  @action
  clearOffsetAndPaging = () => {
    this.paging.pageOppilaitos = 1;
    this.paging.pageKoulutus = 1;
    this.koulutusOffset = 0;
    this.oppilaitosOffset = 0;
  };

  @action
  setFilters = (filterType, item) => {
    this.filter[filterType] = this.filter[filterType].filter(
      (thisItem) => thisItem.id !== item.id
    );
    return true;
  };

  @computed get canSearch() {
    return this.keywordSet || this.filterSet;
  }

  @action
  searchAll = (onSuccess) => {
    this.clearOffsetAndPaging();
    if (this.canSearch) {
      this.state = 'pending';
      this.rest.search(
        [
          this.rest.searchKoulutuksetPromise(
            this.keyword,
            this.paging,
            this.filter
          ),
          this.rest.searchOppilaitoksetPromise(
            this.keyword,
            this.paging,
            this.filter
          ),
        ],
        (result) => {
          runInAction(() => {
            this.koulutusResult = result[0] ? result[0].hits : [];
            this.koulutusCount =
              result[0] && result[0].hits.length > 0
                ? result[0].hits.length
                : 0;
            this.koulutusTotal = result[0]?.total;
            this.koulutusFilters.opetusKieli = result[0].filters.opetuskieli;
            this.koulutusFilters.koulutusTyyppi =
              result[0].filters.koulutustyyppi;
            this.koulutusFilters.koulutusala = result[0].filters.koulutusala;
            this.koulutusFilters.maakunta = result[0].filters.maakunta;
            this.koulutusFilters.kunta = result[0].filters.kunta;
            this.oppilaitosResult = result[1] ? result[1].hits : [];
            this.oppilaitosCount =
              result[1] && result[1].hits.length > 0
                ? result[1].hits.length
                : 0;
            this.oppilaitosTotal = result[1]?.total;
            this.oppilaitosFilters.opetusKieli = result[1].filters.opetuskieli;
            this.oppilaitosFilters.koulutusTyyppi =
              result[1].filters.koulutustyyppi;
            this.oppilaitosFilters.koulutusala = result[1].filters.koulutusala;
            this.oppilaitosFilters.maakunta = result[1].filters.maakunta;
            this.oppilaitosFilters.kunta = result[1].filters.kunta;
            this.state = 'done';

            if (onSuccess) {
              onSuccess();
            }
          });
        }
      );
    }
  };

  @action
  searchKoulutukset = (onSuccess) => {
    if (this.canSearch) {
      this.state = 'pending';
      this.rest.search(
        [
          this.rest.searchKoulutuksetPromise(
            this.keyword,
            this.paging,
            this.filter,
            this.sort
          ),
        ],
        (result) => {
          runInAction(() => {
            this.koulutusResult = result[0] ? result[0].hits : [];
            this.koulutusCount = result[0] ? result[0].hits.length : 0;
            this.koulutusTotal = result[0] ? result[0].total : 0;
            this.state = 'done';
            if (onSuccess) {
              onSuccess();
            }
          });
        }
      );
    }
  };

  @action
  searchOppilaitokset = (onSuccess) => {
    if (this.canSearch) {
      this.state = 'pending';
      this.rest.search(
        [
          this.rest.searchOppilaitoksetPromise(
            this.keyword,
            this.paging,
            this.filter,
            this.sort
          ),
        ],
        (result) => {
          runInAction(() => {
            this.oppilaitosResult = result[0] ? result[0].hits : [];
            this.oppilaitosCount = result[0] ? result[0].hits.length : 0;
            this.oppilaitosTotal = result[0] ? result[0].total : 0;
            this.state = 'done';
            if (onSuccess) {
              onSuccess();
            }
          });
        }
      );
    }
  };

  @action
  loadNextPage = (onSuccess) => {
    if (this.toggleKoulutus && !this.isLastPage) {
      this.paging.pageKoulutus = this.paging.pageKoulutus + 1;
      this.searchKoulutukset(onSuccess);
    }
    if (!this.toggleKoulutus && !this.isLastPage) {
      this.paging.pageOppilaitos = this.paging.pageOppilaitos + 1;
      this.searchOppilaitokset(onSuccess);
    }
  };

  @action
  loadPrevPage = (onSuccess) => {
    if (this.toggleKoulutus && !this.isFirstPage) {
      this.paging.pageKoulutus = this.paging.pageKoulutus - 1;
      this.searchKoulutukset(onSuccess);
    }
    if (!this.toggleKoulutus && !this.isFirstPage) {
      this.paging.pageOppilaitos = this.paging.pageOppilaitos - 1;
      this.searchOppilaitokset(onSuccess);
    }
  };

  @computed get isLastPage() {
    return this.toggleKoulutus
      ? this.maxPageKoulutus === this.paging.pageKoulutus
      : this.maxPageOppilaitos === this.paging.pageOppilaitos;
  }

  @computed get isFirstPage() {
    return this.toggleKoulutus
      ? 1 === this.paging.pageKoulutus
      : 1 === this.paging.pageOppilaitos;
  }

  @action toggleHakutulosFitersHidden = () => {
    this.showHakutulosFilters = !this.showHakutulosFilters;
  };
}

export default HakuStore;
