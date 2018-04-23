import React, { Component } from 'react';
import HakuNavigaatio from './HakuNavigaatio';
import Haku from './Haku';
import superagent from 'superagent';
import {observer, inject} from 'mobx-react';
import Yliopistokoulutus from "./Yliopistokoulutus";

@inject("hakuStore")
@inject("urlStore")
@observer
class Koulutus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: this.props.match.params.oid,
            result: undefined,
            loading: undefined
        };
        console.log("Created component Koulutus with oid: " + this.state.oid + ", result: " + this.state.result);
    }

    async componentDidMount() {
        if(this.state.oid) {
            this.state.loading = true;
            this.getKoulutus();
        }
    }

    getKoulutus() {
        console.log("Getting koulutus with url: " + this.props.urlStore.urls.url('konfo-backend.koulutus') + this.state.oid);
        superagent
            .get(this.props.urlStore.urls.url('konfo-backend.koulutus')+this.state.oid)
            .end((err, res) => {
                console.log("Got result " + res + ", err: " + err);
                this.setState({
                    result: res ? res.body.result.koulutus : undefined,
                    error: err
                });
                if(res) {
                    console.log("Got koulutusdata: %O", res.body.result);
                }
            });
        this.state.loading = false;
    }

    render() {
        //Tähän päättely, minkä tyypin koulutussivupohjaa käytetään. Nyt kaikille valitaan yliopistokoulutuksen pohja.
        var selectedKoulutus=<div/>;
        if(this.state.result && this.state.result[this.state.oid]) {
            selectedKoulutus = <Yliopistokoulutus name={this.state.nimi} oid={this.state.oid} result={this.state.result[this.state.oid]}/>
        }
        return (
            <React.Fragment>
                {selectedKoulutus}
                <HakuNavigaatio/>
            </React.Fragment>
        );
    }
}

export default Koulutus;