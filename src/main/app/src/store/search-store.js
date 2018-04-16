import { observable, computed } from "mobx"

class SearchStore {
    @observable keyword = '';
    @observable result = [];

    @computed get keywordSet() {
        return this.keyword && !(0 === this.keyword.length)
    }

    @computed get count() {
        return this.result ? this.result.length : 0;
    }
}

export default SearchStore;