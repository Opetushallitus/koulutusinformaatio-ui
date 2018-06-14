import React, { Component } from 'react';
import superagent from 'superagent';
import {observer, inject} from 'mobx-react';
import Korkeakoulu from "./Korkeakoulu";
import Ammatillinen from "./Ammatillinen";
import Hakunavigaatio from './../haku/Hakunavigaatio';
import AvoinYoKoulutus from "./AvoinYo";
import Lukiokoulutus from "./Lukiokoulutus";

@inject("urlStore")
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
        superagent
            .get(this.props.urlStore.urls.url('konfo-backend.koulutus') + this.props.navigaatioStore.oid)
            .end((err, res) => {
                this.setState({
                    koulutus: res ? res.body.result.koulutus[this.props.navigaatioStore.oid] : undefined,
                    error: err
                });
            });
    }

    chooseKoulutus() {
        console.log(this.state.koulutus)
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