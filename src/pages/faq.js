import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";

import styles from "@styles/Faq.module.scss";

export default function Faq() {
  const faqs = [
    {
      question: "What is Cypress?",
      answer:
        "Cypress is a web application that allows Toronto citizens to report and track problems they notice on city streets. Users can pinpoint the location of issues on an interactive map, specify the type of problem, and submit reports to the City of Toronto with all necessary details.",
    },
    {
      question: "How do I report a problem?",
      answer:
        "To report a problem, navigate to the map on our homepage, click on the location where the issue is located, select the type of problem from the dropdown menu, add additional details as needed, and submit your report. You'll receive a confirmation once your report has been processed.",
    },
    {
      question: "What types of problems can I report?",
      answer:
        "You can report various city maintenance issues including potholes, damaged road signs, street light outages, graffiti, damaged sidewalks, illegal dumping, and other city infrastructure problems.",
    },
    {
      question: "Can I track the status of my report?",
      answer:
        "Yes, once you submit a report, you'll receive a unique tracking number. You can use this number on our website to track the status of your report and receive updates as the issue is addressed.",
    },
    {
      question: "Do I need to create an account to report a problem?",
      answer:
        "While you can submit anonymous reports, creating an account allows you to track all your submissions, receive updates, and manage your reports more efficiently.",
    },
    {
      question: "How accurate does my location reporting need to be?",
      answer:
        "Our system allows for arbitrary accuracy in pinpointing locations. The more precise you can be, the easier it will be for city workers to find and fix the problem. The map allows you to zoom in to street level for accurate placement.",
    },
    {
      question: "How are duplicate reports handled?",
      answer:
        "Our system automatically detects potential duplicate reports based on location proximity and issue type. When similar issues are reported in the same area, they may be merged to prevent redundant work while maintaining all relevant details.",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>FAQ - Cypress</title>
        <meta
          name="description"
          content="Frequently Asked Questions about the Cypress street reporting system"
        />
      </Head>

      <Section>
        <Container>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <h2 className={styles.faqQuestion}>{faq.question}</h2>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
