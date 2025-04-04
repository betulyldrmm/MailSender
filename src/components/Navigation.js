import React, { useState, useEffect, useContext } from "react";
import { Navbar, Container, Nav, Modal, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from './AuthContext'; 
import AuthForm from '../AuthForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';
import { FaInstagram, FaTwitter, FaYoutube, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";

// Import your images for the slider
import mail1 from './mail1.jpg'; 
import mail2 from './mail2.jpg';
import mail3 from './mail3.jpg';
import mail4 from './mail4.jpg';
import okkk from './okkk.png';

const Navigation = () => {
    const [showModal, setShowModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, user, refreshUserInfo } = useContext(AuthContext);

    const images = [mail1, mail2, mail3, mail4];
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // User data check and refresh effect
    useEffect(() => {
        if (isAuthenticated) {
            // Refresh user data every time the component mounts if user is authenticated
            refreshUserInfo();
        }
    }, [isAuthenticated, refreshUserInfo]);

    // Auth form modal show
    const openAuthModal = () => {
        setShowAuthModal(true);
    };

    // Logout handler
    const handleLogout = async () => {
        try {
            // Get token from localStorage or wherever you store it
            const token = localStorage.getItem('authToken'); // Adjust based on where you store the token
            
            // Call the sign-out API with Authorization header
            const response = await fetch('http://localhost:8080/api/auth/sign-out', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add Authorization header
                },
                body: JSON.stringify({ token }), // Keep sending token in body if needed
                credentials: 'include' // Include cookies if using cookie-based auth
            });
            
            if (!response.ok) {
                // Try alternative endpoint if the first one fails
                const altResponse = await fetch('http://localhost:8080/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ token }),
                    credentials: 'include'
                });
                
                if (!altResponse.ok) {
                    throw new Error('Logout failed');
                }
            }
            
            // Make sure to clear token from localStorage
            localStorage.removeItem('authToken');
            
            // Proceed with existing logout logic
            logout();
            navigate('/');
            
            // Show feedback modal
            setModalTitle("Çıkış Yapıldı");
            setModalMessage("Hesabınızdan başarıyla çıkış yaptınız.");
            setShowModal(true);
        } catch (error) {
            console.error('Logout error:', error);
            
            // Make sure to clear token locally even if the API call fails
            localStorage.removeItem('authToken');
            
            // Still log the user out locally even if the API call fails
            logout();
            navigate('/');
            
            setModalTitle("Çıkış Yapıldı");
            setModalMessage("Hesabınızdan çıkış yapıldı, ancak sunucu kaydı güncellenirken bir hata oluştu.");
            setShowModal(true);
        }
    };

    // Slider transition functions
    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
            setTimeout(() => setIsAnimating(false), 500);
        }, 50);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
            setTimeout(() => setIsAnimating(false), 500);
        }, 50);
    };

    // Function to calculate position classes for images
    const getImageClass = (index) => {
        if (index === activeIndex) return 'active';
        
        // Images to the left of active index
        if ((index === activeIndex - 1) || (activeIndex === 0 && index === images.length - 1)) {
            return 'position-1'; // Left side image
        }
        
        // Images to the right of active index  
        if ((index === activeIndex + 1) || (activeIndex === images.length - 1 && index === 0)) {
            return 'position-3'; // Right side image
        }
        
        // Images two positions to the left
        if ((index === activeIndex - 2) || (activeIndex <= 1 && index === images.length - (2 - activeIndex))) {
            return 'position-2'; // Far left image
        }
        
        // Images two positions to the right
        if ((index === activeIndex + 2) || (activeIndex >= images.length - 2 && index === (activeIndex + 2) % images.length)) {
            return 'position-4'; // Far right image
        }
        
        return 'inactive'; // Other images
    };

    // Function called when login is successful
    const handleLoginSuccess = () => {
        setShowAuthModal(false);
        navigate('/create-event');
    };

    return (
        <div>
            <Navbar expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="custom-navbar-brand">
                        <div className="container">
                            <div className="text">
                                <p>Email Management System</p>
                            </div>
                        </div>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto nav-links">
                            {isAuthenticated && (
                                <>
                                    <Nav.Link as={Link} to="/create-event" className="nav-item" active={location.pathname === '/create-event'}>
                                        Etkinlik Oluştur
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/my-events" className="nav-item" active={location.pathname === '/my-events'}>
                                        Etkinliklerim
                                    </Nav.Link>
                                    
                                    <Dropdown align="end">
                                        <Dropdown.Toggle variant="link" id="dropdown-user" className="nav-link nav-item user-dropdown">
                                            <FaUser className="me-1" /> {user?.fullName || user?.name || user?.email?.split('@')[0] || "Kullanıcı"}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item as={Link} to="/profile">
                                                <FaUser className="me-2" /> Profil
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/settings">
                                                <FaCog className="me-2" /> Ayarlar
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={handleLogout}>
                                                <FaSignOutAlt className="me-2" /> Çıkış Yap
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            )}
                            
                            {!isAuthenticated && (
                                <Nav.Link onClick={openAuthModal} className="nav-item">
                                  Giriş Yap/Kayıt Ol
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Remove the duplicate heading in the homepage content */}
            {location.pathname === '/' && !isAuthenticated && (
                <div className="arkaplan">
                    {/* Image Slider */}
                    <div className="slider-container">
                        <button 
                            className="slider-btn left" 
                            onClick={prevSlide}
                            disabled={isAnimating}
                        >&#10094;</button>
                        <div className="slider">
                            {images.map((img, index) => (
                                <img 
                                    key={index}
                                    src={img} 
                                    alt={`Resim ${index + 1}`}
                                    className={getImageClass(index)}
                                />
                            ))}
                        </div>
                        <button 
                            className="slider-btn right" 
                            onClick={nextSlide}
                            disabled={isAnimating}
                        >&#10095;</button>
                    </div>

                    {/* Login Button */}
                    <div className="auth-button-container" style={{ 
                        textAlign: 'center', 
                        marginTop: '20px', 
                        marginBottom: '20px',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <Button 
                            variant="dark" 
                            size="lg"
                            onClick={openAuthModal}
                            className="auth-button"
                            style={{
                                padding: '30px 24px',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                          CREATE
                        </Button>
                    </div>
                    
                    <div className="container">
                        <div className="ok">
                            <img src={okkk} alt="ok" />
                        </div>
                    </div>

                    {/* Flow Chart */}
                    <div className="flow-container">
                        {/* Upper row */}
                        <div className="flow-row">
                            {/* Box 1 */}
             <div className="flow-box">
                                <div className="box-title">Giriş Yapın ya da Üye Olun</div>
                                <div className="box-content">
                                    Siteyi kullanabilmek için hesabınıza giriş yapın veya yeni bir hesap oluşturun.
                                </div>
                                <div className="arrow-right">➜</div>
                            </div>
                            
                            {/* Box 2 */}
                            <div className="flow-box">
                                <div className="box-title">Yeni Etkinlik Oluşturun</div>
                                <div className="box-content">
                                    Ardından, "Create Event" butonuna tıklayarak yeni bir etkinlik oluşturun.
                                </div>
                                <div className="arrow-right">➜</div>
                            </div>
                            
                            {/* Box 3 */}
                            <div className="flow-box">
                                <div className="box-title">Etkinliği Seçin</div>
                                <div className="box-content">
                                    Oluşturduğunuz etkinliği seçmek için "Select Event" seçeneğini kullanın.
                                </div>
                                <div className="arrow-down">⬇</div>
                            </div>
                        </div>
                        
                        {/* Bottom row */}
                        <div className="flow-row last-row">
                            {/* Box 4 */}
                            <div className="flow-box">
                                <div className="box-title">Gönderin</div>
                                <div className="box-content">
                                    Son olarak, etkinlik bilgilerini içeren maili göndermek için "Send" butonuna tıklayın.
                                </div>
                            </div>
                            
                            {/* Box 5 */}
                            <div className="flow-box">
                                <div className="box-title">Gönderen ve Alıcılar Ekleyin</div>
                                <div className="box-content">
                                    "Senders" ve "Receivers" kısmını ekleyin. Senders eklerken, Google Hesabınızdan Gmail App Şifrenizi oluşturmayı unutmayın.
                                </div>
                                <div className="arrow-right">➜</div>
                            </div>
                            
                            {/* Box 6 */}
                            <div className="flow-box">
                                <div className="box-title">Mail Şablonları Oluşturun</div>
                                <div className="box-content">
                                    Yeni sayfada, etkinliğiniz için özel mail şablonları oluşturun.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Authenticated User Welcome Message */}
            {isAuthenticated && location.pathname === '/' && (
                <div className="welcome-container">
                    <div className="welcome-message">
                        <h2>Hoş Geldiniz, {user?.fullName || user?.name || user?.email?.split('@')[0] || "Kullanıcı"}!</h2>
                    </div>
                </div>
            )}

            {/* AuthForm Modal */}
            <Modal 
                show={showAuthModal} 
                onHide={() => setShowAuthModal(false)} 
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Giriş / Kayıt</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AuthForm onSuccess={handleLoginSuccess} />
                </Modal.Body>
            </Modal>

            {/* Feedback Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Kapat
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Only show the line and contact section on homepage when NOT authenticated */}
            {location.pathname === '/' && !isAuthenticated && (
                <div>
                    <div className="long-line"></div>
                    
                    {/* Contact section with consistent yellow background */}
                    <div className="plan">
                        <div className="text3">
                            <p>İletişim Adreslerimiz:</p>
                            <hr />
                        </div>
                        <div className="social-links">
                            <a href="https://instagram.com/ytuskylab" target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>
                            <a href="https://twitter.com/ytuskylab" target="_blank" rel="noopener noreferrer">
                                <FaTwitter />
                            </a>
                            <a href="https://youtube.com/channel/ytuskylab" target="_blank" rel="noopener noreferrer">
                                <FaYoutube />
                            </a>
                        </div>
                        <ul className="footer-links">
                            <li><Link to="/about" className="nav-item">Hakkımızda</Link></li>
                            <li><Link to="/iletisim" className="nav-item">İletişim</Link></li>
                            <li><Link to="/biz" className="nav-item">Biz Kimiz</Link></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navigation;