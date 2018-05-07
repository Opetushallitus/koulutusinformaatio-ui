import React, { Component } from 'react';
import OskariRPC from '../../tools/rpc-client/rpc-client';
import { OsoiteParser as op } from '../../tools/Utils'

class OskariKartta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result: undefined,
            osoitetieto: [op.getCoreAddress(props.osoite), props.postitoimipaikka],
            mapinfo: OskariKartta.selectMapBasedOnLocation()
        };
        console.log("Created component OskariKartta");
    }

    componentDidMount() {
        console.log("did mount");
        if(this.state.osoitetieto[0] && this.state.osoitetieto[1]) {
            this.setMapLocation(this.state.osoitetieto);
        }
    }

    shouldComponentUpdate() {
        //return false;
    }

    static selectMapBasedOnLocation() {
        var location = window.location.href;
        console.log("Päätellään oikeat parametrit kartalle: " + location);
        if(location.indexOf('localhost') !== -1 ) {
            return ['https://hkp.maanmittauslaitos.fi', '277da693-ae10-4508-bc5a-d6ced2056fd0'];
        } else if (location.indexOf('hahtuvaopintopolku') !== -1 ) {
            return ['https://hahtuvaopintopolku.fi', '74aff82d-7c67-40ba-bd3f-893c8bdb4daa'];
        }
        return null; //fixme
    }


    setMapLocation(osoitetieto) {
        //var mapinfo = this.selectMapBasedOnLocation();
        console.log("Set map location: " +osoitetieto +", mapinfo: "+ this.state.mapinfo);
        var IFRAME_DOMAIN = this.state.mapinfo[0];
        var iFrame = document.getElementById('publishedMap');
        var channel = OskariRPC.connect(
            iFrame,
            IFRAME_DOMAIN);

        channel.handleEvent(
            'SearchResultEvent',
            function(data) {
                console.log('DATA: ' + JSON.stringify(data));
                if(data.success) {
                    console.log('data.result.locations.length: ' + data.result.locations.length);
                    if(data.result && data.result.locations && data.result.locations.length > 0) {
                        var location = data.result.locations[0];
                        data.result.locations.map(loc => {
                            //console.log("LOC: %O", loc);
                            if(loc.region.toLowerCase() === osoitetieto[1].toLowerCase() || loc.village.toLowerCase() === osoitetieto[1].toLowerCase()) {
                                location = loc;
                            }
                        });

                        var x = location.lon;
                        var y = location.lat;
                        var name = location.name;
                        var zoomLevel = 9;

                        channel.postRequest(
                            'MapMoveRequest', [x, y, zoomLevel]
                        );

                        var MARKER_ID = 'OPPILAITOS';
                        var data = {
                            x: x,
                            y: y,
                            color: 'ff0000',
                            msg : name,
                            shape: 2, // icon number (0-6)
                            size: 4
                        };
                        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
                    }
                }
            }
        );

        channel.onReady(function() {
            //channel is now ready and listening.
            channel.log('Map is now listening');
            var expectedOskariVersion = '1.44.3';
            channel.isSupported(expectedOskariVersion, function(blnSupported) {
                if(blnSupported) {
                    channel.log('Client is supported and Oskari version is ' + expectedOskariVersion);
                } else {
                    channel.log('Oskari-instance is not the one we expect (' + expectedOskariVersion + ') or client not supported');
                    // getInfo can be used to get the current Oskari version
                    channel.getInfo(function(oskariInfo) {
                        channel.log('Current Oskari-instance reports version as: ', oskariInfo);
                    });
                }
            });
            channel.isSupported(function(blnSupported) {
                if(!blnSupported) {
                    channel.log('Oskari reported client version (' + OskariRPC.VERSION + ') is not supported.' +
                        'The client might work, but some features are not compatible.');
                } else {
                    channel.log('Client is supported by Oskari.');
                }
            });

            //var data = ['Kaisaniemenkatu 2, Helsinki'];
            var data = osoitetieto[0];
            console.log("Triggering search!" + data);
            channel.postRequest('SearchRequest', data);
            //console.log("searchResult: " + searchResult);

        });
    }

    render() {
        console.log("Render Kartta");
        return (
            <React.Fragment>
                <div>
                <iframe id='publishedMap' src={"https://hkp.maanmittauslaitos.fi/hkp/published/fi/"+this.state.mapinfo[1]}/>
                </div>
            </React.Fragment>
        );
    }
}

export default OskariKartta;