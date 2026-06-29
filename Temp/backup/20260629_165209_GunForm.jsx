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
    year_produced: null,
    reload_eligible: false,
    date_purchased: null,
    year_purchased: null,
    purchased_from: '',
    purchase_method: '',
    appraised_value: null,
    appraisal_year: null,
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
    
    // Convert empty strings to null for integer fields
    const gunData = {
      ...formData,
      user_id: userId,
      year_produced: formData.year_produced === '' ? null : parseInt(formData.year_produced),
      year_purchased: formData.year_purchased === '' ? null : parseInt(formData.year_purchased),
      appraised_value: formData.appraised_value === '' ? null : parseFloat(formData.appraised_value),
      appraisal_year: formData.appraisal_year === '' ? null : parseInt(formData.appraisal_year),
    };

    try {
      await addGun(gunData);
      setFormData({
        name: '',
        caliber: '',
        type: 'Pistol',
        serial_number: '',
        mfg_name: '',
        year_produced: null,
        reload_eligible: false,
        date_purchased: null,
        year_purchased: null,
        purchased_from: '',
        purchase_method: '',
        appraised_value: null,
        appraisal_year: null,
        appraisal_source: '',
        appraisal_contact_name: '',
        appraisal_contact_email: '',
        resale_contact_name: '',
        resale_contact_email: '',
        highlights: '',
      });
      alert('Gun added successfully!');
    } catch (error) {
      console.error('Error adding gun:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={{maxWidth: '600px', margin: '0 auto 40px', padding: '30px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)'}}>
      <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Add New Firearm</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Model Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{width: '100%'}} />
        </div>
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Caliber *</label>
          <input type="text" name="caliber" value={formData.caliber} onChange={handleChange} required style={{width: '100%'}} />
        </div>
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Type of Gun *</label>
          <select name="type" value={formData.type} onChange={handleChange} required style={{width: '100%'}}>
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
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Serial Number</label>
              <input type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Manufacturer</label>
              <input type="text" name="mfg_name" value={formData.mfg_name} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Year Produced</label>
              <input type="number" name="year_produced" value={formData.year_produced || ''} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-color)'}}>
                <input type="checkbox" name="reload_eligible" checked={formData.reload_eligible} onChange={handleChange} />
                Reload Eligible
              </label>
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <h3 style={{color: 'var(--text-color)'}}>Purchase Information</h3>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Date Purchased</label>
              <input type="date" name="date_purchased" value={formData.date_purchased || ''} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Year Purchased</label>
              <input type="number" name="year_purchased" value={formData.year_purchased || ''} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Purchased From</label>
              <input type="text" name="purchased_from" value={formData.purchased_from} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Purchase Method</label>
              <input type="text" name="purchase_method" value={formData.purchase_method} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <h3 style={{color: 'var(--text-color)'}}>Appraisal Information</h3>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraised Value ($)</label>
              <input type="number" step="0.01" name="appraised_value" value={formData.appraised_value || ''} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraisal Year</label>
              <input type="number" name="appraisal_year" value={formData.appraisal_year || ''} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraisal Source</label>
              <input type="text" name="appraisal_source" value={formData.appraisal_source} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraiser Name</label>
              <input type="text" name="appraisal_contact_name" value={formData.appraisal_contact_name} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraiser Email</label>
              <input type="email" name="appraisal_contact_email" value={formData.appraisal_contact_email} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <h3 style={{color: 'var(--text-color)'}}>Resale Contact</h3>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Contact Name</label>
              <input type="text" name="resale_contact_name" value={formData.resale_contact_name} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Contact Email</label>
              <input type="email" name="resale_contact_email" value={formData.resale_contact_email} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Notes & Highlights</label>
              <textarea name="highlights" value={formData.highlights} onChange={handleChange} rows="4" style={{width: '100%'}} />
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