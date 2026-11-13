import Navbar from "./Navbar";

function Contact() {

    return(
        <>
        <div className="page-container">
            <Navbar/>
            Mă puteți contacta telefonic la numărul de telefon:
            <a style={{fontWeight: "500", textDecoration: "Underline"}} href="tel:PHONE_NUM">+40 748 596 806</a>
        </div>
        </>
    )
}

export default Contact;