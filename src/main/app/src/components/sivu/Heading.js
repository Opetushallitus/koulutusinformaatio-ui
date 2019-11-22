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
        lineHeight: "10px",
        fontWeight: "700",
        marginTop: "0",
        marginBottom: "25px"
    },
    anchorLink: {
        fontSize: 0,
        color: colors.black
    }
});


const Heading = ({id, children,level}) => {
    const classes = useStyles();
    const value = children;
    const refe = id;
    const anchor = <a className={classes.anchorLink} id={refe} name={refe}>{value}</a>;
    switch (level) {
       case 1:
           return <h1 className={classes.anchor}>{anchor}{value}</h1>
       case 2:
           return <h2 className={classes.anchor}>{anchor}{value}</h2>
       case 3:
           return <h3 className={classes.anchor}>{anchor}{value}</h3>
       default:
           return <h4 className={classes.anchor}>{anchor}{value}</h4>
    }
};

export default Heading;
