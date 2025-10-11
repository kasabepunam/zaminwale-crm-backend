import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

function ExcelImport({ onImportSuccess }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select an Excel file.");

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            try {
                const res = await axios.post("http://localhost:5000/api/customers/bulk", jsonData);
                alert(`✅ ${res.data.insertedCount} customers imported successfully!`);
                onImportSuccess(); // refresh customer list
            } catch (error) {
                console.error("Import error:", error);
                alert("❌ Failed to import Excel file.");
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div>
            <h3>📥 Import Customers from Excel</h3>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload & Import</button>
        </div>
    );
}

export default ExcelImport;
