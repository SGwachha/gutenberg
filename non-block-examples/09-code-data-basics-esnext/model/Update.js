import React, { useState, useEffect } from '@wordpress/element';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    CardFooter,
    __experimentalText as Text,
    __experimentalHeading as Heading,
    TextareaControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useMessage } from '../redux/MessageContext';

const Update = ({ setTodos }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [inputModel, setInputModel] = useState({ title: '', content: '' });
    const [inputError, setInputError] = useState('');
    const [error, setError] = useState(null);
    const {showMessage} = useMessage();


    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const response = await apiFetch({ path: `/wp/v2/posts/${id}` });
                setInputModel({ title: response.title.rendered, content: response.content.rendered });
            } catch (error) {
                setError('Error fetching todo: ' + error.message);
            }
        };

        fetchTodo();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputModel(prevModel => ({
            ...prevModel,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!inputModel.title || !inputModel.content) {
            setInputError('Please fill out all fields');
            return;
        }

        try {
            const updatedTodo = {
                title: inputModel.title,
                content: inputModel.content,
                status: 'publish',
            };

            await apiFetch({
                path: `/wp/v2/posts/${id}`,
                method: 'PUT',
                data: updatedTodo,
            });

            setTodos(prevTodos => {
                const updatedTodos = prevTodos.map(todo => {
                    if (todo.id === id) {
                        return { ...todo, ...updatedTodo };
                    }
                    return todo;
                });
                return updatedTodos;
            });

            showMessage('Todo updated successfully');

        } catch (error) {
            setError('Error updating todo: ' + error.message);
        }
    };

    return (
        <>
            <Card style={{ width: '50%' }}>
                <CardHeader>
                    <Heading level={4}>Update To-do</Heading>
                </CardHeader>
                <CardBody>
                    <Text>
                        <form onSubmit={handleUpdate}>
                            <div className='card-design'>
                                <input
                                    type='text'
                                    name='title'
                                    placeholder='Title'
                                    value={inputModel.title}
                                    onChange={handleInputChange}
                                />
                                <TextareaControl
                                    placeholder='content'
                                    value={inputModel?.content}
                                    onChange={(value) => setInputModel(prevState => ({ ...prevState, content: value }))}
                                />
                                {inputError && <p className='error'>{inputError}</p>}
                            </div>
                            <Button variant="primary" type='submit'>Update</Button>
                            <Button variant="primary" onClick={() => { navigate('/') }}>Back</Button>
                        </form>
                    </Text>
                </CardBody>
            </Card>
            {error && <p>Error: {error}</p>}
        </>
    );
};

export default Update;