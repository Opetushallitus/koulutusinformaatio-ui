import React, { Component } from 'react';

class Hakurajainvalinta extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" value={false} />
                        <span className="cr">
                            <i className="cr cr-icon fa-check"> </i>
                        </span>
                        {this.props.text}
                    </label>
                    {this.props.color && <span className={"cr ch-" + this.props.color}> </span>}
                </div>
            </React.Fragment>
        );
    }
}

export default Hakurajainvalinta;