import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Map from "@components/Map";
import Button from "@components/Button";

import styles from "@styles/Home.module.scss";
import { useState } from "react";

const DEFAULT_CENTER = [43.65229790812004, -79.3834161444346];

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [visibility, setVisibility] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Cypress</title>
        <meta
          name="description"
          content="A web application that allows Toronto citizens to report and track problems they notice on city streets."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <h1 className={styles.title}>Cypress</h1>

          <Map
            className={styles.homeMap}
            width="800"
            height="400"
            center={DEFAULT_CENTER}
            zoom={12}
          >
            {({ TileLayer, Marker, Popup }) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={DEFAULT_CENTER}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              </>
            )}
          </Map>
          <p className={styles.description}>
            Cypress is a web application that allows Toronto citizens to report
            and track problems they notice on city streets. Users can pinpoint
            the location of issues on an interactive map, specify the type of
            problem, and submit reports to the City of Toronto with all
            necessary details.
          </p>
        </Container>
      </Section>
    </Layout>
  );
}
