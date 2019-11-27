import React, { Component } from 'react';
import SideBarMenu from '../common/SideBarMenu';
import KoulutuksetFilter from './KoulutuksetFilter';
import OppilaitosArvostelut from './OppilaitosArvostelut';
import Media from 'react-media';

class OppilaitosSidebar extends Component {
  render() {
    const menuElements = this.props.items;
    const selectedItem = this.props.selected || 0;
    const ratingStars = this.props.ratingStars;
    return (
      <Media query="(min-width: 992px)">
        {(matches) =>
          matches ? (
            <div className="col-md-4 col-lg-4 col-xl-3" id="side-bar">
              <div className={'col-12 type-' + this.props.name}>
                <h1>{this.props.name}</h1>
              </div>
              <SideBarMenu
                items={menuElements}
                item={this.props.item}
                selected={selectedItem}
              />
              {selectedItem === 0 && (
                <OppilaitosArvostelut ratingStars={ratingStars} />
              )}
              {selectedItem === 2 && <KoulutuksetFilter />}
            </div>
          ) : null
        }
      </Media>
    );
  }
}

export default OppilaitosSidebar;
