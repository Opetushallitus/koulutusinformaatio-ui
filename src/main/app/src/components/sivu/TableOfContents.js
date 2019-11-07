import React, { Component } from 'react';
import '../../assets/styles/components/_toc.scss';
import ReactMarkdown from 'react-markdown';

class TableOfContents extends Component {
    HeadingLevelToComponent = (level, props) => {
        const value = props.children[0].props.value;
        switch (level) {
            case 1:
                return null;
            case 2:
                return <a className={"toc"} href={`#${value}`}>{value}</a>
            default:
                return null;
        }
    };
    render() {
        const content = this.props.content;

        const renderers = {
            heading: props => this.HeadingLevelToComponent(props.level, props),
            paragraph: props => null,
            list: props => null,
            listItem: props => null,
            break: props => null,
            emphasis: props => null,
            strong: props => null,
            blockquote: props => null,
            thematicBreak: props => null,
            table: props => null
        };
        return <ReactMarkdown source={content}
                              skipHtml={true}
                              renderers={renderers}/>;

    }
}

export default TableOfContents;