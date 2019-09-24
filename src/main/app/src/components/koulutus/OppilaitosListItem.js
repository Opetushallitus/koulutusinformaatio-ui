import {Component} from "react";
import React from "react";
import { translate } from 'react-i18next';
import {Link} from "react-router-dom";
import '../../assets/styles/components/_oppilaitos-list-item.scss';
import { Localizer as l } from '../../tools/Utils';
import {inject} from "mobx-react";

@translate()
@inject("hakuStore", "vertailuStore")
class OppilaitosListItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            viewContentState: false,
            isCollapsing: false,
        }
        this.toggleClass = this.toggleClass.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    toggleClass() {
        if(!!this.state.viewContentState){
            this.setState({
                isCollapsing: true
            });
            setTimeout(()=> {
                this.setState({
                    viewContentState: !this.state.viewContentState,
                    isCollapsing: false
                });
            }, 180);
        } else {
            this.setState({
                viewContentState: !this.state.viewContentState
            });
        }
    }

    handleKeyPress(e) {
        e.key === "Enter" && this.toggleClass();
    }

    render () {
        const oppilaitos = this.props.toteutus;
        const link = '/toteutus/' + oppilaitos.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl)
            + '&lng=' + l.getLanguage();
        const koulutusUri = this.props.koulutusUri ? this.props.koulutusUri : undefined;
        return (
            <div className="row justify-content-end">
                <div className="col-11 item-box">         
                    <div className="text d-flex justify-content-between">
                        <div>
                            <Link to={{ pathname: link, state: {koulutusUri: koulutusUri }}} className={"hakutulosbox-link oppilaitos-list-item-link"}>{l.localize(oppilaitos.organisaatio.nimi, this.props.t("koulutus.tuntematon"))}</Link>
                            <p className="oppilaitos-list-item-tutkintonimikkeet">Tutkintonimikkeet tähän</p>
                            <span>Kuvaus tähän</span>
                        </div>
                    </div>
                    <div className="oppilaitos-list-item-info">
                        <span className="oppilaitos-list-item-info-span">
                            <i className="icon-outline-add_location"></i>
                            Tuusula
                        </span>
                        <span className="oppilaitos-list-item-info-span">
                            <i className="icon-outline-access_time"></i>
                            Päiväopetus
                        </span>
                        <span className="oppilaitos-list-item-info-span">
                            <i className="icon-ic_star"></i>
                            Ilmainen
                        </span>
                    </div>
                </div>
            </div>    
        );
    }
}

export default OppilaitosListItem;