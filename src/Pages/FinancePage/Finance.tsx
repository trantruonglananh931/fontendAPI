import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type FinanceData = {
  month: number;
  total: number;
};

const Finance: React.FC = () => {
  const [financeData, setFinanceData] = useState<FinanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart'); // Trạng thái để quản lý chế độ hiển thị

  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [isDescendingByPrice, setIsDescendingByPrice] = useState<boolean>(false);

  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...";

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
        setError('No data available.');
      }
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError('Failed to fetch finance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [isDescendingByPrice]); // Gọi API khi giá trị isDescendingByPrice thay đổi

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFinanceData();
  };

  const chartData = {
    labels: financeData.map((data) => `Month ${data.month}`),
    datasets: [
      {
        label: 'Revenue',
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
      title: { display: true, text: 'Monthly Revenue Overview' },
    },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Monthly Finance Overview</h1>

      {/* Nút chuyển đổi giữa bảng và biểu đồ */}
      <div className="mb-4">
        <button
          onClick={() => setViewMode('chart')}
          className={`px-4 py-2 rounded ${viewMode === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Chart View
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`ml-2 px-4 py-2 rounded ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Table View
        </button>
      </div>

      {/* Form nhập Start Month, End Month, Year và nút Fetch Data */}
      <form onSubmit={handleSubmit} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <label className="block mb-2">Start Month</label>
            <input
              type="number"
              value={start || ''}
              onChange={(e) => setStart(parseInt(e.target.value) || null)}
              className="w-28 px-4 py-2 border rounded"
              placeholder="1-12"
            />
          </div>

          <div>
            <label className="block mb-2">End Month</label>
            <input
              type="number"
              value={end || ''}
              onChange={(e) => setEnd(parseInt(e.target.value) || null)}
              className="w-28 px-4 py-2 border rounded"
              placeholder="1-12"
            />
          </div>

          <div>
            <label className="block mb-2">Year</label>
            <input
              type="number"
              value={year || ''}
              onChange={(e) => setYear(parseInt(e.target.value) || null)}
              className="w-28 px-4 py-2 border rounded"
              placeholder="Year"
            />
            <button type="submit" className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
              Fetch Data
            </button>
          </div>
          <div>
            <label className="block mb-2">Sort by</label>
            <select
              value={isDescendingByPrice ? 'desc' : 'asc'}
              onChange={(e) => setIsDescendingByPrice(e.target.value === 'desc')}
              className="w-40 px-4 py-2 border rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </form>

      {/* Hiển thị biểu đồ hoặc bảng */}
      {viewMode === 'chart' ? (
        <div className="w-full lg:w-3/4 mx-auto">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="overflow-x-auto w-full  mx-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Month</th>
                {financeData.map((data) => (
                  <th key={data.month} className="border border-gray-300 px-4 py-2">{data.month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">Total Revenue ($)</td>
                {financeData.map((data) => (
                  <td key={data.month} className="border border-gray-300 px-4 py-2">{data.total}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Finance;
