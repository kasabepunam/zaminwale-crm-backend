import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Projects.css";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedVillage, setSelectedVillage] = useState("");

    const locations = {
        "Mahamumbai Phase 1": ["Vindhane","Jui", "Chirner", "Pirkon", "Sarade", "Punade","Vabheri","Khopta","Kalambusare"],
        "Mahamumbai Phase 2": ["Sangpalilere","Waredi","Sonkhar"],
        "Thane": ["Dive","Kevne"],
        "Palghar-Dahanu": [],
        "Panvel": ["Chauk Dharné"]
    };

    // ---------------------
    // Fetch all customers from backend
    // ---------------------
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/customers");
                setCustomers(res.data);
            } catch (err) {
                console.error("Error fetching customers:", err);
            }
        };
        fetchCustomers();
    }, []);

    // ---------------------
    // Example projects (can later be fetched from backend)
    // ---------------------
    useEffect(() => {
        setProjects([
            { id: 1, name: "Project A", client: "Client X", location: "Mahamumbai Phase 1", subLocation: "Vindhane", status: "Active" },
            { id: 2, name: "Project B", client: "Client Y", location: "Thane", subLocation: "Dive", status: "Pending" },
            { id: 3, name: "Project C", client: "Client Z", location: "Panvel", subLocation: "Chauk Dharné", status: "Completed" }
        ]);
    }, []);

    // ---------------------
    // Handle village selection
    // ---------------------
    const handleVillageClick = (village) => {
        setSelectedVillage(village);
        const filtered = customers.filter(c => c.village === village);
        setFilteredCustomers(filtered);
    };

    // ---------------------
    // Delete project
    // ---------------------
    const handleDeleteProject = (id) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <div className="projects-container">
            <h2>🗂 Projects</h2>

            {/* Location selection */}
            <div className="location-section">
                <h3>Select Location:</h3>
                {Object.keys(locations).map(loc => (
                    <button
                        key={loc}
                        className={selectedLocation === loc ? "active-location" : ""}
                        onClick={() => {
                            setSelectedLocation(loc);
                            setSelectedVillage("");
                        }}
                    >
                        {loc}
                    </button>
                ))}
            </div>

            {/* Villages */}
            {selectedLocation && locations[selectedLocation].length > 0 && (
                <div className="sublocation-section">
                    <h4>Villages in {selectedLocation}:</h4>
                    {locations[selectedLocation].map(v => (
                        <button
                            key={v}
                            className={selectedVillage === v ? "active-sublocation" : ""}
                            onClick={() => handleVillageClick(v)}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            )}

            {/* Customers Table */}
            {selectedVillage && (
                <div className="customers-in-village">
                    <h4>Customers in {selectedVillage}:</h4>
                    {filteredCustomers.length === 0 ? (
                        <p>No customers found in this village.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                <tr>
                                    <th>Customer ID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Plot Area</th>
                                    <th>Rate</th>
                                    <th>Total Amount</th>
                                    <th>Received Amount</th>
                                    <th>Balance Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredCustomers.map(c => (
                                    <tr key={c._id}>
                                        <td>{c.customerId}</td>
                                        <td>{c.name}</td>
                                        <td>{c.phone}</td>
                                        <td>{c.guntha}</td>
                                        <td>{c.rate}</td>
                                        <td>{c.totalAmount}</td>
                                        <td>{c.receivedAmount}</td>
                                        <td>{c.balanceAmount}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Projects List */}
            <div className="projects-list">
                <h3>Projects List</h3>
                {projects.length === 0 ? (
                    <p>No projects available.</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Client</th>
                                <th>Location</th>
                                <th>Sub-location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {projects.map(p => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{p.client}</td>
                                    <td>{p.location}</td>
                                    <td>{p.subLocation}</td>
                                    <td>{p.status}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDeleteProject(p.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;
