import './ThreadCreator.css'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const create = async(username, title, description) => {
    try{
        const data = await axios.post("http://localhost:4000/newthread", {
            title: title,
            description: description,
            username: username,
        })
        if(data.status===201){
            return data
        }
        if(data.status===400){
            return 1;
        }
        else{
            return null;
        }
    }catch(err){
        console.error('Error while creating topic:', err);
    }
}

export const ThreadCreator = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const username = sessionStorage.getItem('username') || 'Guest';
    const handleClick = async () => {
        if(!title){
            alert("enter title")
        }else{
        const res = await create(username, title, description);
        if(res === null) {
            console.log('Error while creating topic:', res)
        }
        else{
            console.log("Thread created successfully")
            navigate('/');
        }
    }
    }
    return(
        <>
            <div>Input title</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <div>Input description(optional)</div>
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={handleClick}>Create</button>
            <div  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                  onClick={() => navigate('/')}>return</div>
        </>
    );
}