import { useState } from '@wordpress/element';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '../model/Home';
import Add from '../model/Add';
import Update from '../model/Update';
import Cardcomponent from '../model/Cardcomponent';
import { useMessage } from '../redux/MessageContext';
import NoticeMessage from '../model/NoticeMessage';

const Root = () => {
    const [todos, setTodos] = useState([]);
    const { message } = useMessage();

    return (
        <HashRouter>
            {message && <NoticeMessage message={message} />}
            <Routes>
                <Route path="/" element={<Home todos={todos} setTodos={setTodos} />} />
                <Route path="/add" element={<Add setTodos={setTodos} />} />
                <Route path="/update/:id" element={<Update todos={todos} setTodos={setTodos} />} />
                <Route path="/cardcomponent" element={<Cardcomponent />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </HashRouter>
    );
};

export default Root;