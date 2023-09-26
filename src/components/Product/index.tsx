import { PropductModel } from '../../models/product';

export interface ProductProps {
  product: PropductModel;
}

const Product = ({ product }: ProductProps) => {
  return (
    <div className="py-2">
      <p className="text-sm font-medium text-gray-900">
        {product.name}: {product.length}cm x {product.width}cm
      </p>
      <p>Preis: €{product.price}</p>
    </div>
  );
};

export default Product;
