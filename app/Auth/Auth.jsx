import React, { PropTypes, Component } from 'react'
import { Router, hashHistory } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { updateUserType } from '../shared/actions/UserActions'
import { connect } from 'react-redux';



const hideLabel = e => {
    let label = e.target.nextSibling;
    if (e.target.value) {
        label.style.opacity = '0';
    } else {
        label.style.opacity = '1';
    }
};

class Auth extends Component {
    constructor(props) {
        super(props);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    authUser() {
        let user = this.refs.username.value;
        let password = this.refs.password.value;

        var userObject = {
            "$type": 'login',
            "username": user,
            "password": password
        };
        //create socket

        window.socket.send(JSON.stringify(userObject));
        //
        // //Receive response
        window.socket.onmessage = event => {
            let data = JSON.parse(event.data);
            switch (data.$type) {
                case 'login_successful':

                    this.props.dispatch(updateUserType(data.user_type));
                    hashHistory.push('/home');

                    break;
                default:
                    alert("login failed");

            }
        };
    }

    render () {
        return (
            <div className="row">
                <h1>Welcome! Sign in, please!</h1>
                <hr/>
                <form ref="form" name="form" className="col-md-6 col-md-offset-3">
                    <div className="form-group field_custom_wrapper">
                        <input ref="username" type="text" onChange={hideLabel} name="user" className="form-control field_custom"/>
                        <label htmlFor="user" className="label_custom">User</label>
                    </div>
                    <div className="form-group field_custom_wrapper">
                        <input ref="password" type="password" onChange={hideLabel} name="password" className="form-control field_custom"/>
                        <label htmlFor="password" className="label_custom">Password</label>
                    </div>
                    <button type="button" onClick={this.authUser.bind(this)} className="btn btn-success">Sign in</button>
                </form>
            </div>
        );
    }
}

Auth.contextTypes = {
    user: PropTypes.string,
    updateUser: PropTypes.func
}

const mapStateToProps = (state, ownProps) => {
  return {
      tables: state.tablesReducer,
      user: state.userReducer
  };
};

export default connect(mapStateToProps)(Auth);
