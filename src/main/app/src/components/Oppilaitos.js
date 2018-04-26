import React, { Component } from 'react';
import HakuNavigaatio from './HakuNavigaatio';
import Haku from './Haku';
import superagent from 'superagent';
import {observer, inject} from 'mobx-react';
import koulutusIcon from '../assets/images/logo-oppilaitos.png';
import twitterIcon from '../assets/images/twitter-icon.png';
import fbIcon from '../assets/images/fb-icon.png';
import instaIcon from '../assets/images/insta-icon.png';
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
            this.setState({
                loading: true
            });
            this.getOppilaitosTiedot();
        }
    }

    //Todo: Selvitä, onko tämä ylipäänsä järkevää
    getEmailFromYhteystiedot() {
        var data = this.state.result.yhteystiedot;
        var foundEmail = "ei sähköpostiosoitetta";
        data.map(y => {
            if (y.email) {
                foundEmail = y.email;
            }
        });
        return foundEmail;
    }

    //Todo: Selvitä, onko tämä ylipäänsä järkevää
    getPuhelinFromYhteystiedot() {
        var data = this.state.result.yhteystiedot;
        var foundPuhelin = "";
        data.map(y => {
            if(y.tyyppi === "puhelin" && y.numero) {
                foundPuhelin = "Puhelin: " + y.numero;
            }
        });
        return foundPuhelin;
    }

    getKotisivuFromYhteystiedot() {
        var data = this.state.result.yhteystiedot;
        var found = undefined;
        data.map(y => {
            if(y.www) {
                found = y.www;
            }
        });
        if(found) {
            return (
                <a className='oppilaitos-linkki' href={found}><div className='oppilaitos-linkki-ikoni'></div>Oppilaitoksen verkkosivu</a>
            )
        }
    }

    getOppilaitosTiedot() {
        console.log("Getting organisaatio with url: " + this.props.urlStore.urls.url('konfo-backend.organisaatio') + this.state.oid);
        superagent
            .get(this.props.urlStore.urls.url('konfo-backend.organisaatio')+this.state.oid)
            .end((err, res) => {
                this.setState({
                    result: res ? res.body.result : undefined,
                    error: err,
                    loading: false
                });
            });
    }

    parseKayntiOsoite() {
        if(!this.state.result.kayntiosoite) {
            return null;
        }
    return (<div><ul>
        <li><i>Käyntiosoite</i></li>
        <li>{this.state.result.kayntiosoite.osoite ? this.state.result.kayntiosoite.osoite : "???"}</li>
        <li>{this.state.result.kayntiosoite.postinumeroUri ? this.state.result.kayntiosoite.postinumeroUri+" " : "???"}
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
            <li>{this.state.result.postiosoite.postinumeroUri ? this.state.result.postiosoite.postinumeroUri+" " : "???"}
            {this.state.result.postiosoite.postitoimipaikka ? this.state.result.postiosoite.postitoimipaikka : "???"}</li>
        </ul>
        </div>);
    }

    parseSome() {
        var data = this.state.result.metadata.data;
        var fb = <p>(No Facebook)</p>;
        var twitter = <p>(No Twitter)</p>;
        var insta = <p>(No Instagram)</p>;

        for (var i = 1; i < 10; i++) {
            var key = "sosiaalinenmedia_"+i+"#1";
            if(data[key]) {
                var k = data[key];
                if(k["kieli_fi#1"]) {
                    if(k["kieli_fi#1"].indexOf('facebook') !== -1 ) {
                        fb = <a href={k["kieli_fi#1"]}><img className='fb-icon' src={fbIcon} alt={"Facebook"}/></a>
                    } else if (k["kieli_fi#1"].indexOf('twitter') !== -1) {
                        twitter = <a href={k["kieli_fi#1"]}><img className='twitter-icon' src={twitterIcon} alt={"Twitter"}/></a>
                    } else if (k["kieli_fi#1"].indexOf('instagram') !== -1) {
                        insta = <a href={k["kieli_fi#1"]}><img className='insta-icon' src={instaIcon} alt={"Instagram"}/></a>
                    }
                }

            }
        }
        return (
            <div>
                {fb}
                {twitter}
                {insta}
            </div>
        )

        //<img className='fb-icon' src={fbIcon} alt={"Facebook"}/>
        //<img className='twitter-icon' src={twitterIcon} alt={"Facebook"}/>
        //<img className='insta-icon' src={instaIcon} alt={"Facebook"}/>
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
                                        <li>{this.getEmailFromYhteystiedot()}</li>
                                        <li>{this.getPuhelinFromYhteystiedot()}</li>
                                    </ul>
                                </div>
                                <div className='oppilaitos-kotisivu'>
                                    {this.getKotisivuFromYhteystiedot()}
                                </div>
                                <div className='sosiaalinen-media'>
                                    {this.parseSome()}
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