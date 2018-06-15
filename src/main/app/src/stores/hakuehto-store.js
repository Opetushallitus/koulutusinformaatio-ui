import { observable, computed, action } from "mobx"
import {Localizer as l} from "../tools/Utils";

class HakuehtoStore {
    @observable keyword = '';
    @observable filter = {
        koulutus: [],
        kieli: [],
        paikkakunta: ''
    };
    @observable rajainOpen = false;

    @action
    setAll = (keyword, search) => {
        this.setKeyword(keyword);
        this.setFilter({
            koulutus: search.koulutustyyppi,
            kieli: search.kieli,
            paikkakunta: search.paikkakunta });
    };

    @computed get keywordSet() {
        return this.keyword && !(0 === this.keyword.length);
    };

    @action
    setKeyword = (keyword) => {
        this.keyword = keyword ? keyword : '';
    };

    @action
    closeRajain = () => {
        this.rajainOpen = false;
    };

    @action
    toggleRajain = () => {
        this.rajainOpen = !this.rajainOpen;
    };

    @computed get filterSet() {
        return this.filter.paikkakunta || this.filter.koulutus.length || this.filter.kieli.length;
    };

    @action
    setFilter = (filter) => {
        this.filter.koulutus = filter.koulutus ? filter.koulutus.split(',') : [];
        this.filter.kieli = filter.kieli ? filter.kieli.split(',') : [];
        this.filter.paikkakunta = filter.paikkakunta ? filter.paikkakunta.toLowerCase() : '';
    };

    @computed get createHakuUrl() {
        return '/haku' + (this.keywordSet ? '/' + this.keyword : '') + this.searchParams;
    };

    @computed get searchParams() {
        return '?paikkakunta=' + ( this.filter.paikkakunta ?  this.filter.paikkakunta : '')
            + '&koulutustyyppi=' + ( this.filter.koulutus.length ? this.filter.koulutus.join(',') : '')
            + '&kieli=' + ( this.filter.kieli.length ? this.filter.kieli.join(',') : '')
            + '&lng=' + l.getLanguage();
    };

    @action
    clearHakuehdot = () => {
        this.keyword = '';
        this.filter.paikkakunta = '';
        this.filter.koulutus = [];
        this.filter.kieli = [];
        this.rajainOpen = false;
    }
}

export default HakuehtoStore;