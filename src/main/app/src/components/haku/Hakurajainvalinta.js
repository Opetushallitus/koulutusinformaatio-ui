import React, { Component } from 'react';
import '../../assets/styles/components/_hakurajainvalinta.scss';
class Hakurajainvalinta extends Component {
    constructor(props) {
        super(props);
      this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }

    handleKeyPress(e) {
        e.key === "Enter" &&
            this.props.handleChange();
    }

    render() {
        return (
            <React.Fragment>
                <div className="checkbox" tabIndex="0"  onKeyPress={this.handleKeyPress}>
                    <input role="menuitem" id={this.props.text} type="checkbox" checked={this.props.checked} onChange={this.props.handleChange} />
                    <label htmlFor={this.props.text}>{this.props.text}</label>
                    {this.props.color && <span className={"cr ch-" + this.props.color}> </span>}
                </div>
            </React.Fragment>
        );
    }
}

export default Hakurajainvalinta;