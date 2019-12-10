import React from 'react';
import { makeStyles, Typography, Grid, Paper, Icon } from '@material-ui/core';
import { colors } from '../../colors';
import Spacer from './Spacer';

const useStyles = makeStyles({
  paper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '80%',
    backgroundColor: colors.limeGreenBackground,
  },
  text: {
    color: colors.black,
  },
  title: {
    fontWeight: 700,
  },
  grid: {
    width: '70%',
    paddingTop: '62px',
    paddingBottom: '62px',
  },
});

const InfoGrid = (props) => {
  const { heading, gridData } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      <Paper className={classes.paper}>
        <Grid
          className={classes.grid}
          container
          alignItems="flex-start"
          justify="space-evenly"
          spacing={5}
        >
          {gridData.map((e) => (
            <Grid item container spacing={1} xs={12} md={6} lg={4}>
              <Grid item>
                <Icon>
                  <img src={e.icon} alt="" />
                </Icon>
              </Grid>
              <Grid
                item
                xs={10}
                spacing={1}
                alignContent="flex-start"
                container
                direction="column"
              >
                <Typography
                  className={[classes.title, classes.text]}
                  variant="body1"
                  component="h3"
                >
                  {e.title}
                </Typography>
                <Typography className={classes.text} variant="body1">
                  {e.text}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default InfoGrid;
