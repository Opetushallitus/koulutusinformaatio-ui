import React, {Component} from 'react';
import '../../assets/styles/components/_action-button.scss';

class ActionButton extends Component{
    constructor(props) {
        super(props)
        this.toggleClass = this.toggleClass.bind(this);
        this.state = {
            selected:false,
            type: "switch",
            disabled: false
        }
    }

    toggleClass(){
        this.setState({
            selected: !this.state.selected
        })
    };

    getButtonType(){
      const isButtonType = this.props.type && this.props.type !== "switch" ? this.props.type : this.state.type;
      return isButtonType;  
    }; 

    getLinkTypeAddress(){
        if(this.getButtonType() === 'link'){
            const linkAdddress = this.props.address;
            const isValidEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(linkAdddress);
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

    render(){
        const isSwitched = this.state.selected ? "on" : "off";
        const buttonType = this.getButtonType();
        const isValidLinkType = this.getLinkTypeAddress();
        return(
            <div className="action-button">
                { buttonType === "switch" &&
                <div className={"switch-button " + isSwitched} onClick={this.toggleClass}>
                    <span>{this.props.text}</span>
                </div> }
                { buttonType === "link" &&
                    <a className={isValidLinkType ? "enabled" : "disabled"} href={isValidLinkType || ""}>
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