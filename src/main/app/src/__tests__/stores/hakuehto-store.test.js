import HakuehtoStore from '../../stores/hakuehto-store';

describe('HakuehtoStore.setKeyword', () => {

    it('set keyword', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        hakuehtoStore.setKeyword("keyword");
        expect(hakuehtoStore.keyword).toEqual("keyword");
    });
});

describe('HakuehtoStore.keywordSet', () => {
    it('false when no keyword', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        expect(hakuehtoStore.keywordSet).toEqual(false);
    });

    it('true when keyword set', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        hakuehtoStore.setKeyword("keyword");
        expect(hakuehtoStore.keywordSet).toEqual(true);
    });
});

describe('HakuehtoStore.closeRajain', () => {
    it('set to false when rajain closed', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        hakuehtoStore.closeRajain();
        expect(hakuehtoStore.rajainOpen).toEqual(false);
    });

    it('set to false when rajain open', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        hakuehtoStore.rajainOpen = true;
        hakuehtoStore.closeRajain();
        expect(hakuehtoStore.rajainOpen).toEqual(false);
    });
});

describe('HakuehtoStore.toggleRajain', () => {
    it('set to true when rajain closed', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        hakuehtoStore.toggleRajain();
        expect(hakuehtoStore.rajainOpen).toEqual(true);
    });

    it('set to false when rajain open', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        hakuehtoStore.rajainOpen = true;
        hakuehtoStore.toggleRajain();
        expect(hakuehtoStore.rajainOpen).toEqual(false);
    });
});

describe('HakuehtoStore.setFilter', () => {
    it('set filter', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutus: "kk,ako",
            kieli: "fi,sv",
            paikkakunta: "espoo"
        };
        hakuehtoStore.setFilter(filter);
        expect(hakuehtoStore.filter).toEqual({
            koulutus: ["kk", "ako"],
            kieli: ["fi", "sv"],
            paikkakunta: "espoo"
        });
    });
});

describe('HakuehtoStore.filterSet', () => {
    it('true when koulutus filter set', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutus: "kk,ako",
            kieli: "",
            paikkakunta: ""
        };
        hakuehtoStore.setFilter(filter);
        expect(hakuehtoStore.filterSet).toEqual(true);
    });
    it('true when kieli filter set', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutus: "",
            kieli: "fi,sv",
            paikkakunta: ""
        };
        hakuehtoStore.setFilter(filter);
        expect(hakuehtoStore.filterSet).toEqual(true);
    });
    it('true when paikkakunta filter set', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutus: "",
            kieli: "",
            paikkakunta: "espoo"
        };
        hakuehtoStore.setFilter(filter);
        expect(hakuehtoStore.filterSet).toEqual(true);
    });
    it('false when no filter set', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutus: "",
            kieli: "",
            paikkakunta: ""
        };
        hakuehtoStore.setFilter(filter);
        expect(hakuehtoStore.filterSet).toEqual(false);
    });

});

describe('HakuehtoStore.createHakuUrl', () => {
    it('create haku url without keyword when no keyword set', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutus: "kk,ako",
            kieli: "fi,sv",
            paikkakunta: "espoo"
        };
        hakuehtoStore.setFilter(filter);
        expect(hakuehtoStore.createHakuUrl).toEqual(
            "/haku?paikkakunta=espoo&koulutustyyppi=kk,ako&kieli=fi,sv&lng=fi");
    });
    it('create haku url when keyword set', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutus: "kk,ako",
            kieli: "fi,sv",
            paikkakunta: "espoo"
        };
        hakuehtoStore.setKeyword("keyword");
        hakuehtoStore.setFilter(filter);
        expect(hakuehtoStore.createHakuUrl).toEqual(
            "/haku/keyword?paikkakunta=espoo&koulutustyyppi=kk,ako&kieli=fi,sv&lng=fi");
    });
});

describe('HakuehtoStore.searchParams', () => {
    it('create search params', () => {
        expect.assertions(1);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutus: "kk,ako",
            kieli: "fi,sv",
            paikkakunta: "espoo"
        };
        hakuehtoStore.setFilter(filter);
        expect(hakuehtoStore.searchParams).toEqual(
            "?paikkakunta=espoo&koulutustyyppi=kk,ako&kieli=fi,sv&lng=fi");
    });
});

describe('HakuehtoStore.clearHakuehdot', () => {
    it('should clear hakuehdot', () => {
        expect.assertions(3);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutus: "kk,ako",
            kieli: "fi,sv",
            paikkakunta: "espoo"
        };
        hakuehtoStore.setKeyword("keyword");
        hakuehtoStore.setFilter(filter);
        hakuehtoStore.rajainOpen = true;
        hakuehtoStore.clearHakuehdot();
        expect(hakuehtoStore.filter).toEqual({
            koulutus: [],
            kieli: [],
            paikkakunta: ""
        });
        expect(hakuehtoStore.keyword).toEqual('');
        expect(hakuehtoStore.rajainOpen).toEqual(false);
    });
});

describe('HakuehtoStore.setAll', () => {
    it('should set filter and keyword', () => {
        expect.assertions(2);
        const hakuehtoStore = new HakuehtoStore();
        const filter = {
            koulutustyyppi: "kk,ako",
            kieli: "fi,sv",
            paikkakunta: "espoo"
        };
        hakuehtoStore.setAll("keyword", filter);

        expect(hakuehtoStore.filter).toEqual({
            koulutus: ["kk", "ako"],
            kieli: ["fi", "sv"],
            paikkakunta: "espoo"
        });
        expect(hakuehtoStore.keyword).toEqual('keyword');
    });
});
