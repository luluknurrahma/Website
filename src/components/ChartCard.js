import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartCard({ combinedData, showObservasi, showPrediksi, onToggleObservasi, onTogglePrediksi }) {
  return (
    <div className="chart-card">
      <h3 style={{ textAlign: "center", color: "#1a1a4b", marginBottom: "25px", fontWeight: 700 }}>
        Grafik Pasang Surut
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={combinedData}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
          <XAxis
            dataKey="messagedate"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) => {
              try {
                const d = new Date(ts);
                const dd = String(d.getDate()).padStart(2, '0');
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const yyyy = d.getFullYear();
                const hh = String(d.getHours()).padStart(2, '0');
                const min = String(d.getMinutes()).padStart(2, '0');
                return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
              } catch (e) { return ts; }
            }}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => {
              try {
                const d = new Date(label);
                const dd = String(d.getDate()).padStart(2, '0');
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const yyyy = d.getFullYear();
                const hh = String(d.getHours()).padStart(2, '0');
                const min = String(d.getMinutes()).padStart(2, '0');
                return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
              } catch (e) { return label; }
            }}
            contentStyle={{ borderRadius: "8px", borderColor: "#1a1a4b" }}
          />
          <Legend verticalAlign="top" height={36} />
          {showObservasi && <Line type="monotone" dataKey="water_sea_level" stroke="#264d7b" name="Observasi" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />}
          {showPrediksi && <Line type="monotone" dataKey="water_sea_level" stroke="#ff7000" name="Prediksi" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "30px" }}>
        <label className="checkbox-label">
          <input type="checkbox" checked={showObservasi} onChange={onToggleObservasi} />
          Tampilkan Observasi
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={showPrediksi} onChange={onTogglePrediksi} />
          Tampilkan Prediksi
        </label>
      </div>
    </div>
  );
}
