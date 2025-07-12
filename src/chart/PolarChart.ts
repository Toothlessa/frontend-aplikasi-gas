import AxiosInstance from "@/services/AxiosInstance";
import store from "@/store/store";
import { GET_USER_TOKEN_GETTER } from "@/store/storeconstant";

interface CustomerSalesData {
  customer_name: string;
  total: number;
}

interface ChartDataset {
  label: string;
  backgroundColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
  data: number[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
}

let response: any; // Will be typed more specifically after fetching
try {
  response = await AxiosInstance.get<CustomerSalesData[]>(
    `http://127.0.0.1:8000/api/transactions/topcustomer`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    }
  );
} catch (error) {
  console.error("Error fetching customer sales data:", error);
  // Handle error appropriately, e.g., return empty data or throw
  response = { data: [] }; // Provide a fallback
}

const customers: string[] = [];
const totals: number[] = [];

if (response.data && response.data.length > 0) {
  for (let i = 0; i < response.data.length; i++) {
    customers.push(response.data[i].customer_name);
    totals.push(response.data[i].total);
  }
}

export const data: ChartData = {
  labels: customers,
  datasets: [
    {
      label: 'Total Penjualan',
      backgroundColor: 'rgba(46,191,175,0.2)',
      pointBackgroundColor: '#2EBFAF',
      pointBorderColor: '#2EBFAF',
      pointHoverBackgroundColor: '#2EBFAF',
      pointHoverBorderColor: '#2EBFAF',
      data: totals,
    },
  ],
};

export const options: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};