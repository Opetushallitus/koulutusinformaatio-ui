import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import '../../assets/styles/components/_hakukohde-koulutus.scss';
import Korkeakoulu from "./Korkeakoulu";
import Ammatillinen from "./Ammatillinen";
import Hakunavigaatio from './../hakutulos/Hakunavigaatio';
import Avoin from "./Avoin";
import Lukio from "./Lukio";

@inject("restStore")
@inject("navigaatioStore")
@observer
class Koulutus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            koulutus: undefined,
            organisaatio: undefined
        }
    };

    async componentDidMount() {
        await this.getHakukohde();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getHakukohde();
    }

    getHakukohde() {
        this.props.navigaatioStore.setOid(this.props.match.params.oid);
        this.props.restStore.getToteutus(this.props.navigaatioStore.oid, (k, o) => {
            this.setState({
                koulutus: k,
                organisaatio: o
            })
        });
    }

    chooseKoulutus() {
        if(this.state.koulutus) {
            switch(this.state.koulutus.metadata.tyyppi) {
                case 'lk': return <Lukio organisaatio={this.state.organisaatio} koulutus={this.state.koulutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />; //TODO
                case 'yo': return <Korkeakoulu organisaatio={this.state.organisaatio} koulutus={this.state.koulutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />;
                case 'ako': return <Avoin organisaatio={this.state.organisaatio} koulutus={this.state.koulutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />;
                case 'amm' : return <Ammatillinen organisaatio={this.state.organisaatio} koulutus={this.state.koulutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />;
                default: return <Ammatillinen organisaatio={this.state.organisaatio} koulutus={this.state.koulutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} muu={true} />;
            }
        }
        return <div/>
    }

    render() {
        const selectedKoulutus = this.chooseKoulutus();
        return (
            <React.Fragment>
                <div className="container" id="hakukohde-container">
                    <div className="row info-page hakukohde">
                        {selectedKoulutus}
                    </div>
                </div>
                <Hakunavigaatio/>
            </React.Fragment>
        );
    }
}

export default Koulutus;