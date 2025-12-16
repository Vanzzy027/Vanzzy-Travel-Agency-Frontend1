import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
//import { PersistGate } from 'redux-persist/lib/integration/react.js';
import { Toaster } from 'sonner';
import App from './App';
import { store, persistor } from './store/store';
import './index.css';

// ADD THIS BLOCK: Disable logs in production environment
if (import.meta.env) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  // Keep console.error and console.warn for critical troubleshooting
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster 
          richColors 
          position="top-right"
          theme="light"
          expand={true}
          duration={4000}
        />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { Toaster } from 'sonner';
// import App from './App';
// import { store, persistor } from './store/store';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <App />
//         <Toaster 
//           richColors 
//           position="top-right"
//           theme="light"
//           expand={true}
//           duration={4000}
//         />
//       </PersistGate>
//     </Provider>
//   </React.StrictMode>
// );





