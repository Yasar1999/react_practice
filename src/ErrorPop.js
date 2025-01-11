import React, { useState, useEffect } from "react";
import "./Popup.css";

const Popup = ({ message, type }) => (
  <div className={`popup ${type}`}>
    <p>{message}</p>
  </div>
);

const ApiNotificationExample = ({ response }) => {
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    console.log(response)
    if (response) {
      if (response.status === 400 || response.status === 226 || response.status === 208) {
        setPopup({ show: true, message: response.data.error, type: "error" });
      } else {
        setPopup({ show: true, message: response.data.msg, type: "success" });
      }

      const timeout = setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
      return () => clearTimeout(timeout);
    }
  }, [response]); // Re-run when the `response` prop changes

  return popup.show && <Popup message={popup.message} type={popup.type} />;
};

export default ApiNotificationExample;
