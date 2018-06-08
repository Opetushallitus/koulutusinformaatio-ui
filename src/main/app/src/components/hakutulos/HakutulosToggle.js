import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom'

@inject("hakuStore")
@observer
class HakutulosToggle extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const link = '/haku/' + this.props.hakuStore.keyword;
        const koulutusSearch = this.props.hakuStore.searchNoToggle + '&toggle=koulutus';
        const oppilaitosSearch = this.props.hakuStore.searchNoToggle + '&toggle=oppilaitos';
        return <div className="row">
            <div className="col-md-2 col-xs-12">
                <h2 className="KoulutuksetOppilaitokset">
                    <Link className={this.props.hakuStore.toggleKoulutus ? "Valittu Toggle" : "Toggle"} to={{
                        pathname: link,
                        search: koulutusSearch
                    }}>Koulutukset</Link>&nbsp;
                    <span className="Hakutulos_pallo">{this.props.hakuStore.koulutusCount}</span></h2>
            </div>
            <div className="col-md-2 col-xs-12">
                <h2 className="KoulutuksetOppilaitokset">
                    <Link className={this.props.hakuStore.toggleKoulutus ? "Toggle" : "Valittu Toggle"} to={{
                        pathname: link,
                        search: oppilaitosSearch
                    }}>Oppilaitokset</Link>&nbsp;
                    <span className="Hakutulos_pallo">{this.props.hakuStore.oppilaitosCount}</span></h2>
            </div>
        </div>;
    }
}

export default withRouter(HakutulosToggle);