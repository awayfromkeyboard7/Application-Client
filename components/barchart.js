import React, { useState, useEffect, PureComponent } from 'react';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart
} from 'recharts';
import styles from '../styles/components/chart.module.scss';


export default function BarChart({ RankLogArr }) {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width="80%"
                height="80%"
                data={RankLogArr}
                margin={{
                    top: 20,
                    right: 10,
                    left: 10,
                    bottom: 20
                }}
            >
                <XAxis hide={true} dataKey="submitAt" tick={{ fill: 'white' }} />
                <YAxis tick={{ fill: 'white' }} ticks={[1, 2, 3, 4, 5, 6, 7, 8]} domain={[0, 1]} reversed={true} />
                <Line
                    type="monotone"
                    dataKey="ranking"
                    stroke="#8884d8"
                    strokeWidth={5}
                    dot={{ stroke: 'black', strokeWidth: 1, r: 5, strokeDasharray: '' }
                    }
                />
                <Line
                    type="monotone"
                    dataKey="passRate"
                    stroke="#fbde00"
                    strokeWidth={5}
                    dot={{ stroke: 'black', strokeWidth: 1, r: 5, strokeDasharray: '' }}
                />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    )
}