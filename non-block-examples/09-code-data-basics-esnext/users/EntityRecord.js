import { useState, useCallback } from "@wordpress/element";
import { TextareaControl, TextControl, Button, DateTimePicker } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { useDispatch } from '@wordpress/data';
import { useMessage } from '../redux/MessageContext';

function EntityRecord() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState({ event_location: "", event_date: "" });
    const dispatch = useDispatch();
    const { showMessage } = useMessage();

    const handleLocationChange = useCallback((eventLocation) => {
        setMeta(prevMeta => ({
            ...prevMeta,
            event_location: eventLocation
        }));
    }, []);

    const handleDateChange = useCallback((eventDate) => {
        setMeta(prevMeta => ({
            ...prevMeta,
            event_date: eventDate
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            const newTodoId = await dispatch('core').saveEntityRecord(
                'postType',
                'post',
                {
                    title: title,
                    content: content,
                    status: 'publish',
                    meta: meta,
                },
            );
            // remove this commit message
            const todoIdString = typeof newTodoId === 'object' ? newTodoId.id.toString() : newTodoId.toString();

            showMessage(__('Post added successfully'));
            navigate(`/update/${todoIdString}`);

        } catch (err) {
            console.error('Error adding Post:', err);
        }
    }, [title, content, meta, dispatch, navigate, showMessage]);

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
                    onChange={(value) => handleDateChange(value)}
                    is12Hour={true}
                />
            </div>
            <Button isPrimary type="submit">{__('Add')}</Button>
            <Button isPrimary onClick={() => navigate('/')} >{__('Back')}</Button>
        </form>
    );
}

export default EntityRecord;