import {Component} from "react";
import React from "react";
import { withTranslation } from 'react-i18next';
import '../../assets/styles/components/_valintakokeet-list-item.scss';
import { Localizer as l } from '../../tools/Utils';
import {inject} from "mobx-react";

@inject("hakuStore", "vertailuStore")
class ValintakokeetListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewContentState: false,
            isCollapsing: false,
        };
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
        return (
            <div className="row justify-content-end">
                <div className="col-11 item-box">         
                    <div className="text d-flex justify-content-between">
                    </div>
                    <div>
                        {l.localize(this.props.valintakoe.tyyppi.nimi)}
                    </div>
                </div>
            </div>    
        );
    }
}

export default withTranslation()(ValintakokeetListItem);