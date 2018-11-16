import React, {Component} from 'react';
import ServicesMenu from './ServicesMenu';

class ServicesButton extends Component{
    
    constructor(props) {
        super(props)
        this.openServices= this.openServices.bind(this);
        this.state = {
          componentState: false,
          showMenu: false
        }
    }

    openServices() {
        this.setState({
            componentState: !this.state.componentState
        })
    };

    render(){

        return(
            <React.Fragment>
                <div className = "services-button" onClick={this.openServices}>
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