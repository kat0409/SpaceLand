import { useState, useEffect, useRef } from 'react';

const EditMerchandiseModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    quantity: '',
    giftShopName: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (item) {
      setFormData({
        itemName: item.itemName || '',
        price: item.price || '',
        quantity: item.quantity || '',
        giftShopName: item.giftShopName || '',
        description: item.description || ''
      });
      
      // Set image preview if the item has an imageUrl
      if (item.imageUrl) {
        setImagePreview(item.imageUrl);
      } else {
        setImagePreview(null);
      }
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Create FormData for multipart form submission
      const formDataObj = new FormData();
      formDataObj.append('merchandiseID', item.merchandiseID);
      formDataObj.append('itemName', formData.itemName);
      formDataObj.append('price', formData.price);
      formDataObj.append('quantity', formData.quantity);
      formDataObj.append('giftShopName', formData.giftShopName || '');
      formDataObj.append('description', formData.description || '');
      
      // Only append image if a new one was selected
      if (image) {
        formDataObj.append('image', image);
      }
      
      await onSave(formDataObj);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update merchandise');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Edit Merchandise</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 text-center">
              <img 
                src={imagePreview} 
                alt={formData.itemName || 'Product'} 
                className="h-40 w-40 object-cover rounded-lg mx-auto border-2 border-purple-500"
              />
            </div>
          )}
          
          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>
          
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-300">
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0.01"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          
          <div>
            <label htmlFor="giftShopName" className="block text-sm font-medium text-gray-300">
              Gift Shop
            </label>
            <input
              type="text"
              id="giftShopName"
              name="giftShopName"
              value={formData.giftShopName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          
          {error && (
            <div className="bg-red-900/50 text-red-300 p-2 rounded">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMerchandiseModal; 