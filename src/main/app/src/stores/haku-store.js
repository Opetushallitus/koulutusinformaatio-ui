import { observable, computed } from "mobx"

class HakuStore {
    @observable keyword = '';
    @observable currentPageKoulutus = 1;
    @observable currentPageOppilaitos = 1;
    @observable pageSize = 20;
    @observable koulutusResult = [];
    @observable koulutusCount = 0;
    @observable oppilaitosResult = [];
    @observable oppilaitosCount = 0;
    @observable toggleKoulutus = true;
    @observable filterSet = false;
    filterKoulutus = [];
    filterPaikkakunta = '';

    @computed get keywordSet() {
        return this.keyword && !(0 === this.keyword.length);
    }

    updateFilterSet() {
        this.filterSet = this.filterPaikkakunta || this.filterKoulutus.length > 0;
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
            + '&kpage=' + this.currentPageKoulutus + '&opage=' + this.currentPageOppilaitos + '&pagesize=' + this.pageSize
            + (this.filterSet && this.filterPaikkakunta ? '&paikkakunta=' + this.filterPaikkakunta : '')
            + (this.filterSet && this.filterKoulutus.length ? '&koulutustyyppi=' + this.filterKoulutus.join(',') : '')
    }

    @computed get maxPageNumber() {
        if(this.toggleKoulutus) {
            return this.maxPageKoulutus;
        } else {
            return this.maxPageOppilaitos;
        }
    }

    @computed get maxPageKoulutus() {
        return Math.max(1, Math.ceil(this.koulutusCount / this.pageSize));
    }

    @computed get maxPageOppilaitos() {
        return Math.max(1, Math.ceil(this.oppilaitosCount / this.pageSize));
    }

    @computed get currentPageNumber() {
        if(this.toggleKoulutus) {
            return this.currentPageKoulutus;
        } else {
            return this.currentPageOppilaitos;
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