import React from 'react'
import { useEffect } from 'react'
import axiosInstance from '../utils/Instance'

function PropertiesPage() {
    function fetchProperties() {
        axiosInstance.get("/api/projects")
    }
  return (
    <div>
      
    </div>
  )
}

export default PropertiesPage
