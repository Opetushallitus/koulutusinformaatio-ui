import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import '../../assets/styles/components/_toteutus-koulutus.scss';
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
            toteutus: undefined,
            organisaatio: undefined
        }
    };

    async componentDidMount() {
        await this.getToteutus();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getToteutus();
    }

    getToteutus() {
        this.props.navigaatioStore.setOid(this.props.match.params.oid);
        this.props.restStore.getToteutus(this.props.navigaatioStore.oid, (k, o) => {
            this.setState({
                toteutus: k,
                organisaatio: o
            })
        });
    }

    chooseKoulutus() {
        const koulutusUri = this.props.location.state ? (this.props.location.state.koulutusUri ? this.props.location.state.koulutusUri : undefined) : undefined;
        if(this.state.toteutus) {
            switch(this.state.toteutus.metadata.tyyppi) {
                case 'lk': return <Lukio organisaatio={this.state.organisaatio} toteutus={this.state.toteutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />; //TODO
                case 'yo': return <Korkeakoulu organisaatio={this.state.organisaatio} toteutus={this.state.toteutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />;
                case 'amk': return <Korkeakoulu organisaatio={this.state.organisaatio} toteutus={this.state.toteutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />;
                case 'kk': return <Korkeakoulu organisaatio={this.state.organisaatio} toteutus={this.state.toteutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />;
                case 'ako': return <Avoin organisaatio={this.state.organisaatio} toteutus={this.state.toteutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />;
                case 'amm' : return <Ammatillinen koulutusUri={koulutusUri} organisaatio={this.state.organisaatio} toteutus={this.state.toteutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} />;
                default: return <Ammatillinen organisaatio={this.state.organisaatio} toteutus={this.state.toteutus} educationType={this.state.koulutus && this.state.koulutus.metadata.tyyppi} oid={this.props.navigaatioStore.oid} muu={true} />;
            }
        }
        return <div/>
    }

    render() {
        const selectedKoulutus = this.chooseKoulutus();
        return (
            <React.Fragment>
                <div className="container" id="toteutus-container">
                    <div className="row info-page toteutus">
                        {selectedKoulutus}
                    </div>
                </div>
                <Hakunavigaatio/>
            </React.Fragment>
        );
    }
}

export default Koulutus;