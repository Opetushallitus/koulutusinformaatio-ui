import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { colors } from '../../styles';
import { withRouter} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import SidebarValikko from "./SidebarValikko";
import { withStyles } from '@material-ui/core/styles';
import '../../assets/styles/components/_side-menu.scss';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import {drawerWidth} from '../../styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Murupolku from "./Murupolku";

const sideMenuStyles = theme => ({
    root: {
        display: 'flex',
        marginLeft: "20px",
        paddingLeft: "20px"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    inputBackground: {
        backgroundColor: colors.sideInputBackground,
        paddingLeft: "20px",
        paddingTop: "91px",
        paddingBottom: "20px",
    },
    murupolku: {
        paddingLeft: "20px",

    },
    inputRoot: {
        height: "35px",
        display: 'flex',
        alignItems: 'center',
        borderRadius: 0,
        width: 290,
    },
    input: {
        borderRadius: 0,
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        minWidth: "40px",
        maxWidth: "40px",
        borderRadius: 0,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});

@translate()
@inject("contentfulStore")
@observer
class SideMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            search: ""
        };
    }

    selectValikko = (valikko) => {
        this.setState({...this.state, selected: this.state.selected.concat([valikko])});
    };
    popSelected = () => {
        this.setState({...this.state, selected: this.state.selected.slice(0,-1)});
    };
    setSearch = (value) => {
        this.setState({...this.state, search: value});
    };
    doSearch = (event) => {
        this.props.history.push('/sisaltohaku/?hakusana=' + this.state.search);
        event.preventDefault();
    };

    render() {
        const { classes } = this.props;
        const {t} = this.props;
        const last = (a) => a ? a[a.length - 1] : null;
        const single = (entry) => (Object.values(entry)[0] || {});
        const {valikot,valikko} = this.props.contentfulStore.data;
        const {selected} = this.state;
        const selectedValikko = last(selected) ? valikko[last(selected)] : null;
        const linkit = selectedValikko ? [selectedValikko] : (single(valikot).valikot || []).map(v => valikko[v.id]);

        const innards = <React.Fragment>
                <div className={classes.inputBackground}>
                    <Paper component="form"
                           onSubmit={this.doSearch}
                           className={classes.inputRoot}>
                        <InputBase
                            className={classes.input}
                            value={this.state.search}
                            onKeyPress={(event) => event.key === 'Enter' && this.doSearch(event)}
                            onChange={({target}) => this.setSearch(target.value)}
                            placeholder={t("sidebar.etsi-tietoa-opintopolusta")}
                            inputProps={{'aria-label': t("sidebar.etsi-tietoa-opintopolusta")}}
                        />
                        <Button type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.iconButton}
                                aria-label={t("sidebar.etsi-tietoa-opintopolusta")}>
                            <SearchIcon/>
                        </Button>
                    </Paper>
                </div>
                {selectedValikko ? null :
                    <div className={classes.murupolku}>
                        <Murupolku path={[]}/>
                    </div>}
                {linkit.map((valikko) => {
                    const id = valikko.id;
                    const links = (valikko.linkki || []);

                    return <SidebarValikko selectDropdown={() => this.selectDropdown(id)}
                                           key={id}
                                           id={id}
                                           parent={selectedValikko}
                                           name={valikko.name}
                                           deselect={this.popSelected}
                                           select={this.selectValikko}
                                           links={links}
                    />;
                })}
            </React.Fragment>;

        return (
            <React.Fragment>
                <Drawer open={this.props.menuVisible}
                        className={classes.drawer}
                        variant="persistent"
                        anchor="left"
                        classes={{
                            paper: classes.drawerPaper,
                        }}>
                    {innards}
                </Drawer>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(sideMenuStyles, { withTheme: true })(SideMenu));
