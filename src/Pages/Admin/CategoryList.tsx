import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../Context/useAuth";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  categorName: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>("");
  const { user } = useAuth(); 
  const token = user?.token;
  const navigate = useNavigate();

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
      alert('Tên danh mục đã tồn tại!');
      return;
    }

    try {
      const newCategory = { categorName: newCategoryName };

      await axios.post(
        '/v4/api/Category',
        newCategory,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
          }
        }
      );

      fetchCategories();
      setNewCategoryName("");
      alert('Thêm mới danh mục thành công!');
    } catch (error: any) {
      console.error("Lỗi khi thên danh mục:", error.response?.data || error.message);
      alert('Thêm danh mục thất bại: ' + (error.response?.data?.message || "Unknown error"));
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
      {/* Form thêm danh mục */}
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

      {/* Bảng hiển thị danh mục */}
      {categories.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md rounded-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 w-16">STT</th>
              <th className="border border-gray-300 px-4 py-2 w-2/3 text-left">Tên danh mục</th>
              <th className="border border-gray-300 px-4 py-2 w-1/3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className="hover:bg-gray-50">
                {/* Số thứ tự */}
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>

                {/* Tên danh mục */}
                <td className="border border-gray-300 px-4 py-2">
                  {editCategoryId === category.id ? (
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="w-full py-1 px-2 border border-gray-300 rounded-sm"
                      placeholder={category.categorName} // Giữ chiều ngang ổn định
                    />
                  ) : (
                    <span>{category.categorName}</span>
                  )}
                </td>

                {/* Hành động */}
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {editCategoryId === category.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 mr-2 rounded-lg"
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(category.id, category.categorName)}
                        className="bg-yellow-500 text-white py-1 px-3 mr-2 rounded-lg hover:bg-yellow-600"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-center">Không tìm thấy danh mục nào.</p>
      )}
    </div>
  );
};

export default CategoryList;
