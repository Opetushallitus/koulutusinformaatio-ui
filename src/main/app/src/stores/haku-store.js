import { observable, computed, action, runInAction } from "mobx"
import i18n from "../tools/i18n";

class HakuStore {
    @observable keyword = '';
    @observable koulutusResult = [];
    @observable koulutusCount = 0;
    @observable oppilaitosResult = [];
    @observable oppilaitosCount = 0;
    @observable toggle = 'koulutus';
    @observable paging = {
        pageOppilaitos: 1,
        pageKoulutus: 1,
        pageSize: 20
    };
    @observable filter = {
        koulutus: [],
        kieli: [],
        paikkakunta: ''
    };

    constructor(rest) {
        this.rest = rest;
    }

    @action
    setAll = (keyword, search, toggleAction) => {
        const keywordChange = this.setKeyword(keyword);
        const filterChange = this.setFilter({
            koulutus: search.koulutustyyppi,
            kieli: search.kieli,
            paikkakunta: search.paikkakunta });
        const pagingChange = this.setPaging({
            pageOppilaitos: search.opage,
            pageKoulutus: search.kpage,
            pageSize: search.pagesize
        });

        this.setToggle(search.toggle);

        if(keywordChange || filterChange || pagingChange) {
            this.searchAll();
            if(!search.toggle) {
                this.setToggle(this.koulutusCount >= this.oppilaitosCount ? 'koulutus' : 'oppilaitos')
                if(toggleAction) {
                    toggleAction(this.toggle);
                }
            }
        }
    };

    @computed get keywordSet() {
        return this.keyword && !(0 === this.keyword.length);
    }

    @action
    setKeyword = (keyword) => {
        const newKeyword = keyword ? keyword : '';
        const change = this.keyword !== newKeyword;
        this.keyword = newKeyword;
        return change;
    };

    @computed get filterSet() {
        return this.filter.paikkakunta || this.filter.koulutus.length || this.filter.kieli.length;
    }

    @action
    setFilter = (filter) => {
        function compare (a1, a2) { return a1.length === a2.length && a1.every((v,i)=> v === a2[i])}

        //TODO check allowed values
        const koulutus = filter.koulutus ? filter.koulutus.split(',') : [];
        const kieli = filter.kieli ? filter.kieli.split(',') : [];
        const paikkakunta = filter.paikkakunta ? filter.paikkakunta.toLowerCase() : '';

        const change = !(this.filter.paikkakunta === paikkakunta &&
            compare(this.filter.koulutus, koulutus) &&
            compare(this.filter.kieli, kieli));

        this.filter.koulutus = koulutus;
        this.filter.kieli = kieli;
        this.filter.paikkakunta = paikkakunta;

        return change;
    };

    @action
    setPaging = (paging) => {
        function pos (p, d) { return p > 0 ? p : d; }

        const pageOppilaitos = pos(Number(paging.pageOppilaitos), 1);
        const pageKoulutus = pos(Number(paging.pageKoulutus), 1);
        const pageSize = pos(Number(paging.pageSize), 20);

        const change = !(this.paging.pageOppilaitos === pageOppilaitos &&
            this.paging.pageKoulutus === pageKoulutus &&
            this.paging.pageSize === pageSize);

        this.paging.pageOppilaitos = pageOppilaitos;
        this.paging.pageKoulutus = pageKoulutus;
        this.paging.pageSize = pageSize;

        return change;
    };

    @action
    setToggle = (toggle) => {
        const newToggle = (toggle && toggle.toLowerCase() === 'koulutus') ? 'koulutus' : 'oppilaitos';
        const change = this.toggle !== newToggle;
        this.toggle = newToggle;
        return change;
    };

    @computed get toggleKoulutus() {
        return 'koulutus' === this.toggle
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
        return '/haku' + (this.keywordSet ? '/' + this.keyword : '') + '?toggle=' + (this.toggleKoulutus ? 'koulutus' : 'oppilaitos')
            + '&kpage=' + this.paging.pageKoulutus + '&opage=' + this.paging.pageOppilaitos + '&pagesize=' + this.paging.pageSize
            + (this.filter.paikkakunta ? '&paikkakunta=' + this.filter.paikkakunta : '')
            + (this.filter.koulutus.length ? '&koulutustyyppi=' + this.filter.koulutus.join(',') : '')
            + (this.filter.kieli.length ? '&kieli=' + this.filter.kieli.join(',') : '')
            + "&lng=" + i18n.language;
    }

    @computed get searchParams() {
        return '?toggle=' + (this.toggleKoulutus ? 'koulutus' : 'oppilaitos')
            + '&kpage=' + this.paging.pageKoulutus + '&opage=' + this.paging.pageOppilaitos + '&pagesize=' + this.paging.pageSize
            + (this.filter.paikkakunta ? '&paikkakunta=' + this.filter.paikkakunta : '')
            + (this.filter.koulutus.length ? '&koulutustyyppi=' + this.filter.koulutus.join(',') : '')
            + (this.filter.kieli.length ? '&kieli=' + this.filter.kieli.join(',') : '')
            + "&lng=" + i18n.language
    }

    @computed get maxPageNumber() {
        if(this.toggleKoulutus) {
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
        if(this.toggleKoulutus) {
            return this.paging.pageKoulutus;
        } else {
            return this.paging.pageOppilaitos;
        }
    }

    @computed get maxPageSize() {
        if(this.toggleKoulutus) {
            return this.koulutusCount;
        } else {
            return this.oppilaitosCount;
        }
    }

    @action
    clearHaku = () => {
        this.keyword = '';
        this.filter.paikkakunta = '';
        this.filter.koulutus = [];
        this.filter.kieli = [];
        this.paging.pageOppilaitos = 1;
        this.paging.pageKoulutus = 1;
        this.paging.pageSize = 20;
        this.koulutusResult = [];
        this.koulutusCount = 0;
        this.oppilaitosResult = [];
        this.oppilaitosCount = 0;
        this.toggle = 'koulutus';
    };

    @computed get canSearch() {
        return this.keywordSet || this.filterSet;
    }

    @action
    searchAll = () => {
        if(this.canSearch) {
            this.rest.search([
                this.rest.searchKoulutuksetPromise(this.keyword, this.paging, this.filter),
                this.rest.searchOppilaitoksetPromise(this.keyword, this.paging, this.filter)
            ], (result) => { runInAction(() => {
                this.koulutusResult = result[0] ? result[0].result : [];
                this.koulutusCount = result[0] ? result[0].count : 0;
                this.oppilaitosResult = result[1] ? result[1].result : [];
                this.oppilaitosCount = result[1] ? result[1].count : 0;
            })})
        }
    };

    @action
    searchKoulutukset = (onSuccess) => {
        if(this.canSearch) {
            this.rest.search([
                this.rest.searchKoulutuksetPromise(this.keyword, this.paging, this.filter)
            ], (result) => { runInAction(() => {
                this.koulutusResult = result[0] ? result[0].result : [];
                this.koulutusCount = result[0] ? result[0].count : 0;
                if(onSuccess) {
                    onSuccess()
                }
            })})
        }
    };

    @action
    searchOppilaitokset = (onSuccess) => {
        if(this.canSearch) {
            this.rest.search([
                this.rest.searchOppilaitoksetPromise(this.keyword, this.paging, this.filter)
            ], (result) => { runInAction(() => {
                this.oppilaitosResult = result[0] ? result[0].result : [];
                this.oppilaitosCount = result[0] ? result[0].count : 0;
                if(onSuccess) {
                    onSuccess()
                }
            })})
        }
    };

    @action
    loadNextPage = (onSuccess) => {
        if(this.toggleKoulutus && !this.isLastPage) {
            this.paging.pageKoulutus = this.paging.pageKoulutus + 1;
            this.searchKoulutukset(onSuccess)
        }
        if(!this.toggleKoulutus && !this.isLastPage) {
            this.paging.pageOppilaitos = this.paging.pageOppilaitos + 1;
            this.searchOppilaitokset(onSuccess)
        }
    };

    @action
    loadPrevPage = (onSuccess) => {
        if(this.toggleKoulutus && !this.isFirstPage) {
            this.paging.pageKoulutus = this.paging.pageKoulutus - 1;
            this.searchKoulutukset(onSuccess)
        }
        if(!this.toggleKoulutus && !this.isFirstPage) {
            this.paging.pageOppilaitos = this.paging.pageOppilaitos - 1;
            this.searchOppilaitokset(onSuccess)
        }
    };

    @computed get isLastPage() {
        return this.toggleKoulutus ?
            this.maxPageKoulutus === this.paging.pageKoulutus :
            this.maxPageOppilaitos === this.paging.pageKoulutus;
    }

    @computed get isFirstPage() {
        return this.toggleKoulutus ?
            1 === this.paging.pageKoulutus :
            1 === this.paging.pageKoulutus;
    }
}

export default HakuStore;