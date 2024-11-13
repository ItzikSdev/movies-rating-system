import { TRows } from "../types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ILineChart  {
  movie: TRows
}
const MyLineChart = ({ movie }: ILineChart) => {
  const data = movie.lastUpdateTime
  return (
    <>
      <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="generatedTime" />
          <YAxis dataKey="totalVotes"/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalVotes" stroke="#8884d8" activeDot={{ r: 8 }} />
          {/* <Line type="monotone" dataKey="generatedTime" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
      </div>
    </>
  );
}

export default MyLineChart