import { PolarChartData, PolarChartOptions } from "@/types/Chart";

export function usePolarChart(){
    /* -------------------------------
    CHART DATA + OPTIONS
    --------------------------------*/
    
    const defaultPolarOptions: PolarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    const createPolarChartData = (
        labels: string[],
        totals: number[]
        ): PolarChartData => {
        return {
            labels,
            datasets: [
                {
                    label: "Total Penjualan",
                    backgroundColor: "rgba(46,191,175,0.2)",
                    pointBackgroundColor: "#2EBFAF",
                    pointBorderColor: "#2EBFAF",
                    pointHoverBackgroundColor: "#2EBFAF",
                    pointHoverBorderColor: "#2EBFAF",
                    data: totals,
                },
            ],
        };
    };

    return{
        defaultPolarOptions,
        createPolarChartData,
    };
}