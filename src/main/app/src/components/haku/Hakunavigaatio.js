import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom'
import qs from 'query-string';

@inject("navigaatioStore")
@observer
class Hakunavigaatio extends Component {

    initHakuUrl() {
        const search = qs.parse(this.props.location.search);
        this.setState({
            hakuUrl: search.haku ? search.haku : "/haku"
        });
        if(search.haku) {
            this.props.navigaatioStore.load(search.haku)
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            hakuUrl: "/haku"
        };
        this.initHakuUrl();
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.initHakuUrl();
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