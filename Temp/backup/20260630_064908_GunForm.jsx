import { useState } from 'react';
import useInventoryStore from '../stores/useInventoryStore';

export default function GunForm({ userId }) {
  const { addGun } = useInventoryStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    caliber: '',
    type: 'Pistol',
    serial_number: '',
    mfg_name: '',
    year_produced: '',
    reload_eligible: false,
    date_purchased: '',
    year_purchased: '',
    purchased_from: '',
    purchase_method: '',
    appraised_value: '',
    appraisal_year: '',
    appraisal_source: '',
    appraisal_contact_name: '',
    appraisal_contact_email: '',
    resale_contact_name: '',
    resale_contact_email: '',
    highlights: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CRITICAL FIX: Convert empty strings to null for integer/float fields
    const gunData = {
      ...formData,
      userId: userId,
      year_produced: formData.year_produced === '' ? null : parseInt(formData.year_produced),
      year_purchased: formData.year_purchased === '' ? null : parseInt(formData.year_purchased),
      appraised_value: formData.appraised_value === '' ? null : parseFloat(formData.appraised_value),
      appraisal_year: formData.appraisal_year === '' ? null : parseInt(formData.appraisal_year),
    };

    try {
      console.log('[DEBUG] Saving gun:', gunData);
      await addGun(gunData, userId);
      console.log('[DEBUG] Save successful');
      
      // Reset form
      setFormData({
        name: '', caliber: '', type: 'Pistol', serial_number: '', mfg_name: '',
        year_produced: '', reload_eligible: false, date_purchased: '', year_purchased: '',
        purchased_from: '', purchase_method: '', appraised_value: '', appraisal_year: '',
        appraisal_source: '', appraisal_contact_name: '', appraisal_contact_email: '',
        resale_contact_name: '', resale_contact_email: '', highlights: '',
      });
      alert('Gun added successfully!');
    } catch (error) {
      console.error('[DEBUG] Save failed:', error);
      alert('Error saving gun: ' + error.message);
    }
  };

  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)' };
  const inputStyle = { width: '100%' };
  const containerStyle = { marginBottom: '20px' };

  return (
    <div style={{maxWidth: '600px', margin: '0 auto 40px', padding: '30px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)'}}>
      <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Add New Firearm</h2>
      <form onSubmit={handleSubmit}>
        <div style={containerStyle}>
          <label htmlFor="name" style={labelStyle}>Model Name *</label>
          <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={containerStyle}>
          <label htmlFor="caliber" style={labelStyle}>Caliber *</label>
          <input id="caliber" type="text" name="caliber" value={formData.caliber} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={containerStyle}>
          <label htmlFor="type" style={labelStyle}>Type of Gun *</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} required style={inputStyle}>
            <option value="Pistol">Pistol</option>
            <option value="Rifle">Rifle</option>
            <option value="Shotgun">Shotgun</option>
            <option value="Handgun">Handgun</option>
          </select>
        </div>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} style={{background: 'none', border: 'none', color: 'var(--accent-color)', textDecoration: 'underline', cursor: 'pointer', fontSize: 'var(--font-size-base)'}}>
            {showAdvanced ? 'Hide' : 'Show'} Advanced Fields (Appraisal, Purchase, etc.)
          </button>
        </div>
        {showAdvanced && (
          <div>
            <div style={containerStyle}>
              <label htmlFor="serial_number" style={labelStyle}>Serial Number</label>
              <input id="serial_number" type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="mfg_name" style={labelStyle}>Manufacturer</label>
              <input id="mfg_name" type="text" name="mfg_name" value={formData.mfg_name} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="year_produced" style={labelStyle}>Year Produced</label>
              <input id="year_produced" type="number" name="year_produced" value={formData.year_produced} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label style={{display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-color)'}}>
                <input type="checkbox" name="reload_eligible" checked={formData.reload_eligible} onChange={handleChange} />
                Reload Eligible
              </label>
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <h3 style={{color: 'var(--text-color)'}}>Purchase Information</h3>
            <div style={containerStyle}>
              <label htmlFor="date_purchased" style={labelStyle}>Date Purchased</label>
              <input id="date_purchased" type="date" name="date_purchased" value={formData.date_purchased} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="year_purchased" style={labelStyle}>Year Purchased</label>
              <input id="year_purchased" type="number" name="year_purchased" value={formData.year_purchased} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="purchased_from" style={labelStyle}>Purchased From</label>
              <input id="purchased_from" type="text" name="purchased_from" value={formData.purchased_from} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="purchase_method" style={labelStyle}>Purchase Method</label>
              <input id="purchase_method" type="text" name="purchase_method" value={formData.purchase_method} onChange={handleChange} style={inputStyle} />
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <h3 style={{color: 'var(--text-color)'}}>Appraisal Information</h3>
            <div style={containerStyle}>
              <label htmlFor="appraised_value" style={labelStyle}>Appraised Value ($)</label>
              <input id="appraised_value" type="number" step="0.01" name="appraised_value" value={formData.appraised_value} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="appraisal_year" style={labelStyle}>Appraisal Year</label>
              <input id="appraisal_year" type="number" name="appraisal_year" value={formData.appraisal_year} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="appraisal_source" style={labelStyle}>Appraisal Source</label>
              <input id="appraisal_source" type="text" name="appraisal_source" value={formData.appraisal_source} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="appraisal_contact_name" style={labelStyle}>Appraiser Name</label>
              <input id="appraisal_contact_name" type="text" name="appraisal_contact_name" value={formData.appraisal_contact_name} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="appraisal_contact_email" style={labelStyle}>Appraiser Email</label>
              <input id="appraisal_contact_email" type="email" name="appraisal_contact_email" value={formData.appraisal_contact_email} onChange={handleChange} style={inputStyle} />
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <h3 style={{color: 'var(--text-color)'}}>Resale Contact</h3>
            <div style={containerStyle}>
              <label htmlFor="resale_contact_name" style={labelStyle}>Contact Name</label>
              <input id="resale_contact_name" type="text" name="resale_contact_name" value={formData.resale_contact_name} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={containerStyle}>
              <label htmlFor="resale_contact_email" style={labelStyle}>Contact Email</label>
              <input id="resale_contact_email" type="email" name="resale_contact_email" value={formData.resale_contact_email} onChange={handleChange} style={inputStyle} />
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <div style={containerStyle}>
              <label htmlFor="highlights" style={labelStyle}>Notes & Highlights</label>
              <textarea id="highlights" name="highlights" value={formData.highlights} onChange={handleChange} rows="4" style={inputStyle} />
            </div>
          </div>
        )}
        <button type="submit" style={{width: '100%', padding: '15px', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: 'var(--border-radius)', fontSize: 'var(--font-size-lg)', fontWeight: '600', cursor: 'pointer'}}>
          Add to Inventory
        </button>
      </form>
    </div>
  );
}