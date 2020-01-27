import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  summary: {
    minHeight: '70px',
  },
  panel: {
    width: '100%',
    backgroundColor: 'white',
  },
  heading: {
    ...theme.typography.body1,
    fontWeight: 600,
  },
  test: {
    '&$expanded': {
      backgroundColor: '#F4FFF4',
      borderTop: '5px solid #378703',
    },
  },
  expanded: {},
}));

const Accordion = (props) => {
  const classes = useStyles();
  const { items } = props;
  return (
    <div className={classes.root}>
      {items.map((item, i) => (
        <ExpansionPanel className={classes.panel} elevation={0} key={i}>
          <ExpansionPanelSummary
            classes={{
              root: classes.test,
              expanded: classes.expanded,
            }}
            className={classes.summary}
            elevation={0}
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${i}a-content`}
            id={`panel${i}a-header`}>
            <Typography className={classes.heading}>{item.title}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{item.content}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

export default Accordion;
