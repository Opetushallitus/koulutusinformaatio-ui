import React, { useState } from 'react';
import { makeStyles, Typography, Paper, Box } from '@material-ui/core';
import { colors } from '../../colors';
import Spacer from './Spacer';
import strigtags from 'striptags';
import Truncate from 'react-truncate';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '80%',
    backgroundColor: colors.limeGreenBackground,
  },
  textArea: {
    margin: '60px auto',
    width: '63%',
    ...theme.typography.body1,
  },
  showLink: {
    margin: '0 auto',
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'inline',
    padding: 0,
    margin: '35px 0 0',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: '1.375rem',
    color: '#378703',
    fontFamily: 'Open Sans',
  },
}));

const TextBox = (props) => {
  const { heading, className, text } = props;
  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const strippedText = strigtags(text)
    .split('\n')
    .map((textLine, i, arr) => {
      const line = <span key={i}>{textLine}</span>;
      if (i === arr.length - 1) {
        return line;
      } else {
        return [line, <br key={i + 'br'} />];
      }
    });

  const toggleLines = (event) => {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  };
  const handleTruncate = (truncated) => {
    if (isTruncated !== truncated) {
      setIsTruncated(truncated);
    }
  };
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      className={className}>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      <Paper className={classes.paper}>
        <Box className={classes.textArea}>
          <Truncate
            lines={!isExpanded && 10}
            ellipsis={
              <span>
                <span>...</span>
                <div className={classes.showLink}>
                  <button className={classes.linkButton} onClick={toggleLines}>
                    {'Lue lisää'}
                  </button>
                </div>
              </span>
            }
            onTruncate={handleTruncate}>
            {strippedText}
          </Truncate>
          {!isTruncated && isExpanded && (
            <div className={classes.showLink}>
              <button className={classes.linkButton} onClick={toggleLines}>
                {'Näytä vähemmän'}
              </button>
            </div>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TextBox;
