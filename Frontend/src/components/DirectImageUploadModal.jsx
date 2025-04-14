import { useState, useRef } from 'react';

const DirectImageUploadModal = ({ isOpen, onClose, item, onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

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
    
    if (!image) {
      setError('Please select an image to upload');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Log to verify we have the correct data
      console.log("Submitting form with data:", {
        merchandiseID: item.merchandiseID,
        itemName: item.itemName,
        price: item.price,
        quantity: item.quantity,
        image: image.name // just logging the name for verification
      });
      
      // Create FormData for multipart form submission
      const formData = new FormData();
      formData.append('merchandiseID', item.merchandiseID);
      formData.append('itemName', item.itemName);
      formData.append('price', item.price);
      formData.append('quantity', item.quantity);
      formData.append('giftShopName', item.giftShopName || '');
      formData.append('description', item.description || '');
      formData.append('image', image);
      
      console.log("Sending request to:", `${BACKEND_URL}/supervisor/merchandise/update-item`);
      
      const response = await fetch(`${BACKEND_URL}/supervisor/merchandise/update-item`, {
        method: 'PUT',
        body: formData
      });
      
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Invalid JSON response: " + responseText);
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to upload image');
      }
      
      // Update was successful
      if (onUploadSuccess) {
        onUploadSuccess(responseData.item || responseData);
      }
      
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Upload Image for {item.itemName}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Image */}
          {item.imageUrl && (
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-400 mb-2">Current Image:</p>
              <img 
                src={item.imageUrl} 
                alt={item.itemName || 'Product'} 
                className="h-40 w-40 object-cover rounded-lg mx-auto border-2 border-gray-600"
              />
            </div>
          )}
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-400 mb-2">New Image Preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-40 w-40 object-cover rounded-lg mx-auto border-2 border-purple-500"
              />
            </div>
          )}
          
          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300">
              Select New Image
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
              disabled={isLoading || !image}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectImageUploadModal; 