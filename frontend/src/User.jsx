import {useState} from "react";
import Footer from "./Footer";

const fetchUserDetails = async (username) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    console.log("fetchUserDetails called with:", username);
    const response = await fetch("http://127.0.0.1:8000/customer-details/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Backend raw data:", data); // 👈 check what’s coming in
    return {
      cif: data.Customer?.CIF_No,
      username: username,
      email: data.Customer?.Email,
      phone: data.Customer?.Phone_No,
      address: `${data.Customer?.Street}, ${data.Customer?.Town}, ${data.Customer?.State}, ${data.Customer?.Country} - ${data.Customer?.PIN_Code}`,
      type: data.Customer?.Type,
      ...(data.Customer?.Type === "Individual" && {
        dob: data.Specific_Details?.Date_Of_Birth,
        gender: data.Specific_Details?.Gender,
        aadhaar: data.Specific_Details?.Aadhaar || "",
        pan: data.Specific_Details?.PAN || "",
      }),
      ...(data.Customer?.Type === "Organisation" && {
        registrationNumber: data.Specific_Details?.Reg_No || "",
        organisationName: data.Specific_Details?.Org_Name || "",
        orgType: data.Specific_Details?.Org_Type || "",
        cifOwner: data.Specific_Details?.CIF_Owner || "",
        orgEmail: data.Specific_Details?.Email || "",
        contactNumber: data.Specific_Details?.Contact_Number || "",
        
      }),
    };
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw error;
  }
};

const fetchAccounts = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return [
    { accountNo: "1001234567", accountType: "Savings", balance: 50000.00 },
    { accountNo: "1001234568", accountType: "Current", balance: 125000.50 }
  ];
};

const fetchTransactions = async (accountNo, username, password) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { date: "2025-10-01", description: "Salary Credit", amount: 50000, type: "Credit" },
    { date: "2025-10-02", description: "ATM Withdrawal", amount: -5000, type: "Debit" },
    { date: "2025-10-03", description: "Online Transfer", amount: -2000, type: "Debit" },
    { date: "2025-10-04", description: "Refund", amount: 1500, type: "Credit" }
  ];
};

const updateUserDetails = async (username, password, phone, email) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Details updated successfully" };
};

const transferMoney = async (username, password, fromAccount, toAccount, toCif, amount, pin, note) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (pin === "123456") {
    return { success: true, message: "Transfer successful", transactionId: "TXN" + Date.now() };
  } else {
    return { success: false, message: "Invalid PIN or insufficient balance" };
  }
};

const createAccountRequest = async (username, password, accountData) => {
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Simulate random success/failure
  const isSuccess = Math.random() > 0.2;
  
  if (isSuccess) {
    return { 
      success: true, 
      message: "Account request submitted successfully! Your request will be processed within 2-3 business days.", 
      requestId: "REQ" + Date.now() 
    };
  } else {
    return { 
      success: false, 
      message: "Failed to submit account request. Please try again later or contact customer support." 
    };
  }
};

export default function User({ username, password, type }) {
  const [activeSection, setActiveSection] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  
  const [transferForm, setTransferForm] = useState({
    fromAccount: "",
    toAccount: "",
    toCif: "",
    amount: "",
    pin: "",
    note: ""
  });
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferMessage, setTransferMessage] = useState(null);

  // Create Account States
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    branch: "",
    accountType: "",
    overdraftLimit: "",
    loanAmount: "",
    loanTerm: "",
    loanType: "",
    otherLoanType: ""
  });
  const [showReview, setShowReview] = useState(false);
  const [calculatedDetails, setCalculatedDetails] = useState(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreationMessage, setAccountCreationMessage] = useState(null);

  const branches = [
    "Mumbai Main Branch",
    "Delhi Central Branch", 
    "Bangalore Tech Park Branch", 
    "Kolkata Regional Branch", 
    "Chennai South Branch",
    "Pune City Branch",
    "Hyderabad Tech City Branch"
  ];

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserDetails(username, password);
      setUserDetails(data);
      setEditedPhone(data.phone);
      setEditedEmail(data.email);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setIsLoading(false);
  };

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAccounts(username, password);
      setAccounts(data);
    } catch (error) {
      console.error("Error loading accounts:", error);
    }
    setIsLoading(false);
  };

  const loadTransactions = async (accountNo) => {
    setIsLoading(true);
    setSelectedAccount(accountNo);
    try {
      const data = await fetchTransactions(accountNo, username, password);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
    setIsLoading(false);
  };

  const handleSectionToggle = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
      setSelectedAccount(null);
      setTransactions(null);
    } else {
      setActiveSection(section);
      setSelectedAccount(null);
      setTransactions(null);
      setShowCreateAccount(false);
      setShowReview(false);
      setAccountCreationMessage(null);
      
      if (section === "dashboard" && !userDetails) {
        loadDashboard();
      } else if (section === "accounts" && !accounts) {
        loadAccounts();
      } else if (section === "transfer") {
        setTransferMessage(null);
        setTransferForm({
          fromAccount: "",
          toAccount: "",
          toCif: "",
          amount: "",
          pin: "",
          note: ""
        });
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      const result = await updateUserDetails(username, password, editedPhone, editedEmail);
      if (result.success) {
        setUserDetails({ ...userDetails, phone: editedPhone, email: editedEmail });
        setIsEditing(false);
        alert("Details updated successfully!");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      alert("Failed to update details");
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setEditedPhone(userDetails.phone);
    setEditedEmail(userDetails.email);
    setIsEditing(false);
  };

  const handleTransferSubmit = () => {
    if (!transferForm.fromAccount || !transferForm.toAccount || !transferForm.toCif || 
        !transferForm.amount || !transferForm.pin) {
      alert("Please fill all required fields");
      return;
    }
    
    if (window.confirm(`Transfer ₹${transferForm.amount} from ${transferForm.fromAccount} to ${transferForm.toAccount}?`)) {
      executeTransfer();
    }
  };

  const executeTransfer = async () => {
    setIsTransferring(true);
    setTransferMessage(null);
    
    try {
      const result = await transferMoney(
        username, 
        password, 
        transferForm.fromAccount,
        transferForm.toAccount,
        transferForm.toCif,
        transferForm.amount,
        transferForm.pin,
        transferForm.note
      );
      
      setTransferMessage(result);
      
      if (result.success) {
        setTransferForm({
          fromAccount: "",
          toAccount: "",
          toCif: "",
          amount: "",
          pin: "",
          note: ""
        });
      }
    } catch (error) {
      setTransferMessage({ success: false, message: "Network error. Please try again." });
    }
    
    setIsTransferring(false);
  };

  // Create Account Functions
  const handleCreateAccountClick = () => {
    setShowCreateAccount(true);
    setShowReview(false);
    setAccountCreationMessage(null);
    setAccountForm({
      branch: "",
      accountType: "",
      overdraftLimit: "",
      loanAmount: "",
      loanTerm: "",
      loanType: "",
      otherLoanType: ""
    });
  };

  const handleAccountFormChange = (field, value) => {
    const newForm = { ...accountForm, [field]: value };
    
    // Reset dependent fields when account type changes
    if (field === "accountType") {
      newForm.overdraftLimit = "";
      newForm.loanAmount = "";
      newForm.loanTerm = "";
      newForm.loanType = "";
      newForm.otherLoanType = "";
    }
    
    // Reset other loan type when loan type changes
    if (field === "loanType" && value !== "Others: to be specified") {
      newForm.otherLoanType = "";
    }
    
    setAccountForm(newForm);
  };

  const calculateLoanDetails = (amount, term, type) => {
    const principal = parseFloat(amount);
    const months = parseInt(term);
    
    let interestRate;
    switch(type) {
      case "Home": 
        interestRate = 8.5; 
        break;
      case "Personal": 
        interestRate = 12.0; 
        break;
      case "Education": 
        interestRate = 9.5; 
        break;
      case "Business":
        interestRate = 13.0;
        break;
      default: 
        interestRate = 11.0;
    }
    
    const monthlyRate = interestRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;
    
    return {
      interestRate: interestRate.toFixed(2),
      emi: emi.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      monthlyRate: monthlyRate.toFixed(6)
    };
  };

  const validateAccountForm = () => {
    if (!accountForm.branch || !accountForm.accountType) {
      alert("Please fill all required fields");
      return false;
    }
    
    if (accountForm.accountType === "Current") {
      if (!accountForm.overdraftLimit) {
        alert("Please specify overdraft limit for current account");
        return false;
      }
      const limit = parseFloat(accountForm.overdraftLimit);
      if (limit < 0 || limit > 1000000) {
        alert("Overdraft limit must be between ₹0 and ₹10,00,000");
        return false;
      }
    }
    
    if (accountForm.accountType === "Loan") {
      if (!accountForm.loanAmount || !accountForm.loanTerm || !accountForm.loanType) {
        alert("Please fill all loan details");
        return false;
      }
      
      const amount = parseFloat(accountForm.loanAmount);
      const term = parseInt(accountForm.loanTerm);
      
      if (amount < 0 || amount > 10000000) {
        alert("Loan amount must be between ₹0 and ₹1,00,00,000 (1 Crore)");
        return false;
      }
      
      if (term < 1 || term > 240) {
        alert("Loan term must be between 1 month and 240 months (20 years)");
        return false;
      }
      
      if (accountForm.loanType === "Others: to be specified" && !accountForm.otherLoanType) {
        alert("Please specify the loan type");
        return false;
      }
    }
    
    return true;
  };

  const handleReviewAccount = () => {
    if (!validateAccountForm()) {
      return;
    }
    
    if (accountForm.accountType === "Loan") {
      const details = calculateLoanDetails(
        accountForm.loanAmount, 
        accountForm.loanTerm, 
        accountForm.loanType
      );
      setCalculatedDetails(details);
    } else {
      setCalculatedDetails(null);
    }
    
    setShowReview(true);
  };

  const handleRequestAccount = async () => {
    setIsCreatingAccount(true);
    setAccountCreationMessage(null);
    
    try {
      const accountData = {
        ...accountForm,
        calculatedDetails: calculatedDetails
      };
      
      const result = await createAccountRequest(username, password, accountData);
      setAccountCreationMessage(result);
      
      if (result.success) {
        setTimeout(() => {
          setShowCreateAccount(false);
          setShowReview(false);
          setAccountForm({
            branch: "",
            accountType: "",
            overdraftLimit: "",
            loanAmount: "",
            loanTerm: "",
            loanType: "",
            otherLoanType: ""
          });
          setCalculatedDetails(null);
        }, 4000);
      }
    } catch (error) {
      setAccountCreationMessage({ 
        success: false, 
        message: "Network error occurred. Please try again later." 
      });
    }
    
    setIsCreatingAccount(false);
  };

  const handleBackToForm = () => {
    setShowReview(false);
  };

  return (<>
    <style>{`
      .allcontainer{ fontFamily: Arial, sans-serif; background: #f2f6fc; minHeight: 100vh; padding: 20px; }
      .header { display: flex; justify-content: space-between; align-items: center; background: #003366; padding: 10px 2vw; color: #fff; }
      .logo { margin: 0; }
      .nav { display: flex; gap: 7vw; }
      .nav a { color: #00d9ffff; text-decoration: none; }
      .nav a:hover { color: #ff6118; }
      nav a:active { color: red; }
      nav a:visited { color: lightgreen; }
      .loginBtn { background: #ffcc00; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold; }
      svg{ color: rgba(255, 255, 255, 1); }
      .container { max-width: 1000px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      .header { text-align: center; margin-bottom: 30px; color: #ffffffff; }
      .nav-buttons { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
      .nav-btn { flex: 1; min-width: 150px; padding: 15px; background: #003366; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.3s; }
      .nav-btn:hover { background: #0055aa; }
      .nav-btn.active { background: #0055aa; }
      .section { margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 6px; }
      .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
      .detail-label { font-weight: bold; color: #003366; }
      .detail-value { color: #333; }
      .edit-btn, .save-btn, .cancel-btn { margin-top: 20px; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 10px; }
      .edit-btn { background: #ffcc00; color: #003366; font-weight: bold; }
      .save-btn { background: #28a745; color: white; }
      .cancel-btn { background: #6c757d; color: white; }
      .edit-input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; width: 250px; }
      .loader { text-align: center; padding: 40px; color: #003366; font-size: 18px; }
      .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #003366; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
      .account-card { background: white; padding: 20px; margin: 15px 0; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
      .account-info { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
      .account-detail { flex: 1; min-width: 150px; }
      .account-label { font-size: 12px; color: #666; margin-bottom: 5px; }
      .account-value { font-size: 16px; font-weight: bold; color: #003366; }
      .balance { font-size: 20px; color: #28a745; }
      .transactions-btn { padding: 10px 20px; background: #0055aa; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
      .transactions-btn:hover { background: #003366; }
      .transaction-header { background: #003366; color: white; padding: 15px; border-radius: 6px 6px 0 0; margin-top: 20px; }
      .transaction-item { display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #e0e0e0; background: white; }
      .transaction-item:last-child { border-radius: 0 0 6px 6px; }
      .credit { color: #28a745; font-weight: bold; }
      .debit { color: #dc3545; font-weight: bold; }
      .transfer-form { background: white; padding: 20px; border-radius: 6px; }
      .form-group { margin-bottom: 20px; }
      .form-label { display: block; margin-bottom: 8px; font-weight: bold; color: #003366; }
      .form-input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
      .form-select { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; background: white; }
      .transfer-btn { width: 100%; padding: 15px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.3s; }
      .transfer-btn:hover { background: #218838; }
      .transfer-btn:disabled { background: #6c757d; cursor: not-allowed; }
      .message { padding: 15px; border-radius: 4px; margin-top: 20px; text-align: center; font-weight: bold; }
      .success-message { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
      .error-message { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
      .create-account-btn { width: 100%; padding: 15px; background: #ffcc00; color: #003366; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold; margin-top: 20px; transition: background 0.3s; }
      .create-account-btn:hover { background: #e6b800; }
      .review-section { background: white; padding: 20px; border-radius: 6px; margin-top: 20px; }
      .review-header { background: #003366; color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center; }
      .review-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
      .review-label { font-weight: bold; color: #003366; }
      .review-value { color: #333; text-align: right; }
      .calculated-section { background: #e8f4f8; padding: 20px; border-radius: 6px; margin: 20px 0; border: 2px solid #0055aa; }
      .calculated-header { color: #003366; font-size: 18px; font-weight: bold; margin-bottom: 15px; text-align: center; }
      .button-group { display: flex; gap: 10px; margin-top: 20px; }
      .back-btn { flex: 1; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.3s; }
      .back-btn:hover { background: #5a6268; }
      .request-btn { flex: 1; padding: 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.3s; }
      .request-btn:hover { background: #218838; }
      .request-btn:disabled { background: #6c757d; cursor: not-allowed; }
      .info-text { color: #666; font-size: 13px; margin-top: 5px; font-style: italic; }
      .highlight-value { color: #28a745; font-size: 18px; font-weight: bold; }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
    <div className="allcontainer">
      {/* Header / Navbar */}
      <header className="header">
        <h2 className="logo">
          <svg
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-bank2"
            viewBox="0 0 16 16"
          >
            <path
              d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1H.5z"
              fill="#ffffffff"
            ></path>
          </svg>
          MyBank
        </h2>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <div className="container">
        <div className="header">
          <h1>Welcome, {username}</h1>
        </div>

        <div className="nav-buttons">
          <button 
            className={`nav-btn ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => handleSectionToggle("dashboard")}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${activeSection === "accounts" ? "active" : ""}`}
            onClick={() => handleSectionToggle("accounts")}
          >
            Accounts
          </button>
          <button 
            className={`nav-btn ${activeSection === "transfer" ? "active" : ""}`}
            onClick={() => handleSectionToggle("transfer")}
          >
            Transfer Money
          </button>
        </div>

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="section">
            <h2 style={{ color: "#003366", marginBottom: "20px" }}>Dashboard</h2>

            {isLoading && !userDetails ? (
              <div className="loader">
                <div className="spinner"></div>
                Loading dashboard...
              </div>
            ) : userDetails ? (
              <>
                <div className="detail-row">
                  <span className="detail-label">Username:</span>
                  <span className="detail-value">{username}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">CIF:</span>
                  <span className="detail-value">{userDetails.cif}</span>
                </div>

                {/* Shared Fields */}
                <div className="detail-row">
                  <span className="detail-label">Phone Number:</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="edit-input"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                    />
                  ) : (
                    <span className="detail-value">{userDetails.phone}</span>
                  )}
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  {isEditing ? (
                    <input
                      type="email"
                      className="edit-input"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                    />
                  ) : (
                    <span className="detail-value">{userDetails.email}</span>
                  )}
                </div>

                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{userDetails.address}</span>
                </div>

                {/* Conditional Fields */}
                {userDetails.type === "Individual" && (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Date of Birth:</span>
                      <span className="detail-value">{userDetails.dob}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Gender:</span>
                      <span className="detail-value">{userDetails.gender}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Aadhaar:</span>
                      <span className="detail-value">{userDetails.aadhaar}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">PAN:</span>
                      <span className="detail-value">{userDetails.pan}</span>
                    </div>
                  </>
                )}

                {userDetails.type === "Organisation" && (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Organisation Name:</span>
                      <span className="detail-value">{userDetails.organisationName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Registration No.:</span>
                      <span className="detail-value">{userDetails.registrationNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Organisation Type:</span>
                      <span className="detail-value">{userDetails.orgType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">CIF of Owner:</span>
                      <span className="detail-value">{userDetails.cifOwner}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Contact Number:</span>
                      <span className="detail-value">{userDetails.contactNumber}</span>
                    </div>
                  </>
                )}

                {/* Edit buttons */}
                {!isEditing ? (
                  <button className="edit-btn" onClick={handleEdit}>
                    Edit Phone & Email
                  </button>
                ) : (
                  <>
                    <button className="save-btn" onClick={handleSaveEdit} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* Accounts Section */}
        {activeSection === "accounts" && (
          <div className="section">
            <h2 style={{ color: "#003366", marginBottom: "20px" }}>My Accounts</h2>
            
            {isLoading && !accounts ? (
              <div className="loader">
                <div className="spinner"></div>
                Loading accounts...
              </div>
            ) : accounts ? (
              <>
                {accounts.map((account) => (
                  <div key={account.accountNo} className="account-card">
                    <div className="account-info">
                      <div className="account-detail">
                        <div className="account-label">Account Number</div>
                        <div className="account-value">{account.accountNo}</div>
                      </div>
                      <div className="account-detail">
                        <div className="account-label">Account Type</div>
                        <div className="account-value">{account.accountType}</div>
                      </div>
                      <div className="account-detail">
                        <div className="account-label">Balance</div>
                        <div className="account-value balance">₹{account.balance.toFixed(2)}</div>
                      </div>
                      <button 
                        className="transactions-btn"
                        onClick={() => loadTransactions(account.accountNo)}
                      >
                        View Transactions
                      </button>
                    </div>
                  </div>
                ))}

                {selectedAccount && (
                  <>
                    <div className="transaction-header">
                      <h3 style={{ margin: 0 }}>Transactions - Account {selectedAccount}</h3>
                    </div>
                    
                    {isLoading ? (
                      <div className="loader">
                        <div className="spinner"></div>
                        Loading transactions...
                      </div>
                    ) : transactions ? (
                      transactions.map((txn, index) => (
                        <div key={index} className="transaction-item">
                          <div>
                            <div style={{ fontWeight: "bold" }}>{txn.description}</div>
                            <div style={{ fontSize: "12px", color: "#666" }}>{txn.date}</div>
                          </div>
                          <div className={txn.type === "Credit" ? "credit" : "debit"}>
                            {txn.type === "Credit" ? "+" : "-"}₹{Math.abs(txn.amount).toFixed(2)}
                          </div>
                        </div>
                      ))
                    ) : null}
                  </>
                )}
              </>
            ) : null}

            {/* Create Account Button */}
            {accounts && !showCreateAccount && !showReview && (
              <button className="create-account-btn" onClick={handleCreateAccountClick}>
                + Create New Account
              </button>
            )}

            {/* Create Account Form */}
            {showCreateAccount && !showReview && (
              <div className="transfer-form" style={{ marginTop: "20px" }}>
                <h3 style={{ color: "#003366", marginBottom: "20px" }}>New Account Application</h3>

                <div className="form-group">
                  <label className="form-label">Branch Name *</label>
                  <select 
                    className="form-select"
                    value={accountForm.branch}
                    onChange={(e) => handleAccountFormChange("branch", e.target.value)}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Account Type *</label>
                  <select 
                    className="form-select"
                    value={accountForm.accountType}
                    onChange={(e) => handleAccountFormChange("accountType", e.target.value)}
                  >
                    <option value="">Select Account Type</option>
                    <option value="Saving">Saving Account</option>
                    <option value="Current">Current Account</option>
                    <option value="Loan">Loan Account</option>
                  </select>
                </div>

                {/* Current Account - Overdraft Limit */}
                {accountForm.accountType === "Current" && (
                  <div className="form-group">
                    <label className="form-label">Overdraft Limit *</label>
                    <input 
                      type="number"
                      className="form-input"
                      value={accountForm.overdraftLimit}
                      onChange={(e) => handleAccountFormChange("overdraftLimit", e.target.value)}
                      placeholder="Enter overdraft limit"
                      min="0"
                      max="1000000"
                    />
                    <div className="info-text">Range: ₹0 - ₹10,00,000</div>
                  </div>
                )}

                {/* Loan Account Fields */}
                {accountForm.accountType === "Loan" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Loan Amount *</label>
                      <input 
                        type="number"
                        className="form-input"
                        value={accountForm.loanAmount}
                        onChange={(e) => handleAccountFormChange("loanAmount", e.target.value)}
                        placeholder="Enter loan amount"
                        min="0"
                        max="10000000"
                      />
                      <div className="info-text">Range: ₹0 - ₹1,00,00,000 (1 Crore)</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Loan Term (in months) *</label>
                      <input 
                        type="number"
                        className="form-input"
                        value={accountForm.loanTerm}
                        onChange={(e) => handleAccountFormChange("loanTerm", e.target.value)}
                        placeholder="Enter loan term in months"
                        min="1"
                        max="240"
                      />
                      <div className="info-text">Range: 1 month - 240 months (20 years)</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Loan Type *</label>
                      <select 
                        className="form-select"
                        value={accountForm.loanType}
                        onChange={(e) => handleAccountFormChange("loanType", e.target.value)}
                      >
                        <option value="">Select Loan Type</option>
                        <option value="Home">Home Loan</option>
                        <option value="Personal">Personal Loan</option>
                        <option value="Education">Education Loan</option>
                        <option value="Business">Business Loan</option>
                        <option value="Others: to be specified">Others</option>
                      </select>
                    </div>

                    {accountForm.loanType === "Others: to be specified" && (
                      <div className="form-group">
                        <label className="form-label">Specify Loan Type *</label>
                        <input 
                          type="text"
                          className="form-input"
                          value={accountForm.otherLoanType}
                          onChange={(e) => handleAccountFormChange("otherLoanType", e.target.value)}
                          placeholder="Please specify the type of loan"
                        />
                      </div>
                    )}
                  </>
                )}

                <button 
                  className="transfer-btn"
                  onClick={handleReviewAccount}
                  style={{ marginTop: "20px" }}
                >
                  Review Application
                </button>
              </div>
            )}

            {/* Review Section */}
            {showReview && (
              <div className="review-section">
                <div className="review-header">
                  <h3 style={{ margin: 0 }}>Review Your Application</h3>
                </div>

                <div className="review-row">
                  <span className="review-label">Branch:</span>
                  <span className="review-value">{accountForm.branch}</span>
                </div>

                <div className="review-row">
                  <span className="review-label">Account Type:</span>
                  <span className="review-value">{accountForm.accountType}</span>
                </div>

                {accountForm.accountType === "Current" && (
                  <div className="review-row">
                    <span className="review-label">Overdraft Limit:</span>
                    <span className="review-value highlight-value">
                      ₹{parseFloat(accountForm.overdraftLimit).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {accountForm.accountType === "Loan" && (
                  <>
                    <div className="review-row">
                      <span className="review-label">Loan Amount:</span>
                      <span className="review-value highlight-value">
                        ₹{parseFloat(accountForm.loanAmount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="review-row">
                      <span className="review-label">Loan Term:</span>
                      <span className="review-value">
                        {accountForm.loanTerm} months ({(accountForm.loanTerm / 12).toFixed(1)} years)
                      </span>
                    </div>

                    <div className="review-row">
                      <span className="review-label">Loan Type:</span>
                      <span className="review-value">
                        {accountForm.loanType === "Others: to be specified" 
                          ? accountForm.otherLoanType 
                          : accountForm.loanType}
                      </span>
                    </div>

                    {calculatedDetails && (
                      <div className="calculated-section">
                        <div className="calculated-header">
                          💰 Loan Calculation Summary
                        </div>

                        <div className="review-row" style={{ borderBottom: "none" }}>
                          <span className="review-label">Interest Rate (Annual):</span>
                          <span className="review-value">{calculatedDetails.interestRate}% p.a.</span>
                        </div>

                        <div className="review-row" style={{ borderBottom: "none" }}>
                          <span className="review-label">Monthly EMI:</span>
                          <span className="review-value highlight-value">
                            ₹{parseFloat(calculatedDetails.emi).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="review-row" style={{ borderBottom: "none" }}>
                          <span className="review-label">Total Interest Payable:</span>
                          <span className="review-value">
                            ₹{parseFloat(calculatedDetails.totalInterest).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="review-row" style={{ borderBottom: "none" }}>
                          <span className="review-label">Total Amount Payable:</span>
                          <span className="review-value highlight-value">
                            ₹{parseFloat(calculatedDetails.totalAmount).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div style={{ marginTop: "15px", padding: "10px", background: "#fff", borderRadius: "4px", fontSize: "13px", color: "#666" }}>
                          <strong>Note:</strong> The EMI calculation is based on reducing balance method. 
                          Actual rates may vary based on your credit score and bank policies.
                        </div>
                      </div>
                    )}
                  </>
                )}

                {accountCreationMessage && (
                  <div className={`message ${accountCreationMessage.success ? "success-message" : "error-message"}`}>
                    {accountCreationMessage.message}
                    {accountCreationMessage.requestId && (
                      <div style={{ marginTop: "10px", fontSize: "14px" }}>
                        Request ID: {accountCreationMessage.requestId}
                      </div>
                    )}
                  </div>
                )}

                <div className="button-group">
                  <button 
                    className="back-btn" 
                    onClick={handleBackToForm}
                    disabled={isCreatingAccount}
                  >
                    Back to Form
                  </button>
                  <button 
                    className="request-btn"
                    onClick={handleRequestAccount}
                    disabled={isCreatingAccount}
                  >
                    {isCreatingAccount ? "Processing..." : "Request Account"}
                  </button>
                </div>

                {isCreatingAccount && (
                  <div className="loader">
                    <div className="spinner"></div>
                    Submitting your request...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Transfer Money Section */}
        {activeSection === "transfer" && (
          <div className="section">
            <h2 style={{ color: "#003366", marginBottom: "20px" }}>Transfer Money</h2>
            
            <div className="transfer-form">
              <div className="form-group">
                <label className="form-label">From Account Number *</label>
                <input 
                  type="text"
                  className="form-input"
                  value={transferForm.fromAccount}
                  onChange={(e) => setTransferForm({...transferForm, fromAccount: e.target.value})}
                  placeholder="Enter your account number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">To Account Number *</label>
                <input 
                  type="text"
                  className="form-input"
                  value={transferForm.toAccount}
                  onChange={(e) => setTransferForm({...transferForm, toAccount: e.target.value})}
                  placeholder="Enter beneficiary account number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">To CIF Number *</label>
                <input 
                  type="text"
                  className="form-input"
                  value={transferForm.toCif}
                  onChange={(e) => setTransferForm({...transferForm, toCif: e.target.value})}
                  placeholder="Enter beneficiary CIF number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount *</label>
                <input 
                  type="number"
                  className="form-input"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                  placeholder="Enter amount to transfer"
                />
              </div>

              <div className="form-group">
                <label className="form-label">PIN *</label>
                <input 
                  type="password"
                  className="form-input"
                  value={transferForm.pin}
                  onChange={(e) => setTransferForm({...transferForm, pin: e.target.value})}
                  placeholder="Enter your 6-digit PIN"
                  maxLength="6"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Note (Optional)</label>
                <input 
                  type="text"
                  className="form-input"
                  value={transferForm.note}
                  onChange={(e) => setTransferForm({...transferForm, note: e.target.value})}
                  placeholder="Add a note for this transaction"
                />
              </div>

              <button 
                className="transfer-btn"
                onClick={handleTransferSubmit}
                disabled={isTransferring}
              >
                {isTransferring ? "Processing..." : "Transfer Money"}
              </button>

              {transferMessage && (
                <div className={`message ${transferMessage.success ? "success-message" : "error-message"}`}>
                  {transferMessage.message}
                  {transferMessage.transactionId && <div>Transaction ID: {transferMessage.transactionId}</div>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer/>
  </>);
}