import { useState, useEffect } from "react";
import { actions } from "astro:actions";
import "../styles/global.css";
import { queryWordPress } from "../lib/wordpress";

const QURYDATA = `
query Contactus {
  page(id: "contact", idType: URI) {
    contactUs {
      connectUs
      contactFormTitle
      getConnectTittle
      connectUsDesc
    }
  }
}
`;

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [content, setContent] = useState({
    connectUs: "",
    contactFormTitle: "Connect With Us",
    getConnectTittle: "We'd love to hear from you.",
    connectUsDesc: ""
  });

  useEffect(() => {
    async function fetchPageData() {
      try {
        const pagaedata = await queryWordPress(QURYDATA);
        if (pagaedata?.page?.contactUs) {
          setContent({
            connectUs: pagaedata.page.contactUs.connectUs || "",
            contactFormTitle: pagaedata.page.contactUs.contactFormTitle,
            getConnectTittle: pagaedata.page.contactUs.getConnectTittle,
            connectUsDesc: pagaedata.page.contactUs.connectUsDesc,
          });
        }
      } catch (error) {
        console.error("Error fetching WordPress data:", error);
      }
    }
    fetchPageData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("Sending...");

    const formData = new FormData(form);
    
    // Updated data object to match your request
    const data = {
      fullname: formData.get("fullname") as string,
      email: formData.get("email") as string,
      contact: formData.get("contact") as string,
      zip: formData.get("zip") as string,
      message: formData.get("message") as string,
    };

    try {
      // 1. Send the main email
      const { error } = await actions.sendEmail(data);
      if (error) {
        setStatus("❌ Error sending message. Please try again.");
        return;
      }

      // 2. Send the thank you confirmation
      const { error: thankYouError } = await actions.sendThankYouEmail(data);
      if (thankYouError) {
        setStatus("❌ Error sending confirmation.");
      } else {
        setStatus("✅ Thank you! A confirmation email has been sent to you.");
        form.reset();
      }
    } catch (err) {
      setStatus("❌ An unexpected error occurred.");
    }
  };

  return (
    <div className="contactform-holders">
      <div className="centerdata-form">
        <h4 className="fs-30">{content.connectUs}</h4>
        {content.connectUsDesc && (
          <div
            className="connect-desc"
            dangerouslySetInnerHTML={{ __html: content.connectUsDesc }}
          />
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Full Name */}
          <div className="col-md-12">
            <div className="universa-input">
              <input type="text" name="fullname" placeholder="Full Name" required />
            </div>
          </div>

          {/* Email */}
          <div className="col-md-12">
            <div className="universa-input">
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
          </div>

          {/* Contact Number */}
          <div className="col-md-6">
            <div className="universa-input">
              <input type="tel" name="contact" placeholder="Contact Number" required />
            </div>
          </div>

          {/* Zip Code */}
          <div className="col-md-6">
            <div className="universa-input">
              <input type="text" name="zip" placeholder="Zip Code" required />
            </div>
          </div>

          {/* Message */}
          <div className="col-md-12">
            <div className="universa-input">
              <textarea name="message" placeholder="Your Message" rows={5} required />
            </div>
          </div>

          <div className="col-md-12">
            <div className="submit-button">
              <button type="submit" className="submite-button">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </form>

      {status && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{status}</p>}
    </div>
  );
}