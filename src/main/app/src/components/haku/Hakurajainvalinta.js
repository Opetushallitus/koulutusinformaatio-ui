import React, { Component } from 'react';
import '../../assets/styles/components/_hakurajainvalinta.scss';
class Hakurajainvalinta extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="checkbox" tabIndex="0">
                    <input role="menuitem" id={this.props.text} type="checkbox" checked={this.props.checked} onChange={this.props.handleChange} />
                    <label htmlFor={this.props.text}>{this.props.text}</label>
                    {this.props.color && <span className={"cr ch-" + this.props.color}> </span>}
                </div>
            </React.Fragment>
        );
    }
}

export default Hakurajainvalinta;