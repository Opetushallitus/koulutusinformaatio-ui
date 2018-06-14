import React, { Component } from 'react';
import qs from 'query-string';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import Hakutulos from '../hakutulos/Hakutulos';
import { matchPath } from 'react-router';

@inject("hakuStore")
@inject("hakuehtoStore")
@observer
class Haku extends Component {

    constructor(props) {
        super(props);
        this.toggleAction = this.toggleAction.bind(this);
    }

    updateStores() {
        const search = qs.parse(this.props.location.search);
        const match = matchPath(this.props.history.location.pathname, {
            path: '/haku/:keyword',
            exact: true,
            strict: false
        });
        this.props.hakuStore.setAll(match.params.keyword, search);
        this.props.hakuehtoStore.setAll(match.params.keyword, search, this.toggleAction);
    }

    componentDidMount() {
        this.updateStores()
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.updateStores()
    }

    toggleAction(value) {
        this.props.history.replace(this.props.hakuStore.createHakuUrl);
    }

    render() {
        return (
            <Hakutulos {...this.props}/>
        );
    }
}

export default Haku;