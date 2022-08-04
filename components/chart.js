import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from '../styles/components/chart.module.scss';

const COLORS = ["#326e9e", "#e2d14a", "#5f92c6", "#f37821"];
const RADIAN = Math.PI / 180;

export default function Chart({ data }) {
  const [userLangData, setUserLangData] = useState([]);

  useEffect(() => {
    getUserLangInfo(data);
  }, []);

  const getUserLangInfo = (languages) => {
    const langInfo = languages;
    if(langInfo) {
      const langLength = Object.keys(langInfo).length;
      const langKey = Object.keys(langInfo);
      const langValue = Object.values(langInfo);
      const langArr = [];

      for(let i = 0; i < langLength; i++) {
        langArr.push({ name: langKey[i], value: langValue[i] });
      }

      setUserLangData(langArr);
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    let x = cx + radius * Math.cos(-midAngle * RADIAN);
    let y = cy + radius * Math.sin(-midAngle * RADIAN);

    if(x < cx) {
      x += (cx - x) * 0.15;
    } else if(cx < x) {
      x -= (x - cx) * 0.15;
    }

    return (
      <text className={styles.rechartsFontSize} x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      { percent === 0 ? null : `${userLangData[index]['name']} ${(percent * 100).toFixed(0)}%` }
      </text>
    );
  };

  return (
    <ResponsiveContainer height="100%">
      <PieChart>
        <Pie
          data={userLangData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius="50%"
          outerRadius="100%"
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={false}
        >
        {
          userLangData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))
        }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
};