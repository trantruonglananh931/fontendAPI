import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";

const AIUi: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [recommend, setRecommend] = useState<string | null>(null);
    const [tempImage, setTempImage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target?.files?.[0] || null;
        setImage(selectedFile);
        if (selectedFile) {
            setTempImage(URL.createObjectURL(selectedFile)); // Tạo đường dẫn ảnh tạm
        }
    };

    const fetchRecommend = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file); // Đảm bảo key là "file"
            const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setRecommend(response.data);
        } catch (error) {
            console.error("Lỗi khi tải gợi ý:", error);
        }
    };

    useEffect(() => {
        if (image) {
            fetchRecommend(image);
        }
    }, [image]);

    return (
        <div className="AI w-full bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex flex-row h-full">
            <div className="w-1/2 flex flex-col items-center p-6 border-r border-gray-300">
                <h1 className="font-bold text-3xl mb-4 text-gray-800">Vui lòng chọn hình ảnh!</h1>
                <input
                    className="w-full max-w-xs border border-gray-300 rounded-lg p-2 mb-4"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {tempImage && (
                    <img
                        className="w-96 h-132 object-cover rounded-sm shadow-md"
                        src={tempImage}
                        alt="Hình ảnh đã chọn"
                    />
                )}
            </div>

            <div className="w-1/2 flex items-center justify-center p-6">
                {recommend ? (
                    <div className="border-2 border-indigo-600 rounded-md bg-white p-6 shadow-lg">
                        <h2 className="font-sans text-2xl text-indigo-600 mb-2">Gợi ý của chúng tôi là:</h2>
                        <p className="text-xl text-gray-700">{recommend}</p>
                    </div>
                ) : (
                    <p className="text-xl text-gray-500">Chưa có gợi ý nào, vui lòng chọn hình ảnh.</p>
                )}
            </div>
        </div>
    </div>

    );
};

export default AIUi;
