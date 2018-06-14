import { observable, computed, action } from "mobx"

class NavigaatioStore {
    @observable oid = '';

    constructor(hakuStore, hakuehtoStore) {
        this.hakuStore = hakuStore;
        this.hakuehtoStore = hakuehtoStore;
    }

    @action setOid(oid) {
        this.oid = oid;
    }

    @computed get oids() {
        const haku = this.hakuStore;
        const result = haku.toggleKoulutus ? haku.koulutusResult : haku.oppilaitosResult;
        return result.map(r => r.oid);
    }

    @computed get index() {
        return this.oids.findIndex(r => r === this.oid);
    }

    @computed get isLastOid() {
        return (0 < this.oids.length) && this.index >= (this.oids.length - 1)
    }

    @computed get isFirstOid() {
        return this.index === 0;
    }

    @computed get hasNext() {
        return this.isLastOid ? !this.hakuStore.isLastPage : this.oids.length;
    }

    @computed get hasPrev() {
        return this.isFirstOid ? !this.hakuStore.isFirstPage : this.oids.length;
    }

    @computed get getSearchParams() {
        return '?haku=' + encodeURIComponent(this.hakuStore.createHakuUrl)
    }

    @action
    load = (keyword, search) => {
        this.hakuStore.setAll(keyword, search);
        this.hakuehtoStore.setAll(keyword, search);
    };

    @action
    withNextOid = (action) => {
        if(this.isLastOid) {
            this.hakuStore.loadNextPage(() => {action(this.oids[0])})
        } else {
            action(this.oids[this.index + 1])
        }
    }

    @action
    withPrevOid = (action) => {
        if(this.isFirstOid) {
            this.hakuStore.loadPrevPage(() => {action(this.oids[this.oids.length - 1])})
        } else {
            action(this.oids[this.index - 1])
        }
    }
}

export default NavigaatioStore;