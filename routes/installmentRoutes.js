import React, { useEffect, useState, useContext } from "react";
import { CustomerContext } from "../context/CustomerContext";
import CustomerViewModal from "./CustomerViewModal";
import "../styles/Customers.css";

const Installments = () => {
    const { fetchInstallments, deleteCustomer } = useContext(CustomerContext);

    const [installments, setInstallments] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const data = await fetchInstallments(); // fetch API from CustomerContext
            setInstallments(data);
        };
        getData();
    }, []);

    const openModal = customer => {
        setSelectedCustomer(customer);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCustomer(null);
        setModalOpen(false);
    };

    return (
        <div className="customers-container">
            <h2>Installments</h2>
            <table className="customers-table">
                <thead>
                <tr>
                    <th>Customer ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Installment No</th>
                    <th>Installment Amount</th>
                    <th>Received</th>
                    <th>Balance</th>
                    <th>Payment Date</th>
                    <th>Next Due Date</th>
                    <th>Remark</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {installments.map(inst => (
                    <tr key={inst._id + inst.installmentNo}>
                        <td>{inst.customerId}</td>
                        <td>{inst.name}</td>
                        <td>{typeof inst.phone === "object" ? inst.phone.$numberLong : inst.phone}</td>
                        <td>{inst.installmentNo}</td>
                        <td>{inst.installmentAmount}</td>
                        <td style={{ color: "green" }}>{inst.receivedAmount}</td>
                        <td style={{ color: "red" }}>{inst.balanceAmount}</td>
                        <td>{inst.paymentDate}</td>
                        <td>{inst.nextDueDate}</td>
                        <td>{inst.remark}</td>
                        <td>
                            <button className="view-btn" onClick={() => openModal(inst)}>View</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {modalOpen && selectedCustomer && (
                <CustomerViewModal customer={selectedCustomer} onClose={closeModal} />
            )}
        </div>
    );
};

export default Installments;
