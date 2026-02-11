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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    const formData = new FormData(form);

    const newErrors: { [key: string]: string } = {};

    // 1. Get Values
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const contact = formData.get("contact") as string;
    const zip = formData.get("zip") as string;
    const message = formData.get("message") as string;

    // 2. Validation Logic
    if (!fullname) newErrors.fullname = "Full name is required.";

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!contact) {
      newErrors.contact = "Contact number is required.";
    } else if (contact.length < 10) {
      newErrors.contact = "Please enter a valid phone number.";
    }

    if (!zip) newErrors.zip = "Zip code is required.";
    if (!message) newErrors.message = "Message cannot be empty.";

    // If errors exist, stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 3. Submit to Actions
    setStatus("Sending...");
    setErrors({});

    try {
      const { error } = await actions.sendEmail({ fullname, email, contact, zip, message });
      if (error) {
        setStatus("❌ Error sending message.");
        return;
      }

      const { error: thankYouError } = await actions.sendThankYouEmail({ fullname, email, contact, zip, message });

      setStatus("✅ Thank you! Your message has been sent.");
      form.reset();

    } catch (err) {
      setStatus("❌ An unexpected error occurred.");
    }
  };

  // Clear error while typing
  const handleInput = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    if (errors[target.name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[target.name];
        return updated;
      });
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

      <form onSubmit={handleSubmit} onInput={handleInput} noValidate>
        <div className="row">
          <div className="col-md-12">
            <div className="universa-input">
              <input type="text" name="fullname" placeholder="Full Name" />
              {errors.fullname && <p className="field-error">{errors.fullname}</p>}
            </div>
          </div>

          <div className="col-md-12">
            <div className="universa-input">
              <input type="email" name="email" placeholder="Your Email" />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="universa-input">
              <input type="tel" name="contact" placeholder="Contact Number" />
              {errors.contact && <p className="field-error">{errors.contact}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="universa-input">
              <input type="text" name="zip" placeholder="Zip Code" />
              {errors.zip && <p className="field-error">{errors.zip}</p>}
            </div>
          </div>

          <div className="col-md-12">
            <div className="universa-input">
              <textarea name="message" placeholder="Your Message" rows={5} />
              {errors.message && <p className="field-error">{errors.message}</p>}
            </div>
          </div>

          <div className="col-md-12">
            <div className="submit-button">
              <button type="submit" className="submite-button">
                Send Message
                {/* {status === "Sending..." ? "Sending..." : "Send Message"} */}
              </button>
            </div>
          </div>
        </div>
      </form>

      {status && (
        <p className={` ${status.includes("✅") ? "success" : "error"}`}>
          {status}
        </p>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .field-error {
          color: #ff4d4d;
          font-size: 12px;
          margin: 4px 0 10px 0;
          font-weight: 500;
        }
        .status-msg {
          margin-top: 20px;
          font-weight: bold;
          text-align: center;
        }
        .status-msg.success { color: #28a745; }
        .status-msg.error { color: #dc3545; }
        .universa-input input, .universa-input textarea {
          width: 100%;
        }
          .blue-form .field-error,.yellow-form .field-error {
    color: #fff;
    margin-top:5px;
}
    .blue-form .status-msg.success,.yellow-form .status-msg.success{
        color: #fff;
    }

      `}} />
    </div>
  );
}