import {

Chart as ChartJS,

ArcElement,

Tooltip,

Legend

} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
ArcElement,
Tooltip,
Legend
);

export default function UserRoleChart({ users }) {

const admin =
users.filter(u=>u.role==="admin").length;

const staff =
users.filter(u=>u.role==="staff").length;

const customer =
users.filter(u=>u.role==="customer").length;

const data={

labels:["Admin","Staff","Customer"],

datasets:[{

data:[admin,staff,customer]

}]

};

return <Pie data={data}/>;

}