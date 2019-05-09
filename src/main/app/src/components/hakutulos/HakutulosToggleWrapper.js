import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import HakutulosToggle from "./HakutulosToggle";

@inject("hakuStore")
@observer
class HakutulosToggleWrapper extends Component {

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }

    render() {
        return (
            <HakutulosToggle/>
        );
    }
}

export default HakutulosToggleWrapper;
