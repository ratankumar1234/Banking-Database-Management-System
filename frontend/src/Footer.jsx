import React from "react";

export default function Footer() {
  return (
    <div>
      <style>{`
        .support {
          padding: 40px 20px;
          background: #f9f9f9;
          text-align: center;
        }
        
        .footer {
          padding: 20px;
          background: #003366;
          color: #fff;
          text-align: center;
        }
        
        .footer a {
          color: #fff;
          text-decoration: none;
        }
      `}</style>
      {/* Customer Support */}
      <section className="support" id="contact">
        <h2>Need Help?</h2>
        <p>📞 Call us: +91 1800-123-4567 (24x7 Support)</p>
        <p>💬 Live Chat available in Net Banking</p>
        <p>📧 Email: support@mybank.com</p>
      </section>
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 MyBank. All Rights Reserved.</p>
        <p>
          <a href="/privacy">Privacy Policy</a> |{" "}
          <a href="/terms">Terms & Conditions</a>
        </p>
      </footer>
    </div>
  );
}