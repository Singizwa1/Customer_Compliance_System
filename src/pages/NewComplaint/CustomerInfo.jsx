import React from "react";

const CustomerInfo = ({ formData, errors, handleChange }) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Customer Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="customerName" className="form-label">
            Customer Name *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
            value={formData.customerName}
            onChange={handleChange}
          />
          {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="customerPhone" className="form-label">
            Phone Number *
          </label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            className={`form-control ${errors.customerPhone ? "is-invalid" : ""}`}
            value={formData.customerPhone}
            onChange={handleChange}
          />
          {errors.customerPhone && <div className="invalid-feedback">{errors.customerPhone}</div>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="channel" className="form-label">
          Contact Channel
        </label>
        <select
          id="channel"
          name="channel"
          className="form-control"
          value={formData.channel}
          onChange={handleChange}
        >
          <option value="Phone">Phone</option>
          <option value="Email">Email</option>
          <option value="Visit">Visit</option>
          <option value="Whatsapp">Whatsapp</option>
          <option value="SMS">SMS</option>
        </select>
      </div>
    </div>
  );
};

export default CustomerInfo;