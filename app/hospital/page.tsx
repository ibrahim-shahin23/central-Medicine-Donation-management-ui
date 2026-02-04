'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function HospitalPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    hospital_id: '',
    medicine_name: '',
    requested_quantity: '',
    hospital_city: '',
    patient_status: 'Routine',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hospitals`);
      if (response.ok) {
        const data = await response.json();
        setHospitals(data.hospitals || []);
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const handleHospitalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hospitalId = e.target.value;
    setFormData({ ...formData, hospital_id: hospitalId });
    
    const hospital = hospitals.find(h => h.hospital_id === parseInt(hospitalId));
    if (hospital) {
      setFormData(prev => ({ ...prev, hospital_city: hospital.city }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hospital_id: parseInt(formData.hospital_id),
          requested_quantity: parseInt(formData.requested_quantity),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Request submitted successfully! It will be processed soon.' 
        });
        setFormData({
          hospital_id: formData.hospital_id,
          medicine_name: '',
          requested_quantity: '',
          hospital_city: formData.hospital_city,
          patient_status: 'Routine',
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Request submission failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hospital Portal</h1>
        <p>Request medicines for your patients</p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <div className={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <h3>Priority Processing</h3>
            <p>Emergency requests are prioritized. Fulfillment based on proximity and medicine expiration dates.</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {message.text}
            </div>
          )}

          <div className="form-group">
            <label className="form-label form-label-required">Hospital</label>
            <select
              className="form-select"
              value={formData.hospital_id}
              onChange={handleHospitalChange}
              required
            >
              <option value="">Select your hospital</option>
              {hospitals.map(hospital => (
                <option key={hospital.hospital_id} value={hospital.hospital_id}>
                  {hospital.hospital_name} - {hospital.city}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formRow}>
            <div className="form-group">
              <label className="form-label form-label-required">Medicine Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.medicine_name}
                onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
                required
                placeholder="e.g., Paracetamol 500mg"
              />
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Quantity Needed</label>
              <input
                type="number"
                className="form-input"
                value={formData.requested_quantity}
                onChange={(e) => setFormData({ ...formData, requested_quantity: e.target.value })}
                required
                min="1"
                placeholder="Number of units"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label form-label-required">Patient Status</label>
            <div className={styles.radioGroup}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="patient_status"
                  value="Emergency"
                  checked={formData.patient_status === 'Emergency'}
                  onChange={(e) => setFormData({ ...formData, patient_status: e.target.value })}
                  className="form-radio"
                />
                <div className={styles.radioContent}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <div>
                    <div className={styles.radioLabel}>Emergency</div>
                    <div className={styles.radioHint}>Urgent medical need</div>
                  </div>
                </div>
              </label>

              <label className={styles.radio}>
                <input
                  type="radio"
                  name="patient_status"
                  value="Routine"
                  checked={formData.patient_status === 'Routine'}
                  onChange={(e) => setFormData({ ...formData, patient_status: e.target.value })}
                  className="form-radio"
                />
                <div className={styles.radioContent}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  <div>
                    <div className={styles.radioLabel}>Routine</div>
                    <div className={styles.radioHint}>Standard request</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || !formData.hospital_id}>
            {loading ? <span className="spinner"></span> : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}