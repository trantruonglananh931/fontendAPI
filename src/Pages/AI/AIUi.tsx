import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import { useToast } from "react-toastify";
import "./AiUi.css"; 

interface Props {
    inputString: string;
}
const FormatStringWithColonAndDot: React.FC<Props> = ({ inputString }) => {
    // Tách chuỗi dựa trên dấu `:` hoặc `.`
    const parts = inputString.split(/(d+[:]|\.)/);

    return (
        <div>
            {parts.map((part, index) => (
                // Hiển thị từng phần và xuống dòng sau dấu `:` hoặc `.`
                <React.Fragment key={index}>
                    {part}
                    {(part === ":" || part === ".") && <br />}
                </React.Fragment>
            ))}
        </div>
    );
};



const AIUi: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [image1, setImage1] = useState<File | null>(null);
    const [imageProcess, setImageProcess] = useState("");
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [tempImage1, setTempImage1] = useState<string | null>(null);
    const [Flas , setFlas] =  useState(false)
    const [recommendIdImage,setRecommendIdImage] = useState([])

    const [category,setCategory] = useState("Upper-body");
    const options = ['Upper-body','Lower-body','Dress'];
    const [image3, setImage3] = useState<String | null>(null);
    const [recommend, setRecommend] = useState<string | null>(null);
    const [keywords,setKeywords] = useState<string | null>(null);
    const [tempImage3, setTempImage3] = useState<string | null>(null);


    const [loading1,setLoading1] = useState(false);
    const [loading2,setLoading2] = useState(true);
    const [flas2,setFlas2] = useState(false);

    const [sameIamge,setSameImage] = useState([]);
    const [image4,setImage4] = useState<File | null>(null);
    const [tempImage4, setTempImage4] = useState<string | null>(null);


    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setTempImage122] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [camera ,setCamera ] = useState(false);



    const openCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };
    
      const closeCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      };
    
      const captureImage = () => {
        console.log('đâsdasd');
        if (!videoRef.current || !canvasRef.current) return;
    
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');
     
        if (!context) return;
    
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        console.log(imageData); 
        closeCamera();
        setTempImage(imageData);

      };
    
      const startCaptureProcess = () => {
        setCamera(true);
        openCamera();
        let timer = 10;
        setCountdown(timer);
    
        const countdownInterval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
          if (timer <= 0) {
            clearInterval(countdownInterval);
            // console.log('sdasdasd');
            setCountdown(null);
            captureImage();
              setCamera(false);
          }
        }, 1000); // Countdown every second
      };

    const handleChangeSelectBox = (event: React.ChangeEvent<HTMLSelectElement>) => {   
        setCategory(event.target.value);
        console.log("Selected:", event.target.value);
    }
    
    const [loading,setIsLoading] = useState(false);

    const handleFileChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const selectedFile = e.target?.files?.[0] || null;
        // setImage3(selectedFile);
        // if (selectedFile) {
        //     setTempImage3(URL.createObjectURL(selectedFile)); // Tạo đường dẫn ảnh tạm
        // }
        // console.log(e.target.value);
        setImage3(e.target.value);
    };
    const handleFileChange4 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target?.files?.[0] || null;
        setImage4(selectedFile);
        if (selectedFile) {
            setTempImage4(URL.createObjectURL(selectedFile)); // Tạo đường dẫn ảnh tạm
        }
    };
    const fetchRecommend = async (file: String) => {
        try {
            setIsLoading(true);
            // const formData = new FormData();
            // formData.append("file", file); // Đảm bảo key là "file"
            const response = await axios.get("http://127.0.0.1:5001/GetIdRecommend",   {
                params: {   
                    "message": image3,
                },
            });
            setIsLoading(false);
            console.log(response.data);
            setRecommend(response.data);
            // setKeywords(response.data)
        } catch (error) {
            console.error("Lỗi khi tải gợi ý:", error);
        }
    };
    const fetchSussageImage = async (file : File) => {
        try {
            setFlas(true);
            setIsLoading(true);
            const formData = new FormData();
            formData.append("file", file); // Đảm bảo key là "file"
            const response = await axios.post("http://127.0.0.1:5001/getRecommend", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setIsLoading(false);
            console.log(response.data);
            setRecommendIdImage(response.data)
            // setRecommend(response.data);
        } catch (error) {
            console.error("Lỗi khi tải gợi ý:", error);
        }
    }


    const fetchSameImage = async (file : File) => {
        try {

            const formData = new FormData();
            formData.append("file", file); // Đảm bảo key là "file"
            const response = await axios.post("http://127.0.0.1:5001/GetSameProduct", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(response.data);
            setSameImage(response.data)
            // setRecommend(response.data);
        } catch (error) {
            console.error("Lỗi khi tải gợi ý:", error);
        }
    }

    const handleGetTextOrSuggestImage = (a : string) =>{
        if(image3 && a==="1")
        {
            console .log("handle 1");
       
            fetchRecommend(image3);
        } 
        if(image3 && a==="2")
        {
            console .log("handle 2");

            // fetchSussageImage(image3);
         } 
       
    }

    const handleGetSameImage = () =>{
        if(image4)
        {
            fetchSameImage(image4);
        } 

       
    }


    // const formatText = (text: string) => {
    //     // text = removeEnglishWords(text);
    //     // Regex to find **text**
    //     const regex = /\*\*(.*?)\*\*/g;
    //     return text.split(regex).map((part, index) =>
    //       index % 2 === 1 ? (
    //         <strong key={index}>{part}</strong> // Format text between **
    //       ) : (
    //         part
    //       )
    //     );
    //   };



    // const handleSuggestOutFit = () => { 
     
         
    // }

    // useEffect(() => {
    //     if (image3) {
    //         fetchRecommend(image3);
    //     }
    // }, [image3]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target?.files?.[0] || null;
        setImage(selectedFile);
        if (selectedFile) {
            setTempImage(URL.createObjectURL(selectedFile)); // Tạo đường dẫn ảnh tạm
        }
    };

    const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target?.files?.[0] || null;
        setImage1(selectedFile);
        if (selectedFile) {
            setTempImage1(URL.createObjectURL(selectedFile)); // Tạo đường dẫn ảnh tạm
        }
    };


    const handleSubmit = async () => {
        if(!image || !image1) 
        {
                alert("Cần chọn cả 2 ảnh");
                return;
        }
        setLoading2(false);
   
        try {
            const formData = new FormData();
            formData.append("vton_img", image); // Append the first image file
            formData.append("garm_img", image1); // Append the second image file
            formData.append("category",category)
            const response = await axios.post("http://127.0.0.1:5000/generate_image", formData, {
                headers: {
                  "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
                },
              });
                 setLoading2(true);
                setImageProcess(response.data);
                setFlas2(true);
                console.log(response);

                // if (response) {
                //     // const imageData = await response.blob();
                //     // const imageUrl = URL.createObjectURL(imageData); 
                //     setImageProcess(imageUrl);
                // } 
        } catch (error) {
            console.error("Lỗi khi tải gợi ý:", error);
        }
    };

    // useEffect(() => {
    //     if (image) {
    //         fetchRecommend(image);
    //     }
    // }, [image]);

    return (
        <div className="AI bg-gray-50 min-h-screen">
            <Navbar />

            {/* recommend */}
            <div className="flex flex-col items-center p-6">
                <h1 className="font-bold text-3xl mb-4 text-gray-800">Vui lòng chọn hình ảnh!</h1>
                <input
                    className="w-full max-w-xs border border-gray-300 rounded-lg p-2 mb-4"
                    type="text"
                    // accept="image/*"
                    onChange={handleFileChange3}
                />
                {tempImage3 && (
                    <img className="rounded-lg shadow-md"  style={{width:'300px',height:'400px'}} src={tempImage3} alt="Hình ảnh đã chọn" />
                )}
            </div>
            <div>
                <button className="border-2 m-3 p-4 text-xl hover:bg-sky-400 rounded-lg" onClick={() => handleGetTextOrSuggestImage("1")}>
                    Gợi ý cách phối đồ
                </button>
                {/* <button className="border-2 m-3 p-4 text-xl hover:bg-sky-400 rounded-lg" onClick={() => handleGetTextOrSuggestImage("2")}>
                    Gợi ý sản phẩm thời trang phù hợp
                </button> */}
                
            </div>
            <div className="mx-auto my-5">
                {loading ? (
                    <p className="text-xl ml-5">Loading....<p className="spinner"></p></p>
                ) :
                recommend &&  (
                    <div className="border-2 border-indigo-600 font-sans border-solid rounded-md bg-white p-4 shadow-lg">
                        {/* <h2 className="font-bold text-2xl text-indigo-600">Với KeyWords từ hỉnh ảnh bạn cung cấp là:{keywords}</h2>  */}
                        <h2 className="font-bold text-2xl text-indigo-600 font-sans">Gợi ý của chúng tôi là:</h2>
                        {/* <p className="text-xl text-gray-700 font-sans" >{recommend}</p> */}
                        <FormatStringWithColonAndDot inputString={recommend} />
                    </div>
                )  } 
                {/* {recommendIdImage && (
                    <div className="grid grid-cols-4 grid-flow-row gap-2">
                        {
                                   recommendIdImage.map((X,index) => {
                                  
                                    return (
                                        <div key={index}>
                                              <img className="rounded-lg shadow-md" style={{width:'300px',height:'400px'}}  src={"../images/recommendImage/"+X+".jpg"} alt="Hình ảnh đã chọn" />
                                        </div>
                                    )
                                })
                        }
                    </div>
             
                )
            } */}
              
       
                
            </div>
     
        {/* end  */}

        
            
            {Flas || ( 

            <div className="grid grid-cols-3 gap-1">
            <div className="flex flex-col items-center p-6">
                <h1 className="font-bold text-3xl mb-4 text-gray-800">Vui lòng chọn mẫu!</h1>
                <div>
                <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={900}></canvas>
                {!capturedImage && (
                <button onClick={startCaptureProcess}>Open Camera and Capture Image</button>
                )}
                {
                    camera &&  (
<div style={{ position: 'relative' }}>
        {!capturedImage && (
          <div
            style={{
              position: 'fixed',
              top: '10%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              zIndex: 1000,
              border: '2px solid #000',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#fff',
            }}
          >
            <video ref={videoRef} style={{ width: '700px', height: '700px' }} autoPlay muted></video>
            {countdown !== null && (
              <div
                style={{
                  position: 'absolute',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  top: '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1001,
                  color: '#fff',
                  textShadow: '2px 2px 4px #000',
                }}
              >
                {countdown}
              </div>
            )}
          </div>
        )}
      </div>
                    ) 
                }
                


               </div>
                <input
                    className="w-full max-w-xs border border-gray-300 rounded-lg p-2 mb-4"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {tempImage && (
                    <img className="rounded-lg shadow-md " src={tempImage} style={{width:'300px',height:'400px'}} alt="Hình ảnh đã chọn" />
                )}
            </div>
            <div className="flex flex-col items-center p-6">
                <h1 className="font-bold text-3xl mb-4 text-gray-800">Vui lòng chọn quần áo!</h1>
                <input
                    className="w-full max-w-xs border border-gray-300 rounded-lg p-2 mb-4"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange1}
                />
                {tempImage1 && (
                    <img className="rounded-lg shadow-md" style={{width:'300px',height:'400px'}}  src={tempImage1} alt="Hình ảnh đã chọn" />
                )}
            </div>

            <div >   
                <label htmlFor="comboBox" className="font-bold">Chọn option:</label> 
                    <select
                        id='comboBox'
                        value={category}
                        onChange={handleChangeSelectBox}
                        style={{ padding: "8px", margin: "10px", fontSize: "16px" }}
                        className="border-2"
                    >
                        {
                            options.map((value, index) => (
                                <option key={index} value={value}>
                                {value}
                            </option>
                            
                            ))
                        }
                    </select>  
                    <button className="ml-3 border-2  hover:bg-sky-400 rounded-lg" style={{ padding: "8px", margin: "10px", fontSize: "16px" }} onClick={handleSubmit}>
                        Thử đồ
                    </button>

                            <div className="flex justify-center">       
                            { !loading2 ? (
                            <p className="text-xl ml-5">Loading....<p className="spinner"></p></p>
                              )
                             : imageProcess && (
                                <img className="rounded-lg shadow-md mt-20" style={{width:'300px',height:'400px'}}  src={imageProcess} alt="Hình ảnh đã chọn" />
                            ) }
                        </div>
                      
            </div>
        

            </div>
              )} 


            {
                flas2 &&
                (
                    
                    <div>
                        <div className="flex flex-col items-center p-6">
                    <h1 className="font-bold text-3xl mb-4 text-gray-800">Vui lòng chọn hình ảnh!</h1>
                    <input
                        className="w-full max-w-xs border border-gray-300 rounded-lg p-2 mb-4"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange4}
                    />
                    {tempImage4 && (
                        <img className="rounded-lg shadow-md"  style={{width:'300px',height:'400px'}} src={tempImage4} alt="Hình ảnh đã chọn" />
                    )}
                </div>
                <div>
                    <button className="border-2 m-3 p-4 text-xl  hover:bg-sky-400 rounded-lg" onClick={() => handleGetSameImage()}>
                        Tìm sản phẩm tương tự
                    </button>
                
                </div> 
                    </div>
                )
            }
            {sameIamge && (
                    <div className="grid grid-cols-3 grid-flow-col gap-2">
                        {
                                   sameIamge.map((X,index) => {
                                  
                                    return (
                                        <div key={index}>
                                              <img className="rounded-lg shadow-md" style={{width:'200px',height:'300px'}}  src={"../images/SameImage/Images/"+X+".jpg"} alt="Hình ảnh đã chọn" />
                                        </div>
                                    )
                                })
                        }
                    </div>
             
                )
            }             
                               
                    
        </div>
        
        
    );
};


export default AIUi;
