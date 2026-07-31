function StatsCard({ title, value }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>

      <h1
        style={{
          color: "#1e3a8a",
          marginTop: "10px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default StatsCard;