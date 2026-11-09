import "./Services.css"
import Navbar from "./Navbar"
import { useEffect } from "react"
import axios from "axios"
import { useState } from "react"

function Services() {

  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const servicesData = (await axios.get("/api/work-info")).data;

      setData(servicesData["services"]);
      console.log(servicesData["services"])
    }

    fetchData();
  }, [])
  return (
    <>
      <div className="services-container">
        <Navbar />
        {data && data.map((service, index) => (
          <span key={index}>
            { service["name"]}
          </span>
        ))}
      </div>
    </>
  )
}

export default Services