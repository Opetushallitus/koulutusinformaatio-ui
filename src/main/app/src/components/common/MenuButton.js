import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import '../../assets/styles/components/_menu-button.scss';

class MenuButton extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selected: "",
            renderChild: false
        };
        this.selectDropdown = this.selectDropdown.bind(this);
        this.handleChildUnmount = this.handleChildUnmount.bind(this);
    }

    handleChildUnmount(){
        this.setState({renderChild: false});
    }
    changeLanguage(lng) {
        this.props.i18n.changeLanguage(lng);
        if (!this.props.history.location.search) {
            this.props.history.replace(this.props.history.location.pathname + "?lng=" + lng);
        } else if (this.props.history.location.search.indexOf('lng') !== -1) {
            this.props.history.replace(this.props.history.location.pathname + this.props.history.location.search.replace(/lng=../g, "lng=" + lng));
        } else {
            this.props.history.replace(this.props.history.location.pathname + this.props.history.location.search + "&lng=" + lng);
        }
    }

    selectDropdown(dropdown) {
        if (dropdown !== this.state.selected){
            this.setState({selected: dropdown});
        } else {
            this.setState({selected: ""});
        }
    }

    render() {
        const {t, toggleMenu, isOpen} = this.props;
        return (
            <React.Fragment>
                <button type="button" tabIndex="0" className="menu is-closed" onClick={toggleMenu} aria-label={t('valikko')}>
                    {isOpen ?
                        <span className="material-icons menu-icon">close</span> :
                        <span className="material-icons menu-icon">menu</span>}
                    <span className="menu-text">{t('valikko')}</span>
                </button>
            </React.Fragment>
        );
    }
}

export default withRouter(MenuButton);