import { useState, useEffect } from '@wordpress/element';
import { useNavigate, useParams } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import {
    Card,
    CardHeader,
    CardBody,
    TextControl,
    DateTimePicker,
    Button,
    __experimentalText as Text,
    __experimentalHeading as Heading,
    TextareaControl,
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useEntityRecord } from '@wordpress/core-data';
import { useMessage } from '../redux/MessageContext';

const Update = () => {
    const coreStore = 'core'; // custom store
    const navigate = useNavigate();
    const { id } = useParams();
    const [inputModel, setInputModel] = useState({ title: '', content: '' });
    const [inputError, setInputError] = useState('');
    const [eventLocation, setEventLocation] = useState();
    const [eventDate, setEventDate] = useState(new Date());
    const { showMessage } = useMessage();
    const { saveEntityRecord } = useDispatch(coreStore);

    const { record, loading, error, meta } = useEntityRecord('postType', 'post', id);

    useEffect(() => {
        if (!loading && !error && record) {
            setInputModel({ title: record?.title?.rendered, content: record?.content?.rendered });
            setEventLocation(meta?.event_location || '');
            setEventDate(meta?.event_date ? new Date(meta?.event_date) : new Date());
        }
    }, [loading, error, record, meta]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!inputModel.title || !inputModel.content) {
            setInputError('Please fill out all fields');
            return;
        }

        try {
            const res = saveEntityRecord('postType', 'post', {
                id,
                title: inputModel.title,
                content: inputModel.content,
                meta: {
                    event_location: eventLocation,
                    event_date: eventDate,
                }
            });
            showMessage('Todo updated successfully');

        } catch (error) {
            console.error('Error updating Todo:', error);
            setInputError('Error updating Todo: ' + error.message);
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
                                <TextControl
                                    label={__('Title')}
                                    value={inputModel.title}
                                    onChange={(value) => { setInputModel(prevModel => ({ ...prevModel, title: value })) }}
                                />
                                <TextareaControl
                                    placeholder='Content'
                                    value={inputModel.content}
                                    onChange={(value) => {
                                        setInputModel(prevState => ({ ...prevState, content: value }))
                                    }}
                                />
                                <TextControl
                                    label={__('Address')}
                                    value={meta?.event_location}
                                    onChange={(value) => setEventLocation(value)}
                                />
                                <DateTimePicker
                                    currentDate={meta?.event_date}
                                    onChange={(value) => setEventDate(value)}
                                    is12Hour={true}
                                />
                            </div>
                            <Button variant="primary" type='submit'>Update</Button>
                            <Button variant="primary" onClick={() => navigate('/')}>Back</Button>
                        </form>
                    </Text>
                </CardBody>
            </Card>
            {error && <p>Error fetching record: {error.message}</p>}
        </>
    );
};

export default Update;