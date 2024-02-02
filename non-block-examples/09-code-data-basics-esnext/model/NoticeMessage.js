// NoticeMessage component accepting a message prop
import { useNavigate } from 'react-router-dom';
import { Notice, Flex } from '@wordpress/components';
import { useMessage } from '../redux/MessageContext';

const NoticeMessage = ({ message }) => {
    const navigate = useNavigate();
    const { showMessage } = useMessage();

    const handleClose = () => {
        showMessage(null);
        navigate('/');
    };

    return (
        <Notice status="success" isDismissible onRemove={handleClose}>
            <Flex style={{ width: '500px' }}>
                <div style={{ padding: '10px' }}>{message}</div>
            </Flex>
        </Notice>
    );
};

export default NoticeMessage;