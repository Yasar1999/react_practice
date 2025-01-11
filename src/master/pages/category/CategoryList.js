import React, { useEffect, useState } from 'react';
import PopupForm from "./AddEditCategoryForm"; // Popup for add/edit form
import { getItems, deleteItem, createItem, updateItem, partialupdateItem } from "../../../ApiUtils.js"; // API calls
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useLoading } from "../../../Loader";
import ApiNotificationExample from "../../../ErrorPop";

function CategoryList() {
  const [items, setItems] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editData, setEditData] = useState(null); // Data for editing
  const [offset, setOffset] = useState(0); // Current offset for pagination
  const [limit, setLimit] = useState(10); // Number of items per page
  const [totalCount, setTotalCount] = useState(0); // Total number of items for pagination
  const [filterValues, setFilterValues] = useState('');
  const [display_name, setFilterDisplayName] = useState('');
  const [search_text, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { setIsLoading } = useLoading();


  // Load items when component mounts or when offset or limit changes
  useEffect(() => {
    loadItems(offset, offset + limit, filterValues);
  }, [offset, limit, filterValues]);

  // Fetch items with pagination (offset and end)
  const loadItems = async (offset, limit, filters) => {
    const response = await getItems('category', { ...filters, offset, limit });
    setApiResponse(response)
    setItems(response.data.records);
    setTotalCount(response.data.totalRecords);
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    const response = await deleteItem('category', id);
    setApiResponse(response)
    loadItems(offset, offset + limit); // Refresh items after deletion
  };

  // Handle opening the popup for add/edit
  const handleOpenPopup = (data = null) => {
    setEditData(data); // Pass data if editing, null if creating
    setIsPopupOpen(true);
  };

  // Handle form submission (add/edit)
  const handleSubmit = async (data) => {
    let response
    if (editData) {
      // Update operation
      response = await updateItem('category', editData.id, data);
    } else {
      // Create operation
      response = await createItem('category', data);
    }
    setIsPopupOpen(false); // Close the popup
    setApiResponse(response)
    loadItems(offset, offset + limit); // Refresh the list
  };

  // Handle page change
  const handlePageChange = (newOffset) => {
    setOffset(newOffset);
  };

  const handleApplyFilter = (action) => {
    if (action === "clear") {
      setFilterDisplayName("")
      setSearchText("")
      setFilterValues('');
    } else {
      const filterData = {};
    
      // Only add search_text if it's not empty
      if (search_text.trim() !== "") {
        filterData.search_text = search_text;
      }
      if (display_name.trim() !== ""){
        filterData.display_name = display_name;
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
      const response = await partialupdateItem('category', id, { is_active: !updatedItem.is_active });
      setApiResponse(response)
      loadItems(offset, offset + limit);
    } catch (error) {
      setApiResponse(error.response)
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="table-container">
      <h2 className="header-list">
        <div className="header-left">
          Category List
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
          <button onClick={handleOpenPopup} className="add-button">Add New Category</button>
        </div>
      </h2>
      <div className={`filter-container ${showFilters ? "open" : "closed"}`}>
        {showFilters && (
          <div className="filter-search-bar">
            <input
              type="text"
              placeholder="Filter by Display Name"
              value={display_name}
              onChange={(e) => setFilterDisplayName(e.target.value)}
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
            <th>Name</th>
            <th>Section</th>
            <th>Created By</th>
            <th>Modified By</th>
            <th>Created On</th>
            <th>Modified On</th>
            <th>status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.display_name}</td>
              <td>{item.section}</td>
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
                {/* Edit and Delete as icons */}
                <span
                  onClick={() => handleOpenPopup(item)}
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                  data-tooltip-content={'edit'} data-tooltip-float data-tooltip-id='edit-tooltip'
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <ReactTooltip id='edit-tooltip'/> 
                </span>
                <span
                  onClick={() => handleDelete(item.id)}
                  style={{ cursor: 'pointer' }}
                  data-tooltip-content={'delete'} data-tooltip-float data-tooltip-id='delete-tooltip'
                >
                  <ReactTooltip id='delete-tooltip'/> 
                  <FontAwesomeIcon icon={faTrash} />
                </span>
              </td>
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
        <PopupForm
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleSubmit}
          editData={editData} // Pass data for editing, null for adding
        />
      )}
      <ApiNotificationExample response={apiResponse} />
    </div>
  );
}

export default CategoryList;
