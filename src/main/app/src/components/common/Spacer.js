import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { colors } from '../../colors';

const useStyles = makeStyles({
  root: (props) => ({
    height: '4px',
    width: '30px',
    borderRadius: '2px',
    backgroundColor: props.color ? props.color : colors.green,
    margin: '20px',
  }),
});

const Spacer = (props) => {
  const classes = useStyles(props);
  return <div className={classes.root} />;
};

export default Spacer;
