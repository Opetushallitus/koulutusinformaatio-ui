import React, { Component } from 'react';
import superagent from "superagent";
import {inject} from "mobx-react/index";


@inject("urlStore")
class Palaute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arvosana: 0,
            // selected: false,
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
        return (
            <div className="palaute-form">
                <a className="palaute-form-close" onClick={this.props.togglePalaute}><i className="fa fa-times"/></a>
                <div className="palaute-form-container">
                    <h2 className="palaute-form-header">Mitä mieltä olit sivusta?</h2>
                    <div className="palaute-form-rating">
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 0 ? "fa-star" : "fa-star-o")}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(1)}/>
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 1 ? "fa-star" : "fa-star-o")}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(2)}/>
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 2 ? "fa-star" : "fa-star-o")}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(3)}/>
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 3 ? "fa-star" : "fa-star-o")}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(4)}/>
                        <i className={"palaute-form-star fa " + (this.state.arvosana > 4 ? "fa-star" : "fa-star-o")}
                           aria-hidden={true} onClick={() => this.handleArvosanaChange(5)}/>
                    </div>
                    <div className="palaute-form-comment">
                        <textarea placeholder="Anna halutessasi kommentteja sivusta"
                                  onChange={(e) => this.handlePalauteChange(e.target.value)}/>
                    </div>
                    <div className="form-group action-buttons">
                        <a className={"btn btn-primary " + (this.state.arvosana ? "" : "inactive")}  onClick={() => this.handleSubmit()}>Lähetä</a>
                    </div>
                </div>
            </div>);
    }
}

export default Palaute;











