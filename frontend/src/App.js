import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const BASE_URL = "http://127.0.0.1:8000";

  const handleUpload = async () => {
    if (!file || !jobDesc) {
      alert("Please upload file and enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDesc);

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(`${BASE_URL}/api/upload/`, formData);

      if (res.data?.data) {
        setResult(res.data.data);
        fetchHistory();
      } else {
        alert("Invalid response from server");
      }

    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/history/`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "green";
    if (score >= 60) return "orange";
    return "red";
  };

  const getRating = (score) => {
    if (score >= 80) return "🔥 Strong Match";
    if (score >= 60) return "👍 Good Match";
    return "⚠️ Needs Improvement";
  };

  const chartData = result && {
    labels: ["Matched", "Gap"],
    datasets: [
      {
        data: [result.match_score || 0, 100 - (result.match_score || 0)],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

    
      <h1 className="text-3xl font-bold text-blue-600">
        🚀 AI Resume Analyzer
      </h1>

      <p className="text-gray-600 mb-6 text-center">
        Analyze your resume using AI and match it with job descriptions
      </p>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">

        <input
          type="file"
          className="w-full mb-2 p-2 border rounded"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && (
          <p className="text-sm text-gray-600 mb-3">
            📄 Uploaded: {file.name}
          </p>
        )}

        <textarea
          className="w-full mb-4 p-3 border rounded"
          placeholder="Paste Job Description..."
          rows="4"
          onChange={(e) => setJobDesc(e.target.value)}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "⏳ Analyzing..." : "🚀 Analyze Resume"}
        </button>
      </div>

      {result && (
        <div className="bg-white shadow-lg rounded-xl p-6 mt-6 w-full max-w-3xl">

          <h2 className="text-xl font-semibold mb-4 text-center">
            📊 Resume Analysis
          </h2>

  
          <div className="flex justify-center mb-4">
            <div style={{ width: "200px" }}>
              <Doughnut data={chartData} />
            </div>
          </div>

     
          <p className="text-center text-lg font-medium">
            Match Score:
            <span style={{ color: getScoreColor(result.match_score) }}>
              {" "} {result.match_score || 0}%
            </span>
          </p>

          <p className="text-center mt-2 font-semibold">
            {getRating(result.match_score)}
          </p>

  
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${result.match_score}%` }}
            ></div>
          </div>

     
          <h3 className="font-semibold mt-4">✅ Skills Found</h3>
          <div className="mb-4">
            {result.skills.map((skill, i) => (
              <span key={i} className="bg-green-500 text-white px-2 py-1 m-1 rounded inline-block">
                {skill}
              </span>
            ))}
          </div>

          <h3 className="font-semibold mt-4">❌ Missing Skills</h3>
          <div className="mb-4">
            {result.missing_skills.length > 0 ? (
              result.missing_skills.map((skill, i) => (
                <span key={i} className="bg-red-500 text-white px-2 py-1 m-1 rounded inline-block">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-green-600">No missing skills 🎉</p>
            )}
          </div>

       
          <h3 className="font-semibold mt-4">💡 Suggestions</h3>
          <ul className="mt-2 space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="bg-yellow-100 p-2 rounded">
                💡 {s}
              </li>
            ))}
          </ul>

        </div>
      )}

  
      {history.length > 0 && (
        <div className="bg-white shadow-lg rounded-xl p-6 mt-6 w-full max-w-3xl">

          <h3 className="font-semibold mb-4 text-center">
            📜 Recent Analyses
          </h3>

          {history.map((h, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg mb-3 shadow-sm">

              <p><strong>Score:</strong> {h.score}%</p>

              <div className="mt-2">
                <strong>Skills:</strong>
                <div className="flex flex-wrap mt-1">
                  {h.skills.split(", ").map((s, idx) => (
                    <span key={idx} className="bg-green-500 text-white px-2 py-1 m-1 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-2">
                <strong>Missing:</strong>{" "}
                {h.missing ? h.missing : "None 🎉"}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {new Date(h.date).toLocaleString()}
              </p>

            </div>
          ))}

        </div>
      )}
      
      <footer className="mt-10 text-gray-500 text-sm">
        Built with ❤️ using React & Django
      </footer>

    </div>
  );
}

export default App;