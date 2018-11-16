import {Component} from "react";
import React from "react";
import { translate } from 'react-i18next';
import {Link} from "react-router-dom";
import LikeButton from '../common/LikeButton';
import { Localizer as l } from '../../tools/Utils';
import {inject} from "mobx-react";

@translate()
@inject("hakuStore", "vertailuStore")
class OppilaitosListItem extends Component {

    render () {
        const oppilaitos = this.props.toteutus;
        const link = '/toteutus/' + oppilaitos.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl)
            + '&lng=' + l.getLanguage();
        const educationName = this.props.education ? l.localize(this.props.education, this.props.t("koulutus.tuntematon")) : ""; 
        return (
            <div className="row justify-content-end">
                <div className="col-11 item-box">         
                    <div className="text d-flex justify-content-between">
                        <div>
                            <Link to={link} className={"hakutulosbox-link"}>{l.localize(oppilaitos.tarjoaja, this.props.t("koulutus.tuntematon"))}</Link>
                            <p>{l.localize(oppilaitos.osaamisala, "")}</p>
                        </div>
                        <LikeButton></LikeButton>
                        
                    </div>
                    <div className="education-name">
                        <Link to={link} className="hakutulosbox-link">{educationName}</Link>  
                    </div>
                </div>
            </div>    
        );
    }
}

export default OppilaitosListItem;