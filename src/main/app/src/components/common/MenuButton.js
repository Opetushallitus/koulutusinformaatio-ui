import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import SideMenu from './SideMenu';
import '../../assets/styles/components/_menu-button.scss';

@translate()
class MenuButton extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            closing: false,
            selected: "",
            renderChild: false
        };
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.selectDropdown = this.selectDropdown.bind(this);
        this.handleChildUnmount = this.handleChildUnmount.bind(this);
    }

    openMenu() {
        this.setState({
            open: true,
            renderChild:true
        });
    }
    handleChildUnmount(){
        this.setState({renderChild: false});
    }
    closeMenu() {
        this.setState({
            closing: true
        });      
        setTimeout(() => {
            this.setState({
            open: false
          });
          this.setState({
            closing: false
        }); 
        this.setState({renderChild: true});
        }, 250);
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
        const {t} = this.props;
        return (
            <React.Fragment>
                <button type="button" tabIndex="0" className="menu is-closed" onClick={this.openMenu} aria-label={t('valikko')}>
                        <span className="hamb-top"/>
                        <span className="hamb-middle"/>
                        <span className="hamb-bottom"/>
                        <span className="menu-text">{t('valikko')}</span>
                    </button>
                    
                        {this.state.renderChild && this.state.open ? 
                            <SideMenu
                                unmountMe={this.handleChildUnmount}
                                open={this.state.open}
                                />: null
                        }
            </React.Fragment>
        );
    }
}

export default withRouter(MenuButton);