import React, { Component } from 'react';
import Main from './components/Main';
import Sidebar from "./components/Sidebar";
import Header from './components/Header';
import './assets/css/oph-styles-min.css';
import './assets/css/styles.css';
import './assets/css/font-awesome.min.css'
import './assets/css/bootstrap.min.css'

class App extends Component {

    render() {
        return (
            <div id="wrapper">
                <div class="container-fluid navigation-bar"/>
                <Sidebar/>
                <div id="page-content-wrapper">
                    <Header/>
                    <Main/>
                </div>
            </div>
        );
    }
}

export default App;