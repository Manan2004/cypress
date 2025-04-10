import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Map from "@components/Map";
import Button from "@components/Button";

import styles from "@styles/Home.module.scss";
import { useState, useCallback } from "react";

const DEFAULT_CENTER = [43.65229790812004, -79.3834161444346];
// Set a duplicate threshold in meters (e.g., 30 m)
const DUPLICATE_THRESHOLD = 30;

// Helper function to calculate distance in meters between two coordinates using the Haversine formula
function calculateDistance(coord1, coord2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const lat1 = toRad(coord1[0]);
  const lat2 = toRad(coord2[0]);
  const deltaLat = toRad(coord2[0] - coord1[0]);
  const deltaLng = toRad(coord2[1] - coord1[1]);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // Control for edit mode
  const [editForm, setEditForm] = useState(false);
  const [aPosition, setAPosition] = useState(null);
  const [description, setDescription] = useState('');
  // New state for category input when adding a marker
  const [category, setCategory] = useState('');
  const [counter, setCounter] = useState(1);
  // New state for filtering markers by category
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prevMode => !prevMode);

    if (isEditMode) {
      setDescription('');
      setAPosition(null);
      setEditForm(false);
      setCategory('');
    }
  }, [isEditMode]);

  const handleMapClick = useCallback((e) => {
    if (!isEditMode) return;

    const { lat, lng } = e.latlng;    
    setAPosition([lat, lng]);
    setEditForm(true);
  }, [isEditMode]);

  const handleChangeDescription = useCallback((e) => {
    setDescription(e.target.value);
  }, []);

  // New handler for category changes when adding a marker
  const handleChangeCategory = useCallback((e) => {
    setCategory(e.target.value);
  }, []);

  // Helper: Check if a marker at a similar position already exists.
  const isDuplicate = useCallback((newPosition) => {
    return markers.some(marker => {
      const distance = calculateDistance(marker.position, newPosition);
      return distance < DUPLICATE_THRESHOLD;
    });
  }, [markers]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!aPosition) return;

    // Check for duplicate marker
    if (isDuplicate(aPosition)) {
      alert("A similar marker already exists in this area.");
      // Optionally, you could add logic to merge details or update the existing marker
      return;
    }

    // Increment counter
    setCounter(prevCounter => prevCounter + 1);

    // Extend marker object to include category. If none is provided, store "uncategorized"
    const newMarker = {
      position: aPosition,
      id: `${Date.now()}`,
      description: description || "No description provided",
      category: category || "uncategorized"
    };

    setMarkers(currentMarkers => [
      ...currentMarkers,
      newMarker
    ]);

    // Reset the form
    setEditForm(false);
    setAPosition(null);
    setDescription("");
    setCategory("");
  }, [aPosition, description, category, isDuplicate]);

  const handleCancelDescription = useCallback(() => {
    setEditForm(false);
    setAPosition(null);
    setDescription("");
    setCategory("");
  }, []);

  // Handler for filtering markers by category
  const handleFilterChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  // Filter markers to show only those that match the selected category
  const displayedMarkers = selectedCategory === 'all'
    ? markers
    : markers.filter(marker => marker.category === selectedCategory);

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

          {/* Filter Dropdown for Categories */}
          <div style={{ marginBottom: "1em" }}>
            <label>
              Filter by Category:&nbsp;
              <select value={selectedCategory} onChange={handleFilterChange}>
                <option value="all">All</option>
                {/* Predefine some category options. You can modify or generate these as needed. */}
                <option value="pothole">Pothole</option>
                <option value="graffiti">Graffiti</option>
                <option value="streetlight">Streetlight</option>
                <option value="roadsigns">Road Signs</option>
                <option value="sidewalks">Sidewalks</option>
                <option value="dumping">Illegal dumping</option>
                <option value="uncategorized">Uncategorized</option>
              </select>
            </label>
          </div>

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

                  {displayedMarkers.map(marker => (
                    <ReactLeaflet.Marker key={marker.id} position={marker.position}>
                      <ReactLeaflet.Popup>
                        <strong>Description:</strong> <br />
                        {marker.description} <br />
                        <strong>Category:</strong> {marker.category} <br />
                        <strong>Position:</strong> <br />
                        Lat: {marker.position[0]}, <br /> 
                        Lng: {marker.position[1]}
                      </ReactLeaflet.Popup>
                    </ReactLeaflet.Marker>
                  ))}
                </>
              )}
            </Map>

            <Button
              className={`${styles.editButton} ${isEditMode ? styles.active : ''}`}
              onClick={toggleEditMode}
            >
              {isEditMode ? 'Cancel' : 'Add Marker'}
            </Button>

            {editForm && (
              <div className={styles.descriptionStuff1}>
                <div className={styles.descriptionStuff2}>
                  <h3>Add Marker Description:</h3>
                  <form onSubmit={handleSubmit}>
                    <textarea 
                      value={description}
                      onChange={handleChangeDescription}
                      placeholder="Enter description for this marker"
                      className={styles.descriptionStuff3}
                      rows={4}
                    />
                    {/* New field for selecting category */}
                    <div style={{ marginTop: "0.5em" }}>
                      <label>
                        Category:&nbsp;
                        <select value={category} onChange={handleChangeCategory}>
                          <option value="">Select Category</option>
                          <option value="pothole">Pothole</option>
                          <option value="graffiti">Graffiti</option>
                          <option value="streetlight">Streetlight</option>
                          <option value="roadsigns">Road Signs</option>
                          <option value="sidewalks">Sidewalks</option>
                          <option value="dumping">Illegal dumping</option>
                          <option value="uncategorized">Uncategorized</option>
                        </select>
                      </label>
                    </div>
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
            necessary details. Total number of reports: {counter}.
          </p>
        </Container>
      </Section>
    </Layout>
  );
}
