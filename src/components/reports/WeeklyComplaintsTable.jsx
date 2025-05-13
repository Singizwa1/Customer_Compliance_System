import React, { useState, useEffect } from "react";

const WeeklyComplaintsTable = ({ onExportDataChange }) => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    weekRange: "",
    status: "",
    department: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
  });

  // Format helper
  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

  // Calculate week ranges
  const getWeekRange = (range) => {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);

    if (range === "current_week") {
      const day = today.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      startDate.setDate(today.getDate() - diffToMonday);
      endDate.setDate(startDate.getDate() + 6);
    } else if (range === "last_week") {
      const day = today.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      endDate.setDate(today.getDate() - diffToMonday - 1);
      startDate.setDate(endDate.getDate() - 6);
    } else if (range === "custom") {
      return {
        startDate: filter.startDate,
        endDate: filter.endDate,
      };
    } else {
      return { startDate: null, endDate: null };
    }

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  // Fetch all complaints once
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setComplaints(data);
      setFilteredComplaints(data); // Show all initially
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Refilter complaints when filters change
  useEffect(() => {
    const applyFilters = () => {
      const { startDate, endDate } = getWeekRange(filter.weekRange);
      let result = [...complaints];

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        result = result.filter((c) => {
          const compDate = new Date(c.date);
          return compDate >= start && compDate <= end;
        });
      }

      result = result.filter((c) => {
        const matchesStatus = !filter.status || c.status?.toLowerCase() === filter.status.toLowerCase();
        const matchesDept = !filter.department || c.assignedToUser?.department?.toLowerCase() === filter.department.toLowerCase();
        const matchesSearch =
          !filter.searchTerm ||
          c.customer_name?.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
          c.inquiry_type?.toLowerCase().includes(filter.searchTerm.toLowerCase());

        return matchesStatus && matchesDept && matchesSearch;
      });

      setFilteredComplaints(result);
      if (onExportDataChange) onExportDataChange(result);
    };

    applyFilters();
  }, [filter, complaints]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <h3>Complaints Overview</h3>

      <div className="filters-container">
        {/* Week Range */}
        <select
          value={filter.weekRange}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              weekRange: e.target.value,
              startDate: "",
              endDate: "",
            }))
          }
        >
          <option value="">All Complaints</option>
          <option value="current_week">This Week</option>
          <option value="last_week">Last Week</option>
          <option value="custom">Custom Range</option>
        </select>

        {/* Custom date fields */}
        {filter.weekRange === "custom" && (
          <>
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) => setFilter((prev) => ({ ...prev, startDate: e.target.value }))}
            />
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) => setFilter((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </>
        )}

        {/* Status Filter */}
        <select
          value={filter.status}
          onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Department Filter */}
        <select
          value={filter.department}
          onChange={(e) => setFilter((prev) => ({ ...prev, department: e.target.value }))}
        >
          <option value="">All Departments</option>
          <option value="IT department">IT Department</option>
          <option value="Funds Administration">Funds Administration</option>
          <option value="Finance & Accounting">Finance & Accounting</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or inquiry type..."
          value={filter.searchTerm}
          onChange={(e) => setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))}
        />
      </div>

      {/* Table */}
      {filteredComplaints.length > 0 ? (
        <table className="complaint-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Inquiry Type</th>
              <th>Status</th>
              <th>Department</th>
              <th>Resolved Date</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{new Date(c.date).toLocaleDateString()}</td>
                <td>{c.customer_name || "-"}</td>
                <td>{c.inquiry_type || "-"}</td>
                <td>
                  <span className={`status-badge ${c.status?.toLowerCase() || ""}`}>
                    {c.status || "N/A"}
                  </span>
                </td>
                <td>{c.assignedToUser?.department || "-"}</td>
                <td>
                  {c.updated_at
                    ? new Date(c.updated_at).toLocaleDateString()
                    : "-"}
                </td>
                <td>{c.resolution || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="table-empty-state">
          <p>No complaints found.</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyComplaintsTable;
