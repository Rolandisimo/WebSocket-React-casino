import React, { PropTypes } from 'react'
import { Router, hashHistory } from 'react-router'





const hideLabel = (e) => {
    let label = e.target.nextSibling;
    if (e.target.value) {
        label.style.opacity = '0';
    } else {
        label.style.opacity = '1';
    }
};

class Auth extends React.Component {
    constructor(props) {
        super(props);
    }
    authUser() {
        let user = document.forms['form']['user'].value;
        let password = document.forms['form']['password'].value;

        var userObject = {
            "$type": 'login',
            "username": user,
            "password": password
        };

        //create socket

        window.socket.send(JSON.stringify(userObject));

        //Receive response
        window.socket.onmessage = (event) => {
            let data = JSON.parse(event.data);
            switch (data.$type) {
                case 'login_successful':

                    this.setState({
                        userType: data.user_type
                    }, () => {
                        hashHistory.push('/home' + "?userType=" + this.state.userType);
                    });

                    break;
                default:
                    console.log("login failed");

            }
        };

    }
    render () {
        return (
            <div className="row">
                <h1>Welcome! Sign in, please!</h1>
                <hr/>
                <form ref="form" name="form" action="" className="col-md-6 col-md-offset-3">
                    <div className="form-group field_custom_wrapper">
                        <input type="text" onChange={hideLabel} name="user" className="form-control field_custom"/>
                        <label htmlFor="user" className="label_custom">User</label>
                    </div>
                    <div className="form-group field_custom_wrapper">
                        <input type="password" onChange={hideLabel} name="password" className="form-control field_custom"/>
                        <label htmlFor="password" className="label_custom">Password</label>
                    </div>
                    <button type="button" onClick={this.authUser.bind(this)} className="btn btn-success">Sign in</button>
                </form>
            </div>
        );
    }
}





export default Auth;
