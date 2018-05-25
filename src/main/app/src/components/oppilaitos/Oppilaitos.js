import React, { Component } from 'react';
import Hakunavigaatio from '../haku/Hakunavigaatio';
import Hakupalkki from '../haku/Hakupalkki';
import superagent from 'superagent';
import {observer, inject} from 'mobx-react';
import qs from 'query-string';
import OskariKartta from "./OskariKartta";
import renderHTML from 'react-render-html';


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
        const data = this.state.result.yhteystiedot;

        for (let row in data){
            if (row.email) {
                return row.email;
            }
        }
        return "ei sähköpostiosoitetta";
    }

    //Todo: Selvitä, onko tämä ylipäänsä järkevää
    getPuhelinFromYhteystiedot() {
        const data = this.state.result.yhteystiedot;

        for (let row in data){
            if(row.tyyppi === "puhelin" && row.numero) {
                return "Puhelin: " + row.numero;
            }
        }
        return "";
    }

    getKotisivuFromYhteystiedot() {
        const data = this.state.result.yhteystiedot;

        for (let row in data){
            if(row.www) {
                return (
                    <a href={row.www}><i className='fa fa-external-link'> </i>Oppilaitoksen verkkosivu</a>
                )
            }
        }
        return undefined;
    }

    getOppilaitosTiedot() {
        superagent
            .get(this.props.urlStore.urls.url('konfo-backend.oppilaitos')+this.state.oid)
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
            <li>{this.state.result.kayntiosoite.osoite ? this.state.result.kayntiosoite.osoite : "(ei käyntiosoitetta)"}</li>
            <li>{this.state.result.kayntiosoite.postinumeroUri ? this.state.result.kayntiosoite.postinumeroUri+" " : "(ei postinumeroa) "}
                {this.state.result.kayntiosoite.postitoimipaikka ? this.state.result.kayntiosoite.postitoimipaikka : "(ei postitoimipaikkaa)"}</li>
        </ul>
        </div>);
    }

    parsePostiOsoite() {
        if(!this.state.result.postiosoite) {
            return null;
        }
        return (<div><ul>
            <li><i>Postiosoite</i></li>
            <li>{this.state.result.postiosoite.osoite ? this.state.result.postiosoite.osoite : "(ei postiosoitetta)"}</li>
            <li>{this.state.result.postiosoite.postinumeroUri ? this.state.result.postiosoite.postinumeroUri+" " : "(ei postinumeroa)"}
            {this.state.result.postiosoite.postitoimipaikka ? this.state.result.postiosoite.postitoimipaikka : "(ei postitoimipaikkaa)"}</li>
        </ul>
        </div>);
    }

    safeParseYleiskuvaus() {
        var data = this.state.result;
        var result = <div></div>;
        if(data && data.yleiskuvaus && data.yleiskuvaus["kieli_fi#1"])
            result = <div>{renderHTML(data.yleiskuvaus["kieli_fi#1"])}</div>
        return result;
    }

    parseSome() {
        if (!this.state.result.metadata || !this.state.result.metadata.data)  {
            console.log("Ei tarvittavia sometietoja saatavilla");
            return <div className='social'></div>;
        }
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
                        fb = <li><a href={k["kieli_fi#1"]}><i className='fa fa-facebook-square fa-3x' /></a></li>
                    } else if (k["kieli_fi#1"].indexOf('twitter') !== -1) {
                        twitter = <li><a href={k["kieli_fi#1"]}><i className='fa fa-twitter-square fa-3x' /></a></li>
                    } else if (k["kieli_fi#1"].indexOf('instagram') !== -1) {
                        insta = <li><a href={k["kieli_fi#1"]}><i className='fa fa-instagram fa-3x' /></a></li>
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

    luoKarttaJosOsoiteTiedossa() {
        var data = this.state.result.kayntiosoite;
        if(data && data.osoite && data.postitoimipaikka) {
            return <OskariKartta osoite={data.osoite} postitoimipaikka={data.postitoimipaikka} />;
        }
        return null;
    }

    render() {
        if(!this.state.result) {
            console.log("Was going to render, but got no data.");
            return null;
        }
        console.log("Rendering oppilaitos page, data: %O", this.state.result );
        return (
            <React.Fragment>
                <Hakupalkki/>
                <div className='container'>
                    <div className='row info-page oppilaitos'>
                        <div className='col-xs-12 col-md-9 left-column'>
                            <h1><i className='fa fa-circle'></i>{this.state.result.nimi.fi}</h1>
                            <div className='oppilaitos-yleiskuvaus'>
                                <div>{this.safeParseYleiskuvaus()}</div>
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
                                    {this.luoKarttaJosOsoiteTiedossa()}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <Hakunavigaatio haku={this.getHakuUrl()} selected={this.state.oid}/>
            </React.Fragment>
        );
    }
}

export default Oppilaitos;