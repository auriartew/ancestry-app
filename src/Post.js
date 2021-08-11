import { FormControl, FormLabel, Button } from 'react-bootstrap';
import { config } from './Config';
import withAuthProvider from './AuthProvider';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
import './App.css';
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';


function NotYourPosts(props) {
    console.log(props)
    return (
        <div>
            <div key={props._id} className="post-card">           
                <div className="row">
                    <div className="col">
                        <h5>{props.title}</h5>
                    </div>
                </div>
                <p>{props.description}</p> 
                <div className="post-username">
                    <p>By {props.username}</p>
                </div> 
            </div>    
        </div>
    );
}

function PostPage (props) {
    const { postId } = useParams();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState("");
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");

    useEffect(() => {   
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', "access": props.access},
        };
        const fetchData = () => {
        fetch(`/api/HttpTrigger5/${postId}`, requestOptions)
        .then((res) => {
            return res.json();
        })
        .then((response) => {  
            console.log("response" + JSON.stringify(response));        
            setData(response);
            setTitle(response.title);
            setDescription(response.description);
            setIsLoading(false);
            
        })
        .catch((error) => console.log(error));
      }
      fetchData();
    }, [postId]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        var accessToken = await props.getAccessToken(config.scopes);

        const formData = {
            "title": title,
            "description": description,
        }

        const requestOptions = {
            method: 'Post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({'data': formData, "_id": postId, 'access': accessToken})
        }

        await fetch('/api/UpdatePost', requestOptions)
        .then(response => response.json());
        history.push("/posts");
        
    }
  
    return (    
      <>
      {isLoading && (<p>Loading...</p>)}
      {!isLoading && (
          <>
          <div>
                <div key={props._id} className="post-card">                                 
                    <FormLabel>Title: </FormLabel>
                    <FormControl
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />       
                    <FormLabel>Description: </FormLabel>  
                    <FormControl
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    /> 
                    <Button 
                        className="post-update"
                        onClick={e => handleSubmit(e)}>Update</Button>
                </div>    
            </div>
          </>
      )}
      {!isLoading && (data === null) && (
          <>
          <p>You do not have permission to edit this post.</p>
          </>
      )}
      </>        
    )
}

class Posts extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            access: null,
            yourPosts: [],
            notYourPosts: [],
        }
    }

    fetchPosts() {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', "access": this.state.access},
        };
        fetch(
            '/api/FindYourPosts',
            requestOptions
        )
        .then(response => response.json())
        .then(result => {
            this.setState({
                yourPosts: result
            })
        })

        fetch(
            '/api/NotYourPosts',
            requestOptions
        )
        .then(response => response.json())
        .then(result => {
            this.setState({
                notYourPosts: result
            })
        })
    }
    
    async componentDidMount() {
        var accessToken = await this.props.getAccessToken(config.scopes);
        this.setState({
            access: accessToken
        })
        this.fetchPosts();    
    }

    async componentDidUpdate() {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', "access": this.state.access},
        };
        let newData = await fetch(
            '/api/FindYourPosts',
            requestOptions
        )
        .then(response => response.json())
        
        if (JSON.stringify(this.state.yourPosts) !== JSON.stringify(newData)) {
            this.fetchPosts();   
        }
         
    }

    async handleDelete(e, _id) {
        e.preventDefault();

        const requestOptions = {
            method: 'Post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({"_id": _id, 'access': this.state.access})
        }

        await fetch('/api/DeletePost', requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        fetch(
            '/api/FindYourPosts',
            {
                method: 'GET',
                headers: {'Content-Type': 'application/json', "access": this.state.access},
            }
        )
        .then(response => response.json())
        .then(result => {
            this.setState({
                yourPosts: result
            })
        })
    }
    
    render() {
        let match=this.props.match;

        if(this.props.isAuthenticated) {
            return (
                <>
                <div className="post-container">
                <Route path={`${match.url}/:postId`}>
                    <PostPage 
                        access={this.state.access}
                        getAccessToken={this.props.getAccessToken}  />
                </Route>
                <Route exact path={match.url}>
                
                {this.state.yourPosts.map(props => (
                    <div>
                        <div key={props._id} className="post-card">
                            
                            <div className="row">
                                <div className="col">
                                    <h5>{props.title}</h5>
                                </div>
                                <div className="col-md-3">
                                    <Link className="col btn btn-success" to={`/posts/${props._id}`}>Edit</Link>
                                    <Button 
                                        className="post-update"
                                        onClick={e => this.handleDelete(e, props._id)}>Delete</Button>        
                                </div>
                            </div>
                            <p>{props.description}</p> 
                            <div className="post-username">
                                <p>By {props.username}</p>
                            </div>  
                        </div>    
                    </div>                   
                ))}
                {this.state.notYourPosts.map(props => (
                    <NotYourPosts {...props} />                    
                ))}
                
                
                </Route>
                </div>
                </>
            )
        }
        else {
            return null;
        }
    }

}
export default withAuthProvider(Posts);