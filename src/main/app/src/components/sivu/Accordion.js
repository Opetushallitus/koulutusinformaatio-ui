import React from 'react';
import {withStyles} from "@material-ui/core";
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const ExpansionPanel = withStyles({
    root: {
        border: "none",
        backgroundColor: "transparent",
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiExpansionPanel);
const Summary = ({...props, children}) => {
    console.log('here?')
    return <ExpansionPanelSummary
        elevation={0}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
    >
        <Typography>{children}</Typography>
    </ExpansionPanelSummary>
}
const Accordion = ({...props, children}) => {
    console.log(props)
    return <ExpansionPanel elevation={0}>
        {children}
    </ExpansionPanel>
};

export {
    Summary,
    Accordion,
}