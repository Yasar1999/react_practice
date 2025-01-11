// routes.js
import BrandList from './master/pages/brand/BrandList';
import BrandForm from './master/pages/brand/AddEditBrandForm';
import CategoryList from './master/pages/category/CategoryList';
import CategoryForm from './master/pages/category/AddEditCategoryForm';
import SizeList from './master/pages/size/SizeList';
import SizeForm from './master/pages/size/AddEditSizeForm';
import ProductList from './product/ProductList';
import ProductForm from './product/AddEditProductForm';
import Dashboard from './dashboard';
import LoginPage from "./login";
import ProductView from './product/ProductView';

const routes = [
  { path: '/', element: <LoginPage />, isProtected: false },
  { path: '/dashboard', element: <Dashboard />, isProtected: true },
  { path: '/brands', element: <BrandList />, isProtected: true },
  { path: '/brands/create', element: <BrandForm isOpen={true} editData={null} />, isProtected: true },
  { path: '/brands/edit/:id', element: <BrandForm />, isProtected: true },
  { path: '/category', element: <CategoryList />, isProtected: true },
  { path: '/category/create', element: <CategoryForm isOpen={true} editData={null} />, isProtected: true },
  { path: '/category/edit/:id', element: <CategoryForm />, isProtected: true },
  { path: '/size', element: <SizeList />, isProtected: true },
  { path: '/size/create', element: <SizeForm isOpen={true} editData={null} />, isProtected: true },
  { path: '/size/edit/:id', element: <SizeForm />, isProtected: true },
  { path: '/product', element: <ProductList />, isProtected: true },
  { path: '/product/create', element: <ProductForm />, isProtected: true },
  { path: '/product/edit/:id', element: <ProductForm />, isProtected: true },
  { path: '/product/:id', element: <ProductView />, isProtected: true },
];

export default routes;
