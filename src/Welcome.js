import React from 'react';
import {
    Button
} from 'reactstrap';
import {
    Link
} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { config } from './Config';

function WelcomeContent(props) {
    if (props.isAuthenticated) {
        return (
            <div>
            <h4>Welcome {props.user.displayName}!</h4>
            <p>Use the nav bar at the top to get started.</p>
            </div>
        );
    }

    return (<Button className="signInBtn" onClick={props.authButtonMethod}>Click here to sign in</Button>);
}

export default class Welcome extends React.Component {
    //component will mount, use props to fetch and see if user exists
    //if user does not exist, add user and empty family array
    //if user does exist, do nothing
    constructor(props) {
        super(props);
        this.state = { access: ""};
    }

    async componentDidMount() {
        try {
            // Get the user's access token
            var accessToken = await this.props.getAccessToken(config.scopes);
            this.setState({
                access: accessToken
            })
            const requestOptions = {
                method: 'GET',
                headers: {'Content-Type': 'application/json', 'access': this.state.access},
            }
            fetch('/api/FindUser', requestOptions, {})
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("logged in");            
            })
            .catch((error) => console.log(error));
                            
            }
            catch (err) {
            console.log(err)            
            }
            
        
    }

    render() {
        return (
            <div className="container-fluid px-0">
                <div className="welcome row no-gutters align-items-start p-0">
                    <div className="col welcome-msg">
                        <h3>Connecting Floridians Across Generations</h3>
                        <p className="lead">
                            This site is open to the public.
                        </p>
                        <WelcomeContent
                            isAuthenticated={this.props.isAuthenticated}
                            user={this.props.user}
                            authButtonMethod={this.props.authButtonMethod} />
                    </div>
                </div>
                <div className="row no-gutters text-center welcome-middle">
                    <div className="col">
                        <h3>Discover your past.</h3>
                    </div>
                </div>
                <div className="row no-gutters text-center welcome-bottom">
                    <div className="col">
                        <h3>Get your personalized report today.</h3>
                        <Link className="custom-btn btn" to={'/search'}>Get started!</Link>
                    </div>
                </div>
            </div>
        );
        
    }
}