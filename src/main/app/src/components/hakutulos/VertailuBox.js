import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import { Localizer as l } from '../../tools/Utils';
import '../../assets/styles/components/_vertailu-box.scss';

@inject('hakuStore', 'vertailuStore')
@observer
class VertailuBox extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  handleKeyPress(e) {
    e.key === 'Enter' && this.props.vertailuStore.clearItems();
  }

  renderVertailuList() {
    return this.props.vertailuStore.vertailuList.map((i) => (
      <div className="col-12 col-lg-4 col-xl-3 compare-object" key={i.oid}>
        <div className="col-12 compare-box">
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => this.props.vertailuStore.removeItem(i.oid)}
          >
            <i className="icon-outline-close" aria-hidden="true" />
          </button>
          <div className="item-text">
            <Link
              to={`/koulutus/${i.komoOid}?haku=${encodeURIComponent(
                this.props.hakuStore.createHakuUrl
              )}&lng='${l.getLanguage()}`}
              className="title"
            >
              <strong>{l.localize(i.searchData, i.nimi)}</strong>
            </Link>
          </div>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <React.Fragment>
        {!!this.props.vertailuStore.size && (
          <div className="container-fluid" id="compare-row">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-9">
                  <div className="row" id="compared-subjects">
                    <div className="col-12 col-lg-12 col-xl-3 compared-subjects-title">
                      <h3>{this.props.t('haku.olet-valinnut-vertailuun')}</h3>
                    </div>
                    {this.renderVertailuList()}
                  </div>
                </div>
                <div className="col-12 col-md-12 col-lg-3 pull-right d-flex justify-content-center align-items-center flex-column">
                  {this.props.vertailuStore.size > 1 ? (
                    <Link
                      to={this.props.vertailuStore.createVertailuLink}
                      id="vertaile"
                      role="button"
                      className="btn btn-primary"
                    >
                      {this.props.t('haku.vertaile')}
                    </Link>
                  ) : (
                    <a className="btn btn-primary disabled">
                      {this.props.t('haku.vertaile')}
                    </a>
                  )}
                  <a
                    className="clear-compare"
                    id="clear-compare"
                    tabIndex="0"
                    onClick={this.props.vertailuStore.clearItems}
                    onKeyPress={this.handleKeyPress}
                  >
                    {this.props.t('haku.poista-kaikki')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withTranslation()(VertailuBox);
