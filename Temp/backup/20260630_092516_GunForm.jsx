import { useState, useEffect } from 'react';
import useInventoryStore from '../stores/useInventoryStore';

export default function GunForm({ userId, initialData, onEditComplete }) {
  const { addGun, updateGun } = useInventoryStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!initialData);
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
    appraisal_contact_phone: '',
    resale_contact_name: '',
    resale_contact_email: '',
    resale_contact_phone: '',
    highlights: '',
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        caliber: initialData.caliber || '',
        type: initialData.type || 'Pistol',
        serial_number: initialData.serial_number || '',
        mfg_name: initialData.mfg_name || '',
        year_produced: initialData.year_produced || '',
        reload_eligible: initialData.reload_eligible || false,
        date_purchased: initialData.date_purchased || '',
        year_purchased: initialData.year_purchased || '',
        purchased_from: initialData.purchased_from || '',
        purchase_method: initialData.purchase_method || '',
        appraised_value: initialData.appraised_value || '',
        appraisal_year: initialData.appraisal_year || '',
        appraisal_source: initialData.appraisal_source || '',
        appraisal_contact_name: initialData.appraisal_contact_name || '',
        appraisal_contact_email: initialData.appraisal_contact_email || '',
        appraisal_contact_phone: initialData.appraisal_contact_phone || '',
        resale_contact_name: initialData.resale_contact_name || '',
        resale_contact_email: initialData.resale_contact_email || '',
        resale_contact_phone: initialData.resale_contact_phone || '',
        highlights: initialData.highlights || '',
      });
    }
  }, [initialData]);

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/\D/g, '');
    const len = phoneNumber.length;
    if (len < 4) return phoneNumber;
    if (len < 7) return '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3);
    return '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3, 6) + '-' + phoneNumber.slice(6, 10);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Apply US phone formatting
    if (name === 'appraisal_contact_phone' || name === 'resale_contact_phone') {
      newValue = formatPhoneNumber(newValue);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const gunData = {
  ...formData,
  date_purchased: formData.date_purchased === '' ? null : formData.date_purchased,
      year_produced: formData.year_produced === '' ? null : parseInt(formData.year_produced),
      year_purchased: formData.year_purchased === '' ? null : parseInt(formData.year_purchased),
      appraised_value: formData.appraised_value === '' ? null : parseFloat(formData.appraised_value),
      appraisal_year: formData.appraisal_year === '' ? null : parseInt(formData.appraisal_year),
    };

    try {
      if (isEditMode && initialData) {
        await updateGun(initialData.id, gunData);
        console.log('[DEBUG] Gun updated successfully');
      } else {
        await addGun(gunData, userId);
        console.log('[DEBUG] Gun added successfully');
      }
      
      // Reset form if not in edit mode
      if (!isEditMode) {
        setFormData({
          name: '', caliber: '', type: 'Pistol', serial_number: '', mfg_name: '',
          year_produced: '', reload_eligible: false, date_purchased: '', year_purchased: '',
          purchased_from: '', purchase_method: '', appraised_value: '', appraisal_year: '',
          appraisal_source: '', appraisal_contact_name: '', appraisal_contact_email: '',
          appraisal_contact_phone: '', resale_contact_name: '', resale_contact_email: '',
          resale_contact_phone: '', highlights: '',
        });
        alert('Gun added successfully!');
      } else {
        alert('Gun updated successfully!');
        if (onEditComplete) onEditComplete();
      }
    } catch (error) {
      console.error('[DEBUG] Operation failed:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={{maxWidth: '600px', margin: '0 auto 40px', padding: '30px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)'}}>
      <h2 style={{textAlign: 'center', marginBottom: '30px'}}>{isEditMode ? 'Edit Firearm' : 'Add New Firearm'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '20px'}}>
          <label htmlFor="name" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Model Name *</label>
          <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required style={{width: '100%'}} />
        </div>
        <div style={{marginBottom: '20px'}}>
          <label htmlFor="caliber" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Caliber *</label>
          <input id="caliber" type="text" name="caliber" value={formData.caliber} onChange={handleChange} required style={{width: '100%'}} />
        </div>
        <div style={{marginBottom: '20px'}}>
          <label htmlFor="type" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Type of Gun *</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} required style={{width: '100%'}}>
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
              <label htmlFor="serial_number" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Serial Number</label>
              <input id="serial_number" type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="mfg_name" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Manufacturer</label>
              <input id="mfg_name" type="text" name="mfg_name" value={formData.mfg_name} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="year_produced" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Year Produced</label>
              <input id="year_produced" type="number" name="year_produced" value={formData.year_produced} onChange={handleChange} style={{width: '100%'}} />
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
              <label htmlFor="date_purchased" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Date Purchased</label>
              <input id="date_purchased" type="date" name="date_purchased" value={formData.date_purchased} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="year_purchased" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Year Purchased</label>
              <input id="year_purchased" type="number" name="year_purchased" value={formData.year_purchased} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="purchased_from" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Purchased From</label>
              <input id="purchased_from" type="text" name="purchased_from" value={formData.purchased_from} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="purchase_method" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Purchase Method</label>
              <input id="purchase_method" type="text" name="purchase_method" value={formData.purchase_method} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <h3 style={{color: 'var(--text-color)'}}>Appraisal Information</h3>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="appraised_value" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraised Value ($)</label>
              <input id="appraised_value" type="number" step="0.01" name="appraised_value" value={formData.appraised_value} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="appraisal_year" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraisal Year</label>
              <input id="appraisal_year" type="number" name="appraisal_year" value={formData.appraisal_year} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="appraisal_source" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraisal Source</label>
              <input id="appraisal_source" type="text" name="appraisal_source" value={formData.appraisal_source} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="appraisal_contact_name" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraiser Name</label>
              <input id="appraisal_contact_name" type="text" name="appraisal_contact_name" value={formData.appraisal_contact_name} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="appraisal_contact_email" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraiser Email</label>
              <input id="appraisal_contact_email" type="email" name="appraisal_contact_email" value={formData.appraisal_contact_email} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="appraisal_contact_phone" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Appraiser Phone</label>
              <input id="appraisal_contact_phone" type="tel" name="appraisal_contact_phone" value={formData.appraisal_contact_phone} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <h3 style={{color: 'var(--text-color)'}}>Resale Contact</h3>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="resale_contact_name" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Contact Name</label>
              <input id="resale_contact_name" type="text" name="resale_contact_name" value={formData.resale_contact_name} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="resale_contact_email" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Contact Email</label>
              <input id="resale_contact_email" type="email" name="resale_contact_email" value={formData.resale_contact_email} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="resale_contact_phone" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Contact Phone</label>
              <input id="resale_contact_phone" type="tel" name="resale_contact_phone" value={formData.resale_contact_phone} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '30px 0'}} />
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="highlights" style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--text-color)'}}>Notes & Highlights</label>
              <textarea id="highlights" name="highlights" value={formData.highlights} onChange={handleChange} rows="4" style={{width: '100%'}} />
            </div>
          </div>
        )}
        <button type="submit" style={{width: '100%', padding: '15px', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: 'var(--border-radius)', fontSize: 'var(--font-size-lg)', fontWeight: '600', cursor: 'pointer'}}>
          {isEditMode ? 'Update Gun' : 'Add to Inventory'}
        </button>
      </form>
    </div>
  );
}