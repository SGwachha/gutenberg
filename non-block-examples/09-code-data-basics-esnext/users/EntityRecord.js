import { useDispatch } from "@wordpress/data";
import { useCallback, useState } from "@wordpress/element";
import { TextareaControl, TextControl, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { useMessage } from '../redux/MessageContext';

function EntityRecord() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showMessage } = useMessage();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            await dispatch('core').saveEntityRecord(
                'postType',
                'post',
                {
                    title: title,
                    content: content,
                    status: 'publish',
                },
            );
            setTitle('');
            setContent('');
            showMessage(__('Post added successfully'));
            navigate('/');

        } catch (err) {
            console.error('Error adding Post:', err);
        }
    }, [title, content, dispatch, navigate]);

    return (
        <form onSubmit={handleSubmit}>
            <div className='card-design'>
                <TextControl
                    label={__('Title')}
                    value={title}
                    onChange={setTitle}
                />
                <TextareaControl
                    label={__('Content')}
                    onChange={setContent}
                    value={content}
                    rows={8}
                />
            </div>
            <Button isPrimary type="submit">{__('Add')}</Button>
            <Button isPrimary onClick={() => navigate('/')} >{__('Back')}</Button>
        </form>
    );
}

export default EntityRecord;