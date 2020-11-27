import UrlStore from './url-store';
import ContentfulStore from './contentful-store';

class KonfoStore {
  constructor() {
    this.urlStore = new UrlStore();
    this.contentfulStore = new ContentfulStore();
    this.urlStore.loadFrontProperties();
  }
}

export default KonfoStore;
