import React, { Component } from 'react';
import HakuNavigaatio from '../HakuNavigaatio';
import superagent from 'superagent';
import {observer, inject} from 'mobx-react';
import qs from 'query-string';
import {Localizer as l, Parser as p} from '../../tools/Utils';
import OskariKartta from "./OskariKartta";

@inject("hakuStore")
@inject("urlStore")
@observer
class Oppilaitos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: this.props.match.params.oid,
            result: undefined
        };
        console.log("Created component Oppilaitos with oid: " + this.state.oid + ", result: " + this.state.result);
    }

    async componentDidMount() {
        if(this.state.oid) {
            this.getOppilaitosTiedot();
        }
    }

    getHakuUrl() {
        const queryParams = qs.parse(this.props.location.search);
        return queryParams.haku;
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
                <a href={found}><i className='fa fa-external-link'> </i>Oppilaitoksen verkkosivu</a>
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
                    error: err
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
        <li>{this.state.result.kayntiosoite.postinumeroUri ? this.state.result.kayntiosoite.postinumeroUri+" " : "??? "}
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
            <li>{this.state.result.postiosoite.postinumeroUri ? this.state.result.postiosoite.postinumeroUri+" " : "??? "}
            {this.state.result.postiosoite.postitoimipaikka ? this.state.result.postiosoite.postitoimipaikka : "???"}</li>
        </ul>
        </div>);
    }

    safeParseYleiskuvaus() {
        var data = this.state.result;
        var result = <div></div>;
        if(data && data.yleiskuvaus && data.yleiskuvaus["kieli_fi#1"])
            result = <div>{p.removeHtmlTags(data.yleiskuvaus["kieli_fi#1"])}</div>
        return result;
    }

    parseSome() {
        var data = this.state.result.metadata.data;
        var fb = <li></li>;
        var twitter = <li></li>;
        var insta = <li></li>;

        for (var i = 1; i < 10; i++) {
            var key = "sosiaalinenmedia_"+i+"#1";
            if(data[key]) {
                var k = data[key];
                if(k["kieli_fi#1"]) {
                    if(k["kieli_fi#1"].indexOf('facebook') !== -1 ) {
                        fb = <li><a className='fa fa-facebook-square fa-3x' href={k["kieli_fi#1"]}></a></li>
                    } else if (k["kieli_fi#1"].indexOf('twitter') !== -1) {
                        twitter = <li><a className='fa fa-twitter-square fa-3x' href={k["kieli_fi#1"]}></a></li>
                    } else if (k["kieli_fi#1"].indexOf('instagram') !== -1) {
                        insta = <li><a className='fa fa-instagram fa-3x' href={k["kieli_fi#1"]}></a></li>
                    }
                }

            }
        }
        return (
            <ul className='social'>
                {fb}
                {twitter}
                {insta}
            </ul>
        )

        //<img className='fb-icon' src={fbIcon} alt={"Facebook"}/>
        //<img className='twitter-icon' src={twitterIcon} alt={"Facebook"}/>
        //<img className='insta-icon' src={instaIcon} alt={"Facebook"}/>
    }

    render() {
        if(!this.state.result) {
            console.log("Was going to render, but got no data.");
            return null;
        }
        console.log("Rendering page, data: %O", this.state.result );
        return (
            <React.Fragment>
                <div className='container'>
                    <div className='row info-page oppilaitos'>
                        <div className='col-xs-12 col-md-9 left-column'>
                            <h1><i className='fa fa-circle'></i>{this.state.result.nimi.fi}</h1>
                            <div className='oppilaitos-yleiskuvaus'>
                                <p>{this.safeParseYleiskuvaus()}</p>
                            </div>
                        </div>

                        <div className="col-xs-12 col-md-3 right-column row-eq-height">
                            <div className='orgaanisaatio-yhteystiedot'>
                                <div className='col-md-12'>
                                    {this.parseKayntiOsoite()}
                                </div>
                                <div className='col-md-12'>
                                    {this.parsePostiOsoite()}
                                </div>
                                <div className='col-md-12'>
                                    <ul>
                                        <li>{this.getEmailFromYhteystiedot()}</li>
                                        <li>{this.getPuhelinFromYhteystiedot()}</li>
                                    </ul>
                                </div>
                                <div className='col-md-12'>
                                    {this.getKotisivuFromYhteystiedot()}
                                </div>
                                <div className='sosiaalinen-media col-md-12'>
                                    {this.parseSome()}
                                </div>
                                <div>
                                    <OskariKartta/>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <HakuNavigaatio haku={this.getHakuUrl()} selected={this.state.oid}/>
            </React.Fragment>
        );
    }
}

export default Oppilaitos;