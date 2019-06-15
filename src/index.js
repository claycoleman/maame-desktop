import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';

import App from './App';
import { setupFirebase } from './components/Firebase';

ReactDOM.render(setupFirebase(<App />), document.getElementById('root'));

serviceWorker.unregister();
