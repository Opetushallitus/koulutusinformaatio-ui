import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import parse from "url-parse";
import { withRouter } from 'react-router-dom';
import {translate} from 'react-i18next';
import '../../assets/styles/components/_sivutus.scss'

@translate()
@inject("hakuStore")
@observer
class Sivutus extends Component {

    handlePagination(event, page) {
        const search = parse(this.props.location.search);
        if (this.props.hakuStore.toggleKoulutus) {
            search.kpage = '' + page;
        } else {
            search.opage = '' + page;
        }
        event.preventDefault();
        this.props.history.replace({search: "" //qs.stringify(search)
        });
    }

    handlePageSizeChange(event) {
        const search = parse(this.props.location.search);
        search.kpage = '1';
        search.opage = '1';
        search.pagesize = '' + event.target.value;
        event.preventDefault();
        this.props.history.replace({search: "" //qs.stringify(search)
        });
    }

    createPaginationItem(page, active) {
        return <li className={active ? "active" : ""} key={page.toString()}><a className="page-link" onClick={(e) => this.handlePagination(e, page)} >{page}</a></li>;
    }

    createPaginationSeparator(key) {
        return <li className={"item-separator"} key={key}><a>...</a></li>;
    }

    buildPaginationMenu(currentPage) {
        const maxPage = this.props.hakuStore.maxPageNumber;
        const currentOptions = [];
        
        currentOptions.push(1); //ensimmäinen sivu aina
        if (currentPage > 1) {
            currentOptions.push(currentPage);
        }
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
        if (currentOptions.indexOf(maxPage) === -1)  {
            currentOptions.push(maxPage);
        }

        currentOptions.sort((a, b) => a-b);
        const paginationItems = currentOptions.map(o => this.createPaginationItem(o, o === currentPage));

        if (currentPage > 5) {
            paginationItems.splice(1, 0, this.createPaginationSeparator("start"))
        }
        if (maxPage > currentPage + 4) {
            paginationItems.splice(paginationItems.length - 1, 0, this.createPaginationSeparator("end"))
        }

        return paginationItems;
    }

    render() {
        const currentPage = this.props.hakuStore.currentPageNumber;
        const {t} = this.props;

        return (
            <React.Fragment>
                <div className="pagination-control container">
                    {!this.props.hakuStore.filterSet && !this.props.hakuStore.keywordSet ? '' :
                        (<div className="row">
                            <div className="col-12">
                                <nav aria-label="Search result navigation" id="pagination">
                                    <div className="row">
                                        <ul className="pagination">
                                            {this.buildPaginationMenu(currentPage)}
                                        </ul>
                                        <div className="page-size-select">
                                            <select onChange={(e) => this.handlePageSizeChange(e)} aria-labelledby="pagination">
                                                <option value={this.props.hakuStore.pageSize}>{t('haku.näytä')}</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                                <option value={this.props.hakuStore.maxPageSize}>{t('haku.kaikki')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>)}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Sivutus);