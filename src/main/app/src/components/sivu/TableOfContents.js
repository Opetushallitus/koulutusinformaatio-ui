import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { makeStyles } from '@material-ui/core';
import { colors } from '../../colors';
import Markdown from 'markdown-to-jsx';

const useStyles = makeStyles({
  link: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '16px',
    lineHeight: '27px',
    paddingLeft: '21px',
    color: colors.green,
    borderLeftColor: colors.softGrey,
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    display: 'block',
    paddingBottom: '15px',
  },
});

const TableOfContents = (props) => {
  const classes = useStyles();
  const { content } = props;
  const HeadingLevelToComponent = (props) => {
    const value = props.children;
    const anchor = props.id;
    return (
      <Link
        className={classes.link}
        aria-label="anchor"
        to={`#${anchor}`}
        scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
        {value}
      </Link>
    );
  };
  const Null = (props) => null;
  return (
    <Markdown
      options={{
        overrides: {
          img: {
            component: Null,
          },
          h1: {
            component: Null,
          },
          h2: {
            component: HeadingLevelToComponent,
          },
          h3: {
            component: Null,
          },
          h4: {
            component: Null,
          },
          p: {
            component: Null,
          },
          a: {
            component: Null,
          },
          ul: {
            component: Null,
          },
          ol: {
            component: Null,
          },
          details: {
            component: Null,
          },
          sivu: {
            component: Null,
          },
          br: {
            component: Null,
          },
        },
      }}>
      {content}
    </Markdown>
  );
};

export default TableOfContents;
