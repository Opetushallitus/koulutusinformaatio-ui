import React, { Component } from 'react';
import {inject, observer} from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import Murupolku from './common/Murupolku';
import parse from "url-parse";
import '../assets/styles/components/_sisaltohaku.scss';

@inject("contentfulStore")
@observer
class Sisaltohaku extends Component {
    constructor(props) {
        super(props);
        const {query} = parse(this.props.location.search, true);
        this.state = {
            search: query.hakusana
        };
    }

    setSearch = (value) => {
        this.setState({...this.state, search: value});
    };
    doSearch = () => {
        this.setState({...this.state, originalSearch: this.state.search});
        this.props.history.push('/sisaltohaku/?hakusana=' + this.state.search);
    };
    currentSearch = () => {
        const {query} = parse(this.props.location.search, true);
        return query.hakusana || "";
    };

    render() {
        const {t} = this.props;

        const hakusana = this.currentSearch();

        return <div className="sisaltohaku-container container-fluid">
            <div className="row">
                <div className="col-12">
                    <Murupolku path={[{name: t('sisaltohaku.otsikko'), link: '/sisaltohaku/'}]}/>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <span className="sisaltohaku-haku">
                        <input value={this.state.search}
                               onKeyPress={({key}) => key === 'Enter' && this.doSearch()}
                               onChange={({target}) => this.setSearch(target.value)}
                               placeholder={t("sidebar.etsi-tietoa-opintopolusta")}
                               type="text"/><input type="submit"
                                                   onClick={this.doSearch}
                                                   value="search"/>
                    </span>
                </div>
            </div>
            { hakusana !== "" ?
            <div className="row">
                <div className="col-12">
                    <div className="sisaltohaku-eihakutuloksia">
                        <h1>{t('sisaltohaku.eituloksia')}</h1>
                        <span>{t('sisaltohaku.summary', {hakusana: hakusana})}</span>
                        <Link to={"/"}>{t('sisaltohaku.takaisin')}</Link>
                    </div>
                </div>
            </div> : null}
        </div>;
    }
}

export default withRouter(Sisaltohaku);
