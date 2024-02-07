import { useState, useEffect } from '@wordpress/element';
import { Card, CardHeader, CardBody, CardFooter, Button, Flex, Modal } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';
import { useMessage } from '../redux/MessageContext';
import apiFetch from "@wordpress/api-fetch";
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';

const CardComponent = () => {
  const { showMessage } = useMessage();
  const { deleteEntityRecord } = useDispatch('core');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [todoIdToDelete, setTodoIdToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [records, setRecords] = useState([]);
  const perPage = 3;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch({ path: `/wp/v2/posts?per_page=${perPage}&page=${currentPage}`, parse: false });
        const totalCount = res.headers.get('X-WP-Total');
        const totalPagesCount = res.headers.get('X-WP-TotalPages');
        setTotalPages(parseInt(totalPagesCount, 10));
        setRecords(await res.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [currentPage]);

  const formatDateTime = (dateTimeString) => {
    const formattedDateTime = moment(dateTimeString).format('MMMM Do YYYY, h:mm:ss a');
    return formattedDateTime;
  };


  const updatePageInUrl = (page) => {
    setSearchParams({ page });
  };

  const handlePrevPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    updatePageInUrl(newPage);
  };

  const handleNextPage = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    updatePageInUrl(newPage);
  };

  const handlePageClick = (page) => {
    updatePageInUrl(page);
  };

  const handleDeleteClick = (id) => {
    setTodoIdToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEntityRecord('postType', 'post', todoIdToDelete);
      setShowConfirmModal(false);
      setTodoIdToDelete(null);
      showMessage('Post deleted successfully');
      fetchData();
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  const handleUpdateClick = (id) => {
    navigate(`/update/${id}`);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <Button key={i} variant="primary" onClick={() => handlePageClick(i)}>{i}</Button>
      );
    }
    return buttons;
  };

  return (
    <>
      <Flex style={{ flexDirection: 'row', gap: '20px', justifyContent: 'flex-start' }}>
        {records.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              {post.title.rendered}
            </CardHeader>
            <CardBody>
              <RichText.Content value={post.content.rendered} />
            </CardBody>
            <CardBody>
              <RichText.Content value={post.meta.event_location} />
            </CardBody>
            <CardBody>
              <RichText.Content value={formatDateTime(post.meta.event_data)} />
            </CardBody>
            <CardFooter>
              <Button variant="primary" onClick={() => handleDeleteClick(post.id)}>Delete</Button>
              <Button variant="primary" onClick={() => handleUpdateClick(post.id)}>Update</Button>
            </CardFooter>
          </Card>
        ))}
      </Flex>
      <div>
        <Button variant="primary" onClick={handlePrevPage} disabled={currentPage <= 1}>Previous</Button>
        {renderPaginationButtons()}
        <Button variant="primary" onClick={handleNextPage} disabled={currentPage >= totalPages}>Next</Button>
      </div>
      {showConfirmModal && (
        <Modal title="Are You Sure?" onRequestClose={() => setShowConfirmModal(false)}>
          <h1>Are You Sure You Want to Delete This Item?</h1>
          {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
          <Button variant="primary" onClick={() => setShowConfirmModal(false)}>No</Button>
          <Button variant="primary" onClick={confirmDelete}>Yes</Button>
        </Modal>
      )}
    </>
  );
};

export default CardComponent;