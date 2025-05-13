import api from "./api"

export const getComplaintsByCategory = async () => {
  return api.get("/reports/complaints-by-category")
}

export const getResolutionTimeByDepartment = async () => {
  return api.get("/reports/resolution-time-by-department")
}

export const getComplaintStatusDistribution = async () => {
  return api.get("/reports/complaint-status-distribution")
}

export const getMonthlyComplaintTrend = async () => {
  return api.get("/reports/monthly-complaint-trend")
}

export const getDepartmentPerformance = async () => {
  return api.get("/reports/department-performance")
}
export const getAllComplaints = async () => {
  const response = await api.get("/complaints")
  return response.data
}
export const getWeeklyComplaints = async () => {
  const response = await api.get("/reports/weekly-complaints");

  console.log('getWeeklyComplaints',response);
  return response.data;
};



