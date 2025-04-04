import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import AuthForm from './AuthForm';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthContext, AuthProvider } from './components/AuthContext';

// Import pages
import Events from './pages/event/Events';
import EventOperations from './pages/event/EventOperations';
import SendMail from './pages/mail/SendMail';
import MailTemplates from './pages/mail/MailTemplates';
import Senders from './pages/sender/Senders';
import Receivers from './pages/receiver/Receivers';
import ErrorPage from './pages/error/ErrorPage';
import About from './components/About';
import Iletisim from './components/iletisim';

// Define ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={
              <AuthContext.Consumer>
                {({ isAuthenticated }) => 
                  isAuthenticated ? <Navigate to="/events" /> : <div className="landing-page"></div>
                }
              </AuthContext.Consumer>
            } />
           
              
               
                  
                
              
         
            
            {/* Protected routes */}
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/create-event" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId" element={
              <ProtectedRoute>
                <EventOperations />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/templates" element={
              <ProtectedRoute>
                <MailTemplates />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/senders" element={
              <ProtectedRoute>
                <Senders />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/receivers" element={
              <ProtectedRoute>
                <Receivers />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/send-mail" element={
              <ProtectedRoute>
                <SendMail />
              </ProtectedRoute>
            } />
            
            {/* Public routes */}
            <Route path="/about" element={<About />} />
            <Route path="/iletisim" element={<Iletisim />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;