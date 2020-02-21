import React, { Component } from 'react';
import parse from 'url-parse';
import { observer, inject } from 'mobx-react';
import Hakutulos from '../hakutulos/Hakutulos';
import { matchPath } from 'react-router-dom';

@inject('hakuStore')
@inject('hakuehtoStore')
@observer
class Haku extends Component {
  constructor(props) {
    super(props);
    this.toggleAction = this.toggleAction.bind(this);
    this.state = {
      haku: undefined,
    };
  }

  updateSearch() {
    this.setState({
      haku: this.props.hakuStore,
    });
  }

  updateStores() {
    const search = parse(this.props.location.search);
    const match = matchPath(this.props.history.location.pathname, {
      path: '/haku/:keyword',
      exact: true,
      strict: false,
    });
    const keyword = match && match.params ? match.params.keyword : '';
    this.props.hakuStore.setAll(keyword, search, this.toggleAction);
    this.props.hakuehtoStore.setAll(keyword, search);
    this.updateSearch();
  }

  componentDidMount() {
    this.updateStores();
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.updateStores();
  }

  toggleAction(value) {
    this.props.history.replace(this.props.hakuStore.createHakuUrl);
  }

  hakutulosUpdated() {
    this.props.isComponentUpdated();
  }

  render() {
    const koulutukset = this.props.hakuStore.koulutusResult;
    const oppilaitokset = this.props.hakuStore.oppilaitosResult;
    if (
      (koulutukset && koulutukset.length > 0) ||
      (oppilaitokset && oppilaitokset.length > 0) ||
      true
    ) {
      return (
        <Hakutulos
          {...this.props}
          iUpdatedMyChildren={this.hakutulosUpdated()}
        />
      );
    } else {
      return (
        <div className="container">
          <div className="row result-count">
            <div className="col-12">
              <h1 aria-live="assertive">Ei hakutulosta</h1>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Haku;
