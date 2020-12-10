import React from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import {
  SchoolOutlined,
  TimelapseOutlined,
  ExtensionOutlined,
} from '@material-ui/icons/';
import { educationTypeColorCode } from '#/src/colors';

const useStyles = makeStyles({
  nimikkeet: {
    fontWeight: '600',
  },
  paper: (props) => ({
    borderTop: `5px solid ${
      educationTypeColorCode[props.tyyppi] || educationTypeColorCode.muu
    }`,
    width: '100%',
    height: '100%',
    minWidth: '350px',
  }),
  icon: {
    fontSize: '1.1875rem',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  grid: {
    padding: '35px',
  },
});

const TulevaKoulutusCard = (props) => {
  const classes = useStyles(props);
  const { koulutusName, tutkintonimikkeet, koulutustyypit, opintojenlaajuus } = props;

  return (
    <Paper className={classes.paper}>
      <Grid
        className={classes.grid}
        container
        justify="space-between"
        alignItems="center"
        direction="column"
        spacing={3}
        wrap="nowrap">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            {koulutusName}
          </Typography>
        </Grid>
        <Grid item container direction="column" spacing={2}>
          <Grid item>
            <Grid container wrap="nowrap" spacing={1} alignItems="center">
              <Grid item className={classes.iconContainer}>
                <SchoolOutlined />
              </Grid>
              <Grid item>
                <Typography variant="body1">{tutkintonimikkeet}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container wrap="nowrap" spacing={1} alignItems="center">
              <Grid item className={classes.iconContainer}>
                <ExtensionOutlined />
              </Grid>
              <Grid item>
                <Typography variant="body1">{koulutustyypit}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container wrap="nowrap" spacing={1} alignItems="center">
              <Grid item className={classes.iconContainer}>
                <TimelapseOutlined />
              </Grid>
              <Grid item>
                <Typography variant="body1">{opintojenlaajuus}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TulevaKoulutusCard;
