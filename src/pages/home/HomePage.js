import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const features = [
        {
            title: 'Send Email',
            description: 'Send emails using templates to multiple receivers',
            link: '/send-mail',
            icon: '✉️'
        },
        {
            title: 'Manage Templates',
            description: 'Create and manage email templates',
            link: '/templates',
            icon: '📝'
        },
        {
            title: 'Manage Senders',
            description: 'Add and manage email senders',
            link: '/senders',
            icon: '👤'
        },
        {
            title: 'Manage Receivers',
            description: 'Manage email receivers and groups',
            link: '/receivers',
            icon: '👥'
        }
    ];

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Email Management System</h1>
            <Row>
                {features.map((feature, index) => (
                    <Col md={6} lg={3} key={index} className="mb-4">
                        <Card 
                            as={Link} 
                            to={feature.link}
                            className="h-100 text-decoration-none"
                        >
                            <Card.Body className="text-center">
                                <div className="display-4 mb-3">{feature.icon}</div>
                                <Card.Title>{feature.title}</Card.Title>
                                <Card.Text>{feature.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HomePage; 