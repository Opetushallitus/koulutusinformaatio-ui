import { observable } from "mobx"
import {urls as ophUrls} from 'oph-urls-js';
import {production, development} from '../oppija-urls.js';

class UrlStore {
    @observable urls = ophUrls;

    async loadFrontProperties() {
        await this.urls.load({overrides: '/konfo/rest/config/frontProperties'}); //TODO: Poista "konfo" urlista?
    }

    constructor(konfoStore) {
        console.log('Ollaan ympäristössä ' + process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            //console.log(JSON.stringify(process.env))
            this.urls.addProperties(development);
        } else {
            this.urls.addProperties(production);
            this.loadFrontProperties();
        }
    }
}

export default UrlStore;