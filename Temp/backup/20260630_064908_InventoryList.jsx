import { useState, useEffect } from 'react';
import useInventoryStore from '../stores/useInventoryStore';

export default function InventoryList({ userId }) {
  const { guns, fetchGuns, deleteGun } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedGun, setSelectedGun] = useState(null);

  useEffect(() => { if (userId) fetchGuns(userId); }, [userId]);

  const filteredGuns = guns.filter(gun => {
    const matchesSearch = gun.name.toLowerCase().includes(search.toLowerCase()) || gun.caliber.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || gun.type === filter;
    return matchesSearch && matchesFilter;
  });

  const modalStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const contentStyle = { backgroundColor: 'var(--bg-color)', padding: '30px', borderRadius: 'var(--border-radius)', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative', color: 'var(--text-color)' };
  const closeBtn = { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-color)' };
  const fieldStyle = { marginBottom: '12px', padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)' };
  const labelStyle = { fontWeight: '600', marginRight: '8px', color: 'var(--text-color)', display: 'inline-block', minWidth: '150px' };
  const sectionStyle = { marginTop: '25px', paddingTop: '15px', borderTop: '2px solid var(--border-color)' };

  return (
    <div className="container">
      <h2>Current Inventory</h2>
      <div className="flex-row" style={{marginBottom: 'var(--spacing-lg)'}}>
        <div style={{flex: 1}}><input type="text" placeholder="Search model or caliber..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{width: 'auto'}}>
          <option value="All">All</option>
          <option value="Handgun">Handgun</option>
          <option value="Rifle">Rifle</option>
          <option value="Shotgun">Shotgun</option>
          <option value="Pistol">Pistol</option>
        </select>
      </div>
      {filteredGuns.length === 0 ? <p className="text-muted" style={{textAlign:'center'}}>No firearms in inventory yet.</p> : (
        <ul>
          {filteredGuns.map((gun) => (
            <li key={gun.id} className="card flex-between" style={{cursor: 'pointer'}} onClick={() => setSelectedGun(gun)}>
              <div><strong>{gun.name}</strong> <span className="text-muted">({gun.caliber}) - {gun.type}</span></div>
              <button className="btn-danger" onClick={(e) => { e.stopPropagation(); deleteGun(gun.id); }}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {selectedGun && (
        <div style={modalStyle} onClick={() => setSelectedGun(null)}>
          <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedGun(null)} style={closeBtn}>&times;</button>
            <h2 style={{marginTop: 0}}>{selectedGun.name}</h2>
            
            <div style={fieldStyle}>
              <span style={labelStyle}>Caliber:</span>
              <span className="text-muted">{selectedGun.caliber}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Type:</span>
              <span className="text-muted">{selectedGun.type}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Serial Number:</span>
              <span className="text-muted">{selectedGun.serial_number || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Manufacturer:</span>
              <span className="text-muted">{selectedGun.mfg_name || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Year Produced:</span>
              <span className="text-muted">{selectedGun.year_produced || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Reload Eligible:</span>
              <span className="text-muted">{selectedGun.reload_eligible ? 'Yes' : 'No'}</span>
            </div>

            <div style={sectionStyle}>
              <h3 style={{marginBottom: '15px'}}>Purchase Information</h3>
              <div style={fieldStyle}>
                <span style={labelStyle}>Date:</span>
                <span className="text-muted">{selectedGun.date_purchased || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Year:</span>
                <span className="text-muted">{selectedGun.year_purchased || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>From:</span>
                <span className="text-muted">{selectedGun.purchased_from || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Method:</span>
                <span className="text-muted">{selectedGun.purchase_method || 'N/A'}</span>
              </div>
            </div>

            <div style={sectionStyle}>
              <h3 style={{marginBottom: '15px'}}>Appraisal Information</h3>
              <div style={fieldStyle}>
                <span style={labelStyle}>Value:</span>
                <span className="text-muted">${selectedGun.appraised_value || '0'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Year:</span>
                <span className="text-muted">{selectedGun.appraisal_year || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Source:</span>
                <span className="text-muted">{selectedGun.appraisal_source || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Contact Name:</span>
                <span className="text-muted">{selectedGun.appraisal_contact_name || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Contact Email:</span>
                <span className="text-muted">{selectedGun.appraisal_contact_email || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Contact Phone:</span>
                <span className="text-muted">{selectedGun.appraisal_contact_phone || 'N/A'}</span>
              </div>
            </div>

            <div style={sectionStyle}>
              <h3 style={{marginBottom: '15px'}}>Resale Contact</h3>
              <div style={fieldStyle}>
                <span style={labelStyle}>Name:</span>
                <span className="text-muted">{selectedGun.resale_contact_name || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Email:</span>
                <span className="text-muted">{selectedGun.resale_contact_email || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Phone:</span>
                <span className="text-muted">{selectedGun.resale_contact_phone || 'N/A'}</span>
              </div>
            </div>

            <div style={sectionStyle}>
              <h3 style={{marginBottom: '15px'}}>Notes & Highlights</h3>
              <p className="text-muted" style={{whiteSpace: 'pre-wrap'}}>{selectedGun.highlights || 'No notes.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}