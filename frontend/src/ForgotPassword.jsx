import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";


export default function ForgotPassword() {
    const [formData, setFormData] = useState({cif: "",pan: "",aadhaar: "",username: "",phone: "",newPassword: ""});
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isCIFValid, setIsCIFValid] = useState(false);
    const [isAadhaarValid, setIsAadhaarValid] = useState(false);
    const [isPANValid, setIsPANValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const setIsCIFValidState = (cif) => /^[0-9]{9}$/.test(cif);
    const isAadhaarValidState = (aadhaar) => /^[0-9]{12}$/.test(aadhaar);
    const isPANValidState = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.toUpperCase());
    const isPhoneValidState = (phone) => /^[0-9]{10}$/.test(phone);
    const isPasswordValidSatae = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));  
    switch (field) {
        case "newPassword":
            setIsPasswordValid(isPasswordValidSatae(value));
        break;
        case "cif":
            setIsCIFValid(setIsCIFValidState(value));
        break;
        case "aadhaar":
            setIsAadhaarValid(isAadhaarValidState(value));
        break;
        case "pan":
            setIsPANValid(isPANValidState(value));
        break;
        case "phone":
            setIsPhoneValid(isPhoneValidState(value));
        break;
        default:
        break;
    }
    };

    const navigate = useNavigate();
    const handleReset = () => {
         const { CIF_No, password } = formData;
         alert(`Login → Username: ${CIF_No}, Password: ${password}`);
         navigate("/login");
    };


    return (
        <>
            <style>
            {`
                body, html { height: 100%; margin: 0; font-family: Arial, sans-serif; background: #f2f6fc;}
                .page-container { display: flex; flex-direction: column; min-height: 100vh;}
                .forgot-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px;}
                .forgot-box { background: #fff; padding: 40px 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 400px;}
                .forgot-box h2 { text-align: center; margin-bottom: 30px; color: #003366; }
                .forgot-box label { display: block; margin: 10px 0 5px; font-weight: bold; color: #003366; }
                .forgot-box input { width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
                .forgot-box button { width: 100%; padding: 14px; background: #003366; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; transition: background 0.3s ease; }
                .forgot-box button:hover { background: #0055aa;}
                .forgot-box button:disabled { background: #ccc; color: #666; cursor: not-allowed; opacity: 0.7;}
            `}
        </style>

        <Header />

        <div className="page-container">
        <div className="forgot-container">
            <div className="forgot-box">
            <h2>Reset Password</h2>

            <label>CIF Number</label>
            <input
                type="text"
                value={formData.cif}
                onChange={(e) => handleChange("cif", e.target.value)}
            />
            {formData.cif && !isCIFValid && (
                <small style={{ color: "red" }}>CIF must be exactly 9 digits.</small>
            )}
            <label>Username</label>
            <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
            />

            <label>Aadhaar Number</label>
            <input
                type="text"
                value={formData.aadhaar}
                onChange={(e) => handleChange("aadhaar", e.target.value)}
            />
            {formData.aadhaar && !isAadhaarValid && (
                <small style={{ color: "red" }}>Aadhaar must be exactly 12 digits.</small>
            )}
            <label>PAN Number</label>
            <input
                type="text"
                value={formData.pan}
                onChange={(e) => handleChange("pan", e.target.value)}
            />
            {formData.pan && !isPANValid && (
                <small style={{ color: "red" }}>PAN must be in format ABCDE1234F.</small>
            )}
            <label>Phone Number</label>
            <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
            />
            {formData.phone && !isPhoneValid && (
                <small style={{ color: "red" }}>Phone number must be exactly 10 digits.</small>
            )}
            <label>New Password</label>
            <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
            />
            {formData.newPassword && !isPasswordValid && (
                <small style={{ color: "red" }}>
                    Password must be at least 8 characters and must include at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol.
                </small>
            )}
            <button
                onClick={handleReset}
                disabled={
                !formData.cif.trim() ||
                !formData.pan.trim() ||
                !formData.aadhaar.trim() ||
                !formData.username.trim() ||
                !formData.phone.trim() ||
                !formData.newPassword.trim() ||
                !isPasswordValid ||
                !isCIFValid ||
                !isAadhaarValid ||
                !isPANValid ||
                !isPhoneValid
                }
               
            >
                Reset Password
            </button>
            
            </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
