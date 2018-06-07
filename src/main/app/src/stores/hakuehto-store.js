import { observable, computed } from "mobx"

class HakuehtoStore {
    @observable keyword = '';
    @observable filter = {
        koulutus: [],
        kieli: [],
        paikkakunta: ''
    };

    @computed get keywordSet() {
        return this.keyword && !(0 === this.keyword.length);
    }

    @computed get filterSet() {
        return this.filter.paikkakunta || this.filter.koulutus.length || this.filter.kieli.length;
    }

    @computed get createHakuUrl() {
        return '/haku' + (this.keywordSet ? '/' + this.keyword : '') + this.searchParams;
    }

    @computed get searchParams() {
        return (this.filter.paikkakunta ? '?paikkakunta=' + this.filter.paikkakunta : '')
            + (this.filter.koulutus.length ? '&koulutustyyppi=' + this.filter.koulutus.join(',') : '')
            + (this.filter.kieli.length ? '&kieli=' + this.filter.kieli.join(',') : '')
    }
}

export default HakuehtoStore;