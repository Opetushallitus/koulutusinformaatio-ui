import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { SchoolOutlined, HomeWorkOutlined } from '@material-ui/icons';
import qs from 'query-string';
import '../../assets/styles/components/_hakutulos-toggle.scss';
import { styles } from '../../styles';
import { toJS } from 'mobx';
import {withTranslation} from 'react-i18next'

@inject('hakuStore')
@observer
class HakutulosToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: this.props.hakuStore.toggle === 'koulutus' ? 0 : 1 };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  handleSelectedTab = (event, newValue) => {
    // console.log(`Hakutulostoggle - handleSelectedTab, Selected Tab = ${newValue}`);
    this.setState({ selectedTab: newValue });
    const search = qs.parse(this.props.history.location.search);
    const toggleValue = newValue === 0 ? 'koulutus' : 'oppilaitos';
    search.toggle = toggleValue;
    // console.log(`HakutulosToggle - handleSelectedTab - toggleValue = ${toggleValue}`);
    this.props.hakuStore.setToggle(toggleValue);
    this.props.history.replace({ search: qs.stringify(search) });
  }

  render() {
    const { t, classes, hakuStore } = this.props;
    // console.log(`HakutulosToggle - render() - 40 toggle = ${toJS(hakuStore.toggle)}`);
    return (
      <Tabs
        value={this.state.selectedTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={this.handleSelectedTab}
      >
        <Tab
          icon={<SchoolOutlined style={{ marginBottom: 0, marginRight: '15px' }} />}
          classes={{ wrapper: classes.customWrapper, labelIcon: classes.customLabelIcon }}
          label={`${t('haku.koulutukset')} (${this.props.hakuStore.koulutusCount})`}
        ></Tab>
        <Tab
          icon={<HomeWorkOutlined style={{ marginBottom: 0, marginRight: '15px' }} />}
          classes={{ wrapper: classes.customWrapper, labelIcon: classes.customLabelIcon }}
          label={`${t('haku.oppilaitokset')} (${this.props.hakuStore.oppilaitosCount})`}
        ></Tab>
      </Tabs>
    );
  }
}

const HakuTulosToggleWithStyles = withTranslation()(withStyles(styles)(HakutulosToggle));

export default withRouter(HakuTulosToggleWithStyles);
