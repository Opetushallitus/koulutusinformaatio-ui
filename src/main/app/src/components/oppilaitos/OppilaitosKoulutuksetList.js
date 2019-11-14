import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {Localizer as l} from '../../tools/Utils';
import HakutulosBox from '../common/HakutulosBox';
import '../../assets/styles/components/_oppilaitos-koulutukset-list.scss';

@inject("hakuStore")
@observer
class OppilaitosKoulutuksetList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            koulutukset: undefined,
            name: undefined
        };
    }

    async componentDidMount() {
        this.setState({ name: this.props.name.indexOf(",") ? this.props.name.split(",")[0] : this.props.name });
        await this.setKoulutukset();
    }

    async componentWillReceiveProps(nextProps){
        if (nextProps.name !== this.state.name) {
           this.setState({ name: nextProps.name.indexOf(",") ? nextProps.name.split(",")[0] : nextProps.name });
           await this.setKoulutukset();
        }
    } 

    // TODO: kovakoodattu pitää korjata ja lisätä URL rest-store.js, se vaatii uuden konfiguraation palvelimelle    
    setKoulutukset() {
        const self = this;
        const name = self.props.name; 
        fetch(`https://hahtuvaopintopolku.fi/konfo-backend/search/toteutukset?keyword=${name}&size=20&page=1`, {
                method: 'GET'
            }).then( (response) => {
               return response.json()
            }).then((koulutuksetData) => {
                self.setState({
                    koulutukset: koulutuksetData
                });
            }).catch((error) => {
                console.error(error);
        })
    }

    render(){
        const koulutukset = this.state.koulutukset;
        return(
            <div className="col-12" id="oppilaitos-koulutukset-container">
                <h1>{`Koulutukset (${(koulutukset && koulutukset.count) && koulutukset.count})`}</h1>
                {(koulutukset && koulutukset.result) &&
                    koulutukset.result.map((r) => 
                        <HakutulosBox key={r.oid}
                                  oid={r.oid}
                                  vertailuOid={r.toteutusOid}
                                  tyyppi={r.tyyppi}
                                  haettavissa={false}
                                  nimi={r.nimi.kieli_fi}
                                  link={`/koulutus/${r.koulutusOid}?haku${encodeURIComponent(this.props.hakuStore.createHakuUrl)}&lng=${l.getLanguage()}`}
                                  text1={r.tarjoaja}
                                  text2={""}
                                  oppilaitos={true}/>
                    )}
            </div>    
        )
    }
}

export default OppilaitosKoulutuksetList;