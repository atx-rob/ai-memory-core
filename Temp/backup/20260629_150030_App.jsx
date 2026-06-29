import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './supabase';
import Auth from './components/Auth';
import Tabs from './components/Tabs';
import GunForm from './components/GunForm';
import InventoryList from './components/InventoryList';
import BrokerTab from './components/BrokerTab';
import LegacyTab from './components/LegacyTab';
import AdminTab from './components/AdminTab';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');

  if (loading) return <div style={{textAlign:'center',marginTop:'50px'}}>Loading...</div>;
  if (!user) return <Auth />;

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const tabs = [
    { id: 'inventory', label: 'Gun Inventory' },
    { id: 'broker', label: 'Gun Broker' },
    { id: 'legacy', label: 'Legacy' },
    { id: 'admin', label: 'IT Admin' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <div>
            <GunForm userId={user.id} />
            <InventoryList userId={user.id} />
          </div>
        );
      case 'broker':
        return <BrokerTab />;
      case 'legacy':
        return <LegacyTab />;
      case 'admin':
        return <AdminTab />;
      default:
        return null;
    }
  };

  return (
    <div style={{maxWidth:'900px',margin:'0 auto',padding:'20px'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--spacing-lg)',paddingBottom:'20px',borderBottom:'2px solid var(--border-color)'}}>
        <h1 style={{margin:0,fontSize:'2.5rem',color:'var(--primary-color)',flexShrink:0,whiteSpace:'nowrap'}}>My Gun Inventory</h1>
        <div style={{display:'flex',alignItems:'center',gap:'20px',flexShrink:0,marginLeft:'20px'}}>
          <span style={{fontSize:'0.95rem',color:'var(--text-muted)',fontWeight:'500'}}>{user.email}</span>
          <button onClick={handleLogout} style={{padding:'10px 20px',backgroundColor:'var(--secondary-color)',color:'white',border:'none',borderRadius:'var(--border-radius)',cursor:'pointer',fontSize:'0.9rem',fontWeight:'600'}}>Logout</button>
        </div>
      </header>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <main>{renderContent()}</main>
    </div>
  );
}

export default function App() {
  return (<AuthProvider><AppContent /></AuthProvider>);
}