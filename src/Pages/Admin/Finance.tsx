import React, { useEffect, useState } from 'react';
import { useAuth } from "../../Context/useAuth";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { FinanceData } from "../../Models/FinanceData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Finance: React.FC = () => {
  const [financeData, setFinanceData] = useState<FinanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'pie'>('chart'); 

  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [isDescendingByPrice, setIsDescendingByPrice] = useState<boolean>(false);
  const { user } = useAuth(); // Access user info from context
  const navigate = useNavigate();
  const token = user?.token;

  const fetchFinanceData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/v6/api/Finance', {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: '*/*',
        },
        params: {
          start,
          end,
          year,
          IsDecsendingByPrice: isDescendingByPrice,
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setFinanceData(response.data.data);
      } else {
        setFinanceData([]);
        setError('Không có dữ liệu.');
      }
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu tài chính:', err);
      setError('Không thể lấy dữ liệu tài chính.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [isDescendingByPrice]); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFinanceData();
  };

  const chartData = {
    labels: financeData.map((data) => `Tháng ${data.month}`),
    datasets: [
      {
        label: 'Doanh thu',
        data: financeData.map((data) => data.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Tổng quan doanh thu hàng tháng' },
    },
  };

  const pieData = {
    labels: financeData.map((data) => `Tháng ${data.month}`),
    datasets: [
      {
        label: 'Tỷ lệ doanh thu',
        data: financeData.map((data) => data.total),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',  // Teal
          'rgba(54, 162, 235, 0.6)',  // Blue
          'rgba(255, 206, 86, 0.6)',  // Yellow
          'rgba(231, 233, 237, 0.6)', // Light Gray
          'rgba(255, 99, 132, 0.6)',  // Red
          'rgba(153, 102, 255, 0.6)', // Purple
          'rgba(255, 159, 64, 0.6)',  // Orange
          'rgba(75, 0, 130, 0.6)',    // Indigo
          'rgba(34, 193, 195, 0.6)', // Turquoise
          'rgba(253, 121, 168, 0.6)',// Pink
          'rgba(75, 255, 85, 0.6)',  // Green
          'rgba(230, 81, 0, 0.6)',   // Amber
        ],
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Tỷ lệ doanh thu hàng tháng' },
    },
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto ">
      <div className="mb-4">
        <button
          onClick={() => setViewMode('chart')}
          className={`px-4 py-2 rounded ${viewMode === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Xem cột
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`ml-2 px-4 py-2 rounded ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Xem bảng
        </button>
        <button
          onClick={() => setViewMode('pie')}
          className={`ml-2 px-4 py-2 rounded ${viewMode === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Xem biểu đồ tròn
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <label className="block mb-2">Tháng Bắt đầu</label>
            <input
              type="number"
              value={start || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 12) {
                  setStart(value);
                }
              }}
              className="w-28 px-4 py-2 border rounded"
              placeholder="1-12"
              min="1"
              max="12"
            />
          </div>

          <div>
            <label className="block mb-2">Tháng Kết thúc</label>
            <input
              type="number"
              value={end || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 12) {
                  setEnd(value);
                }
              }}
              className="w-28 px-4 py-2 border rounded"
              placeholder="1-12"
              min="1"
              max="12"
            />
          </div>

          <div>
            <label className="block mb-2">Năm</label>
            <input
              type="number"
              value={year || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setYear(value);
                }
              }}
              className="w-28 px-4 py-2 border rounded"
              placeholder="Năm"
              min="2024" 
              max="9999"
            />
          </div>

          <div>
            <label className="block mb-2">Sắp xếp theo</label>
            <select
              value={isDescendingByPrice ? 'desc' : 'asc'}
              onChange={(e) => setIsDescendingByPrice(e.target.value === 'desc')}
              className="w-40 px-4 py-2 border rounded"
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>
          <button type="submit" className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
          Lấy Dữ liệu
        </button>
        </div>

        
      </form>

      {/* Hiển thị biểu đồ hoặc bảng */}
      {viewMode === 'chart' ? (
        <div className="w-full lg:w-3/4 mx-auto">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : viewMode === 'pie' ? (
        <div className="w-full lg:w-2/4 mx-auto">
          <Pie data={pieData} options={pieOptions} />
        </div>
      ) : (
        <div className="overflow-x-auto w-full mx-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Tháng</th>
              <th className="border border-gray-300 px-4 py-2">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {financeData.map((data) => (
              <tr key={data.month}>
                <td className="border border-gray-300 px-4 py-2">{`Tháng ${data.month}`}</td>
                <td className="border border-gray-300 px-4 py-2">{data.total}</td>
                {/* Add other financial data columns if necessary */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default Finance;
