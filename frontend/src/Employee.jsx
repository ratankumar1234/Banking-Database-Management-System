import {useState, useEffect} from "react";

// Mock API functions
const fetchEmployeeDetails = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    employeeId: "EMP12345",
    name: "Rajesh Kumar",
    designation: "Banking Officer",
    department: "Customer Service",
    branch: "Mumbai Central Branch",
    email: "rajesh.kumar@mybank.com",
    phone: "9876543210",
    joinDate: "2020-03-15"
  };
};

const fetchPendingRequests = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    passwordChange: [
      {
        id: "PWD001",
        userId: "user123",
        userName: "Amit Sharma",
        cif: "1234567890",
        requestDate: "2025-10-20",
        status: "Pending"
      },
      {
        id: "PWD002",
        userId: "user456",
        userName: "Priya Patel",
        cif: "1234567891",
        requestDate: "2025-10-21",
        status: "Pending"
      }
    ],
    newAccount: [
      {
        id: "ACC001",
        userName: "Vikram Singh",
        cif: "1234567892",
        accountType: "Savings",
        initialDeposit: 10000,
        requestDate: "2025-10-19",
        userDetails: {
          dob: "1992-05-15",
          phone: "9988776655",
          email: "vikram@example.com",
          address: "45 Park Street, Delhi - 110001",
          aadhaar: "123456789012",
          pan: "ABCDE1234F"
        }
      },
      {
        id: "ACC002",
        userName: "Sneha Reddy",
        cif: "1234567893",
        accountType: "Current",
        initialDeposit: 50000,
        requestDate: "2025-10-20",
        userDetails: {
          dob: "1988-08-22",
          phone: "9876543211",
          email: "sneha@example.com",
          address: "12 MG Road, Bangalore - 560001",
          aadhaar: "987654321098",
          pan: "XYZAB5678C"
        }
      },
      {
        id: "ACC003",
        userName: "Arjun Mehta",
        cif: "1234567894",
        accountType: "Loan",
        initialDeposit: 0,
        loanAmount: 500000,
        requestDate: "2025-10-22",
        userDetails: {
          dob: "1985-12-10",
          phone: "9123456789",
          email: "arjun@example.com",
          address: "78 Beach Road, Chennai - 600001",
          aadhaar: "456789123456",
          pan: "LMNOP9876D"
        }
      }
    ],
    newUser: [
      {
        id: "USR001",
        name: "Ananya Desai",
        requestDate: "2025-10-18",
        userDetails: {
          dob: "1995-03-25",
          phone: "9988112233",
          email: "ananya@example.com",
          address: "23 Lake View, Pune - 411001",
          aadhaar: "789123456789",
          pan: "QRSTU1234E",
          gender: "Female"
        }
      },
      {
        id: "USR002",
        name: "Karthik Iyer",
        requestDate: "2025-10-21",
        userDetails: {
          dob: "1990-07-30",
          phone: "9876123456",
          email: "karthik@example.com",
          address: "56 Temple Street, Kochi - 682001",
          aadhaar: "321654987321",
          pan: "VWXYZ5678F",
          gender: "Male"
        }
      }
    ]
  };
};

const approveRequest = async (requestType, requestId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Request approved successfully" };
};

const rejectRequest = async (requestType, requestId, reason) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Request rejected successfully" };
};

export default function Employee({ username = "emp_rajesh", password = "demo123" }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(null);
  const [activeRequestType, setActiveRequestType] = useState("passwordChange");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEmployeeDetails(username, password);
      setEmployeeDetails(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setIsLoading(false);
  };

  const loadPendingRequests = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPendingRequests(username, password);
      setPendingRequests(data);
    } catch (error) {
      console.error("Error loading requests:", error);
    }
    setIsLoading(false);
  };

  const handleSectionToggle = (section) => {
    setActiveSection(section);
    setSelectedRequest(null);
    setActionMessage(null);
    
    if (section === "requests" && !pendingRequests) {
      loadPendingRequests();
    }
  };

  const handleRequestTypeChange = (type) => {
    setActiveRequestType(type);
    setSelectedRequest(null);
    setActionMessage(null);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setActionMessage(null);
    setRejectReason("");
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm("Are you sure you want to approve this request?")) return;
    
    setIsLoading(true);
    try {
      const result = await approveRequest(activeRequestType, requestId);
      setActionMessage({ success: true, message: result.message });
      setTimeout(() => {
        setSelectedRequest(null);
        loadPendingRequests();
      }, 2000);
    } catch (error) {
      setActionMessage({ success: false, message: "Failed to approve request" });
    }
    setIsLoading(false);
  };

  const handleReject = async (requestId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    
    setIsLoading(true);
    try {
      const result = await rejectRequest(activeRequestType, requestId, rejectReason);
      setActionMessage({ success: true, message: result.message });
      setTimeout(() => {
        setSelectedRequest(null);
        setRejectReason("");
        loadPendingRequests();
      }, 2000);
    } catch (error) {
      setActionMessage({ success: false, message: "Failed to reject request" });
    }
    setIsLoading(false);
  };

  const getCurrentRequests = () => {
    if (!pendingRequests) return [];
    return pendingRequests[activeRequestType] || [];
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .allcontainer {
          font-family: Arial, sans-serif;
          background: #f2f6fc;
          min-height: 100vh;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #003366;
          padding: 15px 30px;
          color: #fff;
          margin-bottom: 30px;
          border-radius: 8px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 24px;
          font-weight: bold;
        }
        .employee-badge {
          background: #ffcc00;
          color: #003366;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .welcome-header {
          text-align: center;
          margin-bottom: 30px;
          color: #003366;
        }
        .nav-buttons {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }
        .nav-btn {
          flex: 1;
          padding: 15px;
          background: #003366;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: background 0.3s;
        }
        .nav-btn:hover {
          background: #0055aa;
        }
        .nav-btn.active {
          background: #0055aa;
        }
        .section {
          margin-top: 20px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 6px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .detail-label {
          font-weight: bold;
          color: #003366;
        }
        .detail-value {
          color: #333;
        }
        .loader {
          text-align: center;
          padding: 40px;
          color: #003366;
          font-size: 18px;
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #003366;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .request-types {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }
        .request-type-btn {
          padding: 12px 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }
        .request-type-btn:hover {
          color: #003366;
        }
        .request-type-btn.active {
          color: #003366;
          border-bottom-color: #003366;
        }
        .request-card {
          background: white;
          padding: 20px;
          margin: 15px 0;
          border-radius: 6px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          border-left: 4px solid #ffcc00;
        }
        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .request-id {
          font-weight: bold;
          color: #003366;
          font-size: 16px;
        }
        .request-date {
          color: #666;
          font-size: 14px;
        }
        .request-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 3px;
        }
        .info-value {
          font-weight: bold;
          color: #333;
        }
        .view-btn {
          padding: 8px 16px;
          background: #0055aa;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .view-btn:hover {
          background: #003366;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          border-radius: 8px;
          padding: 30px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
        }
        .modal-title {
          color: #003366;
          font-size: 20px;
          font-weight: bold;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        .close-btn:hover {
          color: #003366;
        }
        .modal-content {
          margin-bottom: 20px;
        }
        .action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .approve-btn {
          flex: 1;
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
        }
        .approve-btn:hover {
          background: #218838;
        }
        .approve-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        .reject-btn {
          flex: 1;
          padding: 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
        }
        .reject-btn:hover {
          background: #c82333;
        }
        .reject-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        .reject-section {
          margin-top: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        .reject-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          margin-top: 10px;
          resize: vertical;
          min-height: 80px;
        }
        .message {
          padding: 15px;
          border-radius: 4px;
          margin-top: 15px;
          text-align: center;
          font-weight: bold;
        }
        .success-message {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .error-message {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        .badge-savings {
          background: #d4edda;
          color: #155724;
        }
        .badge-current {
          background: #d1ecf1;
          color: #0c5460;
        }
        .badge-loan {
          background: #fff3cd;
          color: #856404;
        }
      `}</style>

      <div className="allcontainer">
        <header className="header">
          <div className="logo">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1H.5z" />
            </svg>
            MyBank
          </div>
          <div className="employee-badge">Employee Portal</div>
        </header>

        <div className="container">
          <div className="welcome-header">
            <h1>Welcome, {employeeDetails?.name || username}</h1>
          </div>

          <div className="nav-buttons">
            <button 
              className={`nav-btn ${activeSection === "dashboard" ? "active" : ""}`}
              onClick={() => handleSectionToggle("dashboard")}
            >
              Dashboard
            </button>
            <button 
              className={`nav-btn ${activeSection === "requests" ? "active" : ""}`}
              onClick={() => handleSectionToggle("requests")}
            >
              Pending Requests
            </button>
          </div>

          {activeSection === "dashboard" && (
            <div className="section">
              <h2 style={{ color: "#003366", marginBottom: "20px" }}>Employee Dashboard</h2>
              
              {isLoading && !employeeDetails ? (
                <div className="loader">
                  <div className="spinner"></div>
                  Loading dashboard...
                </div>
              ) : employeeDetails ? (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Employee ID:</span>
                    <span className="detail-value">{employeeDetails.employeeId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{employeeDetails.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Designation:</span>
                    <span className="detail-value">{employeeDetails.designation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{employeeDetails.department}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Branch:</span>
                    <span className="detail-value">{employeeDetails.branch}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{employeeDetails.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{employeeDetails.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Join Date:</span>
                    <span className="detail-value">{employeeDetails.joinDate}</span>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {activeSection === "requests" && (
            <div className="section">
              <h2 style={{ color: "#003366", marginBottom: "20px" }}>Pending Requests</h2>
              
              <div className="request-types">
                <button 
                  className={`request-type-btn ${activeRequestType === "passwordChange" ? "active" : ""}`}
                  onClick={() => handleRequestTypeChange("passwordChange")}
                >
                  Password Change ({pendingRequests?.passwordChange?.length || 0})
                </button>
                <button 
                  className={`request-type-btn ${activeRequestType === "newAccount" ? "active" : ""}`}
                  onClick={() => handleRequestTypeChange("newAccount")}
                >
                  New Account ({pendingRequests?.newAccount?.length || 0})
                </button>
                <button 
                  className={`request-type-btn ${activeRequestType === "newUser" ? "active" : ""}`}
                  onClick={() => handleRequestTypeChange("newUser")}
                >
                  Create User ({pendingRequests?.newUser?.length || 0})
                </button>
              </div>

              {isLoading && !pendingRequests ? (
                <div className="loader">
                  <div className="spinner"></div>
                  Loading requests...
                </div>
              ) : getCurrentRequests().length === 0 ? (
                <div className="empty-state">
                  <p>No pending requests in this category</p>
                </div>
              ) : (
                <>
                  {activeRequestType === "passwordChange" && getCurrentRequests().map((request) => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <span className="request-id">Request ID: {request.id}</span>
                        <span className="request-date">{request.requestDate}</span>
                      </div>
                      <div className="request-info">
                        <div className="info-item">
                          <span className="info-label">User ID</span>
                          <span className="info-value">{request.userId}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">User Name</span>
                          <span className="info-value">{request.userName}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">CIF</span>
                          <span className="info-value">{request.cif}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Status</span>
                          <span className="info-value">{request.status}</span>
                        </div>
                      </div>
                      <button className="view-btn" onClick={() => handleViewDetails(request)}>
                        View & Process
                      </button>
                    </div>
                  ))}

                  {activeRequestType === "newAccount" && getCurrentRequests().map((request) => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <span className="request-id">Request ID: {request.id}</span>
                        <span className="request-date">{request.requestDate}</span>
                      </div>
                      <div className="request-info">
                        <div className="info-item">
                          <span className="info-label">User Name</span>
                          <span className="info-value">{request.userName}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">CIF</span>
                          <span className="info-value">{request.cif}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Account Type</span>
                          <span className={`badge badge-${request.accountType.toLowerCase()}`}>
                            {request.accountType}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">{request.accountType === "Loan" ? "Loan Amount" : "Initial Deposit"}</span>
                          <span className="info-value">
                            ₹{(request.loanAmount || request.initialDeposit).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button className="view-btn" onClick={() => handleViewDetails(request)}>
                        View Details & Process
                      </button>
                    </div>
                  ))}

                  {activeRequestType === "newUser" && getCurrentRequests().map((request) => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <span className="request-id">Request ID: {request.id}</span>
                        <span className="request-date">{request.requestDate}</span>
                      </div>
                      <div className="request-info">
                        <div className="info-item">
                          <span className="info-label">Name</span>
                          <span className="info-value">{request.name}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Email</span>
                          <span className="info-value">{request.userDetails.email}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Phone</span>
                          <span className="info-value">{request.userDetails.phone}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Gender</span>
                          <span className="info-value">{request.userDetails.gender}</span>
                        </div>
                      </div>
                      <button className="view-btn" onClick={() => handleViewDetails(request)}>
                        View Details & Process
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {activeRequestType === "passwordChange" && "Password Change Request"}
                {activeRequestType === "newAccount" && "New Account Request"}
                {activeRequestType === "newUser" && "Create User Request"}
              </h3>
              <button className="close-btn" onClick={() => setSelectedRequest(null)}>×</button>
            </div>

            <div className="modal-content">
              {activeRequestType === "passwordChange" && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Request ID:</span>
                    <span className="detail-value">{selectedRequest.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value">{selectedRequest.userId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">User Name:</span>
                    <span className="detail-value">{selectedRequest.userName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">CIF:</span>
                    <span className="detail-value">{selectedRequest.cif}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Request Date:</span>
                    <span className="detail-value">{selectedRequest.requestDate}</span>
                  </div>
                </>
              )}

              {activeRequestType === "newAccount" && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Request ID:</span>
                    <span className="detail-value">{selectedRequest.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">User Name:</span>
                    <span className="detail-value">{selectedRequest.userName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">CIF:</span>
                    <span className="detail-value">{selectedRequest.cif}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Account Type:</span>
                    <span className={`badge badge-${selectedRequest.accountType.toLowerCase()}`}>
                      {selectedRequest.accountType}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">
                      {selectedRequest.accountType === "Loan" ? "Loan Amount:" : "Initial Deposit:"}
                    </span>
                    <span className="detail-value">
                      ₹{(selectedRequest.loanAmount || selectedRequest.initialDeposit).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Request Date:</span>
                    <span className="detail-value">{selectedRequest.requestDate}</span>
                  </div>
                  <h4 style={{ marginTop: "20px", marginBottom: "10px", color: "#003366" }}>User Details</h4>
                  <div className="detail-row">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{selectedRequest.userDetails.dob}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedRequest.userDetails.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedRequest.userDetails.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{selectedRequest.userDetails.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Aadhaar:</span>
                    <span className="detail-value">{selectedRequest.userDetails.aadhaar}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">PAN:</span>
                    <span className="detail-value">{selectedRequest.userDetails.pan}</span>
                  </div>
                </>
              )}

              {activeRequestType === "newUser" && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Request ID:</span>
                    <span className="detail-value">{selectedRequest.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedRequest.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Request Date:</span>
                    <span className="detail-value">{selectedRequest.requestDate}</span>
                  </div>
                  <h4 style={{ marginTop: "20px", marginBottom: "10px", color: "#003366" }}>User Details</h4>
                  <div className="detail-row">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{selectedRequest.userDetails.dob}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{selectedRequest.userDetails.gender}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedRequest.userDetails.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedRequest.userDetails.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{selectedRequest.userDetails.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Aadhaar:</span>
                    <span className="detail-value">{selectedRequest.userDetails.aadhaar}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">PAN:</span>
                    <span className="detail-value">{selectedRequest.userDetails.pan}</span>
                  </div>
                </>
              )}

              {actionMessage && (
                <div className={`message ${actionMessage.success ? "success-message" : "error-message"}`}>
                  {actionMessage.message}
                </div>
              )}

              {!actionMessage && (
                <>
                  <div className="action-buttons">
                    <button 
                      className="approve-btn" 
                      onClick={() => handleApprove(selectedRequest.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Approve"}
                    </button>
                    <button 
                      className="reject-btn" 
                      onClick={() => handleReject(selectedRequest.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Reject"}
                    </button>
                  </div>

                  <div className="reject-section">
                    <label style={{ fontWeight: "bold", color: "#003366" }}>
                      Reason for Rejection (if applicable):
                    </label>
                    <textarea 
                      className="reject-input"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}