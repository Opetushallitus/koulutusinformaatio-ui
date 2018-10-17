import React, { Component } from 'react';
import superagent from "superagent";
import {inject} from "mobx-react/index";
import {translate} from 'react-i18next';
import '../../assets/styles/components/_palaute.scss';
@translate()
@inject("urlStore")
class Palaute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arvosana: 0,
            palaute: ""
        }
    }

    handleArvosanaChange(val) {
        this.setState({arvosana: val})
    }

    handlePalauteChange(str) {
        this.setState({palaute: str})
    }

    handleSubmit() {
        if (this.state.arvosana) {
            superagent
                .post(this.props.urlStore.urls.url('konfo-backend.palaute'))
                .send('arvosana=' + this.state.arvosana)
                .send('palaute=' + this.state.palaute)
                .catch((e) => console.log(e))
                .then(() => this.props.togglePalaute());
        }
    }

    render() {
        const {t} = this.props;
        return (
            <div className="palaute-form">
                <a className="palaute-form-close" onClick={this.props.togglePalaute}><i className="icon-outline-close"/></a>
                <div className="palaute-form-container">
                    <h2 className="palaute-form-header">{t('palaute.otsikko')}</h2>
                    <div className="palaute-form-rating">
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 0 ? "icon-ic_star" : "icon-ic_star_border" )}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(1)}/>
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 1 ? "icon-ic_star" : "icon-ic_star_border" )}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(2)}/>
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 2 ? "icon-ic_star" : "icon-ic_star_border" )}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(3)}/>
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 3 ? "icon-ic_star" : "icon-ic_star_border" )}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(4)}/>
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 4 ? "icon-ic_star" : "icon-ic_star_border" )}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(5)}/>
                    </div>
                    <div className="palaute-form-comment">
                        <textarea placeholder={t('palaute.kommentti')}
                                  onChange={(e) => this.handlePalauteChange(e.target.value)}/>
                    </div>
                        <a className={"btn btn-primary " + (this.state.arvosana ? "" : "disabled")}  onClick={() => this.handleSubmit()}>{t('palaute.lähetä')}</a>
                </div>
            </div>);
    }
}

export default Palaute;











