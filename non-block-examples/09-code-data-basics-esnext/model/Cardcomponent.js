import { useState, useEffect } from '@wordpress/element';
import { useNavigate } from 'react-router-dom';
import { Card, Button, CardHeader, CardFooter, CardBody, Flex, Modal, Notice } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { useMessage } from '../redux/MessageContext';

const Cardcomponent = ({ todos = [], setTodos }) => {
  const navigate = useNavigate();

  const [deletedTodoTitle, setDeletedTodoTitle] = useState('');
  const [showConfirmPopover, setShowConfirmPopover] = useState(false);
  const [todoIdToDelete, setTodoIdToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [dataDeleted, setDataDeleted] = useState(false);
  const {showMessage} = useMessage();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await apiFetch({
        path: '/wp/v2/posts',
        method: 'GET',
      });
      setTodos(data);
    } catch (error) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', error);
    }
  };

  const handleDelete = (id, title) => {
    setTodoIdToDelete(id);
    setDeletedTodoTitle(title);
    setShowConfirmPopover(true);
    showMessage('Todos deleted successfully')
  };

  const confirmDelete = async () => {
    try {
      await apiFetch({
        path: `/wp/v2/posts/${todoIdToDelete}`,
        method: 'DELETE',
      });
      const updatedTodos = todos.filter(todo => todo.id !== todoIdToDelete);
      setTodos(updatedTodos);
      setShowConfirmPopover(false);
      setDeletedTodoTitle('');
      setDataDeleted(true)
    } catch (error) {
      setError('Failed to delete todo');
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  const handleCloseConfirmPopover = () => {
    setShowConfirmPopover(false);
    setTodoIdToDelete(null);
  };

  return (
    <>
      <Flex style={{ justifyContent: 'flex-start' }}>
        {todos.map(todo => (
          <Card key={todo.id}>
            <CardHeader>
              <RichText.Content tagName="h3" value={todo.title.rendered} />
            </CardHeader>
            <CardBody>
              <RichText.Content tagName="p" value={todo.content.rendered} />
            </CardBody>
            <CardFooter>
              <Button variant="primary" onClick={() => handleDelete(todo.id)}>Delete</Button>
              <Button variant="primary" onClick={() => handleUpdate(todo.id)}>Update</Button>
            </CardFooter>
          </Card>
        ))}
      </Flex>
      {showConfirmPopover && (
        <Modal
          position="bottom center"
          onRequestClose={handleCloseConfirmPopover}
          focusOnMount={false}
        >
          <h1>Are You Sure??</h1>
          <Flex style={{ width: '500px' }}>
            <div style={{ padding: '10px' }}>Are you sure you want to delete the todo "{deletedTodoTitle}"?</div>
            <Button variant="primary" onClick={confirmDelete}>Yes</Button>
            <Button variant="primary" onClick={handleCloseConfirmPopover}>No</Button>
          </Flex>
        </Modal>
      )}
      {error && <p>Error: {error}</p>}
    </>
  );
};

export default Cardcomponent;