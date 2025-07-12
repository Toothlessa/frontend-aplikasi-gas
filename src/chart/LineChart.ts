import AxiosInstance from "@/services/AxiosInstance";
import store from "@/store/store";
import { GET_USER_TOKEN_GETTER } from "@/store/storeconstant";

interface SalesData {
  day: string;
  total: number;
  month: string; // Assuming month is also part of the response data structure
}

interface ChartDataset {
  label: string;
  backgroundColor: string;
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
  response = await AxiosInstance.get<SalesData[]>(
    `http://127.0.0.1:8000/api/transactions/salesperweek`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    }
  );
} catch (error) {
  console.error("Error fetching sales data:", error);
  // Handle error appropriately, e.g., return empty data or throw
  response = { data: [] }; // Provide a fallback
}


const days: string[] = [];
let month: string | null = null;
const totals: number[] = [];

if (response.data && response.data.length > 0) {
  for (let i = 0; i < response.data.length; i++) {
    days.push(response.data[i].day);
    totals.push(response.data[i].total);
  }
  month = response.data[0].month;
} else {
  month = new Date().toLocaleString("default", { month: "long" });
}


export const data: ChartData = {
  labels: days,
  datasets: [
    {
      label: month || "Sales", // Fallback label if month is null
      backgroundColor: "#2EBFAF",
      data: totals,
    },
  ],
};

export const options: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};