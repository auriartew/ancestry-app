import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './NavBar';
import ErrorMessage from './ErrorMessage';
import Welcome from './Welcome';
import withAuthProvider from './AuthProvider';
import AddFamily from './AddFamily';
import Posts from './Post';
import AddPost from './AddPost';
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css";
import Search from './Search';
import Family from './Family';
import Profile from './Profile';

  class App extends Component {

    handleRenderProps=(routerProps) => {
      return(<Posts {...routerProps}/>)
    }
    render() {
      let error = null;
      if (this.props.error) {
        error = <ErrorMessage
          message={this.props.error.message}
          debug={this.props.error.debug} />;
      }
      
      return (
        <Switch>
          <div>
            <NavBar
              isAuthenticated={this.props.isAuthenticated}
              authButtonMethod={this.props.isAuthenticated ? this.props.logout : this.props.login}
              user={this.props.user} />        
              {error}
              <Route exact path="/"
                render={(props) =>
                  <Welcome {...props}
                    isAuthenticated={this.props.isAuthenticated}
                    getAccessToken={this.props.getAccessToken}
                    user={this.props.user}
                    authButtonMethod={this.props.login} />
                } />
                <Route 
                  path="/profile" 
                  className="nav-link" 
                  render={(props) => 
                    <Profile 
                      getAccessToken={this.props.getAccessToken} 
                      isAuthenticated={this.props.isAuthenticated} 
                      user={this.props.user}
                      {...props}/>}/>
                <Route 
                  path="/family" 
                  className="nav-link" 
                  exact render={(props) => <Family 
                                              getAccessToken={this.props.getAccessToken} 
                                              {...props} />}/>
                <Route 
                  path="/addfamily" 
                  className="nav-link" 
                  render={(props) => 
                    <AddFamily 
                      getAccessToken={this.props.getAccessToken} 
                      isAuthenticated={this.props.isAuthenticated} {...props}/>}/>
                <Route 
                  path='/posts' 
                  render={(props) => 
                          <Posts 
                            user={this.props.user}
                            {...props}/>
                          }
                        
                />
                <Route 
                  path='/addpost' 
                  render={(props) => 
                    <AddPost 
                      getAccessToken={this.props.getAccessToken} 
                      isAuthenticated={this.props.isAuthenticated} 
                      user={this.props.user}
                      {...props}/>}/>
                <Route exact path="/search" render={(props) => 
                  <Search 
                    getAccessToken={this.props.getAccessToken} 
                    isAuthenticated={this.props.isAuthenticated}
                    {...props} 
                />}/>
            
          </div>
        
        </Switch>
      );
    }
  }
export default withAuthProvider(App);
