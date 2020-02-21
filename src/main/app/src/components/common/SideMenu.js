import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  Drawer,
  Paper,
  InputBase,
  Button,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { styles } from '../../styles';
import { useStores } from '../../hooks';
import { observer } from 'mobx-react';
import SidebarValikko from './SidebarValikko';
import Murupolku from './Murupolku';

const useStyles = makeStyles(styles);

const SideMenu = (props) => {
  const { small, menuVisible, closeMenu } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const { contentfulStore } = useStores();
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  const { valikot, valikko } = contentfulStore.data;
  const selectValikko = (valikko) => setSelected([...selected, valikko]);
  const popSelected = () => setSelected(selected.slice(0, -1));
  const last = (a) => (a ? a[a.length - 1] : null);
  const single = (entry) => Object.values(entry)[0] || {};
  const selectedValikko = last(selected) ? valikko[last(selected)] : null;
  const linkit = selectedValikko
    ? [selectedValikko]
    : (single(valikot).valikot || []).map((v) => valikko[v.id]);

  const doSearch = (event) => {
    history.push(`/sisaltohaku/?hakusana=${search}`);
    event.preventDefault();
  };

  const innards = (
    <React.Fragment>
      <div className={classes.inputBackground}>
        <Paper
          component="form"
          onSubmit={doSearch}
          className={classes.inputRoot}
          elevation={0}>
          <InputBase
            className={classes.input}
            value={search}
            onKeyPress={(event) => event.key === 'Enter' && doSearch(event)}
            onChange={({ target }) => setSearch(target.value)}
            placeholder={t('sidebar.etsi-tietoa-opintopolusta')}
            inputProps={{
              'aria-label': t('sidebar.etsi-tietoa-opintopolusta'),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.iconButton}
            aria-label={t('sidebar.etsi-tietoa-opintopolusta')}>
            <SearchIcon />
          </Button>
        </Paper>
      </div>
      {selectedValikko ? null : (
        <div className={classes.murupolku}>
          <Murupolku path={[]} />
        </div>
      )}
      {linkit.map((valikko) => {
        const id = valikko.id;
        const links = valikko.linkki || [];

        return (
          <SidebarValikko
            key={id}
            id={id}
            parent={selectedValikko}
            name={valikko.name}
            deselect={popSelected}
            select={selectValikko}
            links={links}
            closeMenu={closeMenu}
          />
        );
      })}
    </React.Fragment>
  );
  return (
    <React.Fragment>
      {small ? (
        <Drawer
          open={menuVisible}
          className={classes.smDrawer}
          variant="persistent"
          anchor="left"
          classes={{
            paper: classes.smDrawerPaper,
          }}>
          {innards}
        </Drawer>
      ) : (
        <Drawer
          open={menuVisible}
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          classes={{
            paper: classes.drawerPaper,
          }}>
          {innards}
        </Drawer>
      )}
    </React.Fragment>
  );
};

export default observer(SideMenu);
