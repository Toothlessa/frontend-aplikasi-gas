import { LineChartData } from "@/types/Chart";
import { ref } from "vue";

export function useLineChart(){

    /* -------------------------------
   CHART DATA + OPTIONS
--------------------------------*/
    const data = ref<LineChartData>({
        labels: [],
        datasets: [],
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    /* Props-like local variables */
    const cssClasses = "";
    const styles = {};
    const plugins: any[] = [];

    return{
        data,
        options,
        cssClasses,
        styles,
        plugins,
    };
}