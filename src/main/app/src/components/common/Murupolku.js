import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import '../../assets/styles/components/_sivu.scss';
import {withTranslation} from "react-i18next";

@inject("contentfulStore")
@observer
class Murupolku extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        const {t, path} = this.props;
        return <div className="sivu-breadcrump">
            <i className="icon-outline-home"/>
            <Link to={''} className="link sivu-breadcrump-item">{t('etusivu')}</Link>
            {path.map(({name, link}, ind) => {
                return [
                    link ? <Link key={`breadcrumplink-${ind}`} className="sivu-breadcrump-item link"
                                      to={link}>{name}</Link>
                        : <span key={`breadcrumplink-${ind}`} className="sivu-breadcrump-item">{name}</span>
                ];
            })}
        </div>;
    }
}

export default withTranslation()(withRouter(Murupolku));