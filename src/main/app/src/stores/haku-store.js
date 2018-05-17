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

    @computed get keywordSet() {
        return this.keyword && !(0 === this.keyword.length)
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
        return '/haku/' + this.keyword + '?toggle=' + (this.toggleKoulutus ? 'koulutus' : 'oppilaitos')
    }
}

export default HakuStore;