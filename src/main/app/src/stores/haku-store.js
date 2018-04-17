import { observable, computed } from "mobx"

class HakuStore {
    @observable keyword = '';
    @observable result = [];
    @observable totalCount = 0;

    @computed get keywordSet() {
        return this.keyword && !(0 === this.keyword.length)
    }

    @computed get count() {
        return this.result ? this.result.length : 0;
    }
}

export default HakuStore;