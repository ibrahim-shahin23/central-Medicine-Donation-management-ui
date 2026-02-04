'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { format } from 'date-fns';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'requests' | 'process'>('stock');
  const [stockData, setStockData] = useState<any[]>([]);
  const [requestData, setRequestData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (activeTab === 'stock') {
      fetchStock();
    } else if (activeTab === 'requests') {
      fetchRequests();
      fetchSummary();
    }
  }, [activeTab]);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock/status`);
      if (response.ok) {
        const data = await response.json();
        setStockData(data.stock || []);
      }
    } catch (error) {
      console.error('Failed to fetch stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests`);
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        setRequestData(data.requests || []);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests/summary`);
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const processRequests = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests/process`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Requests processed successfully!');
        fetchRequests();
        fetchSummary();
        fetchStock();
      } else {
        alert('Failed to process requests');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Monitor stock levels and manage hospital requests</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'stock' ? styles.active : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h18v18H3z"/>
            <path d="M3 9h18M9 3v18"/>
          </svg>
          Stock Status
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'requests' ? styles.active : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          Requests
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'process' ? styles.active : ''}`}
          onClick={() => setActiveTab('process')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          Process Requests
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'stock' && <StockView data={stockData} loading={loading} />}
        {activeTab === 'requests' && <RequestsView data={requestData} summary={summary} loading={loading} />}
        {activeTab === 'process' && (
          <ProcessView processing={processing} onProcess={processRequests} />
        )}
      </div>
    </div>
  );
}

function StockView({ data, loading }: { data: any[], loading: boolean }) {
  if (loading) {
    return <div className={styles.loading}>Loading stock data...</div>;
  }

  const expiringCount = data.filter(item => {
    const daysUntilExpiry = Math.floor(
      (new Date(item.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 90;
  }).length;

  const lowStockCount = data.filter(item => item.quantity_available < 10).length;

  return (
    <div className={styles.stockView}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3z"/>
              <path d="M3 9h18M9 3v18"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{data.length}</div>
            <div className={styles.statLabel}>Total Stock Items</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{expiringCount}</div>
            <div className={styles.statLabel}>Expiring Soon</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{lowStockCount}</div>
            <div className={styles.statLabel}>Low Stock</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Expiration</th>
              <th>Storage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                  No stock items found
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const daysUntilExpiry = Math.floor(
                  (new Date(item.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <tr key={item.stock_id}>
                    <td><strong>{item.medicine_name}</strong></td>
                    <td>{item.dosage}</td>
                    <td>
                      <span className={item.quantity_available < 10 ? 'badge badge-danger' : 'badge badge-success'}>
                        {item.quantity_available} units
                      </span>
                    </td>
                    <td>{item.location_city}</td>
                    <td>
                      {format(new Date(item.expiration_date), 'MMM dd, yyyy')}
                      {daysUntilExpiry <= 90 && (
                        <span className="badge badge-warning" style={{ marginLeft: '8px' }}>
                          {daysUntilExpiry}d left
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {item.storage_requirement === 'refrigerated' ? '❄️ Cold' : '🌡️ Room'}
                      </span>
                    </td>
                    <td>
                      {item.quantity_available === 0 ? (
                        <span className="badge badge-secondary">Out of Stock</span>
                      ) : daysUntilExpiry <= 30 ? (
                        <span className="badge badge-danger">Critical</span>
                      ) : daysUntilExpiry <= 90 ? (
                        <span className="badge badge-warning">Expiring</span>
                      ) : (
                        <span className="badge badge-success">Good</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RequestsView({ data, summary, loading }: { data: any[], summary: any, loading: boolean }) {
  if (loading) {
    return <div className={styles.loading}>Loading requests...</div>;
  }

  return (
    <div className={styles.requestsView}>
      {summary && (
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{summary.total_requests || 0}</div>
            <div className={styles.summaryLabel}>Total Requests</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue} style={{ color: 'var(--success)' }}>
              {summary.fulfilled_requests || 0}
            </div>
            <div className={styles.summaryLabel}>Fulfilled</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue} style={{ color: 'var(--warning)' }}>
              {summary.pending_requests || 0}
            </div>
            <div className={styles.summaryLabel}>Pending</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue} style={{ color: 'var(--info)' }}>
              {summary.fulfillment_rate ? `${summary.fulfillment_rate.toFixed(1)}%` : '0%'}
            </div>
            <div className={styles.summaryLabel}>Success Rate</div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hospital</th>
              <th>Medicine</th>
              <th>Quantity</th>
              <th>City</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                  No requests found
                </td>
              </tr>
            ) : (
              data.map((request) => (
                <tr key={request.request_id}>
                  <td>#{request.request_id}</td>
                  <td>{request.hospital_name || 'N/A'}</td>
                  <td><strong>{request.medicine_name}</strong></td>
                  <td>{request.requested_quantity} units</td>
                  <td>{request.hospital_city}</td>
                  <td>
                    <span className={request.patient_status === 'Emergency' ? 'badge badge-danger' : 'badge badge-info'}>
                      {request.patient_status}
                    </span>
                  </td>
                  <td>
                    <span className={
                      request.status === 'fulfilled' ? 'badge badge-success' :
                      request.status === 'partial' ? 'badge badge-warning' :
                      request.status === 'unfulfilled' ? 'badge badge-danger' :
                      'badge badge-secondary'
                    }>
                      {request.status}
                    </span>
                  </td>
                  <td>{format(new Date(request.requested_at), 'MMM dd, yyyy')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProcessView({ processing, onProcess }: { processing: boolean, onProcess: () => void }) {
  return (
    <div className={styles.processView}>
      <div className={styles.processCard}>
        <div className={styles.processIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        <h2>Process Hospital Requests</h2>
        <p>
          This will process all pending hospital requests using the intelligent prioritization algorithm.
          Emergency requests are processed first, followed by proximity-based allocation.
        </p>
        
        <div className={styles.processInfo}>
          <div className={styles.infoItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Priority: Emergency {'>'} Routine</span>
          </div>
          <div className={styles.infoItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Proximity: Closest donation centers first</span>
          </div>
          <div className={styles.infoItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Expiration: Nearest expiry dates first</span>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={onProcess}
          disabled={processing}
          style={{ marginTop: '24px' }}
        >
          {processing ? <span className="spinner"></span> : 'Process All Requests'}
        </button>
      </div>
    </div>
  );
}