import React, { Component } from 'react';
import Hakurajainvalinta from './Hakurajainvalinta';

class Hakurajain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rajainOpen: false,
            filterChanged: false
        }
    }

    handleOppilaitosChange(filter) {
        if (filter) {
            if (this.props.hakuStore.filterOppilaitos.indexOf(filter) === -1) {
                this.props.hakuStore.filterOppilaitos.push(filter);
            } else {
                this.props.hakuStore.filterOppilaitos
                    = this.props.hakuStore.filterOppilaitos.filter((i) => i !== filter);

            }
            this.setState({filterChanged: true});
        }
    }

    handlePaikkakuntaChange(str) {
        this.props.hakuStore.filterPaikkakunta = str;
        this.setState({filterChanged: true});
    }

    handleSubmit(e) {
        console.log("submit1");
        this.props.handleRefresh(this.state.filterChanged);
        this.setState({filterChanged: false});
    }

    clearFilters(e) {
        this.props.hakuStore.filterOppilaitos = [];
        this.props.hakuStore.filterPaikkakunta = "";
        this.props.handleRefresh(true);
        this.setState({filterChanged: false});
    }

    toggleRajain() {
        this.setState({rajainOpen: !this.state.rajainOpen});
    }

    render() {
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
                                    <Hakurajainvalinta text="Lukio" checked={this.props.hakuStore.filterOppilaitos.indexOf('lk') !== -1}
                                                       handleChange={() => this.handleOppilaitosChange('lk')} color="1"/>
                                    <Hakurajainvalinta text="Ammatilliset tutkinnot" checked={this.props.hakuStore.filterOppilaitos.indexOf('amm') !== -1}
                                                       handleChange={() => this.handleOppilaitosChange('amm')} color="2"/>
                                    <Hakurajainvalinta text="Korkeakoulut (myös avoimet)" checked={this.props.hakuStore.filterOppilaitos.indexOf('kk') !== -1}
                                                       handleChange={() => this.handleOppilaitosChange('kk')} color="3"/>
                                    <Hakurajainvalinta text="Muut kurssit ja koulutukset" checked={this.props.hakuStore.filterOppilaitos.indexOf('muu') !== -1}
                                                       handleChange={() => this.handleOppilaitosChange('muu')} color="5"/>
                                </div>
                                <div className="form-group">
                                    <h5 className="filter-title">Paikkakunta</h5>
                                    <input className="oph-input" type="text" placeholder="Syötä paikkakunnan nimi"
                                           onChange={(e) =>this.handlePaikkakuntaChange(e.target.value)}
                                           value={this.props.hakuStore.filterPaikkakunta}/>
                                </div>
                                <div className="form-group action-buttons">
                                    <a className="btn btn-primary" role="button" onClick={(e) => this.handleSubmit(e)}>HAE</a>
                                    <a className="clear-compare" onClick={(e) => this.clearFilters(e)}>Poista rajaukset</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </React.Fragment>
        );
    }
}

export default Hakurajain;