import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { SchoolOutlined, HomeWorkOutlined } from '@material-ui/icons';
import qs from 'query-string';
import '../../assets/styles/components/_hakutulos-toggle.scss';
import { styles } from '../../styles';
import { withTranslation } from 'react-i18next';

@inject('hakuStore')
@observer
class HakutulosToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.hakuStore.toggle === 'koulutus' ? 0 : 1,
      koulutusCount: this.props.hakuStore.koulutusCount,
      oppilaitosCount: this.props.hakuStore.oppilaitosCount,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      koulutusCount: nextProps.hakuStore.koulutusCount,
      oppilaitosCount: nextProps.hakuStore.oppilaitosCount,
    });
    this.props = nextProps;
  }

  handleSelectedTab = (event, newValue) => {
    const { hakuStore, history } = this.props;
    this.setState({ selectedTab: newValue });
    const search = qs.parse(history.location.search);
    const toggleValue = newValue === 0 ? 'koulutus' : 'oppilaitos';
    search.toggle = toggleValue;
    hakuStore.setToggle(toggleValue);
    history.replace({ search: qs.stringify(search) });
  };

  render() {
    const { t, classes, hakuStore } = this.props;

    return (
      <Tabs
        value={this.state.selectedTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={this.handleSelectedTab}
      >
        <Tab
          icon={<SchoolOutlined className={classes.hakuTulosTabIconMargin} />}
          classes={{
            wrapper: classes.customWrapper,
            labelIcon: classes.customLabelIcon,
          }}
          label={`${t('haku.koulutukset')} (${this.state.koulutusCount})`}
        ></Tab>
        <Tab
          icon={<HomeWorkOutlined className={classes.hakuTulosTabIconMargin} />}
          classes={{
            wrapper: classes.customWrapper,
            labelIcon: classes.customLabelIcon,
          }}
          label={`${t('haku.oppilaitokset')} (${hakuStore.oppilaitosCount})`}
        ></Tab>
      </Tabs>
    );
  }
}

const HakuTulosToggleWithStyles = withTranslation()(
  withStyles(styles)(HakutulosToggle)
);

export default withTranslation()(withRouter(HakuTulosToggleWithStyles));
