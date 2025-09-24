import React from 'react';
import styled from 'styled-components';
import { User, Settings, BarChart3, Calendar, Bell } from 'lucide-react';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const WelcomeSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const WelcomeTitle = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const WelcomeSubtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const StatTitle = styled.h3`
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  color: #667eea;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 4px;
`;

const StatDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const QuickActions = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

function Dashboard() {
  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>
          <User size={40} />
          Bem-vindo ao Dashboard!
        </WelcomeTitle>
        <WelcomeSubtitle>
          Gerencie sua conta e explore todas as funcionalidades do JavaLovers.
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <BarChart3 size={28} color="white" />
          </StatIcon>
          <StatTitle>Projetos Ativos</StatTitle>
          <StatValue>12</StatValue>
          <StatDescription>Projetos em desenvolvimento</StatDescription>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Calendar size={28} color="white" />
          </StatIcon>
          <StatTitle>Eventos</StatTitle>
          <StatValue>5</StatValue>
          <StatDescription>Próximos eventos agendados</StatDescription>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Bell size={28} color="white" />
          </StatIcon>
          <StatTitle>Notificações</StatTitle>
          <StatValue>3</StatValue>
          <StatDescription>Novas notificações</StatDescription>
        </StatCard>
      </StatsGrid>

      <QuickActions>
        <SectionTitle>
          <Settings size={28} />
          Ações Rápidas
        </SectionTitle>
        <ActionsGrid>
          <ActionButton>
            <User size={20} />
            Editar Perfil
          </ActionButton>
          <ActionButton>
            <Settings size={20} />
            Configurações
          </ActionButton>
          <ActionButton>
            <BarChart3 size={20} />
            Relatórios
          </ActionButton>
          <ActionButton>
            <Calendar size={20} />
            Agendar Evento
          </ActionButton>
        </ActionsGrid>
      </QuickActions>
    </DashboardContainer>
  );
}

export default Dashboard;
