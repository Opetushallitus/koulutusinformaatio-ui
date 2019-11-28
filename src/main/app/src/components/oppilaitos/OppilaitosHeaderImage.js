import React, { Component } from 'react';
import '../../assets/styles/components/_oppilaitos-header-image.scss';
import OppilaitosHeaderImageLocation from '../../assets/images/Programmes-desk-1.jpg';

class OppilaitosHeaderImage extends Component {
  render() {
    return <img alt="Studies" src={OppilaitosHeaderImageLocation} />;
  }
}

export default OppilaitosHeaderImage;
