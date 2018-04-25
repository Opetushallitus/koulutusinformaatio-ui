import React, { Component } from 'react';
import HakuNavigaatio from './HakuNavigaatio';
import Haku from './Haku';
import superagent from 'superagent';
import {observer, inject} from 'mobx-react';
import koulutusIcon from '../assets/images/logo-oppilaitos.png';
import Utils from './Utils';

@inject("hakuStore")
@inject("urlStore")
@observer
class Oppilaitos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: this.props.match.params.oid,
            result: undefined,
            loading: undefined
        };
        console.log("Created component Oppilaitos with oid: " + this.state.oid + ", result: " + this.state.result);
    }

    async componentDidMount() {
        if(this.state.oid) {
            this.state.loading = true;
            this.getOppilaitosTiedot();
        }
    }

    getOppilaitosTiedot() {
        console.log("Getting organisaatio with url: " + this.props.urlStore.urls.url('konfo-backend.organisaatio') + this.state.oid);
        superagent
            .get(this.props.urlStore.urls.url('konfo-backend.organisaatio')+this.state.oid)
            .end((err, res) => {
                this.setState({
                    result: res ? res.body.result : undefined,
                    error: err
                });
            });
        this.state.loading = false;
    }

    parseKayntiOsoite() {
        if(!this.state.result.kayntiosoite) {
            return null;
        }
    return (<div><ul>
        <li><i>Käyntiosoite</i></li>
        <li>{this.state.result.kayntiosoite.osoite ? this.state.result.kayntiosoite.osoite : "???"}</li>
        <li>{this.state.result.kayntiosoite.postinumeroUri ? this.state.result.kayntiosoite.postinumeroUri : "???"}
            {this.state.result.kayntiosoite.postitoimipaikka ? this.state.result.kayntiosoite.postitoimipaikka : "???"}</li>
    </ul>
    </div>);
    }

    parsePostiOsoite() {
        if(!this.state.result.postiosoite) {
            return null;
        }
        return (<div><ul>
            <li><i>Postiosoite</i></li>
            <li>{this.state.result.postiosoite.osoite ? this.state.result.postiosoite.osoite : "???"}</li>
            <li>{this.state.result.postiosoite.postinumeroUri ? this.state.result.postiosoite.postinumeroUri : "???"}
            {this.state.result.postiosoite.postitoimipaikka ? this.state.result.postiosoite.postitoimipaikka : "???"}</li>
        </ul>
        </div>);
    }

    render() {
        if(!this.state.result) {
            console.log("Was going to render, but got no data.");
            Utils.localize("foo");
            return null;
        }
        console.log("Rendering page, data: %O", this.state.result );
        return (
            <React.Fragment>
                <div className='organisaatiosivu'>
                    <h2><img className='koulutusIcon' src={koulutusIcon} alt={"logo"}/>{this.state.result.nimi.fi}</h2>
                    <div className='oppilaitos-yleiskuvaus'>
                        <p>{this.state.result.metadata.data.YLEISKUVAUS["kieli_fi#1"]}</p>
                    </div>
                    <div className="organisaatio-right">
                        <div className="right-innards">
                            <div className='organisaatio-yhteystiedot'>
                                <div>
                                    {this.parseKayntiOsoite()}
                                </div>
                                <div>
                                    {this.parsePostiOsoite()}
                                </div>
                                <div>
                                    <ul>
                                        <li></li>
                                        <li></li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <HakuNavigaatio/>
            </React.Fragment>
        );
    }
}

export default Oppilaitos;