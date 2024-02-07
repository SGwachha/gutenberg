import { useDispatch } from "@wordpress/data";
import { useCallback, useState } from "@wordpress/element";
import { TextareaControl, TextControl, Button, DateTimePicker } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { useMessage } from '../redux/MessageContext';

function EntityRecord() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState({event_location: "", event_date: ""});
    const dispatch = useDispatch();
    const { showMessage } = useMessage();

    const handleLocationChange = (eventlocation) => {
        setMeta(prevMeta => ({
            ...prevMeta,
            event_location: eventlocation

        }));
    }

    const handleDateChage = (eventdate) => {
        setMeta(prevMeta => ({
            ...prevMeta,
            event_date: eventdate
        }))
    }

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
                    meta: meta,
                },
            );
            setTitle('');
            setContent('');
            setMeta({ event_location: '', event_date: '' });
            showMessage(__('Post added successfully'));
            navigate('/update/:id');

        } catch (err) {
            console.error('Error adding Post:', err);
        }
    }, [title, content, meta, dispatch, navigate]);

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
                <TextControl
                    label={__('Address')}
                    value={meta.event_location}
                    onChange={(value) => handleLocationChange(value)}
                />
                <DateTimePicker
                    currentDate={meta.event_date}
                    onChange={(value) => handleDateChage(value)}
                    is12Hour={true}
                />
            </div>
            <Button isPrimary type="submit">{__('Add')}</Button>
            <Button isPrimary onClick={() => navigate('/')} >{__('Back')}</Button>
        </form>
    );
}

export default EntityRecord;