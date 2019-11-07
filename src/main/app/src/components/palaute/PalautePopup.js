import React, {Component} from 'react';
import '../../assets/styles/components/_palaute.scss';
import Palaute from "../common/Palaute";


class PalautePopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            tooltip: true,
            hover: false
        }
    }

    render() {
        const show = () => this.setState({...this.state, show: true});
        const hide = () => this.setState({...this.state, show: false});
        const hideTooltip = () => this.setState({...this.state, tooltip: false});
        const hover = (hover) => this.setState({...this.state, hover: hover});

        return <React.Fragment>
            <div className="palaute-popup-container">
                { (this.state.tooltip || this.state.hover) ?
                <span onClick={hideTooltip} className="arrow_box">
                    { this.state.tooltip ? <span className="material-icons">close</span> :null}
                    Anna palautetta Opintopolusta
                </span> : null}

                <div className="palaute-popup"
                     onClick={show}
                     onMouseEnter={() => hover(true)}
                     onMouseLeave={() => hover(false)}>
                    <div>
                        <span className="material-icons">sentiment_satisfied_alt</span>
                    </div>
                </div>
            </div>
            {this.state.show ? <Palaute togglePalaute={hide}/> : null}
        </React.Fragment>;
    }
}

export default PalautePopup;
