import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, __experimentalHeading as Heading, TextareaControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useMessage } from '../redux/MessageContext';

const Add = ({ setTodos }) => {
    const navigate = useNavigate();
    const [inputModel, setInputModel] = useState({ title: '', content: '' });
    const [inputError, setInputError] = useState('');
    const [error, setError] = useState(null);
    const {showMessage} = useMessage();

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!inputModel.title || !inputModel.content) {
            setInputError('Please fill out all fields');
            return;
        }

        try {
            const newTodo = {
                title: inputModel.title,
                content: inputModel.content,
                status: 'publish',
            };

            const response = await apiFetch({
                path: '/wp/v2/posts',
                method: 'POST',
                data: newTodo,
            });

            if (response && response.id) {
                setTodos(prevTodos => [...prevTodos, response]);
                setInputModel({ title: '', content: '' });
                showMessage('Todo added successfully');
            } else {
                setError('Failed to add todo');
            }
        } catch (error) {
            setError('Failed to add todo');
            console.error('Error adding todo:', error);
        }
    };

    return (
        <>
            {/* {dataAdded && <NoticeMessage />} */}
            <Card style={{ width: '50%' }}>
                <CardHeader>
                    <Heading level={4}>Add Todo</Heading>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleAdd}>
                        <div className='card-design'>
                            <input
                                type="text"
                                placeholder="Title"
                                value={inputModel.title}
                                onChange={(e) => setInputModel({ ...inputModel, title: e.target.value })}
                            />
                            <TextareaControl
                                placeholder="Content"
                                value={inputModel.content}
                                onChange={(value) => setInputModel({ ...inputModel, content: value })}
                            />
                            {inputError && <p className='error'>{inputError}</p>}
                        </div>
                        <Button variant="primary" type="submit">Add</Button>
                        <Button variant="primary" onClick={() => navigate('/')}>Back</Button>
                    </form>
                </CardBody>
            </Card>
            {error && <p>Error adding todo: {error}</p>}
        </>
    );
};

export default Add;