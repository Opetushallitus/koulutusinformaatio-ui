import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next';

@translate()
class KoulutusSection extends Component {

    render () {
        const {t} = this.props;
        const isContent = !!this.props.content;
        const content = this.props.noRender ? this.props.content : renderHTML(this.props.content);
        return (
            <React.Fragment>
                {isContent && <div className="col-xs-12 col-md-9 left-column">
                    <h2 className="line_otsikko">{t(this.props.header)}</h2>
                    <div className="">
                        {content}
                    </div>
                </div>}
            </React.Fragment>
        );
    }
}

export default KoulutusSection;