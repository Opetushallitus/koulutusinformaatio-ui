import React, { Component } from 'react';
import Hakurajainvalinta from './Hakurajainvalinta';
import HakuStore from '../../stores/haku-store'


class Hakurajain extends Component {

    constructor (props) {
        super(props);
        this.state = {
            filterOppilaitos: "",
            filterPaikkakunta: "",
        };
    }

    render() {
        return (
            <React.Fragment>
                <div className="filters-layer">
                    <div className="filter-container open">
                        <div className="filter-options">
                            <div className="filters-main">
                                <div className="form-group">
                                    <h5>Koulutustyyppi</h5>
                                    <Hakurajainvalinta text="Lukio" color="1"/>
                                    <Hakurajainvalinta text="Ammatilliset tutkinnot" color="2"/>
                                    <Hakurajainvalinta text="Korkeakoulut (myös avoimet)" color="3"/>
                                    <Hakurajainvalinta text="Muut kurssit ja koulutukset" color="5"/>
                                </div>
                                <div className="form-group">
                                    <h5 className="filter-title">Paikkakunta</h5>
                                    <input className="oph-input" type="text" placeholder="Syötä paikkakunnan nimi" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Hakurajain;