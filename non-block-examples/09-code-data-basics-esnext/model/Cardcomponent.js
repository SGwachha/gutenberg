import { useState, useEffect } from '@wordpress/element';
import { Card, CardHeader, CardBody, CardFooter, Button, Flex, Modal } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';
import { useMessage } from '../redux/MessageContext';
import apiFetch from "@wordpress/api-fetch"

const CardComponent = () => {
  const { showMessage } = useMessage();
  const navigate = useNavigate();
  const { deleteEntityRecord } = useDispatch('core');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [todoIdToDelete, setTodoIdToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [postLength, setPostLength] = useState();
  const perPage = 3;

  const { records, hasResolved } = useEntityRecords('postType', 'post', { per_page: perPage, page: currentPage });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch({
          path: '/wp/v2/posts',
          method: 'GET',
          parse: false,
        })
          .then((res) => {
            setPostLength(res.headers.get('X-WP-Total'))
            setTotalPages(res.headers.get('X-WP-Totalpages'))
          })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage]);

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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(postLength / perPage);
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <Flex style={{ flexDirection: 'row', gap: '20px', justifyContent: 'flex-start' }}>
        {records && records.map((post) => (
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
        ))}
      </Flex>
      <div>
        <Button variant="primary" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
        <span>{`Page ${currentPage}`}</span>
        <Button
          variant="primary"
          onClick={handleNextPage}
          disabled={!hasResolved || currentPage > totalPages}
        >
          Next
        </Button>
      </div>
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