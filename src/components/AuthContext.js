import React, { createContext, useState, useEffect } from 'react';

// AuthContext'i oluştur
export const AuthContext = createContext();

// AuthProvider bileşeni
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  
  // Sayfa yüklendiğinde token kontrolü yap
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Token'ı kontrol et ve kullanıcı bilgisini al
          const response = await fetch('http://localhost:8080/api/auth/user-profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            setIsAuthenticated(true);
            setAuthError(null);
          } else {
            // Token geçersizse veya süresi dolmuşsa çıkış yap
            console.error("Invalid token or expired");
            logout();
            setAuthError("Oturum süreniz dolmuş, lütfen tekrar giriş yapın");
          }
        } catch (error) {
          console.error("Auth check error:", error);
          logout();
          setAuthError("Bağlantı hatası, lütfen tekrar giriş yapın");
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Giriş yap fonksiyonu
  const login = async (token, userInfo = null) => {
    localStorage.setItem('token', token);
    
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setUser(userInfo);
    } else {
      // Eğer userInfo sağlanmadıysa, API'den kullanıcı bilgilerini al
      try {
        const response = await fetch('http://localhost:8080/api/auth/user-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          localStorage.setItem('userInfo', JSON.stringify(userData));
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    
    setIsAuthenticated(true);
    setAuthError(null);
  };
  
  // Çıkış yap fonksiyonu
  const logout = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Backend'e logout isteği gönder
        const response = await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error('Logout API error:', response.status);
          // API hatası olsa bile local logout işlemini gerçekleştir
        }
      } catch (error) {
        console.error('Logout request failed:', error);
        // Hata olsa bile local logout işlemini gerçekleştir
      }
    }
    
    // Local temizlik işlemleri
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setUser(null);
  };
  
  // Kullanıcı bilgilerini yenile
  const refreshUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/sign-', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing user info:", error);
      return false;
    }
  };
  
  // Provider değerleri
  const value = {
    isAuthenticated,
    loading,
    user,
    authError,
    login,
    logout,
    refreshUserInfo,
    getUserId: () => user?.id || null,
    getUserEmail: () => user?.email || null,
    getUserName: () => user?.fullName || user?.name || null
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
  

    