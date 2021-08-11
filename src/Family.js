import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Select from 'react-select';
import './App.css';
import './FamilyTree.css';
import { config } from './Config';
import { Button, FormControl, Form, FormLabel, FormGroup, } from 'react-bootstrap';
import grandma from './grandmother.svg';
import woman from './woman.png';
import man from './man.png';
import x from './x.png';
import Search from './Search';

export default function Family(props) {
    const [family, setFamily] = useState({});
    const [showPopup, setPopup] = useState(false);
    const [showEdit, setEdit] = useState(false);
    const [showAddRelativeBox, setShowAddRelativeBox] = useState(false);
    const [showAddSibling, setAddSibling] = useState(false);
    const [showAddSpouse, setAddSpouse] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [selectedNode, setSelectedNode] = useState("");
    const [access, setAccess] = useState("");

    useEffect(() => {
        fetchInfo();
    }, []);
    
    
   
    const fetchInfo = async () => {
        var accessToken = await props.getAccessToken(config.scopes);
        setAccess(accessToken);
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'access': accessToken},
        };
        const data = await fetch(
            '/api/GetFamily', requestOptions, {}
        );

        const items = await data.json();
        console.log(items["family"]);
        setFamily(items["family"]); 
    }

    const NewNode = (props) => {
        let dd = [];
        Object.keys(family).forEach((k) => {
            if(k.includes(props.id)) {
                dd.push(
                    <div className={props.class + " node"} id={k} key={k} onClick={e => nodeClicked(e, e.currentTarget.id)}>
                        <img src={family[k].sex === "Female" ? woman : man} />
                        <p>{family[k] !== undefined && family[k].firstName}</p> 
                    </div>
                );
            }
        })
        return dd;
    }
    
    const GenerateFamilyTree = () => {
        if (Object.keys(family).length > 0) {
            return (
                <>
                {}
                <div className="row2 grandparents">
                    <div className="paternal">
                    {family['p2-d'] !== undefined ? 
                            <NewNode id={"p2-d"} class={"grandpa"}/> : 
                            <div className="grandpa node" id="p2-d" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                                <img src={man} />
                                <p>Grandpa</p> 
                            </div> 
                        }
                        {family['p2-m'] !== undefined ? 
                            <NewNode id={"p2-m"} class={"grandma"}/> : 
                            <div className="grandma node" id="p2-m" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                                <img src={woman} />
                                <p>Grandma</p> 
                            </div>
                        }
                    </div>
                    <div className="maternal">
                        {family['m2-d'] !== undefined ? 
                            <NewNode id={"m2-d"} class={"grandpa"}/> : 
                            <div className="grandpa node" id="m2-d" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                                <img src={man} />
                                <p>Grandpa</p> 
                            </div> 
                        }
                        {family['m2-m'] !== undefined ? 
                            <NewNode id={"m2-m"} class={"grandma"}/> : 
                            <div className="grandma node" id="m2-m" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                                <img src={woman} />
                                <p>Grandma</p> 
                            </div>
                        }
                    </div>
                </div>
                <div className="row1 parents">
                    <div className="paternal">
                    {family['p1-d'] !== undefined ? 
                        <NewNode id={"p1"} class={"dad"}/> : 
                        <div className="p1-d node" id="p1-d" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                            <img src={man} />
                            <p>Add Father</p> 
                        </div>}
                                   
                    </div>
                    <div className="maternal">
                        {family['m1-m'] !== undefined ? 
                        <NewNode id={"m1"} class={"mom"}/> : 
                        <div className="m1-m node" id="m1-m" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                            <img src={woman} />
                            <p>Add Mother</p> 
                        </div> }
                    </div>
                </div>
                <div className="row0 me">
                    {family['r0'] !== undefined ? 
                        <NewNode id={"r0"} class={"me"}/> : 
                        <div className="me node" id="r0" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                            <img src={man} />
                            <p>Me</p> 
                        </div> }                   
                </div>
            </>
            )
        }
        else {
            return (
            <>
                <div className="row2 grandparents">
                    <div className="paternal">
                        <div className="grandpa node" id="p2-d" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                            <img src={man} />
                            <p>Add Grandpa</p>
                        </div>
                        <div className="grandma node" id="p2-m" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                            <img src={woman} />
                            <p>Add Grandpa</p>
                        </div>
                    </div>
                    <div className="maternal">
                        <div className="grandpa node" id="m2-d" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                            <img src={man} />
                            <p>Add Grandpa</p>
                        </div>
                        <div className="grandma node" id="m2-m" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                            <img src={woman} />
                            <p>Add Grandma</p> 
                        </div>
                    </div>
                </div>
                <div className="row1 parents">
                    <div className="paternal">
                        <div className="dad node" id="p1-d" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                            <img src={man} />
                            <p>Add Father</p> 
                        </div>           
                    </div>
                    <div className="maternal">
                        <div className="mom node" id="m1-m" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                            <img src={woman} />
                            <p>Add Mother</p> 
                        </div> 
                    </div>
                </div>
                <div className="row0 me">
                    <div className="node" id="r0" onClick={e => nodeClicked(e, e.currentTarget.id)}>
                        <img src={man} />
                        <p>Me</p>
                    </div>
                </div>
            </>
            
            )
        }
    }


    function EditFamilyMember(props) {              
        const [editMode, setEditMode] = useState(false);
        const [deleteItem, setDelete] = useState(false);
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");
        const [sex, setSex] = useState('');
        const [dob, setDob] = useState("");
        const [birthPlace, setBirthPlace] = useState("");
        const [parents, setParents] = useState((family[selectedNode] !== undefined && family[selectedNode].parents !== undefined) ?
        family[selectedNode].parents : []);    
        const [potentialParents, setPotentialParents] = useState([]);        
        const [showParentsCheckbox, setParentsCheckbox] = useState(false);
        
        useEffect(() => {
            fetchItems();
        }, []);

        useEffect(() => {
            var side = selectedNode.substring(0,1);
            var generation = parseInt(selectedNode.substring(1,2)) + 1;
            var dad = side + generation + "-d";
            var mom = side + generation + "-m";

            if (side === 'r') {
                mom = "m1-m";
                dad = "p1-d"
            }
            var showAddParents = family[selectedNode] !== undefined && (family[mom] !== undefined || family[dad] !== undefined);
            if (showAddParents && side !== 'r') {          
                Object.keys(family).forEach(key => {
                    if (key.includes(side + generation)) {
                        setPotentialParents(oldArry => [...oldArry, { value: key, label: family[key].firstName}]);
                    }
                })
                console.log(potentialParents)
                setParentsCheckbox(true);
            }
            else if (showAddParents && side === 'r')  {
                setPotentialParents([
                    { value: mom, label: (family[mom] !== undefined ? family[mom].firstName : "")},
                    { value: dad, label: (family[dad] !== undefined ? family[dad].firstName : "")}
                ])
                setParentsCheckbox(true);
            }
        }, [])

        const fetchItems = async () => {
            const requestOptions = {
                method: 'GET',
                headers: {'Content-Type': 'application/json', "access": access, "role": selectedNode},
            };

            fetch(`/api/GetFamilyMember`, requestOptions, {})
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                if (JSON.stringify(response) !== '{}') {
                    setFirstName(response.firstName)
                    setLastName(response.lastName)
                    setSex(response.sex);
                    console.log("response " + response)
                    if (response.parents !== undefined) {
                        setParents(response.parents);
                        console.log("ds")
                    }                    
                }
            })
            .catch((error) => console.log(error));
                   
                
            
        }

        const handleSubmit = e => {
            e.preventDefault();               
            const personInfo = {
                "firstName":firstName,
                "lastName": lastName,
                "sex": sex,
                "dob": dob,
                "birthPlace": birthPlace,
            };
            if (parents.length > 0) {
                personInfo["parents"] = parents;
            }
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'access': access, 
                    'role': selectedNode
                },
                body: JSON.stringify(personInfo)
            };
            
            fetch('/api/UpdateFamilyMember2', requestOptions)
            .then((response) => {  
                console.log("done")
                setFamily(prevState => ({...prevState, [selectedNode]: personInfo}))
            },
            (error) => {
                console.log(error)
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
        
        return (
            <div className="edit-popup">
            <div className="center-edit">
            <div className="edit-form">
            <form>
            <>
            <div className="edit-options">
                    <Button className="btn btn-primary" onClick={e => handleSubmit(e)}>Update</Button>
                    <Button className="btn btn-primary" onClick={e => handleDelete(e)}>Delete</Button>
                    <Button className="btn btn-primary" onClick={e => {setEditMode(false); setEdit(false)}}>Close</Button>  
                </div>
                <FormLabel >First Name:</FormLabel>                  
                <FormControl 
                    type="text" 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}/></>
                <FormLabel >Last Name:</FormLabel>          
                <FormControl 
                    type="text" 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}/>
                <FormLabel >DOB:</FormLabel>
                <FormControl 
                    type="text" 
                    value={dob}
                    onChange={e => setDob(e.target.value)}/>
                <div>
                    <FormLabel>Sex: </FormLabel>
                    <input type="radio" value="Male" name="gender" 
                        checked={sex === "Male"}
                        onChange={e => setSex(e.target.value)}
                    /> Male
                    <input type="radio" value="Female" name="gender" 
                        checked={sex === "Female"}
                        onChange={e => setSex(e.target.value)}
                    /> Female
                </div>
                
                <FormLabel >Birth Place:</FormLabel>
                <FormControl 
                    type="text" 
                    value={birthPlace}
                    onChange={e => setBirthPlace(e.target.value)}/>

                {showParentsCheckbox &&
                (<><FormLabel>Add Parent</FormLabel>
                <Select
                    defaultValue={parents}
                    isMulti
                    name="parents"
                    options={potentialParents}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={e => setParents(e)}
                />
                </>)}
                </form>    
                </div>
                
            </div>                                       
            </div>
        )
    

        
    }

    const PopupBox = () => {
        const [name, setName] = useState("");
        const [sex, setSex] = useState("");
        const [dob, setDob] = useState("");
        
        useEffect(() => {
            if (family[selectedNode] !== undefined) {
                setName(family[selectedNode].firstName);
                setSex(family[selectedNode].sex);
                setDob(family[selectedNode].dob);
            }
            else if (selectedNode.includes('-m')) {
                setSex("Female")
            }
        }, [])
        

           
        return (      
            <div className="popupBox row">
                <div className="col left">
                    <h4>{name}</h4>
                    <img src={sex === "Female" ? woman : man} />                   
                    

                </div>
                <div className="col">
                    <p><b>Birth:</b> {dob}</p>
                    <p><b>Status:</b> Living</p>
                </div>
                
                <div className="col button-column">
                        <Button className=" btn btn-primary">Profile</Button>
                        <Button className=" btn btn-primary"
                            onClick={()=> setShowSearch(true)}>Search</Button>
                        <Button className=" btn btn-primary"
                            onClick={()=> showEdit ? setEdit(false) : setEdit(true)}
                        >Edit</Button>
                        {family[selectedNode] !== undefined &&
                            <Button className=" btn btn-primary"
                                onClick={()=> setShowAddRelativeBox(!showAddRelativeBox)}
                                >Add Relative</Button>
                        }                       
                </div>  <img width="10" height="5" id="x" onClick={(e) => closePopup(e)} src={x} />    
            </div>
        
        )
        
    }

    const AddRelativeBox = () => {

        const addSibling = () => {
            setShowAddRelativeBox(!showAddRelativeBox);
            setAddSibling(!showAddSibling);         
        }

        const addSpouse = () => {
            setShowAddRelativeBox(!showAddRelativeBox);
            setAddSpouse(!showAddSpouse);         
        }

        return (
            <div className="add-relative-popup">
            <div className="center-edit">
            <div className="add-form">
                <h6>Add a family member to {family[selectedNode] !== undefined ? family[selectedNode].firstName : "No Data"}</h6>
                <p>Who would you like to add?</p>
                <Button onClick={()=> addSibling()}>Brother</Button>
                <Button onClick={()=> addSibling()}>Sister</Button>
                <Button onClick={()=> addSpouse()}>Spouse</Button>
                <Button>Child</Button>
                <Button onClick={()=> setShowAddRelativeBox(!showAddRelativeBox)}>Close</Button>
            </div></div></div>
        )
    }

    const AddNewSiblingBox = () => {

        var selectedParents = family[selectedNode].parents;
        console.log(selectedParents)
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");
        const [sex, setSex] = useState("");
        const [siblings, setSiblings] = useState(family[selectedNode].siblings !== undefined ?
                                                 family[selectedNode].siblings : [])
        //const [nodeParents, setNodeParents] = useState([selectedParents[0], selectedParents[1]])
        const [parentsOf, setParentsOf] = useState(true);
        
        

        const handleSubmit = e => {
            e.preventDefault();
            var relation_code = 'sib' + siblings.length;
            var updatedSiblings = siblings;
            updatedSiblings.push(selectedNode);
            const personInfo = {
                "firstName": firstName,
                "lastName": lastName,
                "sex": sex,
                "siblings": updatedSiblings
            };
            if(parentsOf) { 
                personInfo["parents"] = selectedParents;
            }
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'access': access,
                    'relation': "siblings",
                    'relation_code' : relation_code,
                    'person': selectedNode,
                },
                body: JSON.stringify(personInfo)
            };
            
            fetch('/api/AddNewPerson', requestOptions)
            .then((response) => {  
                console.log(response)
                setAddSibling(!showAddSibling);
                fetchInfo();
            },
            (error) => {
                console.log(error)
            })
        }

        return (
            <div className="add-relative-popup">
            <div className="center-edit">
            <div className="add-form">
                <h6>Add a new person</h6>
                <Form>
                <label>First and middle name</label>
                <FormControl 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}></FormControl>
                <label>Last name</label>
                <FormControl
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}></FormControl>
                <br></br>
                <FormLabel>Sex: </FormLabel>
                <input type="radio" value="Male" name="gender" 
                    checked={sex === "Male"}
                    onChange={e => setSex(e.target.value)}
                /> Male
                <input type="radio" value="Female" name="gender" 
                    checked={sex === "Female"}
                    onChange={e => setSex(e.target.value)}
                /> Female
                {selectedParents !== undefined && (
                    <Form.Group id="formGridCheckbox">
                        <Form.Check 
                        type="checkbox"
                        label={`Parents of ${selectedParents[0].label} and ${selectedParents[1] !== undefined ? selectedParents[1].label : ""}`}
                        checked={parentsOf}
                        onChange={() => setParentsOf(!parentsOf)} />
                    </Form.Group>

                )}
                
                <Button onClick={(e) => handleSubmit(e)}>Save</Button>
                </Form>
                <Button onClick={() => {setAddSibling(!showAddSibling)}}>Cancel</Button>
            </div></div></div>
        )
    }  
    
    const AddNewSpouseBox = () => {
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");

        const handleSubmit = e => {
            
            var relation_code = 'spo';
            const personInfo = {
                "firstName": firstName,
                "lastName": lastName,
                "spouses": [selectedNode]
            };
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'access': access,
                    'relation': "spouses",
                    'relation_code' : relation_code,
                    'person': selectedNode,
                },
                body: JSON.stringify(personInfo)
            };
            
            fetch('/api/AddNewPerson', requestOptions)
            .then((response) => {  
                console.log(response)
                
                fetchInfo();
                setAddSpouse(!showAddSpouse);
            },
            (error) => {
                console.log(error)
            })
        }

        return (
            <div className="add-relative-popup">
            <div className="center-edit">
            <div className="add-form">
                <h6>Add a new person</h6>
                <Form>
                <label>First and middle name</label>
                <FormControl 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}></FormControl>
                <label>Last name</label>
                <FormControl
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}></FormControl>
                <Button onClick={(e) => handleSubmit(e)}>Save</Button>
                </Form>
                <Button onClick={() => {setAddSpouse(!showAddSpouse)}}>Cancel</Button>
            </div></div></div>
        )
    } 

    const closePopup = (e) => {
        e.preventDefault();
        setPopup(!showPopup);
        setSelectedNode("");
    }

    const nodeClicked = (e, id) => {
        e.preventDefault();
        var prevSelected = selectedNode;
        setSelectedNode(id);
        if (selectedNode !== prevSelected) {
            setPopup(true);
        }
        else {
            setPopup(!showPopup);
        }
        
    }

    if (showSearch) {
        return (
            <>
            <Search 
            getAccessToken={props.getAccessToken} 
            isAuthenticated={props.isAuthenticated}
            data={family[selectedNode]}
            {...props} 
            />
            <div className="justify-content-center">
                        <Button 
                        className="letsgo"
                        onClick={() => {setShowSearch(false)}} 
                        >Go to Family</Button> 
                    </div></>
        )
    }
    
    else {
        return (
            <div className="family-tree">
                <GenerateFamilyTree />
                
                
                {showPopup && (<PopupBox/>)}
                {showEdit && (<EditFamilyMember />)}
                {showAddRelativeBox && <AddRelativeBox />}
                {showAddSibling && <AddNewSiblingBox />}
                {showAddSpouse && <AddNewSpouseBox />}
            </div>
        );
    }
    
}