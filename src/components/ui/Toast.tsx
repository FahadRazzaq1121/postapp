import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface ToastProps {
  message: string;
  type: "error" | "success" | "warning";
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
  const [showToast, setShowToast] = useState(false);
  const [toastId] = useState(Math.random().toString());

  const toastClass = type === "error" ? "bg-danger" : "bg-success";

  useEffect(() => {
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [toastId, duration]);

  let bgColorClass = "";
  switch (type) {
    case "error":
      bgColorClass = "bg-red-500";
      break;
    case "warning":
      bgColorClass = "bg-yellow-500";
      break;
    case "success":
    default:
      bgColorClass = "bg-green-500";
      break;
  }

  const handleClose = () => {
    setShowToast(false);
    onClose();
  };

  return (
    <div
      className={`position-fixed bottom-0 end-0 p-3 toast-container`}
      style={{ zIndex: 1050 }}
    >
      {showToast && (
        <div
          id="liveToast"
          className={`toast show ${toastClass}`}
          style={{ borderRadius: "20px" }}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body d-flex justify-content-between">
            <p
              className="fw-bold fs-10 mb-0"
              style={{ fontFamily: "Arial, sans-serif", color: "white" }}
            >
              {message}
            </p>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toast;
