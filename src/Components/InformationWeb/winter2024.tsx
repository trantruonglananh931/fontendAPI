import React from 'react';

const Winter2024 = () => {
  return (
    <div className="bg-gray-100 font-sans">
      <div className="container mx-auto p-5">
        <h1 className="text-4xl font-bold text-center mb-5">YODY Lọt Top 10 Thương Hiệu Thời Trang Lớn Nhất Tại Đông Nam Á</h1>
        <p className="text-gray-600 text-center mb-3">Ngày đăng: 28/10/2024</p>
        <p className="mb-5">
          YODY được website Campaign Asia-Pacific vinh danh là Thương Hiệu Thời Trang thuộc Top 7 Đông Nam Á & Top 10 Việt Nam. Đây là một sự ghi nhận xứng đáng và tự hào cho nỗ lực không ngừng nghỉ mỗi ngày của tập thể gần ~ 3500 nhân viên tại YODY. Tương lai gần YODY đang mở rộng thêm ở thị trường Thailand - Malaysia và US, từng bước mang sản phẩm Việt chất lượng tốt ra thế giới.
        </p>

        <div className="flex items-start mb-5">
          <img
            src="https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/articles/yody-top-10-thuong-hieu-thoi-trang.jpg"
            alt="YODY"
            className="w-full max-w-2xl rounded shadow-lg"
          />
          <p className="ml-5 max-w-lg text-gray-600">
            Campaign là một tạp chí kinh doanh uy tín chuyên về quảng cáo, truyền thông, tiếp thị và sáng tạo thương mại, đặt trụ sở tại Vương quốc Anh và sở hữu các phiên bản tại Mỹ, Châu Á - Thái Bình Dương, Ấn Độ, Trung Đông và Thổ Nhĩ Kỳ. Góp mặt trong bảng xếp hạng các thương hiệu thời trang còn có những "ông lớn" trong ngành như Uniqlo, Dior, Adidas,.... Cùng xem danh sách dưới đây nhé!
          </p>
        </div>

        <div className="bg-white p-5 mb-5">
          <h2 className="text-2xl font-semibold mb-3">Danh Sách Top 10 Thương Hiệu Thời Trang</h2>
          <ol className="list-decimal list-inside">
            {[
              {
                title: "Uniqlo",
                imgSrc: "https://m.yodycdn.com/products/yody_m2st8050789h5kxpbi.jpg",
                description: "Được biết đến với việc là một trong những thương hiệu nổi tiếng với phong cách casual cùng giá cả hợp lý, Uniqlo đã nhanh chóng nhận được sự chú ý của nhiều người và vươn ra thị trường quốc tế."
              },
              {
                title: "Nike",
                imgSrc: "https://m.yodycdn.com/products/yody1_m2st88f23l480gv8u78.jpg",
                description: "Nike vẫn giữ vững vị trí thứ hai trong danh sách. Trên thực tế, Nike là thương hiệu thời trang hàng đầu tại ba thị trường: Việt Nam, Philippines và Thái Lan."
              },
              {
                title: "Việt Tiến",
                imgSrc: "https://m.yodycdn.com/products/yody2_m2st8jk5n3fqs3b6gme.jpg",
                description: "Việt Tiến là một trong những thương hiệu thời trang nam hàng đầu tại Việt Nam với hơn 1.300 cửa hàng trên khắp các tỉnh thành."
              },
              {
                title: "Bench",
                imgSrc: "https://m.yodycdn.com/products/yody3_m2st8xqc98313zs5j3.jpg",
                description: "Bench đã trở thành một cửa hàng tiện lợi cho quần áo thường ngày, đồ lót và đồ thể thao cho cả nam và nữ."
              },
              {
                title: "Adidas",
                imgSrc: "https://m.yodycdn.com/products/yody4_m2st95sc32862t6t6se.jpg",
                description: "Adidas cũng được xếp hạng trong top năm thương hiệu thời trang hàng đầu của Đông Nam Á."
              },
              {
                title: "Penshoppe",
                imgSrc: "https://m.yodycdn.com/products/yody5_m2st9nbze4xkqyrua4v.jpg",
                description: "Penshoppe là nhà bán lẻ thời trang hàng đầu tại Philippines với điểm số cao về nhận biết thương hiệu."
              },
              {
                title: "YODY",
                imgSrc: "https://m.yodycdn.com/products/yody6_m2st9za1ufwga6swcl.jpg",
                description: "YODY là một thương hiệu công nghệ thời trang Việt Nam hiện có hơn 270 cửa hàng trên khắp Việt Nam."
              },
              {
                title: "Dior",
                imgSrc: "https://m.yodycdn.com/products/yody7_m2stablkcrmplfp1kbl.jpg",
                description: "Dior ngày càng hợp tác với các ngôi sao trong khu vực để dẫn đầu các chiến dịch của mình."
              },
              {
                title: "Padini",
                imgSrc: "https://m.yodycdn.com/products/yody8_m2stalii3xvvp1nqcu2.jpg",
                description: "Padini nổi tiếng với việc sử dụng các vật liệu thân thiện với môi trường."
              },
              {
                title: "Levi's",
                imgSrc: "https://m.yodycdn.com/products/yody9_m2stb9axahgelbb8zy8.jpg",
                description: "Levi's nổi tiếng với quần jean denim và đã tích cực mở rộng sự hiện diện của mình trong khu vực."
              }
            ].map((item, index) => (
              <li key={index} className="mb-4 flex">
                <div className="flex-shrink-0">
                  <h3 className="font-bold">{index + 1}.</h3>
                </div>
                <div className="flex-grow ml-2">
                  <h4 className="font-bold">{item.title}</h4>
                  <img src={item.imgSrc} alt={item.title} className="w-full max-w-lg rounded shadow mb-2" />
                  <p className="text-justify">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mb-5">
          Nguồn: <a href="https://www.campaignasia.com/article/top-10-fashion-brands-in-south-east-asia/498123" className="text-blue-500 hover:underline">Campaign Asia</a>
        </p>
        <p className="mb-5">
          Bên trên là TOP 10 thương hiệu thời trang lớn nhất Đông Nam Á năm 2024. YODY hy vọng bài viết này đã cung cấp những thông tin thú vị với các bạn.
        </p>
      </div>
    </div>
  );
};

export default Winter2024;
