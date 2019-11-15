import React, { Component } from 'react';
import '../../assets/styles/components/_footer.scss';
import Media from 'react-media';
import { withTranslation } from 'react-i18next';
import { withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import ReactMarkdown from 'react-markdown';

@inject("contentfulStore")
@observer
class Footer extends Component {

    changeLanguage(lng) {
        this.props.i18n.changeLanguage(lng);

        if (!this.props.history.location.search) {
            this.props.history.replace(this.props.history.location.pathname + "?lng=" + lng);
        } else if (this.props.history.location.search.indexOf('lng') !== -1) {
            this.props.history.replace(this.props.history.location.pathname + this.props.history.location.search.replace(/lng=../g, "lng=" + lng));
        } else {
            this.props.history.replace(this.props.history.location.pathname + this.props.history.location.search + "&lng=" + lng);
        }
    }

    render() {
        const { t } = this.props;
        /*
        const options = {
            renderNode: {
                [BLOCKS.PARAGRAPH]: (node, children) => <span>{children}</span>,
                [INLINES.HYPERLINK]: (node, children) => {
                    return <div><a href={`${node.data.uri}`} className="notification-link">{children}</a></div>;
                },
                [INLINES.ENTRY_HYPERLINK]: (node, children) => {
                    const id = node.data.target.sys.id;
                    if(sivut[id]) {
                        const page = sivut[id];
                        return <Link className="link" to={`${page.sys.id}`}>{page.fields.name[lang]}</Link>;
                    } else {
                        return null;
                    }

                }
            }
        };
        */
        const {content, contentCenter, contentRight} = this.props.contentfulStore.data.footer;

        return (
            <footer className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="col-5">
                            <div className="row">
                                <ReactMarkdown source={content}/>
                            </div>
                        </div>
                        <div className="col-2">
                            <ReactMarkdown source={contentCenter}/>
                        </div>
                        <div className="col-2">
                            <ReactMarkdown source={contentRight}/>
                        </div>
                    </div>
                </div>
                <Media query="(max-width: 992px)">
                    {
                        matches => matches ? (
                            <div className="row d-block d-sm-block d-lg-none">
                                <div className="container">
                                    <div className="col-12">
                                        <p>{t('footer.vastuuvapauslauseke')}</p>
                                        <ul className="social-media">
                                            <li id={"language-fi"}><a onClick={() => this.changeLanguage('fi')}>Suomeksi</a></li>
                                            <li id={"language-en"}><a onClick={() => this.changeLanguage('en')}>In English</a></li>
                                            <li id={"language-sv"}><a onClick={() => this.changeLanguage('sv')}>På svenska</a></li>
                                        </ul>   
                                    </div>    
                                </div>
                            </div>
                        ) : ("")
                    }
                </Media>   
            </footer>);
    }
}

export default withTranslation()(withRouter(Footer));
