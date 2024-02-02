import { render } from '@wordpress/element';
import Root from './root/Root';
import './redux/Store';
import { MessageProvider } from './redux/MessageContext';

function MyFirstApp() {

    return (
        <>
            <div style={{ maxWidth: '100%', width: '100%' }}>
                <MessageProvider>
                    <Root />
                </MessageProvider>,
            </div>
        </>
    );
}

window.addEventListener(
    'load',
    function () {
        render(
            <MyFirstApp />,
            document.querySelector('#my-first-gutenberg-app')
        );
    },
    false
);