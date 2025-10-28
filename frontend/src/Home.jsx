import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
export default function Home() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkLogin, setCheckLogin] = useState(false);
  const [userFirstLetter, setUserFirstLetter] = useState("P");

  const handleLogin = () => {
    navigate("/login");
  };
  const handleProfile = () => {
    navigate("/login1");
  };
  const handleSignup = () => {
    navigate("/signup");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; background: #003366; padding: 1vh 2vw; color: #fff; position: relative; font-size: 20px; }
        .logo { margin: 0; font-size: clamp(1.2rem, 3vw, 1.5rem); }
        .menuIcon { display: none; cursor: pointer; z-index: 1001; }
        .nav { display: flex; gap: 5vw; }
        .nav a { color: #00d9ffff; text-decoration: none; transition: color 0.3s; }
        .nav a:hover { color: #ff6118; }
        .nav a:active { color: red; }
        .nav a:visited { color: lightgreen; }
        .loginBtn { background: #ffcc00; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold; border-radius: 4px; transition: background 0.3s; }
        .ProfileBtn { background: #9d9d9dff; display: flex; justify-content: center; align-items: center; border: none; border-radius: 50%; height: 30px; width: 30px; cursor: pointer; font-weight: bold; transition: background 0.3s; }
        .loginBtn:hover { background: #ffdb4d; }
        .hero { text-align: center; padding: clamp(40px, 10vw, 80px) 20px; background: #f2f6fc; }
        .hero h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); margin-bottom: 15px; }
        .hero p { font-size: clamp(1rem, 2vw, 1.2rem); margin-bottom: 10px; }
        .ctaBtn { margin-top: 20px; padding: 12px 24px; background: #003366; color: #fff; border: none; cursor: pointer; font-size: 16px; border-radius: 4px; transition: background 0.3s; }
        .ctaBtn:hover { background: #004d99; }
        .services { padding: 40px 20px; text-align: center; }
        .services h2 { font-size: clamp(1.5rem, 3vw, 2rem); margin-bottom: 20px; }
        .cardContainer { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; max-width: 1200px; margin-left: auto; margin-right: auto; }
        .card { background: #e6ecf5; padding: 20px; border-radius: 8px; font-weight: bold; transition: transform 0.3s, box-shadow 0.3s; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        .alerts { padding: 30px 20px; background: #fff3cd; }
        .alerts h2 { font-size: clamp(1.3rem, 3vw, 1.8rem); margin-bottom: 15px; }
        .alerts ul { max-width: 800px; margin: 0 auto; text-align: left; }
        .alerts li { margin: 10px 0; font-size: clamp(0.9rem, 2vw, 1rem); }
        .sidebar { position: fixed; top: 0; left: -100%; width: 70%; max-width: 300px; height: 100vh; background: #003366; z-index: 1000; transition: left 0.3s ease-in-out; padding: 20px; overflow-y: auto; }
        .sidebar.open { left: 0; }
        .sidebarHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .sidebarHeader h2 { color: #fff; margin: 0; }
        .closeIcon { cursor: pointer; color: #fff; }
        .sidebarNav { display: flex; flex-direction: column; gap: 20px; }
        .sidebarNav a { color: #00d9ffff; text-decoration: none; font-size: 1.2rem; padding: 10px; border-radius: 4px; transition: background 0.3s; }
        .sidebarNav a:hover { background: rgba(255, 255, 255, 0.1); color: #ff6118; }
        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0, 0, 0, 0.5); z-index: 9; display: none; }
        .overlay.open { display: block; }
        svg { color: rgba(255, 255, 255, 1); }
        @media (max-width: 750px) {
          .menuIcon { display: block; }
          .nav { display: none; }
          .header { padding: 15px 20px; }
          .cardContainer { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
        }
        @media (max-width: 480px) {
          .cardContainer { grid-template-columns: 1fr; }
          .loginBtn { padding: 8px 15px; font-size: 14px; }
        }
      `}</style>

      {/* Overlay */}
      <div className={`overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebarHeader">
            <h2>
            <svg
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-bank2"
                viewBox="0 0 16 16"
                >
                <path
                    d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1H.5z"
                    fill="#ffffffff"
                ></path>
                </svg>
                MyBank
            </h2>
          <svg 
            className="closeIcon" 
            onClick={closeSidebar}
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <nav className="sidebarNav">
          <a href="/" onClick={closeSidebar}>Home</a>
          <a href="#services" onClick={closeSidebar}>Services</a>
          <a href="/about" onClick={closeSidebar}>About Us</a>
          <a href="#contact" onClick={closeSidebar}>Contact</a>
        </nav>
      </div>

      {/* Header / Navbar */}
      <header className="header">
          { !isSidebarOpen &&
            <svg className="menuIcon" 
            onClick={toggleSidebar}
            width="30" 
            height="30" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        }
        <h2 className="logo">
             <svg
  width="16"
  height="16"
  fill="currentColor"
  class="bi bi-bank2"
  viewBox="0 0 16 16"
>
  <path
    d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1H.5z"
    fill="#ffffffff"
  ></path>
</svg>
            MyBank</h2>
        
        <nav className="nav">
          <a href="/">Home</a>
          <a href="#services">Services</a>
          <a href="/about">About Us</a>
          <a href="#contact">Contact</a>
        </nav>
        {
         !checkLogin &&
        <button className="loginBtn" onClick={handleLogin}>
          Login
        </button>
        }
        {
         checkLogin &&
        <div className="ProfileBtn" onClick={handleProfile}>
          {userFirstLetter}
        </div>
        }
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to MyBank</h1>
        <p>Your trusted partner in savings, loans, and digital banking</p>
        <p>New to our bank?</p>
        <button className="ctaBtn" onClick={handleSignup}>Register Yourself</button>
      </section>

      {/* Services */}
      <section id='services' className="services">
        <h2>Our Services</h2>
        <div className="cardContainer">
          <div className="card">💰 Savings & Current Accounts</div>
          <div className="card">🏡 Loans & Mortgages</div>
          <div className="card">📈 Investments & Mutual Funds</div>
          <div className="card">🎁 Offers & Rewards</div>
        </div>
      </section>

      {/* Announcements / Alerts */}
      <section className="alerts">
        <h2>Latest Updates</h2>
        <ul>
          <li>⚠️ Beware of phishing emails. MyBank never asks for OTP via call.</li>
          <li>📢 New Fixed Deposit scheme at 7.5% interest.</li>
          <li>💳 Apply for our Platinum Credit Card today!</li>
        </ul>
      </section>
      
      <Footer />
    </div>
  );
}