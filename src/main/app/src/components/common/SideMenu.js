import React, { Component } from 'react';
import { translate } from 'react-i18next';
import {inject, observer} from 'mobx-react';
import { withRouter } from 'react-router-dom';
import SidebarValikko from "./SidebarValikko";
import '../../assets/styles/components/_side-menu.scss';

@translate()
@inject("contentfulStore")
@observer
class SideMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            search: ""
        };
    }

    selectValikko = (valikko) => {
        this.setState({...this.state, selected: this.state.selected.concat([valikko])});
    };
    popSelected = () => {
        this.setState({...this.state, selected: this.state.selected.slice(0,-1)});
    };
    setSearch = (value) => {
        this.setState({...this.state, search: value});
    };
    doSearch = () => {
        this.props.history.push('/sisaltohaku/?hakusana=' + this.state.search);
    };

    render() {
        const {t} = this.props;
        const last = (a) => a ? a[a.length - 1] : null;
        const single = (entry) => (Object.values(entry)[0] || {});
        const {valikot,valikko} = this.props.contentfulStore.data;
        const {selected} = this.state;
        const selectedValikko = last(selected) ? valikko[last(selected)] : null;
        const linkit = selectedValikko ? [selectedValikko] : (single(valikot).valikot || []).map(v => valikko[v.id]);

        return (
            <React.Fragment>
                <nav role="menubar" className={"navbar navbar-inverse is-closing-" + this.state.closing} id="sidebar-wrapper">
                    <div className="sidebar-nav ">
                        <div className="sidebar-input-container">
                            <div className="sidebar-input">
                                <input value={this.state.search}
                                       onKeyPress={({key}) => key === 'Enter' && this.doSearch()}
                                       onChange={({target}) => this.setSearch(target.value)}
                                       placeholder={t("sidebar.etsi-tietoa-opintopolusta")}
                                       type="text"/><input type="submit"
                                                           onClick={this.doSearch}
                                                           value="search"/>
                            </div>
                        </div>
                        <div className="nav sidebar-nav-valikot" role="menu">
                            {selectedValikko ?
                                <li className="sidebar-nav-breadcrump sidebar-nav-breadcrump--selected"
                                    role="none"
                                    onClick={this.popSelected}>
                                    <span className="material-icons">arrow_back_ios</span>
                                    <span className="sidebar-nav-breadcrump--text">{selectedValikko.name}</span>
                                </li>
                                : <li className="sidebar-nav-breadcrump" role="none">
                                    <i className="icon-outline-home"></i>
                                    <span className="sidebar-nav-breadcrump--text">Etusivu</span>
                                </li>}
                        </div>
                        <div className="nav sidebar-nav-valikot">
                            {linkit.map((valikko) => {
                                const id = valikko.id;
                                const links = (valikko.linkki || []);

                                return <SidebarValikko selectDropdown={() => this.selectDropdown(id)}
                                                        key={id}
                                                        name={valikko.name}
                                                        select={this.selectValikko}
                                                        links={links}
                                />;
                            })}
                        </div>
                    </div>
                </nav>
            </React.Fragment>
        );
    }
}

export default withRouter(SideMenu);
