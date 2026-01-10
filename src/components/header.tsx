import { useState } from "react";
import logoImage from "../assets/images/logo.png";
import "./styles/header.css";

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  isAdmin?: boolean;
}

export default function Header({
  isLoggedIn = false,
  userName = "",
  isAdmin = false,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <img
            src={logoImage}
            alt="경북소프트웨어마이스터고등학교"
            className="logo-image"
          />
        </div>

        <button
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-label="메뉴"
          type="button"
        >
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
        </button>

        <nav className={`nav-section ${isMenuOpen ? "active" : ""}`}>
          <button className="login-button" type="button">
            {isLoggedIn && userName ? (
              <>
                {isAdmin && <span className="admin-badge">관리자</span>}
                {userName} 님
              </>
            ) : (
              "로그인"
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
