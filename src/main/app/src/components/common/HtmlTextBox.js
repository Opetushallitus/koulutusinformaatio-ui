import React, { useState } from 'react';

import { makeStyles, Typography, Paper, Box } from '@material-ui/core';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';

import { educationTypeColorCode } from '../../colors';
import Spacer from './Spacer';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '80%',
    backgroundColor: educationTypeColorCode.ammatillinenGreenBg, // TODO: Not sure if color should come from current koulutus theme
    [theme.breakpoints.down('sm')]: {
      width: '95%',
    },
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

const HtmlTextBox = (props) => {
  const { heading, className, html } = props;
  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLines = (event) => {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  };
  const reflow = (rleState) => {
    const { clamped } = rleState;
    if (isTruncated !== clamped) {
      setIsTruncated(clamped);
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
          <HTMLEllipsis
            unsafeHTML={html}
            maxLine={isExpanded ? 1000 : 8}
            onReflow={reflow}
          />
          {isTruncated || isExpanded ? (
            <div className={classes.showLink}>
              <button className={classes.linkButton} onClick={toggleLines}>
                {isExpanded ? 'Näytä vähemmän' : 'Lue lisää'}
              </button>
            </div>
          ) : null}
        </Box>
      </Paper>
    </Box>
  );
};

export default HtmlTextBox;
