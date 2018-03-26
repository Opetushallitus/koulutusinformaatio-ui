import React, { Component } from 'react';
import superagent from 'superagent';
import '../assets/css/oph-styles-min.css';
import '../assets/css/styles.css';
import '../assets/css/font-awesome.min.css'
import '../assets/css/bootstrap.min.css'

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: props.location.state.search,
            result: '',
            error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        if(this.state.search) {
            this.search();
        }
    }

    search() {
        superagent
            .get('http://localhost:3000/tarjonta-indeksoija/api/ui/search')
            .query({query: this.state.search})
            .end((err, res) => {
                console.log(res.body.result.map((m) => m.nimi));
                this.setState({
                    result: res ? res.body.result : undefined,
                    error: err
                })
            });
    }

    handleChange(event) {
        this.setState({search: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
        this.search();
    }

    render() {
        const result = this.state.result;
        const count = result ? result.length : 0;
        var resultList = <div/>
        if(0 < count) {
            resultList = result.map((r) => <div class="col-xs-12 col-md-6 box-container">
                <div class="col-xs-12 search-box haku amk">
                    <div class="suosikkit">
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                    </div>
                    <div class="text">
                        <a href="koulutus1.html">{r.nimi.kieli_fi}.</a>
                        <p>Ammattinimikkeitä: datanomi, testaaja, 3D-mallintaja, ohjelmoija, pelialan osaaja.</p>
                    </div>
                    <div class="compare-button">
                        <span role="button"></span>
                    </div>
                </div>
            </div>);
        }


        return (
            <React.Fragment>
                <div class="container-fluid" id="call-to-action-secondary">
                    <div class="jumbotron">
                        <div class="container">
                            <div class="row">
                                <div class="col-xs-12 col-md-8 header-search">
                                    <input id="regular-input" class="oph-input" type="text" placeholder="Etsi ja vertaile koulutuksia ja oppilaitoksia" onChange={this.handleChange}/>
                                    <button class="search-button" onClick={this.handleSubmit}/>
                                </div>
                            </div>
                        </div>
                        <div class="container">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="filter-button" role="button">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container search-results">
                    <div class="row">
                        <div class="col-xs-12">
                            <h1>Etsintäsi tuotti {count} osumaa, termillä
                                <span class="highlight"> "{this.state.search}"</span>
                            </h1>
                        </div>
                    </div>
                    <div class="row">
                        {resultList}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Search;