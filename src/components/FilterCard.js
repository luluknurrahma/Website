import React from "react";

export default function FilterCard({ lokasiList, lokasi, onLokasiChange, startDate, onStartDateChange, endDate, onEndDateChange, onApply, canApply = true }) {


  return (
    <div className="filter-card">
      <h3 style={{ textAlign: "center", color: "#1a1a4b", marginBottom: "20px", fontWeight: 700 }}>
        Informasi Prakiraan Pasang Surut
      </h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center", alignItems: "end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Nama Stasiun</label>
          <select value={lokasi} onChange={e => onLokasiChange(e.target.value)}>
            <option value="">-- Pilih Stasiun --</option>
            {lokasiList.map((loc, i) => <option key={i} value={loc.station_name}>{loc.station_name}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Waktu Mulai</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input 
              type="date" 
              value={startDate ? startDate.split('T')[0] : ''} 
              onChange={e => {
                const newDate = e.target.value;
                const time = startDate ? startDate.split('T')[1]?.substring(0, 5) : '00:00';
                onStartDateChange(newDate ? `${newDate}T${time}` : '');
              }}
              style={{ width: "140px" }}
            />
            <select 
              value={startDate ? startDate.split('T')[1]?.substring(0, 5) : ''} 
              onChange={e => {
                const date = startDate ? startDate.split('T')[0] : '';
                onStartDateChange(date ? `${date}T${e.target.value}` : '');
              }}
              style={{ width: "100px" }}
            >
              <option value="">Pilih Waktu</option>
              {Array.from({ length: 24 * 6 }, (_, i) => {
                const hour = Math.floor(i / 6);
                const minute = (i % 6) * 10;
                return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              }).map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Waktu Akhir</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input 
              type="date" 
              value={endDate ? endDate.split('T')[0] : ''} 
              onChange={e => {
                const newDate = e.target.value;
                const time = endDate ? endDate.split('T')[1]?.substring(0, 5) : '00:00';
                onEndDateChange(newDate ? `${newDate}T${time}` : '');
              }}
              style={{ width: "140px" }}
            />
            <select 
              value={endDate ? endDate.split('T')[1]?.substring(0, 5) : ''} 
              onChange={e => {
                const date = endDate ? endDate.split('T')[0] : '';
                onEndDateChange(date ? `${date}T${e.target.value}` : '');
              }}
              style={{ width: "100px" }}
            >
              <option value="">Pilih Waktu</option>
              {Array.from({ length: 24 * 6 }, (_, i) => {
                const hour = Math.floor(i / 6);
                const minute = (i % 6) * 10;
                return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              }).map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn-primary" onClick={onApply} disabled={!canApply} title={!canApply ? "Pilih stasiun, waktu mulai dan waktu akhir terlebih dahulu" : "Tampilkan"}>Tampilkan</button>
        {/* inline alert when station selected but dates missing */}
        {lokasi && (!startDate || !endDate) && (
          <p style={{ color: "#b00020", marginTop: "8px", fontWeight: 600 }}>
            Pilih waktu mulai dan waktu akhir dahulu
          </p>
        )}
      </div>
    </div>
  );
}
