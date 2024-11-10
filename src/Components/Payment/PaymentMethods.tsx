import React from "react";

const PaymentMethods: React.FC = () => {
  return (
    <div className="flex flex-col ">
      {/* Phương thức thanh toán */}
      <div className="flex items-center justify-center space-x-4 ">
        <img
          src="https://cdn.tgdd.vn/2020/04/GameApp/image-180x180.png"
          alt="ZaloPay"
          className="w-12"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQefI6pAZDTEXZqfmgJTghDkO1wpT39ZsuR8A&s"
          alt="Visa"
          className="w-12"
        />
        <img
          src="https://cdn.coin68.com/uploads/2019/01/The%CC%89-Mastercard-la%CC%80-gi%CC%80-Nhu%CC%9B%CC%83ng-tho%CC%82ng-tin-ca%CC%82%CC%80n-thie%CC%82%CC%81t-ve%CC%82%CC%80-Mastercard.png"
          alt="MasterCard"
          className="w-12"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
          alt="VNPAY"
          className="w-12"
        />
        <img
          src="https://cdn.tgdd.vn/2020/03/GameApp/Untitled-2-200x200.jpg"
          alt="MoMo"
          className="w-12"
        />
      </div>

      {/* Thông điệp đảm bảo thanh toán an toàn */}
      <p className=" mt-2 text-xs text-gray-600 text-center">
        Đảm bảo thanh toán an toàn và bảo mật
      </p>

      {/* Thông tin thanh toán */}
      <div className="mt-4 text-gray-600 items-start">
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li className="flex items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/128/5074/5074275.png"
              alt="Miễn phí vận chuyển"
              className="w-6 h-6 mr-2"
            />
            Miễn phí vận chuyển: Đơn hàng từ 99000đ
          </li>
          <li className="flex items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/128/7602/7602640.png"
              alt="Thời gian giao hàng"
              className="w-6 h-6 mr-2"
            />
            Giao hàng: 3 - 5 ngày toàn quốc
          </li>
          <li className="flex items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3917/3917307.png"
              alt="Chính sách trả hàng"
              className="w-6 h-6 mr-2"
            />
            Trả hàng miễn phí trong vòng 7 ngày
          </li>
          <li className="flex items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/128/7653/7653263.png"
              alt="Giảm giá"
              className="w-6 h-6 mr-2"
            />
            Sử dụng mã giảm giá khi thanh toán
          </li>
          <li className="flex items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3917/3917579.png"
              alt="Bảo mật"
              className="w-6 h-6 mr-2"
            />
            Bảo mật thông tin và mã hóa
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentMethods;
