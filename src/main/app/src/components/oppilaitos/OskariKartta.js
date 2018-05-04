import React, { Component } from 'react';
//import OskariRPC from '../../tools/rpc-client/rpc-client';

class OskariKartta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result: undefined
        };
        console.log("Created component OskariKartta");
    }

    async componentDidMount() {
    }

    render() {
        console.log("Render Kartta");
        return (
            <React.Fragment>
                <iframe src="https://hkp.maanmittauslaitos.fi/hkp/published/fi/277da693-ae10-4508-bc5a-d6ced2056fd0"></iframe>
            </React.Fragment>
        );
    }
}

export default OskariKartta;