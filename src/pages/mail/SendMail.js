import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';

const SendMail = () => {
    const [mailTemplates, setMailTemplates] = useState([]);
    const [senders, setSenders] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedSender, setSelectedSender] = useState(null);
    const [selectedReceivers, setSelectedReceivers] = useState([]);
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const { eventId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        const storedEvent = localStorage.getItem('selectedEvent');
        if (storedEvent) {
            const parsedEvent = JSON.parse(storedEvent);
            if (parsedEvent.id.toString() === eventId) {
                fetchAllData();
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [eventId, navigate]);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchMailTemplates(),
                fetchSenders(),
                fetchReceivers()
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMailTemplates = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/mailTemplates/${eventId}`, {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            
            if (response.status === 404) {
                setMailTemplates([]);
                return;
            }

            if (!response.ok) throw new Error('Failed to fetch mail templates');
            
            const data = await response.json();
            setMailTemplates(Array.isArray(data) ? data.map(template => ({
                value: template.id,
                label: template.header
            })) : []);
        } catch (error) {
            showAlert('danger', 'Failed to load mail templates');
            console.error('Error:', error);
        }
    };

    const fetchSenders = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/senders/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            const data = text === "" ? [] : JSON.parse(text);
            const formattedSenders = data.map(sender => ({
                value: sender.id,
                label: sender.email
            }));
            setSenders(formattedSenders);
        } catch (error) {
            console.error('Error fetching senders:', error);
            throw new Error('Failed to fetch senders');
        }
    };

    const fetchReceivers = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/receivers/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            const data = text === "" ? [] : JSON.parse(text);
            const formattedReceivers = data.map(receiver => ({
                value: receiver.id,
                label: `${receiver.email} - ${receiver.groupName || 'No Group'}`
            }));
            setReceivers(formattedReceivers);
        } catch (error) {
            console.error('Error fetching receivers:', error);
            throw new Error('Failed to fetch receivers');
        }
    };

    const showAlert = (variant, message) => {
        setAlert({ show: true, variant, message });
        setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedTemplate || !selectedSender || selectedReceivers.length === 0) {
            showAlert('warning', 'Please select all required fields');
            return;
        }

        try {
            const receiverIdsString = selectedReceivers
                .map(receiver => receiver.value)
                .join(',');

            const url = `http://localhost:8080/api/send-mail?senderID=${selectedSender.value}&receiverIDs=${receiverIdsString}&mailTemplateID=${selectedTemplate.value}`;

            console.log('Sending request to:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            const result = await response.json();

            if (result.success) {
                showAlert('success', '✅ All emails have been sent successfully!');
                // Clear form if successful
                setSelectedTemplate(null);
                setSelectedSender(null);
                setSelectedReceivers([]);
            } else {
                // Handle different error scenarios
                let errorMessage = '';
                let variant = 'warning';

                if (result.failedEmails && result.failedEmails.length > 0) {
                    errorMessage = `⚠️ Failed to send emails to: ${result.failedEmails.join(', ')}`;
                    if (result.message) {
                        errorMessage += `\nReason: ${result.message}`;
                    }
                } else if (result.message === "Authentication failed") {
                    errorMessage = '🔒 Sender authentication failed. Please check the sender\'s email and app password.';
                    variant = 'danger';
                } else if (result.message.includes("Template")) {
                    errorMessage = '�� There was an issue with the email template. Please verify the template content.';
                    variant = 'warning';
                } else if (result.message.includes("Invalid")) {
                    errorMessage = '❌ Invalid request. Please check all selected values.';
                    variant = 'danger';
                } else {
                    errorMessage = result.message || '❌ An unexpected error occurred while sending emails.';
                    variant = 'danger';
                }

                showAlert(variant, errorMessage);
            }
        } catch (error) {
            console.error('Error sending emails:', error);
            let errorMessage = '❌ Failed to send emails: ';
            
            try {
                const parsedError = JSON.parse(error.message);
                errorMessage += parsedError.message || 'Unknown error occurred';
            } catch {
                errorMessage += error.message || 'Unknown error occurred';
            }
            
            showAlert('danger', errorMessage);
        }
    };

    return (
        <Container className="mt-4">
            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    <h2>Send Emails</h2>
                    
                    {alert.show && (
                        <Alert 
                            variant={alert.variant} 
                            onClose={() => setAlert({ show: false })} 
                            dismissible
                            className="d-flex align-items-center"
                            style={{ 
                                fontSize: '1.1rem',
                                padding: '1rem',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ whiteSpace: 'pre-line' }}>
                                {alert.message}
                            </div>
                        </Alert>
                    )}

                    {mailTemplates.length === 0 && (
                        <Alert variant="warning">
                            No mail templates available. Please create a template first.
                        </Alert>
                    )}

                    {senders.length === 0 && (
                        <Alert variant="warning">
                            No senders available. Please add a sender first.
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mail Template</Form.Label>
                            <Select
                                value={selectedTemplate}
                                onChange={setSelectedTemplate}
                                options={mailTemplates}
                                placeholder="Select a template..."
                                isSearchable
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Sender Email</Form.Label>
                            <Select
                                value={selectedSender}
                                onChange={setSelectedSender}
                                options={senders}
                                placeholder="Select a sender..."
                                isSearchable
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Receivers</Form.Label>
                            <Select
                                value={selectedReceivers}
                                onChange={setSelectedReceivers}
                                options={receivers}
                                placeholder="Select receivers..."
                                isMulti
                                isSearchable
                            />
                            <Form.Text className="text-muted">
                                You can select multiple receivers
                            </Form.Text>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={!selectedTemplate || !selectedSender || selectedReceivers.length === 0}
                        >
                            Send Emails
                        </Button>
                    </Form>
                </>
            )}
        </Container>
    );
};

export default SendMail; 