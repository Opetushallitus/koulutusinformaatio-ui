import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import {withTranslation} from 'react-i18next';

class KoulutusSection extends Component {

    render () {
        const {t} = this.props;
        const isContent = !!this.props.content;
        const content = this.props.noRender ? this.props.content : renderHTML(this.props.content);
        return (
            <React.Fragment>
                {isContent && <div className="col-12 left-column">
                    <h2 className="line_otsikko">{t(this.props.header)}</h2>
                    <div className="">
                        {content}
                    </div>
                </div>}
            </React.Fragment>
        );
    }
}

export default withTranslation()(KoulutusSection);