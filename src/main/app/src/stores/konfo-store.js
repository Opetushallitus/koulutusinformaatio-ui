import UrlStore from './url-store';
import HakuStore from './haku-store';
import HakuehtoStore from './hakuehto-store';
import RestStore from './rest-store';
import NavigaatioStore from './navigaatio-store';
import VertailuStore from './vertailu-store';
import ContentfulStore from './contentful-store';
import { observe } from 'mobx';

class KonfoStore {
  constructor() {
    this.urlStore = new UrlStore();
    this.restStore = new RestStore(this.urlStore);
    this.hakuStore = new HakuStore(this.restStore);
    this.hakuehtoStore = new HakuehtoStore();
    this.contentfulStore = new ContentfulStore('fi', this.urlStore);
    observe(this.urlStore, 'loading', (change) => {
      this.contentfulStore.fetchData();
    });
    this.urlStore.loadFrontProperties();
    this.navigaatioStore = new NavigaatioStore(
      this.hakuStore,
      this.hakuehtoStore
    );
    this.vertailuStore = new VertailuStore(this.hakuStore, this.restStore);
  }
}

export default KonfoStore;
