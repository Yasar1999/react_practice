import React, { useEffect, useState } from 'react';
import SizePopupForm from "./AddEditSizeForm"; // Popup for add/edit form
import { getItems, deleteItem, createItem, updateItem, partialupdateItem } from "../../../ApiUtils.js"; // API calls
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from 'react-tooltip';

function BrandList() {
  const [items, setItems] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editData, setEditData] = useState(null); // Data for editing
  const [offset, setOffset] = useState(0); // Current offset for pagination
  const [limit, setLimit] = useState(10); // Number of items per page
  const [totalCount, setTotalCount] = useState(0); // Total number of items for pagination
  const [filterValues, setFilterValues] = useState('');
  const [category, setSearchCategory] = useState('');
  const [search_text, setSearchText] = useState('');
  const [size, setSearchSize] = useState('');
  const [age, setSearchAge] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getItems('category');
      setCategories(response.data.records); // Store categories in state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Load items when component mounts
  useEffect(() => {
    fetchCategories()
    loadItems(offset, offset + limit, filterValues);
  }, [offset, limit, filterValues]);

  // Fetch all brands
  const loadItems = async (offset, end, filter) => {
    const response = await getItems('size', { ...filter, offset, end });
    setItems(response.data.records);
    setTotalCount(response.data.totalRecords);
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    await deleteItem('size', id);
    loadItems(offset, offset + limit); // Refresh items after deletion
  };

  // Handle opening the popup for add/edit
  const handleOpenPopup = (data = null) => {
    setEditData(data); // Pass data if editing, null if creating
    setIsPopupOpen(true);
  };

  // Handle form submission (add/edit)
  const handleSubmit = async (data) => {
    if (editData) {
      // Update operation
      await updateItem('size', editData.id, data);
    } else {
      // Create operation
      await createItem('size', data);
    }
    setIsPopupOpen(false); // Close the popup
    loadItems(offset, offset + limit); // Refresh the list
  };

   // Handle page change
   const handlePageChange = (newOffset) => {
    setOffset(newOffset);
  };


  const handleApplyFilter = (action) => {
    if (action === "clear") {
      setSearchCategory("")
      setSearchText("")
      setSearchAge("")
      setSearchSize("")
      setFilterValues('');
    } else {
      const filterData = {};
    
      // Only add search_text if it's not empty
      if (search_text.trim() !== "") {
        filterData.search_text = search_text;
      }
      if (category !== ""){
        filterData.category__id = category;
      }
      if (age.trim() !== ""){
        filterData.age = age;
      }
      if (size.trim() !== ""){
        filterData.size = size;
      }

      setFilterValues(filterData);
    }
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev); // Toggle the current state
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCount / limit);
  // Create an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);

  const toggleActive = async (id) => {
    const updatedItem = items.find(item => item.id === id);
    
    try {
      // Send PATCH request to update the item
      await partialupdateItem('size', id, { is_active: !updatedItem.is_active });
      
      loadItems(offset, offset + limit);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="table-container">
      <h2 className="header-list">
        <div className="header-left">
          Size List
        </div>
        <div className="header-right">
          <div className="search-container">
            <div className="search-wrapper">
            <span onClick={handleApplyFilter}>
              <FontAwesomeIcon icon={faSearch} className="search-icon"/>
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={search_text}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <button onClick={toggleFilters} className="filter-button">
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button onClick={handleOpenPopup} className="add-button">Add New Size</button>
        </div>
      </h2>
      <div className={`filter-container ${showFilters ? "open" : "closed"}`}>
        {showFilters && (
          <div className="filter-search-bar">
            <div className='form-group' style={{'width': '80%'}}>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.display_name}
                </option>
              ))}
            </select>
            </div>
            <input
              type="text"
              placeholder="Filter by Age"
              value={age}
              onChange={(e) => setSearchAge(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by Size"
              value={size}
              onChange={(e) => setSearchSize(e.target.value)}
            />
            <button onClick={() => handleApplyFilter('clear')} className="apply-button">
              Clear
            </button>
            <button onClick={() => handleApplyFilter('apply')} className="apply-button">
              Apply Filters
            </button>
          </div>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Category</th>
            <th>Size</th>
            <th>Age</th>
            <th>Section</th>
            <th>Row</th>
            <th>Column</th>
            <th>Created By</th>
            <th>Modified By</th>
            <th>Created On</th>
            <th>Modified On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{index+1}</td>
              <td>{item.category_detail.display_name}</td>
              <td>{item.size}</td>
              <td>{item.age}</td>
              <td>{item.category_detail.section}</td>
              <td>{item.row}</td>
              <td>{item.column}</td>
              <td>{item.created_by}</td>
              <td>{item.last_updated_by}</td>
              <td>{item.created_on}</td>
              <td>{item.last_updated_on}</td>
              <td>
                <div className={`toggle-switch ${item.is_active ? 'active' : ''}`} onClick={() => toggleActive(item.id)} data-tooltip-id="status-tooltip" data-tooltip-content={item.is_active ? 'Active' : 'Inactive'} data-tooltip-float>
                    <div className="slider"></div>   
                </div>
                <ReactTooltip id='status-tooltip'/>        
              </td>
              <td>
                <span
                  onClick={() => handleOpenPopup(item)}
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                  data-tooltip-content={'edit'} data-tooltip-float data-tooltip-id='edit-tooltip'>
                  <FontAwesomeIcon icon={faEdit} />
                <ReactTooltip id='edit-tooltip'/> 
                </span>
                <span
                  onClick={() => handleDelete(item.id)}
                  style={{ cursor: 'pointer' }} data-tooltip-content={'delete'} data-tooltip-float data-tooltip-id='delete-tooltip'
                >
                  <ReactTooltip id='delete-tooltip'/> 
                  <FontAwesomeIcon icon={faTrash} />
                </span>              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Links */}
      <div>
        {pageNumbers.map((pageNumber) => (
          <span
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber * limit)}
            style={{
              cursor: 'pointer',
              margin: '0 5px',
              fontWeight: offset === pageNumber * limit ? 'bold' : 'normal',
            }}
          >
            {pageNumber + 1}
          </span>
        ))}
      </div>
      {/* Popup Form for Add/Edit */}
      {isPopupOpen && (
        <SizePopupForm
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleSubmit}
          editData={editData} // Pass data for editing, null for adding
        />
      )}
    </div>
  );
}

export default BrandList;
