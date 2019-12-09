import { observable, action, computed } from 'mobx';
import { Localizer as l } from '../tools/Utils';

class VertailuStore {
  constructor(hakuStore, restStore) {
    this.hakuStore = hakuStore;
    this.rest = restStore;
  }

  @observable vertailuListKoulutus = [];
  @observable vertailuListOppilaitos = [];

  @computed get oids() {
    return this.vertailuList.map((i) => i.oid);
  }

  @computed get size() {
    return this.vertailuList.length;
  }

  @computed get vertailuList() {
    return this.hakuStore.toggleKoulutus
      ? this.vertailuListKoulutus
      : this.vertailuListOppilaitos;
  }

  @computed get createVertailuLink() {
    return (
      '/vertailu?oids=' +
      this.oids.join(',') +
      '&haku=' +
      encodeURIComponent(this.hakuStore.createHakuUrl) +
      '&lng=' +
      l.getLanguage()
    );
  }

  @action
  isOidSelected = (oid) => {
    return this.vertailuList.findIndex((item) => item.oid === oid) !== -1;
  };

  isOidLoaded = (oid) => {
    return (
      this.vertailuList.findIndex(
        (item) => item.oid === oid && item.loaded === true
      ) !== -1
    );
  };

  @action
  selectItem = (oid, nimi, link) => {
    if (this.hakuStore.toggleKoulutus) {
      if (!this.isOidSelected(oid)) {
        const link =
          '/koulutus/' +
          oid +
          '?haku=' +
          encodeURIComponent(this.hakuStore.createHakuUrl) +
          '&lng=' +
          l.getLanguage();
        this.vertailuListKoulutus.push({
          oid: oid,
          nimi: nimi,
          loaded: false,
          link: link,
        });
      }
      if (!this.isOidLoaded(oid)) {
        this.rest.getToteutusPromise(oid).then(
          (result) => {
            const i = this.vertailuListKoulutus.findIndex(
              (item) => item.oid === oid
            );
            if (result.body.result.koulutus[oid]) {
              this.vertailuListKoulutus[i] = {
                ...this.vertailuListKoulutus[i],
                ...result.body.result.koulutus[oid],
                ...{ loaded: true },
              };
            }
          },
          (error) => console.log(error)
        );
      }
    }
    // else {
    //     if (!this.isOidSelected(oid)) {
    //         const link = '/oppilaitos/' + oid + '?haku=' + encodeURIComponent(this.hakuStore.createHakuUrl)
    //             + '&lng=' + l.getLanguage();
    //         this.loadVertailuItem(oid, (result) => {
    //             if (result) {
    //                 this.vertailuListOppilaitos.push(Object.assign(result, {link: link}));
    //             }
    //         });
    //     }
    // }
  };

  @action
  removeItem = (oid) => {
    if (this.hakuStore.toggleKoulutus) {
      if (this.isOidSelected(oid)) {
        this.vertailuListKoulutus = this.vertailuListKoulutus.filter(
          (i) => i.oid !== oid
        );
      }
    } else {
      if (this.isOidSelected(oid)) {
        this.vertailuListOppilaitos = this.vertailuListOppilaitos.filter(
          (i) => i.oid !== oid
        );
      }
    }
  };

  @action
  clearItems = () => {
    if (this.hakuStore.toggleKoulutus) {
      this.vertailuListKoulutus = [];
    } else {
      this.vertailuListOppilaitos = [];
    }
  };
}

export default VertailuStore;
