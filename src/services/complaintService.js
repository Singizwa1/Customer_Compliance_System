import api from "./api"

export const getComplaints = async () => {
  return api.get("/complaints")
}

export const getComplaintById = async (id) => {
  return api.get(`/complaints/${id}`)
}

export const createComplaint = async (complaintData, attachments = []) => {
  const formData = new FormData()

  // Add complaint data
  Object.keys(complaintData).forEach((key) => {
    formData.append(key, complaintData[key])
  })

  // Add attachments
  attachments.forEach((file) => {
    formData.append("attachments", file)
  })

  return api.post("/complaints", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const updateComplaint = async (id, updateData) => {
  try {
    const response = await api.put(`/complaints/${id}`, updateData) 
    return response.data
  } catch (error) {
    console.error(`Error updating complaint ${id}:`, error)
    throw error 
  }
}

export const deleteComplaint = async (id) => {
  return api.delete(`/complaints/${id}`)
}
