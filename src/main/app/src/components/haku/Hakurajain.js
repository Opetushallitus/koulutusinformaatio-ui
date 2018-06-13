import React, { Component } from 'react';
import Hakurajainvalinta from './Hakurajainvalinta';
import {observer, inject} from 'mobx-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

@translate()
@inject ("hakuehtoStore")
@observer
class Hakurajain extends Component {

    handleKoulutusChange(filter) {
        if (filter) {
            if (this.props.hakuehtoStore.filter.koulutus.indexOf(filter) === -1) {
                this.props.hakuehtoStore.filter.koulutus.push(filter);
            } else {
                this.props.hakuehtoStore.filter.koulutus
                    = this.props.hakuehtoStore.filter.koulutus.filter((i) => i !== filter);
            }
        }
    }

    handleKieliChange(filter) {
        if (filter) {
            if (this.props.hakuehtoStore.filter.kieli.indexOf(filter) === -1) {
                this.props.hakuehtoStore.filter.kieli.push(filter);
            } else {
                this.props.hakuehtoStore.filter.kieli
                    = this.props.hakuehtoStore.filter.kieli.filter((i) => i !== filter);
            }
        }
    }

    handlePaikkakuntaChange(str) {
        this.props.hakuehtoStore.filter.paikkakunta = str;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.history.push(this.props.hakuehtoStore.createHakuUrl);
        this.props.hakuehtoStore.toggleRajain();
    }

    toggleRajain() {
        this.props.hakuehtoStore.toggleRajain();
    }

    clear() {
        this.props.hakuehtoStore.filter.kieli = [];
        this.props.hakuehtoStore.filter.paikkakunta = "";
        this.props.hakuehtoStore.filter.koulutus = [];
        this.props.hakuehtoStore.toggleRajain();
    }

    render() {
        const {t} = this.props;
        const link = '/haku/' + this.props.hakuehtoStore.keyword;
        const search = this.props.hakuehtoStore.searchParams;
        const value = this.props.hakuehtoStore.filter.paikkakunta ? this.props.hakuehtoStore.filter.paikkakunta : '';
        return (
            <React.Fragment>
                <div className="col-xs-12">
                    <div className={"filter-button " + (this.props.hakuehtoStore.rajainOpen ? "sulje" : "")} onClick={() => this.toggleRajain()} role="button">
                    </div>
                </div>
                {this.props.hakuehtoStore.rajainOpen &&
                <div className="filters-layer">
                    <div className="filter-container open">
                        <div className="filter-options">
                            <div className="filters-main">
                                <div className="form-group">
                                    <h5>{t('haku.koulutustyyppi')}</h5>
                                    <Hakurajainvalinta text={t('haku.lukio')} checked={this.props.hakuehtoStore.filter.koulutus.indexOf('lk') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('lk')} color="1"/>
                                    <Hakurajainvalinta text={t('haku.ammatillinen')} checked={this.props.hakuehtoStore.filter.koulutus.indexOf('amm') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('amm')} color="2"/>
                                    <Hakurajainvalinta text={t('haku.korkeakoulu')} checked={this.props.hakuehtoStore.filter.koulutus.indexOf('kk') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('kk')} color="3"/>
                                    <Hakurajainvalinta text={t('haku.muut')} checked={this.props.hakuehtoStore.filter.koulutus.indexOf('muu') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('muu')} color="5"/>
                                </div>
                                <div className="form-group">
                                    <h5>{t('haku.opetuskieli')}</h5>
                                    <Hakurajainvalinta text={t('haku.suomi')} checked={this.props.hakuehtoStore.filter.kieli.indexOf('fi') !== -1}
                                                       handleChange={() => this.handleKieliChange('fi')}/>
                                    <Hakurajainvalinta text={t('haku.ruotsi')} checked={this.props.hakuehtoStore.filter.kieli.indexOf('sv') !== -1}
                                                       handleChange={() => this.handleKieliChange('sv')}/>
                                    <Hakurajainvalinta text={t('haku.englanti')} checked={this.props.hakuehtoStore.filter.kieli.indexOf('en') !== -1}
                                                       handleChange={() => this.handleKieliChange('en')}/>
                                </div>
                                <div className="form-group">
                                    <h5 className="filter-title">{t('haku.paikkakunta')}</h5>
                                    <input className="oph-input" type="text" placeholder={t('haku.paikkakunta-kehoite')}
                                           onChange={(e) =>this.handlePaikkakuntaChange(e.target.value)}
                                           value={value}
                                           onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                </div>
                                <div className="form-group action-buttons">
                                    <Link className="btn btn-primary" to={{
                                        pathname: link,
                                        search: search
                                    }} onClick={() => {this.toggleRajain()}}>{t('haku.hae')}</Link>
                                    <Link className="clear-compare" to={{
                                        pathname: link,
                                        search: ''
                                    }} onClick={() => {this.clear()}}>{t('haku.poista-rajaukset')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </React.Fragment>
        );
    }
}

export default withRouter(Hakurajain);