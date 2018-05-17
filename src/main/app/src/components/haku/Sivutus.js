import React, { Component } from 'react';
import qs from 'query-string';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';

@inject("hakuStore")
@inject("urlStore")
@observer
class Sivutus extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //this.handleRefresh();
    }

    componentWillReceiveProps(nextProps) {
        //this.props = nextProps;
        //this.handleHistory()
    }

    handleHistory() {
        const queryParamToggle = qs.parse(this.props.location.search).toggle;
        if(this.props.hakuStore.keyword != this.props.match.params.keyword) {
            this.props.hakuStore.keyword = this.props.match.params.keyword;
            this.search(queryParamToggle);
        } else {
            this.props.hakuStore.toggleKoulutus = ('oppilaitos' !== queryParamToggle)
        }
    }

    changeUrl() {
        if(this.props.hakuStore.keyword === this.props.match.params.keyword) {
            this.props.history.replace(this.props.hakuStore.createHakuUrl);
        } else {
            this.props.history.push(this.props.hakuStore.createHakuUrl);
        }
    }

    searchAction(newKeyword) {
        if(newKeyword != this.props.hakuStore.keyword) {
            this.props.hakuStore.keyword = newKeyword;
            this.search();
        }
    }

    handlePagination(page) {
        this.props.hakuStore.currentPageKoulutus = page;
        this.props.handleRefresh(true);
        //this.forceUpdate();

    }

    createPaginationItem(page, active) {
        return <li class={active ? "page-item active" : "page-item"}><a class="page-link" onClick={() => this.handlePagination(page)} href="#">{page}</a></li>;
    }

    buildPaginationMenu(currentPage) {

        const maxPage = this.getMaxPageNumber();
        //console.log("Building pagination menu. Current page: " + currentPage)

        const currentOptions = [];
        currentOptions.push(1); //ensimmäinen sivu aina
        if (currentPage > 2) {
            currentOptions.push(currentPage-1);
        }
        if (currentPage > 3) {
            currentOptions.push(currentPage-2);
        }
        if (currentPage > 4) {
            currentOptions.push(currentPage-3);
        }
        if (currentPage+1 < maxPage) {
            currentOptions.push(currentPage+1);
        }
        if (currentPage+2 < maxPage) {
            currentOptions.push(currentPage+2);
        }
        if (currentPage+3 < maxPage) {
            currentOptions.push(currentPage+3);
        }
        if(maxPage > currentPage +3) {
            currentOptions.push(maxPage);
        }
        if (currentOptions.indexOf(currentPage) === -1)  {
            currentOptions.push(currentPage);
        }
        if (currentOptions.indexOf(maxPage) === -1)  {
            currentOptions.push(maxPage);
        }

        currentOptions.sort((a, b) => a-b);
        //console.log("options: " + currentOptions);
        return currentOptions.map(o => this.createPaginationItem(o, o === currentPage));

    }

    getMaxPageNumber() {
        if(this.props.hakuStore.toggleKoulutus) {
            return parseInt(this.props.hakuStore.koulutusCount / this.props.hakuStore.pageSizeKoulutus) +1;
        } else {
            return parseInt(this.props.hakuStore.oppilaitosCount / this.props.hakuStore.pageSizeOppilaitos) +1;
        }
    }

    getCurrentPageNumber() {
        if(this.props.hakuStore.toggleKoulutus) {
            return this.props.hakuStore.currentPageKoulutus;
        } else {
            return this.props.hakuStore.currentPageOppilaitos;
        }
    }

    setDesiredPageSize(size) {
        if(this.props.hakuStore.toggleKoulutus) {
            this.props.hakuStore.pageSizeKoulutus = size;
        } else {
            this.props.hakuStore.pageSizeOppilaitos = size;
        }
    }

    render() {
        const currentPage = this.getCurrentPageNumber();

        return (
            <React.Fragment>
                <div className="pagination-control">
                    <nav aria-label="Search result navigation">
                        <ul class="pagination">
                            {this.buildPaginationMenu(currentPage)}
                        </ul>
                    </nav>
                </div>
            </React.Fragment>
        );
    }
}

export default Sivutus;