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
  const contentStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' };
  const closeBtn = { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' };
  const fieldStyle = { marginBottom: '10px' };
  const labelStyle = { fontWeight: 'bold', marginRight: '5px' };

  return (
    <div style={{padding:'20px',maxWidth:'400px',margin:'0 auto'}}>
      <h2>Current Inventory</h2>
      <div style={{display:'flex',gap:'10px',marginBottom:'20px'}}>
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{flex:1,padding:'8px',border:'1px solid #ccc',borderRadius:'4px'}} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{padding:'8px',border:'1px solid #ccc',borderRadius:'4px'}}>
          <option value="All">All</option><option value="Handgun">Handgun</option><option value="Rifle">Rifle</option><option value="Shotgun">Shotgun</option>
        </select>
      </div>
      {filteredGuns.length === 0 ? <p style={{textAlign:'center',color:'#666'}}>No firearms in inventory yet.</p> : (
        <ul style={{listStyleType:'none',padding:0}}>
          {filteredGuns.map((gun) => (
            <li key={gun.id} onClick={() => setSelectedGun(gun)} style={{padding:'10px',borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between',cursor:'pointer',backgroundColor:'#f9f9f9',marginBottom:'5px',borderRadius:'4px'}}>
              <span><strong>{gun.name}</strong> ({gun.caliber}) - {gun.type}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteGun(gun.id); }} style={{padding:'5px 10px',background:'#dc3545',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {selectedGun && (
        <div style={modalStyle} onClick={() => setSelectedGun(null)}>
          <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedGun(null)} style={closeBtn}>&times;</button>
            <h2>{selectedGun.name}</h2>
            <div style={fieldStyle}><span style={labelStyle}>Caliber:</span> {selectedGun.caliber}</div>
            <div style={fieldStyle}><span style={labelStyle}>Type:</span> {selectedGun.type}</div>
            <div style={fieldStyle}><span style={labelStyle}>Manufacturer:</span> {selectedGun.mfg_name}</div>
            <div style={fieldStyle}><span style={labelStyle}>Year Produced:</span> {selectedGun.year_produced}</div>
            <div style={fieldStyle}><span style={labelStyle}>Reload Eligible:</span> {selectedGun.reload_eligible ? 'Yes' : 'No'}</div>
            <hr />
            <h3>Purchase Info</h3>
            <div style={fieldStyle}><span style={labelStyle}>Date:</span> {selectedGun.date_purchased}</div>
            <div style={fieldStyle}><span style={labelStyle}>Year:</span> {selectedGun.year_purchased}</div>
            <div style={fieldStyle}><span style={labelStyle}>From:</span> {selectedGun.purchased_from}</div>
            <div style={fieldStyle}><span style={labelStyle}>Method:</span> {selectedGun.purchase_method}</div>
            <hr />
            <h3>Appraisal</h3>
            <div style={fieldStyle}><span style={labelStyle}>Value:</span> ${selectedGun.appraised_value}</div>
            <div style={fieldStyle}><span style={labelStyle}>Year:</span> {selectedGun.appraisal_year}</div>
            <div style={fieldStyle}><span style={labelStyle}>Source:</span> {selectedGun.appraisal_source}</div>
            <div style={fieldStyle}><span style={labelStyle}>Contact:</span> {selectedGun.appraisal_contact_name} ({selectedGun.appraisal_contact_email})</div>
            <hr />
            <h3>Resale Contact</h3>
            <div style={fieldStyle}>{selectedGun.resale_contact_name} - {selectedGun.resale_contact_email}</div>
            <hr />
            <h3>Notes</h3>
            <p>{selectedGun.highlights}</p>
          </div>
        </div>
      )}
    </div>
  );
}