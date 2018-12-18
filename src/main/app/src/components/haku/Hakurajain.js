import React, { Component } from 'react';
import Hakurajainvalinta from './Hakurajainvalinta';
import {observer, inject} from 'mobx-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import '../../assets/styles/components/_hakurajain.scss';

@translate()
@inject ("hakuehtoStore")
@observer
class Hakurajain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtersHeight: 0,
            isVisible: false,
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount () {
        window.addEventListener('resize', this.handleWindowResize); 
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    getBoundingClientRect() {
        const rect = document.getElementById("main-content").getBoundingClientRect();
        return {
          height: rect.height
        };
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    calculateLayerHeight(){
        const element = this.getBoundingClientRect();
        const filtersForm = document.getElementById('filters-form');
        const layerHeight = filtersForm && filtersForm.clientHeight <= window.innerHeight - 175 ? element.height : window.innerHeight - 175;
        return layerHeight;
    }

    handleWindowResize() {
        setTimeout(() => {
            const layerHeight = this.calculateLayerHeight();
            this.setState({
                filtersHeight: layerHeight
              });
        },100) 
    }

    handleClickOutside(event) {   
        const clickedElementId = event.target && event.target.offsetParent ? event.target.offsetParent.id : "no-id";
        const isFiltersButton = clickedElementId === "filters-button";
        const isToggleTabs = event.target.parentElement.className === "KoulutuksetOppilaitokset";
        if ((this.wrapperRef && !this.wrapperRef.contains(event.target)) && !isToggleTabs && !isFiltersButton) {
            this.toggleRajain();
        }
    }

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
        this.props.shareVisibility();
        setTimeout(() => {
            const layerHeight = this.calculateLayerHeight();
            this.setState({
                filtersHeight: this.state.isVisible ? 0 : layerHeight,
                isVisible: !this.state.isVisible
        })
        },250)
    }

    clear() {
        this.props.hakuehtoStore.filter.kieli = [];
        this.props.hakuehtoStore.filter.paikkakunta = "";
        this.props.hakuehtoStore.filter.koulutus = [];
        this.toggleRajain();
    }

    render() {
        const {t} = this.props;
        const link = '/haku/' + this.props.hakuehtoStore.keyword;
        const search = this.props.hakuehtoStore.searchParams;
        const value = this.props.hakuehtoStore.filter.paikkakunta ? this.props.hakuehtoStore.filter.paikkakunta : '';
        return (
            <React.Fragment>
                <div className="container">
                    <div className="col-12">
                        <div id="filters-button" className="filter-button" onClick={() => this.toggleRajain(this)} role="button">
                            <span>{this.props.hakuehtoStore.rajainOpen ? t("haku.sulje-rajain") : t("haku.rajaa-etsintää")}</span>
                        </div>
                    </div>
                </div>
                {this.props.hakuehtoStore.rajainOpen &&
                <div className="container search-filter">
                <div className="col-12">
                <div className="filters-layer" ref={this.setWrapperRef}>
                    <div className={`filter-container ${this.state.isVisible ? "open" : "collapsed"}`}>
                        <div className="filter-options" style={{height: this.state.filtersHeight, overflowX: "scroll"}}>
                            <div className="filters-main" id="filters-form">
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
                                    <input id="paikkakunta" className="oph-input" type="text" aria-label={t('haku.paikkakunta-kehoite')} placeholder={t('haku.paikkakunta-kehoite')}
                                           onChange={(e) =>this.handlePaikkakuntaChange(e.target.value)}
                                           value={value}
                                           onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                </div>
                                <div className="form-group action-buttons">
                                    <Link id="rajain-search" role="button" aria-label={t('haku.hae')} className="btn btn-primary" to={{
                                        pathname: link,
                                        search: search
                                    }} onClick={() => {this.toggleRajain()}}>{t('haku.hae')}</Link>
                                    <Link id="rajain-clear" role="button" aria-label={t('haku.poista-rajaukset')} className="clear-compare" to={{
                                        pathname: link,
                                        search: ''
                                    }} onClick={() => {this.clear()}}>{t('haku.poista-rajaukset')}</Link>
                                </div>
                            </div>
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