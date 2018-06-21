import NavigaatioStore from '../stores/navigaatio-store';

let empty_result = {
    toggleKoulutus: true,
    koulutusResult: []
};

let last_page = {
    isFirstPage: false,
    isLastPage: true,
    toggleKoulutus: true,
    koulutusResult: [{oid: "1"}, {oid: "2"}, {oid: "3"}],
    loadPrevPage: (action) => {
        action();
    }
};

let first_page = {
    isFirstPage: true,
    isLastPage: false,
    toggleKoulutus: true,
    koulutusResult: [{oid: "1"}, {oid: "2"}, {oid: "3"}],
    loadNextPage: (action) => {
        action();
    }
};

describe('NavigaatioStore.hasNext', () => {

    it('false for empty result', () => {
        let navigaatioStore = new NavigaatioStore(empty_result, null);
        expect(navigaatioStore.hasNext).toEqual(false);
    });

    it('false for last result in last page', () => {
        let navigaatioStore = new NavigaatioStore(last_page, null);
        navigaatioStore.setOid("3");
        expect(navigaatioStore.hasNext).toEqual(false);
    });

    it('true for last result in not last page', () => {
        let navigaatioStore = new NavigaatioStore(first_page, null);
        navigaatioStore.setOid("3");
        expect(navigaatioStore.hasNext).toEqual(true);
    });

    it('true for not last result in last page', () => {
        let navigaatioStore = new NavigaatioStore(last_page, null);
        navigaatioStore.setOid("2");
        expect(navigaatioStore.hasNext).toEqual(true);
    });
});

describe('NavigaatioStore.withNextOid', () => {

    it('get next oid for not last result on last page', () => {
        let navigaatioStore = new NavigaatioStore(last_page, null);
        navigaatioStore.setOid("2");
        let _result = null;
        navigaatioStore.withNextOid((oid) => {_result = oid});
        expect(_result).toEqual("3")
    });

    it('get next oid for last result on not last page', () => {
        let navigaatioStore = new NavigaatioStore(first_page, null);
        navigaatioStore.setOid("3");
        let _result = null;
        navigaatioStore.withNextOid((oid) => {_result = oid});
        expect(_result).toEqual("1")
    });

});

describe('NavigaatioStore.hasPrev', () => {

    it('false for empty result', () => {
        let navigaatioStore = new NavigaatioStore(empty_result, null);
        expect(navigaatioStore.hasPrev).toEqual(false);
    });

    it('false for first result in first page', () => {
        let navigaatioStore = new NavigaatioStore(first_page, null);
        navigaatioStore.setOid("1");
        expect(navigaatioStore.hasPrev).toEqual(false);
    });

    it('true for first result in not first page', () => {
        let navigaatioStore = new NavigaatioStore(last_page, null);
        navigaatioStore.setOid("1");
        expect(navigaatioStore.hasPrev).toEqual(true);
    });

    it('true for not first result in first page', () => {
        let navigaatioStore = new NavigaatioStore(first_page, null);
        navigaatioStore.setOid("2");
        expect(navigaatioStore.hasPrev).toEqual(true);
    });

});

describe('NavigaatioStore.withPrevOid', () => {

    it('get prev oid for not first result on first page', () => {
        let navigaatioStore = new NavigaatioStore(first_page, null);
        navigaatioStore.setOid("2");
        let _result = null;
        navigaatioStore.withPrevOid((oid) => {_result = oid});
        expect(_result).toEqual("1")
    });

    it('get prev oid for first result on not first page', () => {
        let navigaatioStore = new NavigaatioStore(last_page, null);
        navigaatioStore.setOid("1");
        let _result = null;
        navigaatioStore.withPrevOid((oid) => {_result = oid});
        expect(_result).toEqual("3")
    });

});

