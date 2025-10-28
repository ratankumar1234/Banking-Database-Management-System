export default function Header(){
    return(
        <> 
            <style>{`
                .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #003366;
                padding: 10px 2vw;
                color: #fff;
                }
                
                .logo {
                margin: 0;
                }
                
                .nav {
                display: flex;
                gap: 7vw;
                }
                
                .nav a {
                color: #00d9ffff;
                text-decoration: none;
                }
                
                .nav a:hover {
                color: #ff6118;
                }
                
                nav a:active {
                color: red;
                }

                nav a:visited {
                color: lightgreen;
                }
                .loginBtn {
                background: #ffcc00;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
                font-weight: bold;
                }
                svg{
                    color: rgba(255, 255, 255, 1);
                }
            `}</style>
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
        </>
    )
}