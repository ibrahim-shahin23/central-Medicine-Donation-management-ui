'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function DonorPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'donate'>('register');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Donor Portal</h1>
        <p>Register and donate medicines to help those in need</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
          onClick={() => setActiveTab('register')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Register as Donor
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'donate' ? styles.active : ''}`}
          onClick={() => setActiveTab('donate')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
          Submit Donation
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'register' ? <RegisterForm /> : <DonationForm />}
      </div>
    </div>
  );
}

function RegisterForm() {
  const [formData, setFormData] = useState({
    nationalId: '',
    name: '',
    cityId: '',
    password: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registration successful! You can now submit donations.' });
        setFormData({ nationalId: '', name: '', cityId: '', email: '', password:'' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Registration failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label className="form-label form-label-required">National ID</label>
        <input
          type="text"
          className="form-input"
          value={formData.nationalId}
          onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
          required
          placeholder="Enter your national ID"
        />
      </div>

      <div className="form-group">
        <label className="form-label form-label-required">Full Name</label>
        <input
          type="text"
          className="form-input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label className="form-label form-label-required">City</label>
        <select
          className="form-select"
          value={formData.cityId}
          onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
          required
        >
          <option value="">Select your city</option>
          <option value="1">Cairo</option>
          <option value="2">Alexandria</option>
          <option value="3">Giza</option>
          <option value="4">Luxor</option>
          <option value="5">Aswan</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label form-label-required">Email</label>
        <input
          type="email"
          className="form-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="your.email@example.com"
        />
        <span className="form-hint">You will receive donation status updates via email</span>
      </div>

      <div className="form-group">
        <label className="form-label form-label-required">Password</label>
        <input
          type="password"
          className="form-input"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          placeholder="2134sds@#$@#%@"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? <span className="spinner"></span> : 'Register as Donor'}
      </button>
    </form>
  );
}

function DonationForm() {
  const [formData, setFormData] = useState({
    donor_id: '',
    medicine_name: '',
    dosage: '',
    quantity: '',
    expiration_date: '',
    storage_requirement: 'room_temp',
    packaging_unopened: true,
    storage_appropriate: true,
    donation_city: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === 'accepted') {
          setMessage({ type: 'success', text: 'Thank you! Your donation has been accepted and added to stock.' });
        } else {
          setMessage({ type: 'error', text: `Donation rejected: ${data.rejection_reasons}` });
        }
        setFormData({
          donor_id: formData.donor_id,
          medicine_name: '',
          dosage: '',
          quantity: '',
          expiration_date: '',
          storage_requirement: 'room_temp',
          packaging_unopened: true,
          storage_appropriate: true,
          donation_city: formData.donation_city,
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Submission failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label className="form-label form-label-required">National ID</label>
        <input
          type="text"
          className="form-input"
          value={formData.donor_id}
          onChange={(e) => setFormData({ ...formData, donor_id: e.target.value })}
          required
          placeholder="Enter your registered national ID"
        />
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
            placeholder="e.g., Paracetamol"
          />
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">Dosage</label>
          <input
            type="text"
            className="form-input"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            required
            placeholder="e.g., 500mg"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className="form-group">
          <label className="form-label form-label-required">Quantity</label>
          <input
            type="number"
            className="form-input"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            min="1"
            placeholder="Number of units"
          />
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">Expiration Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.expiration_date}
            onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
            required
          />
          <span className="form-hint">Must be at least 6 months away</span>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className="form-group">
          <label className="form-label form-label-required">Storage Requirement</label>
          <select
            className="form-select"
            value={formData.storage_requirement}
            onChange={(e) => setFormData({ ...formData, storage_requirement: e.target.value })}
            required
          >
            <option value="room_temp">Room Temperature</option>
            <option value="refrigerated">Refrigerated</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">Donation City</label>
          <select
            className="form-select"
            value={formData.donation_city}
            onChange={(e) => setFormData({ ...formData, donation_city: e.target.value })}
            required
          >
            <option value="">Select city</option>
            <option value="Cairo">Cairo</option>
            <option value="Alexandria">Alexandria</option>
            <option value="Giza">Giza</option>
            <option value="Shubra El-Kheima">Shubra El-Kheima</option>
            <option value="Port Said">Port Said</option>
            <option value="Suez">Suez</option>
            <option value="Luxor">Luxor</option>
            <option value="Mansoura">Mansoura</option>
            <option value="Tanta">Tanta</option>
            <option value="Asyut">Asyut</option>
          </select>
        </div>
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            className="form-checkbox"
            checked={formData.packaging_unopened}
            onChange={(e) => setFormData({ ...formData, packaging_unopened: e.target.checked })}
          />
          <span>Medicine packaging is unopened</span>
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            className="form-checkbox"
            checked={formData.storage_appropriate}
            onChange={(e) => setFormData({ ...formData, storage_appropriate: e.target.checked })}
          />
          <span>Storage conditions were appropriate</span>
        </label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? <span className="spinner"></span> : 'Submit Donation'}
      </button>
    </form>
  );
}