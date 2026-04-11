import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ADD THESE TWO LINES:
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This makes dropdowns and modals work!

// (Your other imports like index.css can stay here)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)