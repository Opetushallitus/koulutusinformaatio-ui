import React, { Component } from 'react';
import { Localizer as l } from '../../tools/Utils';
import AvoinInfoBox from "./AvoimenKurssinInfoBox";
import KoulutusSidebar from "./KoulutusSidebar";
import renderHTML from 'react-render-html';

class AvoinYoKoulutus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: props.oid,
            result: props.result,
        };
        console.log("Created element AoinYoKoulutus. Data: %O", this.state.result);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({
            oid: this.props.oid,
            result: this.props.result
        });
    }

    parseNimi() {
        return l.localize(this.state.result.searchData, "(Tuntematon nimi)");
    }

    parseKuvaus() {
        if(this.state.result && this.state.result.kuvausKomoto && this.state.result.kuvausKomoto.SISALTO) {
            return renderHTML(l.localize(this.state.result.kuvausKomoto.SISALTO));
        }

        if(this.state.result && this.state.result.kuvausKomo && this.state.result.kuvausKomo.TAVOITTEET) {
            return renderHTML(l.localize(this.state.result.kuvausKomo.TAVOITTEET));
        }
        return "";
    }

    render() {
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className="fa fa-circle avoin-hattu" aria-hidden="true"></i>
                            <span>{this.parseNimi()}</span>
                        </h1>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <AvoinInfoBox result={this.state.result}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">Yleiskuvaus</h2>
                            <div className="">
                                {this.parseKuvaus()}
                                <ul>

                                </ul>
                            </div>
                        </div>
                    </div>
                    <KoulutusSidebar/>
                </div>
            </div>
        );
    }
}

export default AvoinYoKoulutus;