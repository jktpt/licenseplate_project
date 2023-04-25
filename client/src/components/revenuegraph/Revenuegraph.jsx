import "./revenuegraph.scss";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import Axios from "axios";

export const Revenuegraph = () => {
  const [loading, setLoading] = useState(null);
  const [day1to7, setDay1to7] = useState("0");
  const [day8to15, setDay8to15] = useState("0");
  const [day16to23, setDay16to23] = useState("0");
  const [day24to31, setDay24to31] = useState("0");
  var data;


  const getDay8to15 = () => {
    Axios.get(`${process.env.REACT_APP_HOST}/api/day8to15`).then((response) => {
      setDay8to15(response.data[0]);
    });
  };

  const getDay16to23 = () => {
    Axios.get(`${process.env.REACT_APP_HOST}/api/day16to23`).then((response) => {
      setDay16to23(response.data[0]);
    });
  };

  const getDay24to31 = () => {
    Axios.get(`${process.env.REACT_APP_HOST}/api/day24to31`).then((response) => {
      setDay24to31(response.data[0]);
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_HOST}/api/day1to7`)
      .then((response) => {
        if (response.ok) {
          getDay8to15();
          getDay16to23();
          getDay24to31();

          return response.json();
        }
        throw response;
      })
      .then((res) => {
        setDay1to7(res[0]);
        
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // console.log(week1)
  data = [
    {
      name: "Week 1 (Day 1 - 7)",
      Current_Month: day1to7.current_month,
      Last_Month: day1to7.prev_month,
    },
    {
      name: "Week 2 (Day 8 - 15)",
      Current_Month: day8to15.current_month,
      Last_Month: day8to15.prev_month,
    },
    {
      name: "Week 3 (Day 16 - 23)",
      Current_Month: day16to23.current_month,
      Last_Month: day16to23.prev_month,
    },
    {
      name: "Week 4 (Day 24 - 31)",
      Current_Month: day24to31.current_month,
      Last_Month: day24to31.prev_month,
    },
    
  ];

  if (!loading) {
    return (
      <div className="chart">
        <div className="title">Revenue Graph</div>
        <AreaChart
          width={700}
          height={300}
          data={data}
          margin={{ top: 10, right: 20, left: 50, bottom: 0 }}
        >
          <defs>
            <linearGradient id="lastMonthColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6776c2" stopOpacity={0.65} />
              <stop offset="95%" stopColor="#6776c2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="currentMonthColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a6f7cd" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#a6f7cd" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="Last_Month"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#lastMonthColor)"
          />
          <Area
            type="monotone"
            dataKey="Current_Month"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#currentMonthColor)"
          />
        </AreaChart>
      </div>
    );
  } else {
   
  }
};
