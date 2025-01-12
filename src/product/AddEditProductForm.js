import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getItems, createItem, updateItem } from "../ApiUtils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faXmarkSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom"
import { useLoading } from "../Loader";

function ProductForm({setApiResponse}) {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const editData = useMemo(() => location.state?.editData || {}, [location.state]);
  const { setIsLoading } = useLoading();
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [formData, setFormData] = useState({
    brand: '',
    categories: [
      {
        size: '',
        min_price: '',
        photo_key: '',
        colors: [{ color: '', quantity: '' }],
      },
    ],
  });

  const [popupImage, setPopupImage] = useState(null);
  const [maxCategories, setMaxCategories ] = useState(1);
  const MAX_COLORS = 2;

  const validateForm = () => {
    const newErrors = { ...errors};
    
    if (!formData.brand) {
      newErrors['brand'] = "Brand is required";
    }
  
    if (!category) {
      newErrors['category'] = "Category is required";
    }
  
    formData.categories.forEach((cat, catIndex) => {
      if (!cat.size) {
        newErrors[`size_${catIndex}`] = "Size is required for category";
      }
      if (!cat.min_price || cat.min_price <= 0) {
        newErrors[`min_price_${catIndex}`] = "Min Price is required and must be greater than 0";
      }
      if (!cat[`a_${catIndex}`])
      {
        newErrors[`a_${catIndex}`] = "Product image is required";
      }
      cat.colors.forEach((color, colorIndex) => {
        if (!color.color) {
          newErrors[`color_${catIndex}_${colorIndex}`] = "Color is required for the selected size";
        }
        if (!color.quantity || isNaN(color.quantity) || color.quantity <= 0) {
          newErrors[`quantity_${catIndex}_${colorIndex}`] = "Quantity is required and must be greater than 0";
        }
      });
    });
  
    if (Object.entries(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };
  

  // Add a new category if under limit
  const addCategory = () => {
    if (formData.categories.length < maxCategories) {
      setFormData({
        ...formData,
        categories: [
          ...formData.categories,
          { size: '', min_price: '', photo_key: '', colors: [{ color: '', quantity: '' }] },
        ],
      });
    } else {
      alert(`Maximum of ${maxCategories} categories allowed.`);
    }
  };

  const removeCategory = (catIndex) => {
    setSelectedSizes((prev) => {
      const { [catIndex]: removed, ...remaining } = prev;
      return remaining;
    });
    setFormData((prevFormData) => {
      const updatedCategories = prevFormData.categories.filter((_, index) => index !== catIndex);
      return { ...prevFormData, categories: updatedCategories };
    });
  };
  const removeColor = (categoryIndex, colorIndex) => {
    setFormData((prevFormData) => {
      const updatedCategories = [...prevFormData.categories];
      const updatedColors = updatedCategories[categoryIndex].colors.filter((_, index) => index !== colorIndex);
      updatedCategories[categoryIndex].colors = updatedColors;
      return { ...prevFormData, categories: updatedCategories };
    });
  };

  // Add a new color to a specific category if under limit
  const addColor = (categoryIndex) => {
    const newCategories = [...formData.categories];
    if (newCategories[categoryIndex].colors.length < MAX_COLORS) {
      newCategories[categoryIndex].colors.push({ color: '', quantity: '' });
      setFormData({ ...formData, categories: newCategories });
    } else {
      alert(`Maximum of ${MAX_COLORS} colors allowed per category.`);
    }
  };

  const handleInputChange = (categoryIndex, colorIndex, name, value) => {
    const newCategories = [...formData.categories];
    const newErrors = { ...errors };
  
    const errorKey = colorIndex != null
      ? `${name}_${categoryIndex}_${colorIndex}`
      : `${name}_${categoryIndex}`;
  
    if (colorIndex != null) {
      newCategories[categoryIndex].colors[colorIndex][name] = value;
    } else if (categoryIndex !== null) {
      newCategories[categoryIndex][name] = value;
      if (name !== 'photo_key') {
        newCategories[categoryIndex]['photo_key'] = `a_${categoryIndex}`;
      }
    }
  
    delete newErrors[errorKey];  // Remove error for valid input
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      categories: newCategories,
      ...(name === 'brand' ? { brand: value } : '')
    }));
    setErrors(newErrors);
  };
  



  const fetchCategories = async () => {
      try {
        const response = await getItems('category');
        setCategories(response.data.records); // Store categories in state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
  const fetchBrands = async () => {
      try {
        const response = await getItems('brand');
        setBrands(response.data.records); // Store categories in state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

  const fetchSize = useCallback(async () => {
    try {
      const response = await getItems('size', { 'category__id': category });
      setSizes(response.data.records);
      setMaxCategories(response.data.totalRecords);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [category]);
  

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (category) {
      fetchSize();
    }
  }, [category, fetchSize]);
    

  // Initialize form with editData or reset for adding
  useEffect(() => {
    if (editData) {
      setIsDisabled(true);
      setCategory(editData.category);
      const updatedFormData = {
        brand: editData.brand || '',
        categories: [
          {
            size: editData.size || '',
            min_price: editData.min_price || '',
            photo_key: 'a_0',
            a_0: editData.image,
            colors: editData.product_colors,
          },
        ]
      };
      const initialUrlMap = updatedFormData.categories.reduce((acc, category, index) => {
        if (category.a_0) {
          acc[`preview_${index}`] = category.a_0;  // Use existing image URL
        }
        return acc;
      }, {});
      
      setUrlMap(initialUrlMap);  // Set initial preview URLs
      setFormData(updatedFormData);
    }
  }, [editData]);
  
  const [urlMap, setUrlMap] = useState({}); // Global or component-level map to store URLs by category index

  const handleFileChange = (categoryIndex, file) => {
    const newCategories = [...formData.categories];
  
    if (urlMap[`preview_${categoryIndex}`]) {
      URL.revokeObjectURL(urlMap[`preview_${categoryIndex}`]);  // Revoke previous URL
    }
  
    if (file) {
      const previewUrl = file ? URL.createObjectURL(file) : newCategories[categoryIndex].a_0;
      setUrlMap((prev) => ({ ...prev, [`preview_${categoryIndex}`]: previewUrl }));
      
      newCategories[categoryIndex][`a_${categoryIndex}`] = file;
    }
  
    setFormData({ ...formData, categories: newCategories });
  };
  
  const handleSizeChange = (categoryIndex, sizeId) => {
    setSelectedSizes((prev) => ({ ...prev, [categoryIndex]: sizeId }));
    handleInputChange(categoryIndex, null, 'size', sizeId); // Update formData
  };

  const getAvailableSizes = (sizeId) => {
    const usedSizeIds = new Set(Object.values(selectedSizes).filter((value) => value !== sizeId));
    return sizes.filter((size) => !usedSizeIds.has(size.id));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; 
    }
    setIsLoading(true);
    try{
      const formDataToSend = new FormData();

      formDataToSend.append('data', JSON.stringify({
        brand: formData.brand,
        categories: formData.categories.map((category, index) => ({
          size: category.size,
          min_price: category.min_price,
          photo_key: `a_${index}`, // Ensure this matches the dynamic photo key
          colors: category.colors
        }))
      }));
      // }
      

      // Loop through categories and add the corresponding files
      formData.categories.forEach((category, index) => {
        const fileKey = `a_${index}`;
        const file = category[fileKey]; // Ensure file is available for each category
        if (file) {
          formDataToSend.append(fileKey, file);
        }
      });
      if (editData){
        const response = await updateItem('product', editData.id, formDataToSend, { 'Content-Type': 'multipart/form-data' });
        if (response.status === 200){
          setApiResponse(response)
          navigate('/product')
        }
      }
      else {
        const response = await createItem('product', formDataToSend, { 'Content-Type': 'multipart/form-data' });
        if (response.status === 201){
          setApiResponse(response)
          navigate('/product')
        }
      }
    }
    catch(error){
      setApiResponse(error.response)
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setPopupImage(imageUrl);  // Show the popup with the selected image
  };
  
  const handleCategoryCheck = (e) => {
    if (e.target.value !== null) {
      setCategory(e.target.value);
      delete errors['category'];
    }
  };


  return (
    <div className="row px-2 col-12 product-container">
      <form className="common-form" onSubmit={handleSubmit}>
      <div className="row mt-2">
          <div className="col-12">
            <h3>{editData ? "Edit Product" : "Add Product"}</h3>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12">
            <h4>Product Information</h4>
          </div>
        </div>
        
        <div className="row form-group-container">
          <div className="form-group col-lg-3">
            <label htmlFor="brand">Brand <span style={{color:'red'}}>*</span></label>
            <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange(null, null, 'brand', Number(e.target.value))}
                required
                disabled={isDisabled}
              >
                <option value="" disabled>
                  Select a Brand
                </option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.display_name}
                  </option>
                ))}
              </select>
              {errors['brand'] && (
              <small className="error-message">{errors['brand']}</small>
            )}
          </div> 
          <div className="form-group col-lg-3">
          <label htmlFor="category">Category <span style={{color:'red'}}>*</span></label>
            <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => handleCategoryCheck(e)}
                required
                disabled={isDisabled}
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
              {errors['category'] && (
              <small className="error-message">{errors['category']}</small>
            )}
          </div> 
        </div>
        {sizes.length > 0 && (
        <>
        <div className="row mt-2">
        <h6 className="header-list">
          <div className="header-left">Size Chart
          </div>
          {!editData && (<div className="header-right">
            <button className="add-category-button" onClick={addCategory}>➕ Add Category</button>
          </div>)}
        </h6>
        </div>
        {formData.categories.map((category, catIndex) => (
        <div>
          <div className="row form-group-container">
            <div className="form-group col-lg-3">
              <label htmlFor={`size_${catIndex}`}>Size <span style={{color:'red'}}>*</span></label>
              <select
                id={`size_${catIndex}`}
                name={`size_${catIndex}`}
                value={category.size || ''}
                onChange={(e) => handleSizeChange(catIndex, Number(e.target.value))}
                required
                disabled={isDisabled}
              >
              <option value="" disabled>Select a Size</option>
                {getAvailableSizes(category.size).map((size) => (
                  <option key={size.id} value={size.id}>{size.size}</option>
                ))}
              </select>
              {errors[`size_${catIndex}`] && (
              <small className="error-message">{errors[`size_${catIndex}`]}</small>
            )}
            </div>
            <div className="form-group col-lg-3">
              <label htmlFor={`minprice_${catIndex}`}>Min Price <span style={{color:'red'}}>*</span></label>
              <input
              id={`minprice_${catIndex}`}
              name={`minprice_${catIndex}`}
              type="text"
              placeholder="Min Price"
              value={category.min_price}
              required
              onChange={(e) => handleInputChange(catIndex, null, 'min_price', Number(e.target.value))}
            />
            {errors[`min_price_${catIndex}`] && (
              <small className="error-message">{errors[`min_price_${catIndex}`]}</small>
            )}
            </div>
            <div className="form-group col-lg-3">
              <label htmlFor={`productpic_${catIndex}`}>Photo <span style={{color:'red'}}>*</span></label>
              <input
              id={`productpic_${catIndex}`}
              name={`productpic_${catIndex}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(catIndex, e.target.files[0], e)}
              style={{ border: '1px solid #ccc', padding: '5px' }}
            />
            {errors[`a_${catIndex}`] && (
              <small className="error-message">{`a_${catIndex}`}</small>
            )}
            </div>
            {urlMap[`preview_${catIndex}`] && (
              <div className="form-group col-lg-2 d-flex justify-content-center align-items-center">
                <img 
                  id={`preview_${catIndex}`} 
                  src={urlMap[`preview_${catIndex}`]} 
                  alt="Preview" 
                  className="preview-image" 
                  onClick={() => handleImageClick(urlMap[`preview_${catIndex}`])}
                />
              </div>
            )}
            {popupImage && (
              <div className="image-popup" onClick={() => setPopupImage(null)}>
                <div className="image-popup-overlay"></div>
                <div className="image-popup-content">
                  <img src={popupImage} alt="Full Size" />
                  <span onClick={() => setPopupImage(null)}><FontAwesomeIcon icon={faXmarkSquare} color="#a2b3c1" size="3x"/></span>
                </div>
              </div>
            )}
            {catIndex !== 0 && (<div className="form-group col-lg-1 col-md-1 d-flex justify-content-center align-items-center pt-3">
              <span onClick={() => removeCategory(catIndex)} style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faTrash} color="black" />
              </span>
            </div>)}
          </div>
          <div className="row">
            <h6 className="header-list">
            <div className="header-left">Colors
            </div>
            <div className="header-right">
              <button className="add-category-button" onClick={() => addColor(catIndex)}>➕ Add Color</button>
            </div>
            </h6>
          </div>
          {category.colors.map((color, colorIndex) => (
            <div className="row form-group-container pr-3">
              <div className="form-group col-lg-4">
              <label htmlFor={`color_${colorIndex}`}>Color <span style={{color:'red'}}>*</span></label>
                <div className="color-display">
                  <input
                    id={`color_${colorIndex}`}
                    name={`color_${colorIndex}`}
                    type="color"
                    value={color.color}
                    required
                    onChange={(e) => handleInputChange(catIndex, colorIndex, 'color', e.target.value)}
                  />
                  <span className="color-hex">{color.color}</span>
                  {errors[`color_${catIndex}_${colorIndex}`] && (
                    <small className="error-message">{errors[`color_${catIndex}_${colorIndex}`]}</small>
                  )}
                </div>
              </div>
              <div className="form-group col-lg-4">
                <label htmlFor={`quantity_${colorIndex}`}>Quantity <span style={{color:'red'}}>*</span></label>
                <input
                  id={`quantity_${colorIndex}`}
                  name={`quantity_${colorIndex}`}
                  type="number"
                  min="0"
                  onInput={(e) => {
                    if (!e.target.validity.valid || isNaN(e.target.value)) {
                      // More specific validation check
                      e.target.value = '';
                    }
                  }}
                  placeholder="Quantity"
                  value={color.quantity}
                  required
                  onChange={(e) =>
                    handleInputChange(catIndex, colorIndex, 'quantity', e.target.value)
                  }
                />
                {errors[`quantity_${catIndex}_${colorIndex}`] && (
                    <small className="error-message">{errors[`quantity_${catIndex}_${colorIndex}`]}</small>
                  )}
              </div>
              {colorIndex !== 0 && (<div className="form-group col-lg-2 col-md-2 d-flex justify-content-center align-items-center pt-3">
                <span onClick={() => removeColor(catIndex, colorIndex)} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faTrash} color="black" />
                </span>
              </div>)}
            </div>
          ))}
        </div>
      ))}
      </>
    )}
      <div className="actions">
        <button type="submit">Save</button>
      </div>
    </form>
  </div>
  );
}

export default ProductForm;
