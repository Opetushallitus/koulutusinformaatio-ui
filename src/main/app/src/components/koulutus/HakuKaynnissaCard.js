import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  card: { margin: '40px', padding: '20px' },
  gridWrapper: {},
  buttonText: { color: '#FFFFFF' },
});

const HakuKaynnissaCard = (props) => {
  const classes = useStyles();
  const { title, text, link, buttonText } = props;
  return (
    <>
      <Card className={classes.card} elevation={2}>
        <CardContent className={classes.gridWrapper}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Typography variant="h4" gutterBottom>
                {title}
              </Typography>
              <Typography variant="body1">{text}</Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          {React.cloneElement(link, {
            children: (
              <Button variant="contained" size="large" color="primary">
                <Typography className={classes.buttonText} variant="body1">
                  {buttonText}
                </Typography>
              </Button>
            ),
          })}
        </CardActions>
      </Card>
    </>
  );
};

export default HakuKaynnissaCard;
