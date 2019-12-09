import React from 'react';
import parse from 'url-parse';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  media: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: '0',
    overflow: 'hidden',
  },
});

const Youtube = ({ href, ...props }) => {
  const classes = useStyles();
  const url = parse(href, true);
  return (
    <div className={classes.container}>
      <iframe
        className={classes.media}
        title={props.url}
        width="560"
        height="315"
        style={{ display: 'block', margin: '10px 0px' }}
        src={`https://www.youtube.com/embed${(url.query.v &&
          '/' + url.query.v) ||
          url.pathname}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={true}
      />
    </div>
  );
};

export default Youtube;
