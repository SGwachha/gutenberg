import { createReduxStore, register } from "@wordpress/data";

const DEFAULT_STATE = {
    messages: [],
};

const store = createReduxStore('todoMessage', {
    reducer(state = DEFAULT_STATE, action) {
        switch (action.type) {
            case 'ADD_MESSAGE':
                return {
                    ...state,
                    messages: [...state.messages, action.payload],
                };
            default:
                return state;
        }
    },
    actions: {
        setMessage(message) {
            return {
                type: 'ADD_MESSAGE',
                payload: message,
            }
        }
    },
    selectors: {
        getMessages(state) {
            return state.messages;
        },
    },
});

register(store);

export default store;