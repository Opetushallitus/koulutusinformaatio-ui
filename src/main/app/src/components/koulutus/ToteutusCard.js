import React from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import { educationTypeColorCode } from '../../colors';
import DiakoniaLogo from '../../assets/images/suomen_diakonia_opisto_logo.png';

const useStyles = makeStyles({
  nimikkeet: {
    fontWeight: '600',
  },
  paper: (props) => ({
    borderTop: `5px solid ${educationTypeColorCode[props.tyyppi] ||
      educationTypeColorCode.muu}`,
    width: '100%',
  }),
  icon: {
    fontSize: '1.1875rem',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  grid: {
    padding: '40px',
  },
  img: {
    width: '180px',
    height: '120px',
    float: 'right',
  },
});

const ToteutusCard = (props) => {
  const classes = useStyles(props);
  const {
    tarjoajaName,
    ammattinimikkeet,
    description,
    locations,
    opetustapa,
    price,
  } = props;
  return (
    <Paper className={classes.paper}>
      <Grid
        className={classes.grid}
        container
        justify="space-between"
        alignItems="center"
        wrap="nowrap">
        <Grid item container direction="column" xs>
          <Grid item>
            <Typography variant="h4" gutterBottom>
              {tarjoajaName}
            </Typography>
            <Typography className={classes.nimikkeet} variant="body1" gutterBottom>
              {ammattinimikkeet}
            </Typography>
            <Typography variant="body1" paragraph>
              {description}
            </Typography>
          </Grid>
          <Grid item container spacing={3}>
            <Grid item>
              <Grid container spacing={1} alignItems="center">
                <Grid item className={classes.iconContainer}>
                  <PublicIcon className={classes.icon} />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{locations}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={1} alignItems="center">
                <Grid item className={classes.iconContainer}>
                  <HourglassEmptyIcon className={classes.icon} />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{opetustapa}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={1} alignItems="center">
                <Grid item className={classes.iconContainer}>
                  <EuroSymbolIcon className={classes.icon} />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{price}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <img className={classes.img} alt="diaconia-logo" src={DiakoniaLogo} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ToteutusCard;
