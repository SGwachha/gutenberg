import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@wordpress/components';
import CardComponent from './Cardcomponent';

const Home = ({ todos, setTodos }) => {
    const navigate = useNavigate();

    return (
        <>
            <h1>To-do List</h1>
            <>
                <Button variant="primary" onClick={() => { navigate('/add') }}>Add</Button>
                <CardComponent todos={todos} setTodos={setTodos} />
            </>
        </>
    );
};

export default Home;