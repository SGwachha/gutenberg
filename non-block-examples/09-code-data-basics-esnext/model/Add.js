import { Card, CardHeader, CardBody, __experimentalHeading as Heading } from '@wordpress/components';
import EntityRecord from '../users/EntityRecord';

const Add = () => {

    return (
        <>
            <Card style={{ width: '50%' }}>
                <CardHeader>
                    <Heading level={4}>Add Todo</Heading>
                </CardHeader>
                <CardBody>
                    <EntityRecord />
                </CardBody>
            </Card>
        </>
    );
};

export default Add;