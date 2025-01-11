import React, { useState, useEffect } from "react";
import {getItems } from "../../../ApiUtils.js";

function SizePopupForm({ isOpen, onClose, onSubmit, editData }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    size: "",
    age: "",
    category: "",
    row: "",
    column: "",
    max_percentage: ""
  });

  const fetchCategories = async () => {
    try {
      const response = await getItems('category');
      setCategories(response.data.records); // Store categories in state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Initialize form with editData or reset for adding
  useEffect(() => {
    fetchCategories()
    if (editData) {
      setFormData({
        size: editData.size || "",
        age: editData.age || "",
        category: editData.category || "",
        row: editData.row || "",
        column: editData.column || "",
        max_percentage: editData.max_percentage || ""
      });
    } else {
      setFormData({ size: "", age: "", category_id: "", row: "", column: "", max_percentage: "" });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // setFormData((prevData) => ({
    //     ...prevData,
    //     [name]:
    // name === "category" || name === "size" || name === "max_percentage"
    //   ? parseInt(value, 10)
    //   : value,
    //   }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass data back to parent
  };

  if (!isOpen) return null; // Don't render if popup is closed

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{editData ? "Edit Category" : "Add Category"}</h2>
        <form className="common-form" onSubmit={handleSubmit}>
          <div className="form-group-container row">
            <div className="form-group col-md-6">
              <label htmlFor="size">Size</label>
              <input
                type="number"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group-container row">
            <div className="form-group col-md-6">
              <label htmlFor="row">Row</label>
              <input
                type="number"
                id="row"
                name="row"
                value={formData.row}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="column">Column</label>
              <input
                type="number"
                id="column"
                name="column"
                value={formData.column}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group-container row">
          <div className="form-group col-md-6">
              <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                    Select a category
                    </option>
                    {/* Render categories as options */}
                    {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.display_name} {/* Use display_name as the visible text */}
                    </option>
                    ))}
                </select>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="max_percentage">Max Percentage</label>
              <input
                type="number"
                id="max_percentage"
                name="max_percentage"
                value={formData.max_percentage}
                onChange={handleChange}
                required
              />
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

export default SizePopupForm;
