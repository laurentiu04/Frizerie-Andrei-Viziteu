import "./Services.css"
import Navbar from "./Navbar"
import { useEffect } from "react"
import axios from "axios"
import { useState } from "react"
import TunsModern from "./assets/Tuns_modern.jpeg"
import TunsBarba from "./assets/Tuns_barbă.jpeg"
import clock from "./assets/clock-icon.png"
import price from "./assets/price-icon.png"
import placeholder from "./assets/placeholder.png"

function Services() {

  const [data, setData] = useState(null);
  const backgrounds = [placeholder, TunsModern, TunsBarba, placeholder];

  useEffect(() => {
    const fetchData = async () => {
      const servicesData = (await axios.get("/api/work-info")).data;

      setData(servicesData["services"]);
      // console.log(servicesData["services"])
    }

    fetchData();
  }, [])
  return (
    <>
    <div className="page-container">
      <Navbar />
      <div className="services-container">
        {data && data.map((service, index) => (
          <div key={index} data-id={index} className="service-card">
            <img className="bg" src={backgrounds[index]}/>
            <h1 className="title">{service["name"]}</h1>
            <div className="info price">
                <img src={price}/>
                <p>{service["price"]} RON (1 DEC: {service["price"] + 10} RON)</p>
            </div>
            <div className="info time">
                <img src={clock}/>
                <p>{service["time"]} MIN</p>
            </div>
          </div>
        ))}
      </div>

    </div>
    </>
  )
}

export default Services