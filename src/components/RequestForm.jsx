import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const RequestForm = () => {
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showNoPosFields, setShowNoPosFields] = useState(false);
  const [noPosData, setNoPosData] = useState({
    orderNumber: '',
    address: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await apiFetch('/medications');
        setMedications(data || []);
        if (data && data.length > 0) {
          setSelectedMedication(data[0].id);
          setShowNoPosFields(data[0].noPos);
        }
      } catch (err) {
        setError('Failed to fetch medications.');
      }
    };
    fetchMedications();
  }, []);

  useEffect(() => {
    const medication = medications.find(
      (med) => med.id === parseInt(selectedMedication, 10)
    );
    setShowNoPosFields(medication?.noPos);
  }, [selectedMedication, medications]);

  const handleNoPosChange = (e) => {
    const { name, value } = e.target;
    setNoPosData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedMedication || quantity <= 0) {
      setError('Please select a medication and enter a valid quantity.');
      return;
    }

    const requestBody = {
      medicationId: parseInt(selectedMedication, 10),
      quantity: parseInt(quantity, 10),
    };

    if (showNoPosFields) {
      Object.assign(requestBody, noPosData);
    }

    try {
      await apiFetch('/requests', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      setSuccessMessage('Request created successfully!');
      setQuantity(1);
      setNoPosData({
        orderNumber: '',
        address: '',
        phone: '',
        email: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to create request.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                Create Medication Request
              </h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="medication">Medication</label>
                  <select
                    id="medication"
                    className="form-select"
                    value={selectedMedication}
                    onChange={(e) => setSelectedMedication(e.target.value)}
                  >
                    {medications.map((med) => (
                      <option key={med.id} value={med.id}>
                        {med.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                {showNoPosFields && (
                  <>
                    <div className="form-group mb-3">
                      <label htmlFor="orderNumber">Order Number</label>
                      <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        className="form-control"
                        value={noPosData.orderNumber}
                        onChange={handleNoPosChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="form-control"
                        value={noPosData.address}
                        onChange={handleNoPosChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={noPosData.phone}
                        onChange={handleNoPosChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={noPosData.email}
                        onChange={handleNoPosChange}
                        required
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-primary w-100">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;

