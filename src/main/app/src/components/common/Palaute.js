import React, {Component, useState} from 'react';
import superagent from "superagent";
import {inject} from "mobx-react/index";
import {translate} from 'react-i18next';
import '../../assets/styles/components/_palaute.scss';

@translate()
@inject("urlStore")
class Palaute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            palauteAnnettu: false
        }
    }

    render() {
        const {t} = this.props;
        const handleSubmit = (arvosana, palaute) => {
            superagent
                .post(this.props.urlStore.urls.url('konfo-backend.palaute'))
                .send('arvosana=' + arvosana)
                .send('palaute=' + palaute)
                .catch((e) => console.log(e))
                .then(() => this.setState({palauteAnnettu: true}));
        };

        const AnnaPalaute = () => {
            const [state, setState] = useState({arvosana: 0,
                arvosanaHover: null,
                palaute: ""});
            const handleArvosanaHoverChange = (star) => setState({...state, arvosanaHover: star});
            const handleArvosanaChange = (star) => setState({...state, arvosana: star});
            const handlePalauteChange = (p) => setState({...state, palaute: p});


            return <React.Fragment>
                <h2 className="palaute-form-header">{t('palaute.otsikko')}</h2>
                <div className="palaute-form-rating">
                    {[1, 2, 3, 4, 5].map(star => {

                        const selected =
                            (state.arvosanaHover &&
                                state.arvosanaHover >= star) ||
                            (state.arvosana >= star) ? 'palaute-form-star-selected' : null;
                        return <span key={'star-' + star}
                                     onMouseEnter={() => handleArvosanaHoverChange(star)}
                                     onMouseLeave={() => handleArvosanaHoverChange(null)}
                                     onClick={() => handleArvosanaChange(star)}
                                     className={"material-icons palaute-form-star " + selected}>
                                    {selected ? 'star' : 'star'}</span>;
                    })}


                </div>
                {state.arvosana ?
                    <React.Fragment>
                        <div className="palaute-form-comment">
                        <textarea placeholder={t('palaute.kommentti')}
                                  onChange={(e) => handlePalauteChange(e.target.value)}/>
                        </div>
                        <a className={"btn btn-primary " + (state.arvosana ? "palaute-form-button" : "disabled")}
                           onClick={() => handleSubmit(state.arvosana, state.palaute)}>{t('palaute.lähetä')}</a>
                    </React.Fragment> : null}
            </React.Fragment>
        };

        const KiitosPalautteesta = (props) => {
            return <React.Fragment>
                <h2 className="palaute-form-header">{t('palaute.kiitos')}</h2>
                <p className="palaute-form-paragraph">{t('palaute.vastaanotettu')}</p>
                <a className="btn btn-primary palaute-form-button"
                   onClick={this.props.togglePalaute}>{t('palaute.palaa')}</a>
            </React.Fragment>;
        };

        return (
            <div className="palaute-form-container">
                <div className="palaute-form">
                    <div className="palaute-form-close">
                    <a onClick={this.props.togglePalaute}><i
                        className="icon-outline-close"/></a></div>
                    {this.state.palauteAnnettu ? <KiitosPalautteesta/> : <AnnaPalaute/>}
                </div>
            </div>
        );
    }
}

export default Palaute;











