import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Map from "@components/Map";
import Button from "@components/Button";

import styles from "@styles/Home.module.scss";
import { useState, useCallback } from "react";

const DEFAULT_CENTER = [43.65229790812004, -79.3834161444346];

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // Added a button to make it more cleaner
  const [editForm, setEditForm] = useState(false);
  const [aPosition, setAPosition] = useState(null);
  const [description, setDescription] = useState('');


  const toggleEditMode = useCallback(() => { // This is where we handle if the EditMode is on or off and if its on, we should reset everything for the user to input.
    setIsEditMode(prevMode => !prevMode);

    if (isEditMode) {
      setDescription('');
      setAPosition(null);
      setEditForm(false);
    }
  }, [isEditMode]);

  const handleMapClick = useCallback((e) => { // This is where we handle if the EditMode is on, then we show the description form.
    if (!isEditMode) return;
    
    const { lat, lng } = e.latlng;    
    setAPosition([lat, lng]);
    setEditForm(true);
  }, [isEditMode]);

  const handleChangeDescription = useCallback((e) => { // This is where we change the description to whatever the user inputted.
    setDescription(e.target.value);
  }, []);

  const handleSubmit = useCallback((e) => { // Once the user finishes inputting, we save/print their inputs and reset everything including shutting down the description form.
    e.preventDefault();
    
    if (!aPosition) return;
    
    setMarkers(currentMarkers => [
      ...currentMarkers,
      {
        position: aPosition,
        id: `marker-${Date.now()}`,
        description: description || "No description provided"
      }
    ]);
    
    // Reset the form
    setEditForm(false);
    setAPosition(null);
    setDescription("");
  }, [aPosition, description]);

  const handleCancelDescription = useCallback(() => { // Handles cancelation
    setEditForm(false);
    setAPosition(null);
    setDescription("");
  }, []);

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

          <div className={styles.mapContainer}>
            <Map
              className={styles.homeMap}
              width="800"
              height="400"
              center={DEFAULT_CENTER}
              zoom={12}
              onClick={handleMapClick}
            >
              {(ReactLeaflet, Leaflet) => (
                <>
                  <ReactLeaflet.TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  <ReactLeaflet.Marker position={DEFAULT_CENTER}>
                    <ReactLeaflet.Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </ReactLeaflet.Popup>
                  </ReactLeaflet.Marker>
                  
                  {/* Temporary Marker until a description is written */}
                  {aPosition && (
                    <ReactLeaflet.Marker position={aPosition}>
                      <ReactLeaflet.Popup>Adding description...</ReactLeaflet.Popup>
                    </ReactLeaflet.Marker>
                  )}

                  {markers.map(marker => (
                    <ReactLeaflet.Marker key={marker.id} position={marker.position}>
                      <ReactLeaflet.Popup>
                        <strong>Description:</strong> <br />
                        {marker.description} <br />
                        <strong>Position:</strong> <br />
                        Lat: {marker.position[0]}, <br /> 
                        Lng: {marker.position[1]}
                      </ReactLeaflet.Popup>
                    </ReactLeaflet.Marker>
                  ))}
                </>
              )}
            </Map>

            <Button // Using the prebuilt button
              className={`${styles.editButton} ${isEditMode ? styles.active : ''}`}
              onClick={toggleEditMode}
            >
              {isEditMode ? 'Cancel' : 'Add Marker'}
            </Button>
            
            {editForm && (
              <div className={styles.descriptionStuff1}>
                <div className={styles.descriptionStuff2}>
                  <h3>Add Marker Description</h3>
                  <form onSubmit={handleSubmit}>
                    <textarea 
                      value={description}
                      onChange={handleChangeDescription}
                      placeholder="Enter description for this marker"
                      className={styles.descriptionStuff3}
                      rows={4}
                    />
                    <div className={styles.formButtons}>
                      <Button type="submit">Save</Button>
                      <Button type="button" onClick={handleCancelDescription}>Cancel</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

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