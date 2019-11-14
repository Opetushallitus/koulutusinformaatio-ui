import React, {Component} from 'react';
import ServicesMenu from './ServicesMenu';
import '../../assets/styles/components/_services-button.scss';

class ServicesButton extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
          componentState: false,
          showMenu: false
        };
        this.openServices= this.openServices.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    openServices() {        
        this.setState({
            componentState: !this.state.componentState
        })
    };

    handleKeyPress(e) {
        e.key === "Enter" &&
        this.openServices();
    }

    render(){

        return(
            <React.Fragment>
                <div role="button" aria-label="Palvelut" tabIndex="0" className = "services-button" onClick={this.openServices} onKeyPress={this.handleKeyPress}>
                    <i className="icon-ic_apps"></i>
                    <span>Palvelut</span>
                </div>
                {
                    this.state.componentState&&
                    <ServicesMenu open={this.state.componentState} unmountMe={this.openServices}></ServicesMenu>
                }
            </React.Fragment>
        )
    }
}

export default ServicesButton;