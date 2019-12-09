import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import parse from 'url-parse';
import { matchPath } from 'react-router';
import { withTranslation } from 'react-i18next';
import '../../assets/styles/components/_hakunavigatio.scss';

@inject('navigaatioStore')
@observer
class Hakunavigaatio extends Component {
  updateStores(haku) {
    const splitted = haku.split('?');
    const search = parse(splitted[1]);
    const match = matchPath(splitted[0], {
      path: '/haku/:keyword',
      exact: true,
      strict: false,
    });
    const keyword = match && match.params ? match.params.keyword : '';
    this.props.navigaatioStore.load(keyword, search);
  }

  constructor(props) {
    super(props);
    const search = parse(this.props.location.search);
    this.state = {
      hakuUrl: search.haku ? search.haku : '/haku',
    };
    if (search.haku) {
      this.updateStores(search.haku);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    const search = parse(this.props.location.search);
    this.setState({
      hakuUrl: search.haku ? search.haku : '/haku',
    });
    if (search.haku) {
      this.updateStores(search.haku);
    }
  }

  componentDidMount() {
    const search = this.state.hakuUrl ? this.state.hakuUrl : undefined;
    if (search) {
      this.updateStores(search);
    }
  }

  prev(event) {
    this.props.navigaatioStore.withPrevOid((oid) => {
      this.navigate(event, oid);
    });
  }

  next(event) {
    this.props.navigaatioStore.withNextOid((oid) => {
      this.navigate(event, oid);
    });
  }

  navigate(event, oid) {
    event.preventDefault();
    this.props.history.push({
      pathname: this.props.match.path.replace(':oid', oid),
      search: this.props.navigaatioStore.getSearchParams,
    });
  }

  render() {
    const t = this.props.t;
    const prevLink =
      this.props.navigaatioStore.hasPrev && !this.props.vertailu ? (
        <a
          onClick={(e) => {
            this.prev(e);
          }}
        >
          <span>{t('navigaatio.edellinen')}</span>
        </a>
      ) : (
        <span />
      );
    const nextLink =
      this.props.navigaatioStore.hasNext && !this.props.vertailu ? (
        <a
          onClick={(e) => {
            this.next(e);
          }}
        >
          <span>{t('navigaatio.seuraava')}</span>
        </a>
      ) : (
        <span />
      );

    return (
      <div className="container-fluid app-navigation-bar hakupalkki">
        <div className="container">
          <div className="row">
            {<div className="col-4 previous">{prevLink}</div>}
            <div className="col-4 search">
              <Link to={this.state.hakuUrl}>
                <span>{t('navigaatio.etsintä-tulos')}</span>
              </Link>
            </div>
            {<div className="col-4 next">{nextLink}</div>}
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(withRouter(Hakunavigaatio));
