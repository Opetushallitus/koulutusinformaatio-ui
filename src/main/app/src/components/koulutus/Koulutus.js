import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import '../../assets/styles/components/_koulutus.scss';
import Korkeakoulu from "./Korkeakoulu";
import Ammatillinen from "./Ammatillinen";
import Hakunavigaatio from './../hakutulos/Hakunavigaatio';
import Media from 'react-media';
import KoulutusHeaderImage from './KoulutusHeaderImage';
import KoulutusSidebar from './KoulutusSidebar';
import PageVertailuBox from '../common/PageLikeBox';
import Avoin from "./Avoin";
import Lukio from "./Lukio";

@inject("restStore")
@inject("navigaatioStore")
@observer
class Koulutus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            koulutus: undefined
        }
    };

    async componentDidMount() {
        await this.getKoulutus();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getKoulutus();
    }

    getKoulutus() {
        this.props.navigaatioStore.setOid(this.props.match.params.oid);
        this.props.restStore.getKoulutus(this.props.navigaatioStore.oid, (k) => {
            this.setState({
                koulutus: k
            })
        });
    }

    chooseKoulutus() {
        if(this.state.koulutus) {
            switch(this.state.koulutus.searchData.tyyppi) {
                case 'lk': return <Lukio oid={this.props.navigaatioStore.oid} result={this.state.koulutus}/>; //TODO
                case 'kk': return <Korkeakoulu oid={this.props.navigaatioStore.oid} result={this.state.koulutus}/>;
                case 'ako': return <Avoin oid={this.props.navigaatioStore.oid} result={this.state.koulutus}/>;
                case 'amm' : return <Ammatillinen oid={this.props.navigaatioStore.oid} result={this.state.koulutus}/>;
                default: return <Ammatillinen oid={this.props.navigaatioStore.oid} result={this.state.koulutus} muu={true}/>;
            }
        }
        return <div/>
    }

    koulutusType() {
        if(this.state.koulutus){
            return this.state.koulutus.searchData.tyyppi;
        }
    }

    render() {
        const selectedKoulutus = this.chooseKoulutus();
        const actualKoulutus = this.koulutusType();
        return (
            /*<React.Fragment>
                <div className="container">
                    <div className="row info-page">
                        <div className="col-12 col-md-9 left-column">
                            {selectedKoulutus}
                        </div>
                        <KoulutusSidebar/>
                    </div>
                    
                </div>
                <Hakunavigaatio/>
            </React.Fragment>*/
            <React.Fragment>
                <div className="container" id="koulutus-container">
                    <div className="row">
                        <Media query="(min-width: 992px)">
                                {
                                    matches => matches ? (
                                        <KoulutusSidebar type={actualKoulutus}></KoulutusSidebar>
                            ):("")}
                        </Media>   
                        <div className="col-12 col-md-12 col-lg-8 col-xl-9">
                                <div className="header-image">
                                    <KoulutusHeaderImage></KoulutusHeaderImage>
                                </div>
                                <PageVertailuBox text="Ota vertailuun"></PageVertailuBox>
                                {selectedKoulutus}
                        </div>
                    </div>                
                </div>
            <Hakunavigaatio/>
            </React.Fragment>  
        );
    }
}

export default Koulutus;