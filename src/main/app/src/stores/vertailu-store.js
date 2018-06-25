import { observable, action } from "mobx"

class VertailuStore {
    @observable vertailuList = [];

    @action
    isOidSelected = (oid) => {
        return this.vertailuList.findIndex((item) => item.oid === oid) !== -1;
    };
    @action
    selectKoulutus = (oid, nimi, link) => {
        if (!this.isOidSelected(oid)) {
            this.vertailuList.push({oid: oid, nimi: nimi, link: link});
        }
    };
    @action
    removeKoulutus = (oid) => {
        if (this.isOidSelected(oid)) {
            this.vertailuList = this.vertailuList.filter((i) => i.oid !== oid);
        }
    }
}

export default VertailuStore;