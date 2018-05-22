import React, { Component } from 'react';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';

@inject("hakuStore")

@observer
class Sivutus extends Component {

    handlePagination(page) {
        if (this.props.hakuStore.toggleKoulutus) {
            this.props.hakuStore.currentPageKoulutus = page;
        } else {
            this.props.hakuStore.currentPageOppilaitos  = page;
        }
        this.props.handleRefresh(true);
    }

    createPaginationItem(page, active) {
        return <li className={active ? "page-item active" : "page-item"} key={page.toString()}><a className="page-link" onClick={() => this.handlePagination(page)} >{page}</a></li>;
    }

    createPaginationSeparator(key) {
        return <li className={"page-item"} key={key}><a>...</a></li>;
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

    handlePageSizeChange(size) {
        if(this.props.hakuStore.toggleKoulutus) {
            if (this.props.hakuStore.pageSizeKoulutus !== size) {
                this.props.hakuStore.pageSizeKoulutus = size;
                this.props.hakuStore.currentPageKoulutus = 1;
            }
        } else {
            if (this.props.hakuStore.pageSizeOppilaitos !== size) {
                this.props.hakuStore.pageSizeOppilaitos = size;
                this.props.hakuStore.currentPageOppilaitos = 1;
            }
        }
        this.props.handleRefresh(true);
    }

    render() {
        const currentPage = this.props.hakuStore.currentPageNumber;

        return (
            <React.Fragment>
                <div className="pagination-control container-fluid">
                    <div className="row">
                        <div className="col-xs-12 col-sm-8 col-md-6 col-lg-4">
                            <nav aria-label="Search result navigation">
                                <ul className="pagination">
                                    {this.buildPaginationMenu(currentPage)}
                                </ul>
                            </nav>
                        </div>
                        <div className="page-size-select">
                            <select onChange={(e) => this.handlePageSizeChange(e.target.value)}>
                                <option value={this.props.hakuStore.pageSize}>Näytä</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={this.props.hakuStore.maxPageSize}>Kaikki</option>
                            </select>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Sivutus;