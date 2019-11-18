import React from 'react';
import {makeStyles} from "@material-ui/core";
import {colors} from "../../colors";


const useStyles = makeStyles({
    anchor: {
        color: colors.black,
        "&:a" : {
            color: colors.black,
        }
    },
    anchorLink: {
        color: colors.black,
    }
});


const Heading = ({...props,level}) => {
    const classes = useStyles();
    const value = props.children[0].props.value;
    switch (level) {
       case 1:
           return <h1 className={classes.anchor}><a className={classes.anchorLink} name={value}>{value}</a></h1>;
       case 2:
           return <h2 className={classes.anchor}><a className={classes.anchorLink} name={value}>{value}</a></h2>;
       case 3:
           return <h3 className={classes.anchor}><a className={classes.anchorLink} name={value}>{value}</a></h3>;
       default:
           return <h4 className={classes.anchor}><a className={classes.anchorLink} name={value}>{value}</a></h4>
    }
};

export default Heading;
