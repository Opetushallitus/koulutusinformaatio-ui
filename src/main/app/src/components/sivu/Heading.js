import React from 'react';
import {makeStyles} from "@material-ui/core";
import {colors} from "../../colors";

export function sanitize(name) {
    return name.replace(/\s+/g, '_')
}

const useStyles = makeStyles({
    anchor: {
        color: colors.black,
        fontSize: "24px",
        lineHeight: "30px",
        fontWeight: "700",
        marginTop: "15px",
        marginBottom: "25px"
    },
    anchorLink: {
        color: colors.black
    }
});


const Heading = ({...props,level}) => {
    const classes = useStyles();
    const value = props.children[0].props.value;
    const refe = sanitize(value);
    const anchor = <a className={classes.anchorLink} id={refe} name={refe}>{value}</a>;
    switch (level) {
       case 1:
           return <h1 className={classes.anchor}>{anchor}</h1>
       case 2:
           return <h2 className={classes.anchor}>{anchor}</h2>
       case 3:
           return <h3 className={classes.anchor}>{anchor}</h3>
       default:
           return <h4 className={classes.anchor}>{anchor}</h4>
    }
};

export default Heading;
