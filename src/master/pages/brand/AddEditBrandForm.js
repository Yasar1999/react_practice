import React, { useState, useEffect } from "react";

function PopupForm({ isOpen, onClose, onSubmit, editData }) {
  const [formData, setFormData] = useState({
    display_name: "",
    description: "",
  });

  // Initialize form with editData or reset for adding
  useEffect(() => {
    if (editData) {
      setFormData({
        display_name: editData.display_name || '',
        description: editData.description || ''
      });
    } else {
      setFormData({ display_name: "", description: "" });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass data back to parent
  };

  if (!isOpen) return null; // Don't render if popup is closed

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{editData ? "Edit Brand" : "Add Brand"}</h2>
        <form className="common-form" onSubmit={handleSubmit}>
        <div className="form-group-container row">
          <div className="form-group col-md-6">
            <label htmlFor="display_name">Display Name</label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="1"
              required
            ></textarea>
          </div>
          </div>
          <div className="actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PopupForm;
