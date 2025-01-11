import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItem } from '../ApiUtils';
import { useLoading } from "../Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";


const ProductView = () => {

    const { id } = useParams(); // Retrieve the product ID from the URL
    const [product, setProduct] = useState(null);
    const { setIsLoading } = useLoading();

    const fetchProduct = async () => {
        setIsLoading(true); // Start loading indicator
        try {
          const response = await getItem('product', id); // Fetch product by ID
          setProduct(response.data);
        } catch (error) {
          console.error('Error fetching product details:', error);
        } finally {
          setIsLoading(false); // Stop loading indicator
        }
      };
    
      useEffect(() => {
        fetchProduct();
      }, [id]); // Trigger fetchProduct when `id` changes



    return (
        product  && (<div className="product-container">
      {/* Product Image and Info Section */}
      <div className="product-main-section">
        <div>
          <Link to={`/product/`} style={{ 'cursor': 'pointer' }}>
          <FontAwesomeIcon icon={faLeftLong} />
          </Link>
        </div>
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.product_code}
            className="product-image"
          />
        </div>
        <div className="product-details-container">
          <h1 className="product-title">{product.brand} {product.category}</h1>
          {/* <p className="product-brand">Brand: {product.brand}</p> */}
          <p className="product-price">₹ {product.max_price}</p>
          <p className="product-description">{product.description}</p>
          
          {/* Additional Product Info */}
          <div className="product-additional-info">
            <p><strong>Size:</strong> {product.size}</p>
            {/* <p><strong>Age:</strong> {product.age}</p>
            <p><strong>Section:</strong> {product.section}</p>
            <p><strong>Location:</strong> Row {product.row}, Column {product.column}</p> */}
          </div>

          {/* Add to Cart Button */}
          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>

      {/* Product Colors and Quantities Section */}
      <div className="product-color-section">
        <h3 className="product-subtitle">Available Colors and Quantities</h3>
        <div className="product-color-grid">
          {product.product_color_quantity.map((colorDetail) => (
            <div key={colorDetail.id} className="product-color-card">
              <div
                className="product-color-box"
                style={{ backgroundColor: colorDetail.color }}
              ></div>
              <p>Quantity: {colorDetail.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>)
  );
};


export default ProductView;