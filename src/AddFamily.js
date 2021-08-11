import React, { useState, useEffect } from 'react';
import Grandma from './grandmother.svg';
import { config } from './Config';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import {FormControl, FormLabel, Row} from 'react-bootstrap';
import withAuthProvider from './AuthProvider';
import {
    BrowserRouter as 
    Route,
    Link,
    useParams,
  } from "react-router-dom";
import './App.css';


function FamilyMember(props) {
    const [editMode, setEditMode] = useState(false);
    const [deleteItem, setDelete] = useState(false);
    const [firstName, setFirstName] = useState((props.firstName ? props.firstName : ""));
    const [lastName, setLastName] = useState((props.lastName ? props.lastName : ""));
    const [dob, setDob] = useState((props.dob ? props.dob : ""));
    const [birthPlace, setBirthPlace] = useState(`${props.city ? props.city : ""}, ${props.state ? props.state : ""}`);
    
    const handleSubmit = e => {
        e.preventDefault();
        const formData = {
            "firstName":firstName,
            "lastName": lastName,
            "dob": dob,
            "birthPlace": birthPlace
        };
        
        
        
        const requestOptions = {
            method: 'GET',
            headers: {
                        'Content-Type': 'application/json', 
                        'data': JSON.stringify(formData), 
                        'access': props.access,
                        'id': props._id
                    }
        };
        console.log(formData)
       
        fetch(`/api/UpdateFamilyMember`, requestOptions)
        .then(response => response.json())
        .then(result => {
            setEditMode(false);
            console.log(result)
        })       
    }

    const handleDelete = e => {
        e.preventDefault();
        const formData = {
            "firstName":firstName,
            "lastName": lastName,
            "dob": dob,
            "birthPlace": birthPlace,
        };
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'id': props._id, 'access': props.access}
        };
        console.log(formData)
       
        fetch(`/api/DeleteFamilyMember`, requestOptions)
        .then(response => response.json())
        .then(result => {
            setEditMode(false);
            setDelete(true);
            console.log(result)
        })       
    }

    if(editMode) {
        return (
            <div className="entry">    
                <div className="avatar-holder">
                        <img src={Grandma} alt="Relative"></img>
                </div>
                <div className="name">
                <Row>
                    <Col sm="3">
                        <FormLabel column>First Name:</FormLabel>
                    </Col>                    
                    <Col sm="7">
                        <FormControl 
                            type="text" 
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm="3">
                        <FormLabel column>Last Name:</FormLabel>
                    </Col>                    
                    <Col sm="7">
                        <FormControl 
                            type="text" 
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}/>
                    </Col>
                </Row> 
                <Row>
                    <Col sm="3">
                        <FormLabel column>DOB:</FormLabel>
                    </Col>                    
                    <Col sm="7">
                        <FormControl 
                            type="text" 
                            value={dob}
                            onChange={e => setDob(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm="3">
                        <FormLabel column>Birth Place:</FormLabel>
                    </Col>                   
                    <Col sm="7">
                        <FormControl 
                            type="text" 
                            value={birthPlace}
                            onChange={e => setBirthPlace(e.target.value)}/>
                    </Col>
                </Row>
                
                </div> 
                <Row>
                <Button className="col btn btn-success" onClick={e => handleSubmit(e)}>Update</Button>
                <Button className="col btn btn-danger" onClick={e => handleDelete(e)}>Delete</Button>
                <Button className="col btn btn-primary" onClick={e => setEditMode(false)}>Cancel</Button>
                </Row>                                                  
                                            
            </div>
        )
    }
    else if (deleteItem) {
        return null;
    }
    else {
        return (  
            <div key={props._id} className="entry">    
                <div className="avatar-holder">
                    <img src={Grandma} alt="Relative"></img>
                </div>
                <div className="name">
                    <p>{firstName + " " + lastName}</p>
                </div>  
                <div className="info">
                    <p>DOB: {dob}</p>
                    <p>Birth Place: {birthPlace}</p>
                    <p>Relationship: {props.relationship}</p>
                </div>         
                <div className="btn-row">                                     
                    <Button className="col btn btn-primary" onClick={e => setEditMode(true)}>Edit</Button>
                </div>                             
            </div>
            
        );} 
}

function EditFamily (props) {
    const { personId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [birthPlace, setBirthPlace] = useState("");
    const [data, setData] = useState("");
 
    
    useEffect(() => {   
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', "access": props.access},
        };
        const fetchData = () => {
        fetch(`/api/FindFamilyMember/${personId}`, requestOptions, {})
        .then((res) => {
            console.log(res.body);
            return res.json();
        })
        .then((response) => {
            
            setData(response);
            setIsLoading(false);
        })
        .catch((error) => console.log(error));
      }
      fetchData();
    }, [personId]);
  
    return (    
      <>
      {console.log("why")}
      {isLoading && (<p>Loading.</p>)}
      {!isLoading && (
          <>
          <div className="entry col-md-3">    
                <div className="ds-top"></div>
                <div className="avatar-holder">
                    <img src="https://www.flaticon.com/svg/vstatic/svg/3436/3436198.svg?token=exp=1617994947~hmac=16bf36c03e990a1e3dfbe89dcec81f96" alt="Albert Einstein"></img>
                </div>
                <div className="name-edit">
                    <p>{data.firstName + " " + data.lastName}</p>
                <div className="info-edit">
                <FormGroup as={Row}>
                    <FormLabel column>DOB:</FormLabel>
                        <Col md="12">
                            <FormControl 
                                type="text" 
                                value={(data.dob ? data.dob : "")}
                                onChange={e => setDob(e.target.value)}/>
                        </Col>
                </FormGroup>
                    <FormLabel column>Birth Place:</FormLabel>
                    <FormControl 
                    type="text" 
                    value={(data.birthPlace ? data.birthPlace : "")}
                    onChange={e => setBirthPlace(e.target.value)}/>
                    <p>{(data.relationship ? data.relationship : "")}</p>
                </div>
                    <h6 title="dob"><i className="fas fa-users"></i> <span className="dob">{(data.dob && (data.dob))}</span></h6>
                </div>                                                   
                <Link className="col btn btn-primary" to={`/addfamily`}>Go Back</Link>                            
            </div> 
          </>
      )}
      </>        
    )
}

class AddFamily extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            firstName: "",
            lastName: "",
            dob: "",
            city: "", 
            state: "", 
            country: "",
            relationship: "",
            side: "Other",
            description: "",
            familyMembers: "",
            isLoading: true,
            access: null,
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value})          
    }

    async handleSubmit(event) {
        event.preventDefault();
        var accessToken = await this.props.getAccessToken(config.scopes);
        this.setState({
            access: accessToken
        })

        var filledInData = {};
        Object.keys(this.state).map((key) => {
            if (this.state[key] !== "" && (key !== "familyMembers") && (key!== "isLoading")) {
                filledInData[key] = this.state[key];
            }
        });
        console.log(filledInData);
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filledInData)
        };
        this.setState({isLoading: true});
        fetch('/api/HttpTrigger1', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState(prevState => ({
                    familyMembers: [...prevState.familyMembers, filledInData]
                  }))
                this.setState({isLoading: false});
            },
            (error) => {
                console.log(error)
            })
            
    }

    async componentDidMount() {
        if (this.props.user)
        {
          try {
            // Get the user's access token
            var accessToken = await this.props.getAccessToken(config.scopes);
            this.setState({
                access: accessToken
            })

            const requestOptions = {
                method: 'GET',
                headers: {'Content-Type': 'application/json', 'access': this.state.access},
            };

            fetch(`/api/HttpTrigger6`, requestOptions, {})
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({
                    familyMembers: data,
                    isLoading: false
                });
                console.log(this.state.familyMembers);
                
            })
            .catch((error) => console.log(error));
                         
          }
          catch (err) {
            console.log(err)            
          }
        }
      }

    render() {
        let match=this.props.match;

        if(this.props.isAuthenticated) {
            return (
                <>
                <Route path={`${match.url}/:personId`} render={(props) => <EditFamily  access={this.state.access}{...props}/>}>                    
                </Route>
                <Route exact path={match.url}>
                <div className="container-fluid family-page">        
                <div className="row justify-content-center ">
                
                <div className="col-auto">
                <div className="family-nest">
                <Form onSubmit={this.handleSubmit}>
                <h3>Add Family Members</h3>
                <p className="lead">
                Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.
                </p>
                    <FormGroup row>
                        <Label for="first-name" md={4}>First Name:</Label>
                        <Col md={6}>
                            <Input type="text" name="firstName"
                            value={this.state.firstName || ""} 
                            onChange={this.handleChange}  
                            className="animated fadein"
                            />
                        </Col>                        
                    </FormGroup>
                    <FormGroup row>
                        <Label for="last-name" md={4}>Last Name:</Label>
                        <Col md={6}>
                            <Input type="text" name="lastName" 
                            value={this.state.lastName || ""} 
                            onChange={this.handleChange}  />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="dob" md={4}>Date of Birth:</Label>
                        <Col md={6}>
                            <Input type="text" name="dob"
                            value={this.state.dob || ""} onChange={this.handleChange}  />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="birth-place" md={4}>Place of Birth:</Label>
                        <Col md={4}>
                            <Input type="text" name="city" 
                            value={this.state.city || ""} 
                            onChange={this.handleChange}  
                            placeholder="City"/>
                        </Col>
                        <Col md={2}>
                            <Input type="text" name="state" 
                            value={this.state.state || ""} 
                            onChange={this.handleChange}  
                            placeholder="State"/>
                        </Col>                    
                    </FormGroup>
                    <FormGroup row className="">
                        <Col md={6} className="col-md-6 offset-md-4">
                            <Input type="text" name="country" 
                            value={this.state.country || ""} 
                            onChange={this.handleChange}  
                            placeholder="Country"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="">
                    <Label md={4}>Relationship to you:</Label>
                        <Col md={6} >
                            <Input type="text" name="relationship" 
                            value={this.state.relationship || ""} 
                            onChange={this.handleChange}  
                            placeholder=""/>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="">
                    <Label md={4}>Side of the Family:</Label>
                        <Col md={6} >
                        <select 
                            name="side"
                            value={this.state.side}
                            onChange={this.handleChange}
                            placeholder="">
                            <option value="Other">Other</option>
                            <option value="Mother">Mother's</option>
                            <option value="Father">Father's</option>
                            
                            
                        </select>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="description" md={3}>Description</Label>
                        <Col md={8} className="col-md-6 offset-md-4">
                            <FormControl name="description" as="textarea" rows={3} 
                            value={this.state.description || ""} 
                            onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Col md={10}>
                    
                    </Col> 
                    </FormGroup>   
                          
                </Form>
                <Button
                    onClick={this.handleSubmit}>
                    Add Family Member
                </Button>
                </div></div>
                
                </div>
                <div className="row spacing"></div>
                <div className="family-section">
                    <div className="row justify-content-center ">
                        <div className="divider">
                            <h1 className="text-center">Your Family</h1>
                        </div>
                    </div>
                    
                    <div className="row member-container">
                {this.state.familyMembers && (this.state.familyMembers.map(props => (
                    <FamilyMember key={props._id} access={this.state.access} {...props} />
                    
                )))}
                </div></div></div>
                </Route>               
                </>
            )
        }
        else {
            return null;
        }
    }

}
export default withAuthProvider(AddFamily);