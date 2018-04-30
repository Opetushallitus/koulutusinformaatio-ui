import React, { Component } from 'react';
import HakuNavigaatio from './../HakuNavigaatio';
import superagent from 'superagent';
import {observer, inject} from 'mobx-react';
import Korkeakoulu from "./Korkeakoulu";
import Ammatillinen from "./Ammatillinen";
import qs from 'query-string';

@inject("hakuStore")
@inject("urlStore")
@observer
class Koulutus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: this.props.match.params.oid,
            result: undefined
        };
        console.log("Created component Koulutus with oid: " + this.state.oid + ", result: " + this.state.result);
    }

    async componentDidMount() {
        if(this.state.oid) {
            this.getKoulutus();
        }
    }

    getHakuUrl() {
        const queryParams = qs.parse(this.props.location.search);
        return queryParams.haku;
    }

    getKoulutus() {
        console.log("Getting koulutus with url: " + this.props.urlStore.urls.url('konfo-backend.koulutus') + this.state.oid);
        superagent
            .get(this.props.urlStore.urls.url('konfo-backend.koulutus')+this.state.oid)
            .end((err, res) => {
                this.setState({
                    result: res ? res.body.result.koulutus : undefined,
                    error: err
                });
            });
    }

    chooseKoulutus(koulutus) {
        if(koulutus) {
            if(koulutus.moduulityyppi === 'LUKIOKOULUTUS') {
                return <Korkeakoulu name={this.state.nimi} oid={this.state.oid} result={koulutus}/> //TODO
            }
            if(koulutus.moduulityyppi === 'KORKEAKOULUTUS' && !(koulutus.isAvoimenYliopistonKoulutus)) {
                return <Korkeakoulu name={this.state.nimi} oid={this.state.oid} result={koulutus}/>
            }
            if(koulutus.isAvoimenYliopistonKoulutus) {
                return <Korkeakoulu name={this.state.nimi} oid={this.state.oid} result={koulutus}/> //TODO
            }
            return <Ammatillinen name={this.state.nimi} oid={this.state.oid} result={koulutus}/> //TODO
        }
        return <div/>
    }

    render() {
        var selectedKoulutus=<div/>;
        if(this.state.result) {
                selectedKoulutus = this.chooseKoulutus(this.state.result[this.state.oid]);
        }
        return (
            <React.Fragment>
                {selectedKoulutus}
                <HakuNavigaatio haku={this.getHakuUrl()} selected={this.state.oid}/>
            </React.Fragment>
        );
    }
}

export default Koulutus;