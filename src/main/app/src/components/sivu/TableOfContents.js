import React from 'react';
import ReactMarkdown from 'react-markdown';
import Link from '@material-ui/core/Link';
import {makeStyles} from "@material-ui/core";
import {sanitize} from './Heading';
import {colors} from "../../colors";

const useStyles = makeStyles({
    link: {
        fontSize: "16px",
        lineHeight: "24px",
        paddingLeft: "21px",
        color: colors.green,
        borderLeftColor: colors.softGrey,
        borderLeftWidth: "1px",
        borderLeftStyle: "solid",
        display: "block",
        paddingBottom: "15px"
    }
});



const TableOfContents = (props) => {
    const classes = useStyles();
    const {content} = props;
    const HeadingLevelToComponent = (level, props) => {
        const value = props.children[0].props.value;
        const anchor = sanitize(value);
        switch (level) {
            case 1:
                return null;
            case 2:
                return <Link className={classes.link}
                             aria-label="anchor"
                             href={`#${anchor}`}>
                    {value}
                </Link>;
            default:
                return null;
        }
    };
    const renderers = {
        heading: props => HeadingLevelToComponent(props.level, props),
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
};

export default TableOfContents;