import React, { useEffect, useState, useCallback } from 'react';
import { getItems, deleteItem, partialupdateItem } from "../ApiUtils.js"; // API calls
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useLoading } from "../Loader";
import { useNavigate, Link } from "react-router-dom"

function ProductList({setApiResponse}) {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0); // Current offset for pagination
  const [limit] = useState(10); // Number of items per page
  const [totalCount, setTotalCount] = useState(0); // Total number of items for pagination
  const [filterValues, setFilterValues] = useState('');
  const [category, setSearchCategory] = useState('');
  const [search_text, setSearchText] = useState('');
  const [size, setSearchSize] = useState('');
  const [age, setSearchAge] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await getItems('category');
      setCategories(response.data.records); // Store categories in state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Load items when component mounts
  const loadItems = useCallback(async (offset, end, filter) => {
    setIsLoading(true);
    try {
      const response = await getItems('product', { ...filter, offset, end });
      setItems(response.data.records);
      setTotalCount(response.data.totalRecords);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);
  
  useEffect(() => {
    fetchCategories();
  }, []);  // Only call fetchCategories once on mount
  
  useEffect(() => {
    loadItems(offset, offset + limit, filterValues);
  }, [offset, limit, filterValues, loadItems]);
  

  // Handle delete operation
  const handleDelete = async (id) => {
    try{
      const response = await deleteItem('product', id);
      setApiResponse(response)
      loadItems(offset, offset + limit); // Refresh items after deletion
    }
    catch(error){
      setApiResponse(error.response)
    }
  };

  // Handle edit
  const handleEditChange = (data = null) => {
    // setEditData(data); // Pass data if editing, null if creating
    navigate(`/product/edit/${data.id}`, { state: { editData: data } });
  };


   // Handle page change
   const handlePageChange = (newOffset) => {
    setOffset(newOffset);
  };


  const handleApplyFilter = (action) => {
  if (action === "clear") {
    setSearchCategory("");
    setSearchText("");
    setSearchAge("");
    setSearchSize("");
    setFilterValues({});
  } else {
    const filterData = {};
    if (search_text.trim() !== "") filterData.search_text = search_text;
    if (category !== "") filterData.category__id = category;
    if (age.trim() !== "") filterData.age = age;
    if (size.trim() !== "") filterData.size = size;
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
      const response = await partialupdateItem('product', id, { is_active: !updatedItem.is_active });
      setApiResponse(response)
      loadItems(offset, offset + limit);
    } catch (error) {
      setApiResponse(error.response)
    }
  };

  return (
    <div className="table-container">
      <h2 className="header-list">
        <div className="header-left">
          Product List
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
          <button onClick={() => navigate('/product/create')} className="add-button">Add New Product</button>
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
            <th>Product Code</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Size</th>
            <th>Min Price</th>
            <th>Max Price</th>
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
              <td> 
                <Link to={`/product/${item.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                {item.product_code}
                </Link>
              </td>
              <td>{item.brand_name}</td>
              <td>{item.category_name}</td>
              <td>{item.size_value}</td>
              <td>{item.min_price}</td>
              <td>{item.max_price}</td>
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
                  onClick={() => handleEditChange(item)}
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
    </div>
  );
}

export default ProductList;
