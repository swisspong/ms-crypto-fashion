"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, LineChart, Tooltip, CartesianGrid, Line, Legend } from "recharts"



interface Props {
  data: IOrderTrade[]
}

export const Overview = ({ data }: Props) => {
  const monthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.",
    "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.",
    "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];


  let curr = 0;
  const line_data = data.length > 0 ? monthNames.map((month, index) => {
    let object = undefined
    if ((index + 1).toString() == data[curr].month as string) {
      object = {
        name: month,
        totalOrders: data[curr].totalOrders,
        amountSales: data[curr].totalSales,
        amt: data[curr].totalSales
      }
      if (curr < (data.length - 1)) curr++;

    }
    return object ? object : {
      name: month,
      totalOrders: 0,
      amountSales: 0,
      amt: 0
    }
  }) : []

  return (
    <ResponsiveContainer width="100%" height={350}>


      <LineChart
        width={500}
        height={300}
        data={line_data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" name="คำสั่งซื้อทั้งหมด" dataKey="amountSales" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" name="จำนวนคำสั่งซื้อ" dataKey="totalOrders" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}