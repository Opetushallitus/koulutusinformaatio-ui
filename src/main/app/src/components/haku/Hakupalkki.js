import React, { Component } from 'react';
import Hakurajain from './Hakurajain';
import {observer, inject} from 'mobx-react';
import Media from 'react-media';
import { Link, withRouter } from 'react-router-dom';
import {translate} from 'react-i18next';
import '../../assets/styles/components/_hakupalkki.scss';

@translate()
@inject ("hakuehtoStore")
@observer
class Hakupalkki extends Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if(event.target.value) {
            this.props.hakuehtoStore.keyword = event.target.value
        } else {
            this.props.hakuehtoStore.keyword = ''
        }
    }

    handleSubmit(event) {
        this.handleChange(event);
        event.preventDefault();
        this.props.hakuehtoStore.closeRajain();
        this.props.history.push(this.props.hakuehtoStore.createHakuUrl);
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
      }

    closeRajain() {
        this.props.hakuehtoStore.closeRajain();
    }

    render() {
        const {t} = this.props;
        const link = '/haku/' + this.props.hakuehtoStore.keyword;
        const search = this.props.hakuehtoStore.searchParams;
        const value = this.props.hakuehtoStore.keyword ? this.props.hakuehtoStore.keyword : '';
        return (
            <React.Fragment>
                <div className="container-fluid" id={this.props.main ? "call-to-action" : "call-to-action-secondary"}>
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className={"col-12 col-md-12 header-search" + (this.props.main ? " main" : "")}>
                                    <div className="search">
                                        <input id="regular-input" className="oph-input" type="text"
                                               placeholder={t('haku.kehoite')}
                                               value={value}
                                               onChange={this.handleChange}
                                               onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                        <Link role="button" to={{
                                            pathname: link,
                                            search: search
                                        }} className="search-button" onClick={() => {this.closeRajain()}}>{
                                             <Media query="(max-width: 768px)">
                                             {
                                                 matches => matches ? ("") : (t('haku.etsi'))
                                             }
                                            </Media> 
                                        }
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Hakurajain/>
            </React.Fragment>
        );
    }
}

export default withRouter(Hakupalkki);