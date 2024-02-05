import { useState } from '@wordpress/element';
import { Card, CardHeader, CardBody, CardFooter, Button, Flex, Modal } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';
import { useMessage } from '../redux/MessageContext';

const CardComponent = () => {
  const navigate = useNavigate();
  const { deleteEntityRecord } = useDispatch('core');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [todoIdToDelete, setTodoIdToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const {showMessage} = useMessage();

  const { records, hasResolved } = useEntityRecords('postType', 'post');

  const handleDeleteClick = (id) => {
    setTodoIdToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (todoIdToDelete !== null) {
        await deleteEntityRecord('postType', 'post', todoIdToDelete);
        setShowConfirmModal(false);
        setTodoIdToDelete(null);
        showMessage('Post deleted successfully');
      }
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  const handleUpdateClick = (id) => {
    navigate(`/update/${id}`);
  };

  return (
    <>
      <Flex style={{ flexDirection: 'row', gap: '20px', justifyContent: 'flex-start' }}>
        {hasResolved ? (
          records.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                {post?.title?.rendered}
              </CardHeader>
              <CardBody>
                <RichText.Content value={post?.content?.rendered} />
              </CardBody>
              <CardFooter>
                <Button variant="primary" onClick={() => handleDeleteClick(post.id)}>Delete</Button>
                <Button variant="primary" onClick={() => handleUpdateClick(post.id)}>Update</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>Loading..</p>
        )}
      </Flex>
      {showConfirmModal && (
        <Modal
          title="Are You Sure?"
          onRequestClose={() => setShowConfirmModal(false)}
        >
          <h1>Are You Sure You Want to Delete This Item?</h1>
          {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
          <Flex style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="primary" onClick={() => setShowConfirmModal(false)}>No</Button>
            <Button variant="primary" onClick={confirmDelete}>Yes</Button>
          </Flex>
        </Modal>
      )}
    </>
  );
};

export default CardComponent;