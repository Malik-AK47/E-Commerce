import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
        <h3 className="mt-3 font-semibold text-gray-800">{product.name}</h3>

        <p className="text-gray-600 text-sm mt-1">${product.price}</p>

        <button className="mt-3 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default ProductCard;
