import React from 'react';
import { Grid, makeStyles, Icon, Typography, Paper } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { colors } from '../../colors';

const useStyles = makeStyles({
  grid: {
    height: '100%',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  paper: {
    height: '110px',
    borderLeft: '4px solid',
    borderLeftColor: colors.green,
    minWidth: '426px',
  },
  leftIcon: {
    height: '60px',
    width: '60px',
  },
});

const LinkCard = (props) => {
  const { icon, text } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Grid
        className={classes.grid}
        spacing={3}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={2}>
          <Icon className={classes.leftIcon}>
            <img src={icon} alt="" />
          </Icon>
        </Grid>
        <Grid item xs={9}>
          <Typography align="left" variant="p">
            {text}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <ArrowForwardIosIcon />
        </Grid>
      </Grid>
    </Paper>
  );
};
export default LinkCard;
