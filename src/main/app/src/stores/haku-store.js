import { observable, computed } from "mobx"

class HakuStore {
    @observable keyword = '';
    @observable currentPageKoulutus = 1;
    @observable pageSizeKoulutus = 20;
    @observable currentPageOppilaitos = 1;
    @observable pageSizeOppilaitos = 20;
    @observable koulutusResult = [];
    @observable koulutusCount = 0;
    @observable oppilaitosResult = [];
    @observable oppilaitosCount = 0;
    @observable toggleKoulutus = true;
    @observable testi = 1;
    filterKoulutus = [];
    filterPaikkakunta = '';

    @computed get keywordSet() {
        return this.keyword && !(0 === this.keyword.length);
    }

    @computed get filterSet() {
        return (!!this.filterPaikkakunta || this.filterKoulutus.length > 0) && this.testi;
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
        return '/haku' + (this.keywordSet ? '/' + this.keyword : '') + '?toggle=' + (this.toggleKoulutus ? 'koulutus' : 'oppilaitos')
            + '&kpage=' + this.currentPageKoulutus + '&opage=' + this.currentPageOppilaitos
            + '&kpagesize=' + this.pageSizeKoulutus + '&opagesize=' + this.pageSizeOppilaitos
            + (this.filterPaikkakunta ? '&paikkakunta=' + this.filterPaikkakunta : '')
            + (this.filterKoulutus.length ? '&koulutustyyppi=' + this.filterKoulutus.join(',') : '')
    }

    @computed get maxPageNumber() {
        if(this.toggleKoulutus) {
            return this.maxPageKoulutus;
        } else {
            return this.maxPageOppilaitos;
        }
    }

    @computed get maxPageKoulutus() {
        return Math.max(1, Math.ceil(this.koulutusCount / this.pageSizeKoulutus));
    }

    @computed get maxPageOppilaitos() {
        return Math.max(1, Math.ceil(this.oppilaitosCount / this.pageSizeOppilaitos));
    }

    @computed get currentPageNumber() {
        if(this.toggleKoulutus) {
            return this.currentPageKoulutus;
        } else {
            return this.currentPageOppilaitos;
        }
    }

    @computed get pageSize() {
        if(this.toggleKoulutus) {
            return this.pageSizeKoulutus;
        } else {
            return this.pageSizeOppilaitos;
        }
    }

    @computed get maxPageSize() {
        if(this.toggleKoulutus) {
            return this.koulutusCount;
        } else {
            return this.oppilaitosCount;
        }
    }
}

export default HakuStore;