import {Component} from "react";
import React from "react";
import { translate } from 'react-i18next';
import {Link} from "react-router-dom";
import LikeButton from '../common/LikeButton';
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
        const dropDownContent = this.state.viewContentState ? "expanded" : "collapsed";
        const isComponentCollapsing = this.state.isCollapsing ? "collapsing" : "";
        const tProp = this.props;
        const oppilaitos = this.props.toteutus;
        const link = '/toteutus/' + oppilaitos.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl)
            + '&lng=' + l.getLanguage();
        const educationName = this.props.education ? l.localize(this.props.education, this.props.t("koulutus.tuntematon")) : (this.props.educationName ? l.localize(this.props.educationName, this.props.t("koulutus.tuntematon")) : ""); 
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
                    <div className="education-name" onClick={this.toggleClass} onKeyPress={this.handleKeyPress}>
                        <Link to={link} className="hakutulosbox-link">{educationName}</Link> 
                        <div className={`dropdown-content-min ${dropDownContent} ${isComponentCollapsing}`}>
                            <div>
                                <p>Opiskelupaikkoja: 71(joista vähintään 41 ensikertalaisille)</p>
                                <p>Hakuaika: 4.3.2019 klo 08:00 - 28.3.2019 klo 15:00</p>
                            </div>
                            <div className="action-button">
                                <div role="button" id="add-compare" className="toggle-link-button" tabIndex="0" onKeyPress={this.handleKeyPress} onClick={() => this.props.vertailuStore.selectItem(this.props.vertailuOid, this.props.nimi)}>
                                    <span>Lue lisää ja hae koulutukseen</span>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>    
        );
    }
}

export default OppilaitosListItem;