import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useParams, Navigate } from 'react-router-dom';
import './CreateEvent';

const EventDashboard = () => {
    const [event, setEvent] = useState(null);
    const { eventId } = useParams();
    
    useEffect(() => {
        const storedEvent = localStorage.getItem('selectedEvent');
        if (storedEvent) {
            try {
                setEvent(JSON.parse(storedEvent));
            } catch (error) {
                console.error('Error parsing stored event');
            }
        }
    }, [eventId]);
    
    if (!event) {
        return <Navigate to="/" replace />;
    }
    
    const features = [
        {
            title: 'Mail Templates',
            description: 'Create and manage email templates',
            link: `/event/${eventId}/templates`,
            icon: '📝',
            color: 'primary',
            bgColor: 'rgba(0, 123, 255, 0.1)'
        },
        {
            title: 'Senders',
            description: 'Manage email senders',
            link: `/event/${eventId}/senders`,
            icon: '👤',
            color: 'success',
            bgColor: 'rgba(40, 167, 69, 0.1)'
        },
        {
            title: 'Receivers',
            description: 'Manage receivers and import from Excel',
            link: `/event/${eventId}/receivers`,
            icon: '👥',
            color: 'info',
            bgColor: 'rgba(122, 27, 100, 0.1)'
        },
        {
            title: 'Send Emails',
            description: 'Send emails using templates',
            link: `/event/${eventId}/send-mail`,
            icon: '✉️',
            color: 'warning',
            bgColor: 'rgba(255, 193, 7, 0.1)'
        }
    ];
    
    return (
        <Container fluid className="dashboard-container py-4">
            <Card className="mb-4 shadow-sm border-0 event-header">
                <Card.Body>
                    <h2 className="mb-2">{event.name}</h2>
                    <p className="text-muted mb-1">{event.description}</p>
                    <small className="text-muted">Date: {event.date}</small>
                </Card.Body>
            </Card>
            
            <Row className="g-4 features-row">
                {features.map((feature, index) => (
                   <Col xs={6} md={3} key={index}>
                        <Card
                            as={Link}
                            to={feature.link}
                            className="feature-card text-decoration-none border-0 shadow-sm h-100"
                            style={{
                                backgroundColor: feature.bgColor
                            }}
                        >
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3">
                                <div className="feature-icon mb-3">
                                    {feature.icon}
                                </div>
                                <Card.Title className={`text-${feature.color} text-center mb-2`}>
                                    {feature.title}
                                </Card.Title>
                                <Card.Text className="feature-description text-center mb-0 small">
                                    {feature.description}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default EventDashboard;