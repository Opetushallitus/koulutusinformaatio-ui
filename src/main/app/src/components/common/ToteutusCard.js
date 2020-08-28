import React from 'react';
import { Grid, Typography, Paper, makeStyles, Hidden } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import { educationTypeColorCode } from '../../colors';
import DiakoniaLogo from '../../assets/images/suomen_diakonia_opisto_logo.png';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';

const useStyles = makeStyles((theme) => ({
  nimikkeet: {
    fontWeight: '600',
  },
  paper: (props) => ({
    borderTop: `5px solid ${educationTypeColorCode[props.tyyppi] ||
      educationTypeColorCode.muu}`,
    maxWidth: '900px',
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
    [theme.breakpoints.down('sm')]: { padding: '8px' },
  },
  img: {
    width: '180px',
    height: 'auto',
    float: 'right',
    [theme.breakpoints.down('sm')]: {
      width: '80px',
      float: 'left',
      marginBottom: '8px',
    },
  },
}));

const ToteutusCard = (props) => {
  const classes = useStyles(props);
  const {
    heading,
    ammattinimikkeet,
    description,
    locations,
    opetustapa,
    price,
    image,
  } = props;
  return (
    <Paper className={classes.paper}>
      <Grid
        className={classes.grid}
        container
        justify="space-between"
        alignItems="center"
        wrap="nowrap"
        spacing={3}>
        <Grid item container direction="column" xs>
          <Hidden mdUp>
            <Grid item>
              <img className={classes.img} alt="logo" src={image || DiakoniaLogo} />
            </Grid>
          </Hidden>
          <Grid item>
            <Typography variant="h4" gutterBottom>
              {heading}
            </Typography>
            {ammattinimikkeet ? (
              <Typography className={classes.nimikkeet} variant="body1" gutterBottom>
                {ammattinimikkeet}
              </Typography>
            ) : null}
            <Hidden smDown>
              <Typography variant="body1" paragraph>
                <HTMLEllipsis unsafeHTML={description} maxLine={2} />
              </Typography>
            </Hidden>
          </Grid>
          <Grid item container spacing={3}>
            <Grid item sm={6} md>
              <Grid
                container
                direction="row"
                spacing={1}
                alignItems="center"
                wrap="nowrap">
                <Grid item className={classes.iconContainer}>
                  <PublicIcon className={classes.icon} />
                </Grid>
                <Grid item>
                  <Typography variant="body1" noWrap>
                    {locations}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={6} md>
              <Grid
                container
                spacing={1}
                alignItems="center"
                direction="row"
                wrap="nowrap">
                <Grid item className={classes.iconContainer}>
                  <HourglassEmptyIcon className={classes.icon} />
                </Grid>
                <Grid item>
                  <Typography variant="body1" noWrap>
                    {opetustapa}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={6} md>
              <Grid
                container
                spacing={1}
                alignItems="center"
                direction="row"
                wrap="nowrap">
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
        <Hidden smDown>
          <Grid item>
            <img className={classes.img} alt="logo" src={image || DiakoniaLogo} />
          </Grid>
        </Hidden>
      </Grid>
    </Paper>
  );
};

export default ToteutusCard;
