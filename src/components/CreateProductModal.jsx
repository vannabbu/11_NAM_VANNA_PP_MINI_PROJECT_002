import { useState } from "react";
import { createProduct } from "@/service/products.service";
import { categories } from "@/data/mockData";

const CreateProductModal = ({ isOpen, onClose, refreshData }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    colors: [],
    sizes: []
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createProduct(form);
    if (result) {
      refreshData(); 
      onClose();     
    }
  };

  const toggleItem = (listName, value) => {
    setForm(prev => ({
      ...prev,
      [listName]: prev[listName].includes(value) 
        ? prev[listName].filter(i => i !== value) 
        : [...prev[listName], value]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create product</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input 
                className="w-full border rounded-xl p-3" 
                placeholder="e.g. Tea-Trica BHA Foam"
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input 
                type="number" 
                className="w-full border rounded-xl p-3" 
                placeholder="e.g. 62"
                onChange={e => setForm({...form, price: e.target.value})}
              />
            </div>
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-2">Colors</label>
            <div className="flex gap-2">
              {['green', 'gray', 'red', 'blue', 'white'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleItem('colors', color)}
                  className={`px-4 py-1 rounded-full border transition-all ${
                    form.colors.includes(color) ? 'bg-black text-white' : 'bg-white'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-2">Sizes</label>
            <div className="flex gap-2">
              {['s', 'm', 'l', 'xl', 'xxl'].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleItem('sizes', size)}
                  className={`px-4 py-1 rounded-full border uppercase transition-all ${
                    form.sizes.includes(size) ? 'bg-black text-white' : 'bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="w-full border rounded-xl p-3 h-24" 
              placeholder="Short description..."
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>
          <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Category</label>
        <select 
          className="w-full border rounded-xl p-3 bg-white focus:ring-2 focus:ring-slate-100 outline-none"
          value={form.categoryId || ""} 
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
        >
          <option value="" disabled>Select Category</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-full font-bold">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#befa00] rounded-full font-bold hover:opacity-90">Create product</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateProductModal ;