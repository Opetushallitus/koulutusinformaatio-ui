import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom'
import qs from 'query-string';
import { matchPath } from 'react-router'

@inject("navigaatioStore")
@observer
class Hakunavigaatio extends Component {

    updateStores(haku) {
        const splitted = haku.split('?');
        const search = qs.parse(splitted[1]);
        const match = matchPath(splitted[0], {
            path: '/haku/:keyword',
            exact: true,
            strict: false
        });
        const keyword = (match && match.params) ? match.params.keyword : '';
        this.props.navigaatioStore.load(keyword, search);
    }

    constructor(props) {
        super(props);
        const search = qs.parse(this.props.location.search);
        this.state = {
            hakuUrl: search.haku ? search.haku : "/haku"
        };
        if(search.haku) {
            this.updateStores(search.haku)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        const search = qs.parse(this.props.location.search);
        this.setState({
            hakuUrl: search.haku ? search.haku : "/haku"
        });
        if(search.haku) {
            this.updateStores(search.haku)
        }
    }

    prev(event) {
        this.props.navigaatioStore.withPrevOid((oid) => {this.navigate(event, oid)})
    }

    next(event) {
        this.props.navigaatioStore.withNextOid((oid) => {this.navigate(event, oid)})
    }

    navigate(event, oid) {
        event.preventDefault();
        this.props.history.push({pathname: this.props.match.path.replace(':oid', oid), search: this.props.navigaatioStore.getSearchParams});
    }

    render() {
        const prevLink = this.props.navigaatioStore.hasPrev ? <a onClick={(e) => {this.prev(e)}}>
            <i className="fa fa-circle-thin" aria-hidden="true"/>
        </a> : <span/>;
        const nextLink = this.props.navigaatioStore.hasNext ? <a onClick={(e) => {this.next(e)}}>
            <i className="fa fa-circle-thin" aria-hidden="true"/>
        </a> : <span/>;

        return (
            <div className="container-fluid app-navigation-bar hakupalkki">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-4 previous">
                            {prevLink}
                        </div>
                        <div className="col-xs-4 search">
                            <Link to={this.state.hakuUrl}>
                                <i className="fa fa-circle-thin" aria-hidden="true"/>
                            </Link>
                        </div>
                        <div className="col-xs-4 next">
                            {nextLink}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Hakunavigaatio);