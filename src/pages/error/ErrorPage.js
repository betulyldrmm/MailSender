import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <Container className="mt-5 text-center">
            <Alert variant="danger">
                <Alert.Heading>Oops! Something went wrong</Alert.Heading>
                <p>
                    Sorry, the page you're looking for doesn't exist.
                </p>
            </Alert>
            <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                className="me-2"
            >
                Go Home
            </Button>
            <Button 
                variant="secondary" 
                onClick={() => navigate(-1)}
            >
                Go Back
            </Button>
        </Container>
    );
};

export default ErrorPage; 