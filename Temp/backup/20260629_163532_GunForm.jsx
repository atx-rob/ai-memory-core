import { useState } from 'react';
import useInventoryStore from '../stores/useInventoryStore';

export default function GunForm({ userId }) {
  const [formData, setFormData] = useState({
    name: '', caliber: '', type: 'Pistol', mfg_name: '', year_produced: '',
    reload_eligible: false, year_purchased: '', appraised_value: '', appraisal_year: '',
    appraisal_source: '', appraisal_contact_name: '', appraisal_contact_email: '', appraisal_contact_phone: '',
    resale_contact_name: '', resale_contact_email: '', resale_contact_phone: '',
    purchase_method: 'in person', highlights: '', date_purchased: '', purchased_from: '', image_urls: ''
  });
  const { addGun } = useInventoryStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addGun(formData, userId);
    setFormData({
      name: '', caliber: '', type: 'Pistol', mfg_name: '', year_produced: '',
      reload_eligible: false, year_purchased: '', appraised_value: '', appraisal_year: '',
      appraisal_source: '', appraisal_contact_name: '', appraisal_contact_email: '', appraisal_contact_phone: '',
      resale_contact_name: '', resale_contact_email: '', resale_contact_phone: '',
      purchase_method: 'in person', highlights: '', date_purchased: '', purchased_from: '', image_urls: ''
    });
  };

  const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Add New Firearm</h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Model Name *</label>
        <input name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />

        <label style={labelStyle}>Caliber *</label>
        <input name="caliber" value={formData.caliber} onChange={handleChange} required style={inputStyle} />

        <label style={labelStyle}>Type of Gun *</label>
        <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
          <option value="Pistol">Pistol</option>
          <option value="Semi Auto">Semi Auto</option>
          <option value="Shotgun">Shotgun</option>
          <option value="Long Gun">Long Gun</option>
        </select>

        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginBottom: '10px' }}>
          {showAdvanced ? 'Hide Advanced Fields' : 'Show Advanced Fields (Appraisal, Purchase, etc.)'}
        </button>

        {showAdvanced && (
          <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '4px', marginBottom: '10px' }}>
            <h3>Manufacturer & Production</h3>
            <label style={labelStyle}>Mfg Name</label><input name="mfg_name" value={formData.mfg_name} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Year Produced</label><input name="year_produced" type="number" value={formData.year_produced} onChange={handleChange} style={inputStyle} />

            <h3>Purchase Details</h3>
            <label style={labelStyle}>Date Purchased</label><input name="date_purchased" type="date" value={formData.date_purchased} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Year Purchased</label><input name="year_purchased" type="number" value={formData.year_purchased} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Purchased From</label><input name="purchased_from" value={formData.purchased_from} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>How Purchased</label>
            <select name="purchase_method" value={formData.purchase_method} onChange={handleChange} style={inputStyle}>
              <option value="online">Online</option><option value="in person">In Person</option><option value="gun show">Gun Show</option><option value="gift">Gift</option><option value="other">Other</option>
            </select>

            <h3>Appraisal Info</h3>
            <label style={labelStyle}>Appraised Value ($)</label><input name="appraised_value" type="number" value={formData.appraised_value} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Appraisal Year</label><input name="appraisal_year" type="number" value={formData.appraisal_year} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Source of Appraisal</label><input name="appraisal_source" value={formData.appraisal_source} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Appraisal Contact Name</label><input name="appraisal_contact_name" value={formData.appraisal_contact_name} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Appraisal Contact Email</label><input name="appraisal_contact_email" type="email" value={formData.appraisal_contact_email} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Appraisal Contact Phone</label><input name="appraisal_contact_phone" value={formData.appraisal_contact_phone} onChange={handleChange} style={inputStyle} />

            <h3>Resale Contact</h3>
            <label style={labelStyle}>Resale Contact Name</label><input name="resale_contact_name" value={formData.resale_contact_name} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Resale Contact Email</label><input name="resale_contact_email" type="email" value={formData.resale_contact_email} onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Resale Contact Phone</label><input name="resale_contact_phone" value={formData.resale_contact_phone} onChange={handleChange} style={inputStyle} />

            <h3>Additional Info</h3>
            <label style={{display:'flex',alignItems:'center',gap:'5px'}}><input name="reload_eligible" type="checkbox" checked={formData.reload_eligible} onChange={handleChange} /> Reload Eligible</label>
            <label style={labelStyle}>Gun Highlights</label><textarea name="highlights" value={formData.highlights} onChange={handleChange} style={{...inputStyle, height: '80px'}} />
            <label style={labelStyle}>Image URLs (comma separated)</label><input name="image_urls" value={formData.image_urls} onChange={handleChange} style={inputStyle} placeholder="https://..." />
          </div>
        )}

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add to Inventory</button>
      </form>
    </div>
  );
}