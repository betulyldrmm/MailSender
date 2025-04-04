// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import EventsList from './components/EventsList';
import CreateEvent from './components/CreateEvent';
import EventDetails from './components/EventDetails';
import EditEvent from './components/EditEvent';

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<EventsList />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/edit" element={<EditEvent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;