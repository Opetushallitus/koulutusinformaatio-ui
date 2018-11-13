import React, {Component} from 'react';

class CheckBox extends Component{

    render(){
        return(
            <div className="checkbox">
                <input id={this.props.filterName} type="checkbox"/>
                <label htmlFor={this.props.filterName}>{this.props.filterName}</label>
            </div>
        )
    }
}

export default CheckBox;