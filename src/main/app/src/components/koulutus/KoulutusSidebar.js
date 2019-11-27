import React, { Component } from 'react';
import '../../assets/styles/components/_koulutus-side-bar.scss';
import SideBarMenu from '../common/SideBarMenu';
import KoulutusType from './KoulutusType';

class KoulutusSidebar extends Component {
  getName() {
    switch (this.props.type) {
      case 'lk':
        return 'Lukio';
      case 'yo':
        return 'Korkeakoulu';
      case 'ako':
        return 'Avoin';
      case 'amm':
        return 'Ammatillinen';
      default:
        return 'Ammatillinen';
    }
  }

  render() {
    const menuElements = this.props.items;
    const selectedItem = this.props.selected || 0;
    const koulutusName = this.getName();
    const koulutusType = this.props.type;
    return (
      <div className="col-md-4 col-lg-4 col-xl-3" id="side-bar">
        <KoulutusType type={koulutusType} name={koulutusName} />
        <SideBarMenu
          items={menuElements}
          item={this.props.item}
          selected={selectedItem}
        />
      </div>
    );
  }
}

export default KoulutusSidebar;
