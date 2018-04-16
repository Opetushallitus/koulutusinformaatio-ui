import { observable, computed } from "mobx"
import {urls as ophUrls} from 'oph-urls-js';

class UrlStore {
    @observable urls = ophUrls;
}

export default UrlStore;