import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {translate} from "react-i18next";
import '../../assets/styles/components/_action-button.scss';

@translate()
class ActionButton extends Component{
    
    constructor(props) {
        super(props)
        this.state = {
            selected: false,
            switched: true,
            type: "compare",
            disabled: false
        }
        this.toggleSelected = this.toggleSelected.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    toggleSelected(){
        this.setState({
            selected: !this.state.selected
        })
    };

    toggleSwitch(){
        this.setState({
            switched: !this.state.switched
        })
    }

    getButtonType(){
      const isButtonType = this.props.type && this.props.type !== "compare" ? this.props.type : this.state.type;
      return isButtonType;  
    }; 

    getLinkTypeAddress(){
        if(this.getButtonType() === 'link'){
            const linkAdddress = this.props.address ? this.props.address : undefined ;
            const isValidEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(linkAdddress);
            const isValidUrl = new RegExp(/^(http|https):\/\/[^ "]+$/).test(linkAdddress);
           
            if(isValidEmail){
                const emailAddress =`mailto:${linkAdddress}`;
                return emailAddress;
            }
            if(isValidUrl){
                const urlAddress = `${linkAdddress}`;
                return urlAddress;
            }
            else{
                return false;
            }
        }       
    }; 

    handleKeyPress(e){
        e.key === "Enter" &&
            this.toggleSwitch();    
    }

    render(){
        const {t} = this.props;
        const isSelected = this.state.selected ? "on" : "off";
        const isSwitched = this.state.switched ? "on" : "off";
        const buttonType = this.getButtonType();
        const isValidLinkType = this.getLinkTypeAddress();
        return(
            <div className={`action-button ${this.props.className || ""}`}>
                { buttonType === "compare" &&
                    <div className={`compare-button ${isSelected}`} tabIndex="0" onClick={this.toggleSelected}>
                        <span>{this.props.text}</span>
                    </div>
                }
                { buttonType === "switch" &&
                    <div className="switch-button" onClick={this.toggleSwitch} onKeyPress={this.handleKeyPress} tabIndex="0">
                        <div className={`switched ${isSwitched} d-flex justify-content-around`}>
                            <div className="switch">
                                Kyllä
                            </div>
                            <div className="switch">
                                Ei
                            </div>
                        </div>
                    </div>
                }
                { buttonType === "link" && 
                    <a className={isValidLinkType ? "enabled" : "disabled"} tabIndex="0" href={isValidLinkType || ""}>
                        <div className="link-button">
                            <span>{this.props.text}</span>
                        </div>
                    </a>
                }
                { buttonType === "react-link" &&
                    <Link role="button" tabIndex="0" to={{
                        pathname: this.props.address
                    }}>
                        <div className="link-button big">
                            <span>{t('toteutus.tutustu')}</span>
                        </div>
                    </Link>
                }
                { buttonType === "transparent" &&
                    <a className="transparent-button" tabIndex="0">
                        <div className="link-button">
                            <span>{this.props.text}</span>
                        </div>
                    </a>
                }
            </div>
        )
    }
}

export default ActionButton;