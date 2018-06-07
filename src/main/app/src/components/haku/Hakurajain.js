import React, { Component } from 'react';
import Hakurajainvalinta from './Hakurajainvalinta';
import {observer, inject} from 'mobx-react';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

@inject ("hakuStore")
@observer
class Hakurajain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rajainOpen: false
        }
    }

    handleKoulutusChange(filter) {
        if (filter) {
            if (this.props.hakuStore.filterKoulutus.indexOf(filter) === -1) {
                this.props.hakuStore.filterKoulutus.push(filter);
            } else {
                this.props.hakuStore.filterKoulutus
                    = this.props.hakuStore.filterKoulutus.filter((i) => i !== filter);
            }
        }
    }

    handleKieliChange(filter) {
        if (filter) {
            if (this.props.hakuStore.filterKieli.indexOf(filter) === -1) {
                this.props.hakuStore.filterKieli.push(filter);
            } else {
                this.props.hakuStore.filterKieli
                    = this.props.hakuStore.filterKieli.filter((i) => i !== filter);
            }
        }
    }

    handlePaikkakuntaChange(str) {
        this.props.hakuStore.filterPaikkakunta = str;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.history.push(this.props.hakuStore.createHakuUrl);
    }

    toggleRajain() {
        this.setState({rajainOpen: !this.state.rajainOpen});
    }

    render() {
        const link = '/haku/' + this.props.hakuStore.keyword;
        const search = this.props.hakuStore.search;
        const value = this.props.hakuStore.filterPaikkakunta ? this.props.hakuStore.filterPaikkakunta : '';
        return (
            <React.Fragment>
                <div className="col-xs-12">
                    <div className={"filter-button " + (this.state.rajainOpen ? "sulje" : "")} onClick={() => this.toggleRajain()} role="button">
                    </div>
                </div>
                {this.state.rajainOpen &&
                <div className="filters-layer">
                    <div className="filter-container open">
                        <div className="filter-options">
                            <div className="filters-main">
                                <div className="form-group">
                                    <h5>Koulutustyyppi</h5>
                                    <Hakurajainvalinta text="Lukio" checked={this.props.hakuStore.filterKoulutus.indexOf('lk') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('lk')} color="1"/>
                                    <Hakurajainvalinta text="Ammatilliset tutkinnot" checked={this.props.hakuStore.filterKoulutus.indexOf('amm') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('amm')} color="2"/>
                                    <Hakurajainvalinta text="Korkeakoulut" checked={this.props.hakuStore.filterKoulutus.indexOf('kk') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('kk')} color="3"/>
                                    <Hakurajainvalinta text="Muut kurssit ja koulutukset" checked={this.props.hakuStore.filterKoulutus.indexOf('muu') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('muu')} color="5"/>
                                </div>
                                <div className="form-group">
                                    <h5>Opetuskieli</h5>
                                    <Hakurajainvalinta text="Suomi" checked={this.props.hakuStore.filterKieli.indexOf('fi') !== -1}
                                                       handleChange={() => this.handleKieliChange('fi')}/>
                                    <Hakurajainvalinta text="Ruotsi" checked={this.props.hakuStore.filterKieli.indexOf('sv') !== -1}
                                                       handleChange={() => this.handleKieliChange('sv')}/>
                                    <Hakurajainvalinta text="Englanti" checked={this.props.hakuStore.filterKieli.indexOf('en') !== -1}
                                                       handleChange={() => this.handleKieliChange('en')}/>
                                </div>
                                <div className="form-group">
                                    <h5 className="filter-title">Paikkakunta</h5>
                                    <input className="oph-input" type="text" placeholder="Syötä paikkakunnan nimi"
                                           onChange={(e) =>this.handlePaikkakuntaChange(e.target.value)}
                                           value={value}
                                           onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                </div>
                                <div className="form-group action-buttons">
                                    <Link className="btn btn-primary" to={{
                                        pathname: link,
                                        search: search
                                    }}>HAE</Link>
                                    <Link className="clear-compare" to={{
                                        pathname: link,
                                        search: ''
                                    }}>Poista rajaukset</Link>
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