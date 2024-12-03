import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
const AIUi: React.FC = () => {
    const [Image, setImage] = useState<File | null>(null);
    const [recommend, setRecommend] = useState<string | null>(null);
    const [TemImage, setTemImage] = useState<string | null>(null);

    // Chỉ định kiểu cho tham số e
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectFile = e.target?.files?.[0] || null;
        setImage(selectFile);
        if (selectFile) {
            setTemImage(URL.createObjectURL(selectFile)); // tạo đường dẫn ảnh tạm
        }
    }

    const FetchReconmmend = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file); // Đảm bảo key là "file"
            const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // dùng để đinh nghĩa header là 1 file
                },
            });
            setRecommend(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (Image) {
            FetchReconmmend(Image);
            console.log(recommend);
        }
    }, [Image]);

    return (
        <div className="AI">
              <Navbar />
            <div className="flex justify-center items-center">
                <div>
                    <p className="font-bold text-2xl">Vui lòng chọn hình ảnh!</p>
                    <input className="w-200" type="file" accept="image/*" onChange={handleFileChange} />
                    {TemImage && (
                        <img className="w-96 h-80 mt-4" src={TemImage} alt="" />
                    )}
                </div>
                <div></div>
            </div>

            <div className="mx-11 my-5">
                {recommend && (
                    <div className="border-2 border-indigo-600 border-solid rounded-md">
                        <p className="font-bold text-2xl">Gợi ý của chúng tôi là:</p>
                        <p className="text-xl">{recommend}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIUi;
