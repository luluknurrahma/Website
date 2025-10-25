import React, { useEffect, useState } from "react";
// Recharts imports moved to ChartCard component
import "./App.css";
import Header from "./components/Header";
import WaveBottom from "./components/WaveBottom";
import FilterCard from "./components/FilterCard";
import ChartCard from "./components/ChartCard";

function App() {
  const [lokasiList, setLokasiList] = useState([]);
  const [lokasi, setLokasi] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataObservasi, setDataObservasi] = useState([]);
  const [dataPrediksi, setDataPrediksi] = useState([]);
  const [showObservasi, setShowObservasi] = useState(true);
  const [showPrediksi, setShowPrediksi] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/lokasi")
      .then(res => res.json())
      .then(data => setLokasiList(data))
      .catch(err => console.error("Error ambil lokasi:", err));
  }, []);

  const applyFilter = async () => {
    if (!lokasi) return alert("Pilih stasiun terlebih dahulu!");
    if (!startDate || !endDate) return alert("Pilih waktu mulai dan waktu akhir terlebih dahulu!");
    // convert datetime-local (e.g. '2022-06-01T00:00') to DB format 'YYYY-MM-DD HH:mm:ss'
    const toDbDate = (s) => {
      if (!s) return s;
      // common input from <input type=datetime-local> is 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DDTHH:mm:ss'
      const withSpace = s.replace('T', ' ');
      // ensure seconds
      return withSpace.length === 16 ? withSpace + ':00' : withSpace;
    };

    const startParam = toDbDate(startDate);
    const endParam = toDbDate(endDate);
    // handle overnight ranges: if end <= start, assume end is next day
    const parseDbToDate = (s) => s ? new Date(s.replace(' ', 'T')) : null;
    let startDt = parseDbToDate(startParam);
    let endDt = parseDbToDate(endParam);
    let finalEndParam = endParam;
    if (startDt && endDt && endDt.getTime() <= startDt.getTime()) {
      // add one day to end
      endDt = new Date(endDt.getTime() + 24 * 60 * 60 * 1000);
      const pad = (n) => n.toString().padStart(2, '0');
      const yyyy = endDt.getFullYear();
      const mm = pad(endDt.getMonth() + 1);
      const dd = pad(endDt.getDate());
      const hh = pad(endDt.getHours());
      const mi = pad(endDt.getMinutes());
      const ss = pad(endDt.getSeconds());
      finalEndParam = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
      alert('Waktu akhir lebih awal dari waktu mulai — diasumsikan keesokan harinya.');
    }

    const params = new URLSearchParams({ lokasi, start: startParam, end: finalEndParam });
    const [obsRes, predRes] = await Promise.all([
      fetch(`http://localhost:5000/api/observasi?${params}`),
      fetch(`http://localhost:5000/api/prediksi?${params}`)
    ]);
    // helper: safely parse JSON or throw a helpful error with any HTML/text body
    const parseJsonSafe = async (res) => {
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed ${res.status}: ${text}`);
      }
      if (ct.includes("application/json") || ct.includes("application/ld+json")) {
        return res.json();
      }
      // not JSON: attempt to read text and surface it
      const text = await res.text();
      try { return JSON.parse(text); } catch (e) {
        throw new Error(`Expected JSON but received: ${text.slice(0,200)}`);
      }
    };

    let obsData, predData;
    try {
      obsData = await parseJsonSafe(obsRes);
    } catch (err) {
      console.error("Error parsing observasi response:", err);
      alert(`Gagal ambil observasi: ${err.message}`);
      return;
    }

    try {
      predData = await parseJsonSafe(predRes);
    } catch (err) {
      // If prediksi is missing that's non-fatal; just warn and continue with empty pred data
      console.warn("prediksi parse failed:", err);
      predData = [];
    }
      // normalize backend fields to match ChartCard dataKeys
      const normalize = (arr = []) => arr.map(item => {
        // pick the raw date string from common fields
        const raw = item.messagedate || item.MESSAGEDATE || item.Messagedate || item.MESSAGE_DATE || item.message_date || null;
        // convert 'YYYY-MM-DD HH:mm:ss' to ISO and timestamp
        let timestamp = null;
        let isoString = null;
        if (raw) {
          // replace space with 'T' so Date can parse it as ISO
          const iso = raw.replace(' ', 'T');
          const d = new Date(iso);
          if (!Number.isNaN(d.getTime())) {
            timestamp = d.getTime();
            isoString = d.toISOString();
          }
        }
        return {
          ...item,
          messagedate: timestamp != null ? timestamp : (item.messagedate || item.MESSAGEDATE || item.Messagedate),
          messagedate_iso: isoString,
          // ensure numeric type for plotting
          water_sea_level: item.water_sea_level != null ? Number(item.water_sea_level) : item.water_sea_level,
        };
      });

      setDataObservasi(normalize(obsData));
      setDataPrediksi(normalize(predData));
  };

  const combinedData = [
    ...(showObservasi ? dataObservasi : []),
    ...(showPrediksi ? dataPrediksi : []),
  ];

  return (
    <>
      <div className="cloud-bg"></div> {/* Mega mendung tipis */}
      <div className="container">
        <Header />

        <FilterCard
          lokasiList={lokasiList}
          lokasi={lokasi}
          onLokasiChange={val => setLokasi(val)}
          startDate={startDate}
          onStartDateChange={val => setStartDate(val)}
          endDate={endDate}
          onEndDateChange={val => setEndDate(val)}
          onApply={applyFilter}
          canApply={!!(lokasi && startDate && endDate)}
        />

        <ChartCard
          combinedData={combinedData}
          showObservasi={showObservasi}
          showPrediksi={showPrediksi}
          onToggleObservasi={() => setShowObservasi(!showObservasi)}
          onTogglePrediksi={() => setShowPrediksi(!showPrediksi)}
        />
      </div>

      <WaveBottom /> {/* Gelombang animasi di bawah */}
    </>
  );
}

export default App;
