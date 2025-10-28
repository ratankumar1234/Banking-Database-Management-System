import { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function Signup() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    street: "",
    town: "",
    district: "",
    state: "",
    country: "India",
    pinCode: "",
    type: "Individual",
    pin: "",
    // Individual-specific fields
    aadhaar: "",
    pan: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    dateOfBirth: "",
    // Organisation-specific fields
    regNo: "",
    orgName: "",
    orgType: "",
    cifOwner: "",
    orgContactNumber: "",
    orgEmail: ""
  });

  const [validation, setValidation] = useState({
    isPhoneValid: false,
    isPasswordValid: false,
    isEmailValid: false,
    isPINCodeValid: false,
    isUsernameValid: false,
    isPINValid: false,
    isAadhaarValid: false,
    isPANValid: false,
    isRegNoValid: false,
    isOrgContactValid: false,
    isOrgEmailValid: false,
    isCifOwnerValid: false
  });

  const [loading, setLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const validators = {
    phone: (val) => /^[0-9]{10}$/.test(val),
    password: (val) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val),
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    pinCode: (val) => /^[0-9]{6}$/.test(val),
    username: (val) => val.length >= 6,
    pin: (val) => /^[0-9]{6}$/.test(val),
    aadhaar: (val) => /^[0-9]{12}$/.test(val),
    pan: (val) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val),
    regNo: (val) => /^[0-9]{10}$/.test(val),
    cifOwner: (val) => /^[0-9]{9}$/.test(val) && val.length === 9
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    switch (field) {
      case "phone":
        setValidation((prev) => ({ ...prev, isPhoneValid: validators.phone(value) }));
        break;
      case "password":
        setValidation((prev) => ({ ...prev, isPasswordValid: validators.password(value) }));
        break;
      case "email":
        setValidation((prev) => ({ ...prev, isEmailValid: validators.email(value) }));
        break;
      case "pinCode":
        setValidation((prev) => ({ ...prev, isPINCodeValid: validators.pinCode(value) }));
        break;
      case "username":
        setValidation((prev) => ({ ...prev, isUsernameValid: validators.username(value) }));
        break;
      case "pin":
        setValidation((prev) => ({ ...prev, isPINValid: validators.pin(value) }));
        break;
      case "aadhaar":
        setValidation((prev) => ({ ...prev, isAadhaarValid: validators.aadhaar(value) }));
        break;
      case "pan":
        setValidation((prev) => ({ ...prev, isPANValid: validators.pan(value) }));
        break;
      case "regNo":
        setValidation((prev) => ({ ...prev, isRegNoValid: validators.regNo(value) }));
        break;
      case "orgContactNumber":
        setValidation((prev) => ({ ...prev, isOrgContactValid: validators.phone(value) }));
        break;
      case "orgEmail":
        setValidation((prev) => ({ ...prev, isOrgEmailValid: validators.email(value) }));
        break;
      case "cifNo":
        setValidation((prev) => ({ ...prev, isCifNoValid: validators.cifNo(value) }));
        break;
      case "cifOwner":
        setValidation((prev) => ({ ...prev, isCifOwnerValid: validators.cifOwner(value) }));
        break;
      default:
        break;
    }
  };

  const isStep1Valid =
    formData.username &&
    formData.email &&
    formData.phone &&
    formData.password &&
    formData.pin &&
    formData.street &&
    formData.town &&
    formData.district &&
    formData.state &&
    formData.country &&
    formData.pinCode &&
    validation.isPhoneValid &&
    validation.isPasswordValid &&
    validation.isEmailValid &&
    validation.isUsernameValid &&
    validation.isPINValid &&
    validation.isPINCodeValid;

  const isStep2Valid =
    formData.aadhaar &&
    formData.pan &&
    formData.firstName &&
    formData.lastName &&
    formData.gender &&
    formData.dateOfBirth &&
    validation.isAadhaarValid &&
    validation.isPANValid;

  const isStep3Valid =
    formData.regNo &&
    formData.orgName &&
    formData.orgType &&
    formData.cifOwner &&
    formData.orgContactNumber &&
    formData.orgEmail &&
    validation.isRegNoValid &&
    validation.isOrgContactValid &&
    validation.isOrgEmailValid &&
    validation.isCifOwnerValid 

  const handleNext = () => {
    setServerError(null);
    if (step === 1) {
      if (formData.type === "Individual") {
        setStep(2);
      } else if (formData.type === "Organisation") {
        setStep(3);
      }
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setServerError(null);
    setStep(1);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      phone: "",
      password: "",
      street: "",
      town: "",
      district: "",
      state: "",
      country: "India",
      pinCode: "",
      type: "Individual",
      pin: "",
      aadhaar: "",
      pan: "",
      firstName: "",
      lastName: "",
      gender: "Male",
      dateOfBirth: "",
      regNo: "",
      orgName: "",
      orgType: "",
      cifOwner: "",
      orgContactNumber: "",
      orgEmail: ""
    });
    setValidation({
      isPhoneValid: false,
      isPasswordValid: false,
      isEmailValid: false,
      isPINCodeValid: false,
      isUsernameValid: false,
      isPINValid: false,
      isAadhaarValid: false,
      isPANValid: false,
      isRegNoValid: false,
      isOrgContactValid: false,
      isOrgEmailValid: false,
      isCifOwnerValid: false
    });
    setServerResponse(null);
    setServerError(null);
    setShowSummary(false);
    setStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setServerError(null);
    setServerResponse(null);

    try {
      const fd = new FormData();

      // Map frontend fields to backend expected names
      fd.append("email", formData.email);
      fd.append("phone_no", formData.phone);
      fd.append("street", formData.street || "");
      fd.append("town", formData.town || "");
      fd.append("district", formData.district || "");
      fd.append("state", formData.state || "");
      fd.append("country", formData.country || "India");
      fd.append("pin_code", formData.pinCode);
      fd.append("Type", formData.type); // "Individual" or "Organisation"
      fd.append("username", formData.username);
      fd.append("password", formData.password);
      fd.append("PIN", formData.pin);

      if (formData.type === "Individual") {
        fd.append("aadhar", formData.aadhaar);
        fd.append("pan", formData.pan.toUpperCase());
        fd.append("first_name", formData.firstName);
        fd.append("last_name", formData.lastName);
        fd.append("gender", formData.gender);
        fd.append("dob", formData.dateOfBirth);
      } else {
        // Organisation
        fd.append("registration_number", formData.regNo);
        fd.append("organisation_name", formData.orgName);
        fd.append("org_type", formData.orgType);
        // optional fields to match your schema
        fd.append("phone_no", formData.orgContactNumber || formData.phone);
        fd.append("email", formData.orgEmail || formData.email);
        fd.append("cif_owner", formData.cifOwner);
      }

      // Adjust the URL if your API lives on a different host/port
      const resp = await fetch("http://localhost:8000/accounts/create", {
        method: "POST",
        body: fd
      });

      const json = await resp.json();

      if (!resp.ok) {
        // backend returned an error
        setServerError(json.detail || JSON.stringify(json));
        setLoading(false);
        return;
      }

      setServerResponse(json);
      setShowSummary(true);
      setLoading(false);
    } catch (err) {
      setServerError(err.message || "Network error");
      setLoading(false);
    }
  };

  const maskedPassword = (pw) => {
    if (!pw) return "";
    return "*".repeat(Math.min(12, pw.length)) + (pw.length > 12 ? "…" : "");
  };

  return (
    <>
      <style>{`
        body, html { height: 100%; margin: 0; font-family: Arial, sans-serif; background: #f2f6fc; }
        .page-container { display: flex; flex-direction: column; min-height: 100vh; }
        .sign-up-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px; }
        .sign-up-box { background: #fff; padding: 40px 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 400px; }
        .sign-up-box h2 { text-align: center; margin-bottom: 20px; color: #003366; }
        .sign-up-box h3 { text-align: center; margin-bottom: 20px; color: #0055aa; font-size: 16px; }
        .sign-up-box label { display: block; margin: 10px 0 5px; font-weight: bold; color: #003366; font-size: 14px; }
        .sign-up-box input, .sign-up-box select { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
        .sign-up-box button { width: 100%; padding: 14px; background: #003366; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; transition: background 0.3s ease; margin-top: 10px; }
        .sign-up-box button:hover { background: #0055aa; }
        .sign-up-box button:disabled { background: #ccc; color: #666; cursor: not-allowed; opacity: 0.7; }
        .sign-up-box button.back-btn { background: #6c757d; margin-top: 10px; }
        .sign-up-box button.back-btn:hover { background: #5a6268; }
        .error-text { color: red; font-size: 12px; margin-top: -12px; margin-bottom: 10px; display: block; }
        .step-indicator { text-align: center; color: #666; font-size: 14px; margin-bottom: 20px; }
        .response-panel { background:#fff; padding:20px; border-radius:8px; box-shadow:0 3px 8px rgba(0,0,0,0.08); margin-top:20px; }
        .response-panel h4 { margin:0 0 10px 0; color:#003366; }
        .summary-table { width:100%; border-collapse:collapse; margin-top:10px; }
        .summary-table td { padding:6px 8px; border-bottom:1px solid #eee; font-size:14px; }
        .small-muted { color:#666; font-size:13px; }
      `}</style>

      <Header />

      <div className="page-container">
        <div className="sign-up-container">
          <div className="sign-up-box">
            <h2>Sign Up</h2>

            {!showSummary && (
              <>
                <div className="step-indicator">
                  Step {step === 1 ? "1" : "2"} of {formData.type === "Individual" ? 2 : formData.type === "Organisation" ? 2 : 1}
                </div>

                {step === 1 && (
                  <>
                    <h3>Basic Information</h3>

                    <label>Email</label>
                    <input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                    {formData.email && !validation.isEmailValid && <small className="error-text">Enter a valid email.</small>}

                    <label>Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                    {formData.phone && !validation.isPhoneValid && <small className="error-text">Phone must be 10 digits.</small>}

                    <label>Street</label>
                    <input type="text" value={formData.street} onChange={(e) => handleChange("street", e.target.value)} />

                    <label>Town</label>
                    <input type="text" value={formData.town} onChange={(e) => handleChange("town", e.target.value)} />

                    <label>District</label>
                    <input type="text" value={formData.district} onChange={(e) => handleChange("district", e.target.value)} />

                    <label>State</label>
                    <input type="text" value={formData.state} onChange={(e) => handleChange("state", e.target.value)} />

                    <label>Country</label>
                    <input type="text" value={formData.country} onChange={(e) => handleChange("country", e.target.value)} />

                    <label>PIN Code</label>
                    <input type="text" value={formData.pinCode} onChange={(e) => handleChange("pinCode", e.target.value)} />
                    {formData.pinCode && !validation.isPINCodeValid && <small className="error-text">PIN must be 6 digits.</small>}

                    <label>User Type</label>
                    <select value={formData.type} onChange={(e) => handleChange("type", e.target.value)}>
                      <option>Individual</option>
                      <option>Organisation</option>
                    </select>

                    <label>Set Username</label>
                    <input type="text" value={formData.username} onChange={(e) => handleChange("username", e.target.value)} />
                    {formData.username && !validation.isUsernameValid && <small className="error-text">Username must be at least 6 characters.</small>}

                    <label>Set Password</label>
                    <input type="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />
                    {formData.password && !validation.isPasswordValid && <small className="error-text">Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.</small>}

                    <label>Set PIN</label>
                    <input type="password" value={formData.pin} onChange={(e) => handleChange("pin", e.target.value)} />
                    {formData.pin && !validation.isPINValid && <small className="error-text">PIN must be exactly 6 digits.</small>}

                    <button onClick={handleNext} disabled={!isStep1Valid || loading}>
                      {loading ? "Please wait..." : "Next"}
                    </button>
                  </>
                )}

                {step === 2 && formData.type === "Individual" && (
                  <>
                    <h3>Individual Details</h3>

                    <label>Aadhaar Number</label>
                    <input
                      type="text"
                      value={formData.aadhaar}
                      onChange={(e) => handleChange("aadhaar", e.target.value)}
                      maxLength="12"
                      placeholder="12 digit Aadhaar number"
                    />
                    {formData.aadhaar && !validation.isAadhaarValid && <small className="error-text">Aadhaar must be exactly 12 digits.</small>}

                    <label>PAN Number</label>
                    <input
                      type="text"
                      value={formData.pan}
                      onChange={(e) => handleChange("pan", e.target.value.toUpperCase())}
                      maxLength="10"
                      placeholder="e.g., ABCDE1234F"
                      style={{ textTransform: "uppercase" }}
                    />
                    {formData.pan && !validation.isPANValid && <small className="error-text">PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F).</small>}

                    <label>First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      maxLength="20"
                    />

                    <label>Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      maxLength="20"
                    />

                    <label>Gender</label>
                    <select value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                    <label>Date of Birth</label>
                    <input type="date" value={formData.dateOfBirth} onChange={(e) => handleChange("dateOfBirth", e.target.value)} />

                    <button onClick={handleNext} disabled={!isStep2Valid || loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                    <button className="back-btn" onClick={handleBack} disabled={loading}>
                      Back
                    </button>
                  </>
                )}

                {step === 3 && formData.type === "Organisation" && (
                  <>
                    <h3>Organisation Details</h3>

                    <label>Registration Number</label>
                    <input
                      type="text"
                      value={formData.regNo}
                      onChange={(e) => handleChange("regNo", e.target.value)}
                      maxLength="10"
                      placeholder="10 digit registration number"
                    />
                    {formData.regNo && !validation.isRegNoValid && <small className="error-text">Registration number must be exactly 10 digits.</small>}

                    <label>Organisation Name</label>
                    <input type="text" value={formData.orgName} onChange={(e) => handleChange("orgName", e.target.value)} maxLength="100" />

                    <label>Organisation Type</label>
                    <input type="text" value={formData.orgType} onChange={(e) => handleChange("orgType", e.target.value)} maxLength="50" placeholder="e.g., Private Limited, Partnership" />

                    <label>Contact Number</label>
                    <input type="tel" value={formData.orgContactNumber} onChange={(e) => handleChange("orgContactNumber", e.target.value)} maxLength="10" placeholder="10 digit contact number" />
                    {formData.orgContactNumber && !validation.isOrgContactValid && <small className="error-text">Contact number must be 10 digits.</small>}

                    <label>Organisation Email</label>
                    <input type="email" value={formData.orgEmail} onChange={(e) => handleChange("orgEmail", e.target.value)} maxLength="100" />
                    {formData.orgEmail && !validation.isOrgEmailValid && <small className="error-text">Enter a valid email.</small>}

                    <label>CIF of Owner</label>
                    <input
                      type="text"
                      value={formData.cifOwner}
                      onChange={(e) => handleChange("cifOwner", e.target.value)}
                      maxLength="9"
                      placeholder="9 digit CIF number"
                    />
                    {formData.cifOwner && !validation.isCifOwnerValid && <small className="error-text">CIF must be exactly 9 digits.</small>}



                    <button onClick={handleNext} disabled={!isStep3Valid || loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                    <button className="back-btn" onClick={handleBack} disabled={loading}>
                      Back
                    </button>
                  </>
                )}
              </>
            )}

            {/* Server error */}
            {serverError && !showSummary && <div className="response-panel"><strong style={{color:'red'}}>Error:</strong><div className="small-muted">{serverError}</div></div>}

            {/* Response & Summary panel */}
            {showSummary && serverResponse && (
              <div className="response-panel">
                <h4>Account Created Successfully ✅</h4>
                <div className="small-muted">Server response:</div>
                <pre style={{whiteSpace:'pre-wrap', fontSize:13}}>{JSON.stringify(serverResponse, null, 2)}</pre>

                <h4 style={{marginTop:12}}>Entered Details</h4>
                <table className="summary-table">
                  <tbody>
                    <tr><td><strong>Username</strong></td><td>{formData.username}</td></tr>
                    <tr><td><strong>Email</strong></td><td>{formData.email}</td></tr>
                    <tr><td><strong>Phone</strong></td><td>{formData.phone}</td></tr>
                    <tr><td><strong>Password</strong></td><td>{maskedPassword(formData.password)}</td></tr>
                    <tr><td><strong>PIN</strong></td><td>{"******"}</td></tr>
                    <tr><td><strong>Type</strong></td><td>{formData.type}</td></tr>
                    <tr><td><strong>Address</strong></td><td>{`${formData.street}, ${formData.town}, ${formData.district}, ${formData.state}, ${formData.country} - ${formData.pinCode}`}</td></tr>

                    {formData.type === "Individual" && (
                      <>
                        <tr><td><strong>Aadhaar</strong></td><td>{formData.aadhaar}</td></tr>
                        <tr><td><strong>PAN</strong></td><td>{formData.pan}</td></tr>
                        <tr><td><strong>Name</strong></td><td>{`${formData.firstName} ${formData.lastName}`}</td></tr>
                        <tr><td><strong>Gender</strong></td><td>{formData.gender}</td></tr>
                        <tr><td><strong>DOB</strong></td><td>{formData.dateOfBirth}</td></tr>
                      </>
                    )}

                    {formData.type === "Organisation" && (
                      <>
                        <tr><td><strong>Registration No</strong></td><td>{formData.regNo}</td></tr>
                        <tr><td><strong>Organisation Name</strong></td><td>{formData.orgName}</td></tr>
                        <tr><td><strong>Org Type</strong></td><td>{formData.orgType}</td></tr>
                        <tr><td><strong>Org Contact</strong></td><td>{formData.orgContactNumber || formData.phone}</td></tr>
                        <tr><td><strong>Org Email</strong></td><td>{formData.orgEmail || formData.email}</td></tr>
                      </>
                    )}
                  </tbody>
                </table>

                <button style={{marginTop:12}} onClick={() => { setShowSummary(false); }}>
                  Close
                </button>
                <button className="back-btn" style={{marginTop:8}} onClick={resetForm}>
                  Create Another
                </button>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
