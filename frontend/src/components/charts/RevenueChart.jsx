import { useMemo, useState } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function RevenueChart({ orders }) {

    const [type, setType] = useState("day");

    const chartData = useMemo(() => {

        const result = {};

        orders.forEach(order => {

            if (order.status !== "completed") return;

            const date = new Date(order.createdAt);

            let key = "";

            if (type === "day") {

                key = date.toLocaleDateString();

            } else {

                key = `${date.getMonth() + 1}/${date.getFullYear()}`;

            }

            result[key] = (result[key] || 0) + order.finalAmount;

        });

        return {
            labels: Object.keys(result),
            datasets: [
                {
                    label: "Doanh thu",
                    data: Object.values(result),
                    borderWidth: 3,
                    tension: 0.3
                }
            ]
        };

    }, [orders, type]);

    return (
        <>
            <div className="d-flex justify-content-end mb-3">

                <select
                    className="form-select w-auto"
                    value={type}
                    onChange={(e)=>setType(e.target.value)}
                >

                    <option value="day">Theo ngày</option>

                    <option value="month">Theo tháng</option>

                </select>

            </div>

            <Line data={chartData}/>
        </>
    );
}