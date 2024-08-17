import { createRoot } from 'react-dom/client';


import { Provider } from 'react-redux';

// project imports
import App from './App';
import store from './store/store';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// style + assets
import 'src/assets/scss/style.scss';
// import reportWebVitals from 'reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

// ==============================|| REACT DOM RENDER  ||============================== //

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// reportWebVitals();
