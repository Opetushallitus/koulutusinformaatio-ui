import React from 'react';
import { Paper, Typography, makeStyles, Grid, Button } from '@material-ui/core';

const useStyles = makeStyles({
  card: { width: '50%', height: '130px', marginTop: '100px' },
  gridWrapper: { margin: '40px' },
  buttonText: { color: '#FFFFFF' },
});

const HakuKaynnissaCard = (props) => {
  const classes = useStyles();
  const { title, text, link, buttonText } = props;
  return (
    <>
      <Paper className={classes.card} elevation={2}>
        <div className={classes.gridWrapper}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Typography variant="h4" gutterBottom>
                {title}
              </Typography>
              <Typography variant="body1">{text}</Typography>
            </Grid>
            <Grid item>
              {React.cloneElement(link, {
                children: (
                  <Button variant="contained" size="large" color="primary">
                    <Typography className={classes.buttonText} variant="body1">
                      {buttonText}
                    </Typography>
                  </Button>
                ),
              })}
            </Grid>
          </Grid>
        </div>
      </Paper>
    </>
  );
};

export default HakuKaynnissaCard;
