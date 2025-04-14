import { useState, useRef } from "react";

export default function AddMerchandiseForm(){
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://spacelandmark.onrender.com";

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

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Create a FormData object to handle file uploads
        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('price', price);
        formData.append('quantity', quantity);
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/add-merch`, {
                method: "POST",
                body: formData, // Don't set Content-Type header when using FormData
            });

            const data = await res.json();
            setMessage(data.message || data.error || "Unexpected behavior");

            if(res.ok){
                setItemName("");
                setPrice("");
                setQuantity("");
                setImage(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        } catch (error) {
            console.error("Error adding merchandise:", error);
            setMessage("Failed to add merchandise. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-lg mt-8">
            <h2 className="text-xl font-bold text-white">➕ Add New Merchandise</h2>
            
            {/* Image Preview */}
            {imagePreview && (
                <div className="mb-4">
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-40 w-40 object-cover rounded-lg mx-auto border-2 border-purple-500"
                    />
                </div>
            )}
            
            {/* Image Upload */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300 mb-1">
                    Product Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="w-full p-2 rounded bg-black text-white border border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
            </div>
            
            <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Item Name"
                required
                className="w-full p-2 rounded bg-black text-white"
            />
            <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                required
                className="w-full p-2 rounded bg-black text-white"
            />
            <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                required
                className="w-full p-2 rounded bg-black text-white"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                Add Item
            </button>
            {message && <p className="text-green-400 mt-2">{message}</p>}
        </form>
    );
}