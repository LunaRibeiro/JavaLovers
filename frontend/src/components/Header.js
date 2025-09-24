import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Coffee, User, LogIn, UserPlus } from 'lucide-react';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  font-size: 24px;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  &.active {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

function Header() {
  const location = useLocation();

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <Coffee size={28} />
          JavaLovers
        </Logo>
        <NavLinks>
          <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/login" className={location.pathname === '/login' ? 'active' : ''}>
            <LogIn size={18} />
            Login
          </NavLink>
          <NavLink to="/register" className={location.pathname === '/register' ? 'active' : ''}>
            <UserPlus size={18} />
            Cadastro
          </NavLink>
          <NavLink to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            <User size={18} />
            Dashboard
          </NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
