import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link, useParams, Navigate } from 'react-router-dom';

const EventOperations = () => {
    const [event, setEvent] = useState(null);
    const [mailTemplates, setMailTemplates] = useState([]);
    const [senders, setSenders] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { eventId } = useParams();

    useEffect(() => {
        const storedEvent = localStorage.getItem('selectedEvent');
        if (storedEvent) {
            setEvent(JSON.parse(storedEvent));
            fetchEventData(JSON.parse(storedEvent).id);
        } else {
            setError('No event selected');
            setIsLoading(false);
        }
    }, [eventId]);

    const token = localStorage.getItem('token');
    const fetchEventData = async (eventId) => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch mail templates for this event
            const templatesResponse = await fetch(`http://localhost:8080/api/mailTemplates/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            const templatesText = await templatesResponse.text();
            const templatesData = templatesText === "" ? [] : JSON.parse(templatesText);
            setMailTemplates(templatesData);

            // Fetch senders for this event
            const sendersResponse = await fetch(`http://localhost:8080/api/senders/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            const sendersText = await sendersResponse.text();
            const sendersData = sendersText === "" ? [] : JSON.parse(sendersText);
            setSenders(sendersData);

            // Fetch receivers for this event
            const receiversResponse = await fetch(`http://localhost:8080/api/receivers/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            const receiversText = await receiversResponse.text();
            const receiversData = receiversText === "" ? [] : JSON.parse(receiversText);
            setReceivers(receiversData);

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching event data:', error);
            setError('Failed to load event data');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Container className="mt-4 text-center">
                <div>Loading...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!event) {
        return <Navigate to="/" replace />;
    }

    const operations = [
        {
            title: 'Mail Templates',
            description: 'Create and manage email templates',
            link: `/events/${eventId}/templates`,
            icon: '📝',
            color: 'primary',
            bgColor: 'rgba(0, 123, 255, 0.1)',
            count: mailTemplates.length,
            text: `${mailTemplates.length} templates available`
        },
        {
            title: 'Senders',
            description: 'Manage email senders',
            link: `/events/${eventId}/senders`,
            icon: '👤',
            color: 'success',
            bgColor: 'rgba(40, 167, 69, 0.1)',
            count: senders.length,
            text: `${senders.length} senders configured`
        },
        {
            title: 'Receivers',
            description: 'Manage receivers and import from Excel',
            link: `/events/${eventId}/receivers`,
            icon: '👥',
            color: 'info',
            bgColor: 'rgba(23, 162, 184, 0.1)',
            count: receivers.length,
            text: `${receivers.length} receivers registered`
        },
        {
            title: 'Send Emails',
            description: 'Send emails using templates to receivers',
            link: `/events/${eventId}/send-mail`,
            icon: '✉️',
            color: 'warning',
            bgColor: 'rgba(255, 193, 7, 0.1)',
            text: 'Send emails to receivers'
        }
    ];

    return (
        <Container fluid className="mt-4">
            <Card className="mb-4 bg-light">
                <Card.Body>
                    <h2 className="mb-2">{event.name}</h2>
                    <p className="text-muted mb-1">{event.description}</p>
                    <small className="text-muted">Date: {event.date}</small>
                </Card.Body>
            </Card>

            <Row>
                {operations.map((operation, index) => (
                   <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-4">
                        <Card 
                            as={Link} 
                            to={operation.link}
                            className="h-100 text-decoration-none hover-shadow operation-card"
                            style={{ 
                                backgroundColor: operation.bgColor,
                                cursor: 'pointer'
                            }}
                        >
                            <Card.Body className="text-center">
                                <div className="operation-icon mb-3">
                                    {operation.icon}
                                </div>
                                <Card.Title className={`text-${operation.color}`}>
                                    {operation.title}
                                </Card.Title>
                                <Card.Text>
                                    {operation.description}
                                </Card.Text>
                                {operation.count !== undefined && (
                                    <div className={`mt-3 text-${operation.color}`}>
                                        <strong>{operation.text}</strong>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default EventOperations; 