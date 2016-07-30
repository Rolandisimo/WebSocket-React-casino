require("!style!css!sass!./assets/scss/styles.scss");
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Main from './Casino/Main.jsx';
import Auth from './Auth/Auth.jsx';
import {Router, IndexRoute, Route, hashHistory} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Provider } from 'react-redux';
import store from './shared/store/store'





class App extends Component {
    constructor(props) {
        super(props);
        this.updateUser = this.updateUser.bind(this);
        this.state = {
            user: "user"
        };


        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    getChildContext() {
        return {
            user: this.state.user,
            updateUser: this.updateUser
        };
    }

    updateUser(user) {
        this.setState({user});
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}



App.childContextTypes = {
    user: PropTypes.string,
    updateUser: PropTypes.func
}


ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/home" component={Main}/>
            <IndexRoute component={Auth}/>
        </Route>
    </Router>
    </Provider>,
    document.getElementById('app')
);
