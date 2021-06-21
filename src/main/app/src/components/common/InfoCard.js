import React from 'react';

import {
  makeStyles,
  Button,
  Card,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
} from '@material-ui/core';

const useStyles = makeStyles({
  media: {
    height: 260,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 460,
    height: '100%',
  },
  button: {
    marginTop: 'auto',
    paddingBottom: '24px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const InfoCard = (props) => {
  const { image, title, text, buttonText } = props;
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      {image ? (
        <CardMedia
          role="img"
          className={classes.media}
          image={image.url}
          title={image.title}
        />
      ) : null}
      <CardContent className={classes.content}>
        {title ? (
          <Typography align="left" gutterBottom variant="h4">
            {title}
          </Typography>
        ) : null}
        <Typography align="left" variant="body1" component="p">
          {text}
        </Typography>
      </CardContent>
      <CardActions className={classes.button}>
        <Button variant="contained" size="medium" color="primary">
          {buttonText ? buttonText : 'Lue lisää'}
        </Button>
      </CardActions>
    </Card>
  );
};
export default InfoCard;
