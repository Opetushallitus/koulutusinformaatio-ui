import { computed, observable, action /*configure*/ } from 'mobx';
import superagent from 'superagent';
import { Localizer as l } from '../tools/Utils';

//configure({ enforceActions: true })

class RestStore {
  @observable errors = [];

  constructor(urlStore) {
    this.urlStore = urlStore;
  }

  @computed get restErrorsArrLength() {
    return this.errors.length;
  }

  @action
  handleError = (e) => {
    console.log(e);
    this.errors.push(e);
  };

  @action
  searchKoulutuksetPromise = (keyword, paging, filter, sort) => {
    const sijainnit = filter.sijainti.concat(filter.selectedsijainnit);
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.search.koulutukset'))
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .query({
        keyword: keyword,
        page: paging.pageKoulutus,
        size: paging.pageSize,
        koulutustyyppi: filter.koulutustyyppi
          ? filter.koulutustyyppi.map(({ id }) => id).join(',')
          : '',
        koulutusala: filter.koulutusala
          ? filter.koulutusala.map(({ id }) => id).join(',')
          : '',
        opetuskieli: filter.opetuskieli
          ? filter.opetuskieli.map(({ id }) => id).join(',')
          : '',
        sijainti: sijainnit ? sijainnit.map(({ id }) => id).join(',') : '',
        lng: l.getLanguage(),
        sort: sort,
      })
      .catch(this.handleError);
  };

  @action
  searchOppilaitoksetPromise = (keyword, paging, filter, sort) => {
    const sijainnit = filter.sijainti.concat(filter.selectedsijainnit);
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.search.oppilaitokset'))
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .query({
        keyword: keyword,
        page: paging.pageOppilaitos,
        size: paging.pageSize,
        koulutustyyppi: filter.koulutustyyppi
          ? filter.koulutustyyppi.map(({ id }) => id).join(',')
          : '',
        koulutusala: filter.koulutusala
          ? filter.koulutusala.map(({ id }) => id).join(',')
          : '',
        opetuskieli: filter.opetuskieli
          ? filter.opetuskieli.map(({ id }) => id).join(',')
          : '',
        sijainti: sijainnit ? sijainnit.map(({ id }) => id).join(',') : '',
        lng: l.getLanguage(),
        sort: sort,
      })
      .catch(this.handleError);
  };

  @action
  search = (promises, resultAction) => {
    const _this = this;
    _this.errors = [];
    Promise.all(promises)
      .then((result) => {
        resultAction(result.map((r) => r.body));
      })
      .catch((err) => {
        _this.handleError(err);
      });
  };

  @action
  getKoulutus = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.koulutus') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const koulutus = res.body ? res.body : undefined;
          onSuccess(koulutus);
        }
      });
  };

  @action
  getKoulutusKuvaus = (oid, osaamisalakuvaukset, onSuccess) => {
    oid = oid.substring(0, oid.indexOf('#'));
    superagent
      .get(this.urlStore.urls.url('konfo-backend.koulutus.kuvaus') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .query({ osaamisalakuvaukset: osaamisalakuvaukset })
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const kuvaus = res.body ? res.body : undefined;
          onSuccess(kuvaus);
        }
      });
  };

  @action
  getToteutus = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.toteutus') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const koulutus = res.body ? res.body : undefined;
          const organisaatio =
            res.body && res.body.organisaatio
              ? res.body.organisaatio
              : undefined;
          onSuccess(koulutus, organisaatio);
        }
      });
  };

  @action
  getOppilaitos = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.oppilaitos') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          onSuccess(res.body.result);
        }
      });
  };

  @action
  getHaku = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.haku') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const haku = res.body ? res.body : undefined;
          onSuccess(haku);
        }
      });
  };

  @action
  getHakukohde = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.hakukohde') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const hakukohde = res.body ? res.body : undefined;
          onSuccess(hakukohde);
        }
      });
  };

  @action
  getToteutusPromise = (oid) => {
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.toteutus') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .then((res) => res.body)
      .catch(this.handleError);
  };

  @action
  getOppilaitosPromise = (oid) => {
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.oppilaitos') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui');
  };

  @action
  getKoulutusPromise = (oid) => {
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.koulutus') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .then((res) => res.body)
      .catch(this.handleError);
  };

  @action
  getKuvausPromise = (koulutuskoodi) => {
    return superagent
      .get(
        this.urlStore.urls.url('konfo-backend.koulutus.kuvaus') + koulutuskoodi
      )
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .then((res) => res.body)
      .catch(this.handleError);
  };
  @action
  getKoulutusJarjestajatPromise = (oid, options) => {
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.koulutus.jarjestajat', oid))
      .query(options)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .then((res) => res.body)
      .catch(this.handleError);
  };
}

export default RestStore;
