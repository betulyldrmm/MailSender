import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css'; // Import the CSS file

const CreateEvent = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // handleSubmit fonksiyonu burada
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token bulunamadı. Lütfen giriş yapın.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: eventName,
                    date: eventDate,
                    description: eventDescription
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Etkinlik oluşturma başarısız oldu.');
            }

            const responseText = await response.text();
            if (responseText.trim()) {
                const data = JSON.parse(responseText);
                navigate(`/events/${data.id}`);
            } else {
                navigate('/events');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-event-container">
            <Card className="create-event-card">
                <Card.Header className="create-event-header">
                    Yeni Etkinlik Oluştur
                </Card.Header>
                <Card.Body className="create-event-body">
                    {error && <Alert variant="danger" className="create-event-alert">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="create-event-form-group">
                            <Form.Label className="create-event-form-label">Etkinlik Adı</Form.Label>
                            <Form.Control
                                className="create-event-form-control"
                                type="text"
                                placeholder="Etkinlik adını girin"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="create-event-form-group">
                            <Form.Label className="create-event-form-label">Etkinlik Tarihi</Form.Label>
                            <Form.Control
                                className="create-event-form-control"
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="create-event-form-group">
                            <Form.Label className="create-event-form-label">Etkinlik Açıklaması</Form.Label>
                            <Form.Control
                                className="create-event-form-control create-event-textarea"
                                as="textarea"
                                rows={2}
                                placeholder="Etkinlik detaylarını girin"
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                            className="create-event-button"
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Lütfen bekleyin...' : 'Etkinlik Oluştur'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};



export default CreateEvent;
