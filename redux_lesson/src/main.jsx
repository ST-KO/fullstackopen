import { createRoot } from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './App.jsx'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

// import React from 'react';
// import ReactDom from 'react-dom/client';
// import { createStore } from 'redux';

// const counterReducer = (state = 0, action) => {
//   switch (action.type) {
//     case 'INCREMENT': 
//       return state + 1;
//     case 'DECREMENT':
//       return state - 1;
//     case 'ZERO':
//       return 0;
//     default: 
//       return state;
//   }
// }

// const store = createStore(counterReducer);

// const App = () => {
//   return (
//     <div>
//       <div>
//         {store.getState()}
//       </div>
//       <button onClick={e => store.dispatch({ type: 'INCREMENT' })}>
//         plus
//       </button>
//       <button onClick={e => store.dispatch({ type: 'DECREMENT' })}>
//         minus
//       </button>
//       <button onClick={e => store.dispatch({ type: 'ZERO' })}>
//         zero
//       </button>
//     </div>
//   )
// };

// const root = ReactDom.createRoot(document.getElementById('root'));

// const renderApp = () => {
//   root.render(<App />);
// }

// renderApp();
// store.subscribe(renderApp);