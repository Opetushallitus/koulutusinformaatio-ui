import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import Korkeakoulu from "./Korkeakoulu";
import Ammatillinen from "./Ammatillinen";
import Hakunavigaatio from './../hakutulos/Hakunavigaatio';
import AvoinYoKoulutus from "./AvoinYo";
import Lukiokoulutus from "./Lukiokoulutus";

@inject("restStore")
@inject("navigaatioStore")
@observer
class Koulutus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            koulutus: undefined
        }
    };

    async componentDidMount() {
        await this.getKoulutus();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getKoulutus();
    }

    getKoulutus() {
        this.props.navigaatioStore.setOid(this.props.match.params.oid);
        this.props.restStore.getKoulutus(this.props.navigaatioStore.oid, (k) => {
            this.setState({
                koulutus: k
            })
        });
    }

    chooseKoulutus() {
        if(this.state.koulutus) {
            switch(this.state.koulutus.searchData.tyyppi) {
                case 'lk': return <Lukiokoulutus oid={this.props.navigaatioStore.oid} result={this.state.koulutus}/>; //TODO
                case 'kk': return <Korkeakoulu oid={this.props.navigaatioStore.oid} result={this.state.koulutus}/>;
                case 'ako': return <AvoinYoKoulutus oid={this.props.navigaatioStore.oid} result={this.state.koulutus}/>;
                case 'amm' : return <Ammatillinen oid={this.props.navigaatioStore.oid} result={this.state.koulutus}/>;
                default: return <Ammatillinen oid={this.props.navigaatioStore.oid} result={this.state.koulutus} muu={true}/>;
            }
        }
        return <div/>
    }

    render() {
        const selectedKoulutus = this.chooseKoulutus();
        return (
            <React.Fragment>
                {selectedKoulutus}
                <Hakunavigaatio/>
            </React.Fragment>
        );
    }
}

export default Koulutus;