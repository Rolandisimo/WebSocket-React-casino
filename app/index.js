require("!style!css!sass!./assets/scss/styles.scss");
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Main from './Casino/Main.jsx';
import Auth from './Auth/Auth.jsx';
import {Router, IndexRoute, Route, hashHistory} from 'react-router'
import shallowCompare from 'react-addons-shallow-compare';





class App extends React.Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}




ReactDOM.render(
    <Router history={hashHistory}>
    <Route path="/" component={App}>
        <Route path="/home" component={Main}/>
        <IndexRoute component={Auth}/>
    </Route>
</Router>, document.getElementById('app'));
