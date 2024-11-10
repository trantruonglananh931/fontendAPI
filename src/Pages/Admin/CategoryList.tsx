import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

interface Category {
  id: string;
  categorName: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>("");

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/v4/api/Category');
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
        console.error("API did not return an array.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) {
      alert('Category name is required!');
      return;
    }

    try {
      const newCategory = { categorName: newCategoryName };
      const token = "your_jwt_token_here";

      await axios.post(
        '/v4/api/Category',
        newCategory,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      fetchCategories();
      setNewCategoryName("");
      alert('Category added successfully!');
    } catch (error: any) {
      console.error("Error adding category:", error.response?.data || error.message);
      alert('Failed to add category: ' + (error.response?.data?.message || "Unknown error"));
    }
  };

  const handleEdit = (id: string, name: string) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
  };

  const handleCancelEdit = () => {
    setEditCategoryId(null);
    setEditCategoryName("");
  };

  const token = "your_jwt_token_here";

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này?");
    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`/v4/api/Category/${id}`);
      alert('Xóa thành công!');
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert('Failed to delete category.');
    }
  };

  const handleUpdate = async () => {
    if (editCategoryId === null || !editCategoryName.trim()) {
      alert('Không thể cập nhật loại sản phẩm này!');
      return;
    }

    try {
      const updatedCategory = {
        id: editCategoryId,
        categorName: editCategoryName,
      };

      await axios.put(
        `/v4/api/Category`,
        updatedCategory,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      fetchCategories();
      setEditCategoryId(null);
      setEditCategoryName("");
      alert('Cập nhật thành công');
    } catch (error) {
      console.error("Error updating category:", error);
      alert('Failed to update category.');
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Thêm tên loại sản phẩm"
            className="py-2 px-4 border border-gray-300 rounded-sm"
          />
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-sm hover:bg-green-600"
          >
            Thêm danh mục
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {categories.length > 0 ? (
          categories.map(category => (
            <li key={category.id} className="flex justify-between items-center border rounded-sm shadow-md p-4 bg-white">
              {editCategoryId === category.id ? (
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="w-96 py-2 px-4 border border-gray-300 rounded-sm"
                />
              ) : (
                <span className="text-lg font-bold">{category.categorName}</span>
              )}
              <div className="space-x-2">
                {editCategoryId === category.id ? (
                  <>
                    <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 mr-3 rounded-lg">
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3  mr-3  rounded-lg">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(category.id, category.categorName)} className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </ul>
    </div>
  );
};

export default CategoryList;
