import Container from "@components/Container";

import styles from "./Footer.module.scss";

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      <Container className={`${styles.footerContainer} ${styles.footerLegal}`}>
        <p>&copy; Cypress, By Group 39, {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

export default Footer;
