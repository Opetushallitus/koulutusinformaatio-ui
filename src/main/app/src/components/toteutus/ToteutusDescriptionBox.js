import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import '../../assets/styles/components/_toteutus-description-box.scss';

class ToteutusDescriptionBox extends Component {
  render() {
    return (
      <div>
        <h1 className="toteutus-description-header">Koulutuksen kuvaus</h1>
        <div className="rectangle"></div>
        <div className="col-12" id="toteutus-description-box">
          <span className="description-box-content">
            {this.props.content
              ? renderHTML(this.props.content)
              : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
          </span>
        </div>
      </div>
    );
  }
}

export default ToteutusDescriptionBox;
