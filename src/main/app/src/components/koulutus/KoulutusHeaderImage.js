import React, { Component } from 'react';
import '../../assets/styles/components/_koulutus-header-image.scss';
import KoulutusHeaderImageLocation from '../../assets/images/o-JOB-STUDENT-facebook.jpg';

class KoulutusHeaderImage extends Component {
  render() {
    return <img alt="Studies" src={KoulutusHeaderImageLocation} />;
  }
}

export default KoulutusHeaderImage;
