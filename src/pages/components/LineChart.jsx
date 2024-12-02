import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ weights }) => {
  return (
    <div>
      {weights.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={weights}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={(entry) => new Date(entry.date.seconds * 1000).toLocaleDateString()}>
              <Label value="Date" offset={0} position="bottom" />
            </XAxis>
            <YAxis>
              <Label value="Weight (kg)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#ff7300" fill="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No weight data available for the selected pet.</p>
      )}
    </div>
  );
};

export default LineChartComponent;