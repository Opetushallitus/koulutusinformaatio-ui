import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { SchoolOutlined, AccountBalanceOutlined } from '@material-ui/icons';
import qs from 'query-string';
import '../../assets/styles/components/_hakutulos-toggle.scss';
import { styles } from '../../styles';

@inject('hakuStore')
@observer
class HakutulosToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: this.props.hakuStore.toggleKoulutus ? 0 : 1 };
    this.handleSelectedTab = this.handleSelectedTab.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  handleSelectedTab(event, newValue) {
    this.setState({ selectedTab: newValue });
    const search = qs.parse(this.props.history.location.search);
    search.toggle = newValue === 0 ? 'koulutus' : 'oppilaitos';
    this.props.history.replace({ search: qs.stringify(search) });
  }

  render() {
    const { t, classes } = this.props;
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
          icon={<AccountBalanceOutlined style={{ marginBottom: 0, marginRight: '15px' }} />}
          classes={{ wrapper: classes.customWrapper, labelIcon: classes.customLabelIcon }}
          label={`${t('haku.oppilaitokset')} (${this.props.hakuStore.oppilaitosCount})`}
        ></Tab>
      </Tabs>
    );
  }
}

const HakuTulosToggleWithStyles = withStyles(styles)(HakutulosToggle);

export default withRouter(HakuTulosToggleWithStyles);
