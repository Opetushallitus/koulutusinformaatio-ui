import React from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import { educationTypeColorCode } from '../../colors';
import DiakoniaLogo from '../../assets/images/suomen_diakonia_opisto_logo.png';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: (props) => ({
    borderTop: `5px solid ${educationTypeColorCode[props.tyyppi] ||
      educationTypeColorCode.muu}`,
    maxWidth: '400px',
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
    margin: '0',
  },
  img: {
    width: 'auto',
    height: '130px',
    float: 'right',
    [theme.breakpoints.down('sm')]: {
      width: '80px',
      float: 'left',
      marginBottom: '8px',
    },
  },
  heading: {
    textAlign: 'center',
    fontWeight: '600',
  },
}));

const OppilaitosCard = (props) => {
  const classes = useStyles(props);
  const { heading, locations, image, oppilaitosOid, tyyppi } = props;
  return (
    <Grid item xs={12} sm={6} md={4}>
      <LocalizedLink
        underline="none"
        component={RouterLink}
        to={`/oppilaitos/${oppilaitosOid}`}>
        <Paper className={classes.paper}>
          <Grid
            className={classes.grid}
            container
            justify="center"
            alignItems="center"
            wrap="nowrap"
            direction="column"
            spacing={3}>
            <Grid item>
              <img className={classes.img} alt="logo" src={image || DiakoniaLogo} />
            </Grid>
            <Grid item className={classes.heading}>
              {heading}
            </Grid>
            <Grid container direction="row" spacing={1} justify="center" wrap="nowrap">
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
        </Paper>
      </LocalizedLink>
    </Grid>
  );
};

export default OppilaitosCard;
