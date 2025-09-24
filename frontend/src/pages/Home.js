import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Coffee, Code, Database, Users } from 'lucide-react';

const HeroSection = styled.section`
  text-align: center;
  padding: 80px 0;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-top: 80px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: white;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
`;

const CTALink = styled(Link)`
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

function Home() {
  return (
    <div>
      <HeroSection>
        <HeroTitle>Bem-vindo ao JavaLovers</HeroTitle>
        <HeroSubtitle>
          Uma plataforma moderna desenvolvida com Java Spring Boot e React para
          demonstrar as melhores práticas de desenvolvimento de software.
        </HeroSubtitle>
        <CTAButtons>
          <CTALink to="/login">Fazer Login</CTALink>
          <CTALink to="/register">Criar Conta</CTALink>
        </CTAButtons>
      </HeroSection>

      <FeatureGrid>
        <FeatureCard>
          <FeatureIcon>
            <Coffee size={40} color="white" />
          </FeatureIcon>
          <FeatureTitle>Java Spring Boot</FeatureTitle>
          <FeatureDescription>
            Backend robusto e escalável construído com Spring Boot,
            oferecendo APIs RESTful e segurança avançada.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <Code size={40} color="white" />
          </FeatureIcon>
          <FeatureTitle>React Frontend</FeatureTitle>
          <FeatureDescription>
            Interface moderna e responsiva desenvolvida com React,
            proporcionando uma experiência de usuário excepcional.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <Database size={40} color="white" />
          </FeatureIcon>
          <FeatureTitle>MySQL Database</FeatureTitle>
          <FeatureDescription>
            Banco de dados relacional confiável para armazenamento
            seguro e eficiente de dados da aplicação.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <Users size={40} color="white" />
          </FeatureIcon>
          <FeatureTitle>Gestão de Usuários</FeatureTitle>
          <FeatureDescription>
            Sistema completo de autenticação e autorização
            para gerenciar usuários e permissões.
          </FeatureDescription>
        </FeatureCard>
      </FeatureGrid>
    </div>
  );
}

export default Home;
