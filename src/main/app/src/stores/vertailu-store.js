import { observable, action, computed, toJS } from "mobx";
import { Localizer as l } from "../tools/Utils";


class VertailuStore {
    constructor(hakuStore, restStore) {
        this.hakuStore = hakuStore;
        this.rest = restStore;
    }

    @observable vertailuListKoulutus = [];
    @observable vertailuListOppilaitos = [];
    @observable vertailuResults = [];
    @observable sizeKoulutus = 0;
    @observable sizeOppilaitos = 0;

    @computed get oids() {
        return this.vertailuList.map((i) => i.oid);
    }

    @computed get size() {
        return this.hakuStore.toggleKoulutus ? this.sizeKoulutus : this.sizeOppilaitos;
    }

    @computed get vertailuList() {
        return this.hakuStore.toggleKoulutus ? this.vertailuListKoulutus : this.vertailuListOppilaitos;
    }

    @computed get createVertailuLink() {
        return "/vertailu?oids=" + this.oids.join(',') + "&haku=" + encodeURIComponent(this.hakuStore.createHakuUrl) + "&lng=" + l.getLanguage();
    }

    @action
    isOidSelected = (oid) => {
        return this.vertailuList.findIndex((item) => item.oid === oid) !== -1;
    };

    @action
    selectItem = (oid, nimi, link) => {
        if (this.hakuStore.toggleKoulutus) {
            if (!this.isOidSelected(oid)) {
                this.vertailuListKoulutus.push({oid: oid, nimi: nimi, link: link});
            }
            this.sizeKoulutus = this.vertailuListKoulutus.length;
        } else {
            if (!this.isOidSelected(oid)) {
                this.vertailuListOppilaitos.push({oid: oid, nimi: nimi, link: link});
            }
            this.sizeOppilaitos = this.vertailuListOppilaitos.length;
        }
    };

    @action
    removeItem = (oid) => {
        if (this.hakuStore.toggleKoulutus) {
            if (this.isOidSelected(oid)) {
                this.vertailuListKoulutus = this.vertailuListKoulutus.filter((i) => i.oid !== oid);
            }
            this.sizeKoulutus = this.vertailuListKoulutus.length;
        } else {
            if (this.isOidSelected(oid)) {
                this.vertailuListOppilaitos = this.vertailuListOppilaitos.filter((i) => i.oid !== oid);
            }
            this.sizeOppilaitos = this.vertailuListOppilaitos.length;
        }
    };

    @action
    clearItems = () => {
        if (this.hakuStore.toggleKoulutus) {
            this.vertailuListKoulutus = [];
            this.sizeKoulutus = 0;
        } else {
            this.vertailuListOppilaitos = [];
            this.sizeOppilaitos = 0;
        }
    };

    @action
    loadVertailuItems = (oids) => {
        this.vertailuResults = [];
        const cbKoulutus = (results) => {this.vertailuResults = results.map((res, i) => {
                return (res.result.koulutus) ? toJS(res.result.koulutus[oids[i]]) : undefined;
            }); console.log(results)
        };

        if (this.hakuStore.toggleKoulutus) {
            this.rest.search(oids.map((i) => this.rest.getKoulutusPromise(i)), cbKoulutus)
        } else {
            this.rest.search(oids.map((i) => this.rest.getOppilaitosPromise(i)), () => (""))
        }
    };
}

export default VertailuStore;