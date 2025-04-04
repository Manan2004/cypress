import Link from "next/link";
import { FaGithub, FaQuestionCircle } from "react-icons/fa";

import Container from "@components/Container";

import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">Cypress</Link>
        </p>
        <ul className={styles.headerLinks}>
          <li>
            <Link href="/faq" className={styles.navLink}>
              <FaQuestionCircle />
              <span className={styles.linkText}>FAQ</span>
            </Link>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
