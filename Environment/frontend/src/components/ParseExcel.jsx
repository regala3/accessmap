import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @brief A file upload component that parses .xlsx files and returns the extracted
 *        vendor data to the parent component
 * @param onParsed is a callback function that recieves an array in the
 *        format [{ name: string, email: string }, ...]
 * @returns a component for file input that uploads and parses Excel files.
 * @note Documentation and resources for navigating the xlsx library:
 *  docsheetjs : https://docs.sheetjs.com/docs/getting-started/examples/import
 *               https://docs.sheetjs.com/docs/solutions/input
 *               https://docs.sheetjs.com/docs/api/utilities/array
 *  React- Read & Parse Excel Sheets with SheetJs:
 *               https://www.youtube.com/watch?v=GUFzw4jo_E4
 * @note2 Currently have functionality for accepting CSVs as well, changed scope during
 *        implementation, may remove later.
 */
const ParseExcel = ({ onParsed }) => {
  const [rows, setRows] = useState([]); // [{name, email}]
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  // Handles error checking returns safe array of rows
  const toPairs = (input) => {
    // expect [name, email, ...]
    const output = [];
    for (const row of input) {
      if (!row){continue;}
      const name = String((row[0] ?? "")).trim();
      const email = String((row[1] ?? "")).trim();
      if (!name || !email) {continue;}         // name and email must be present
      if (!EMAIL_RE.test(email)) {continue;}   // reg ex email checking
      output.push({ name, email });
    }
    return output;
  };

  // Handles the file drop event from the drag-and-drop zone.
  // only accepts one file
  // if parsing succeeds:
  //  setRows is set and result is passed back up onParsed
  const onDrop = useCallback((acceptedFiles) => {
    setError("");
    const file = acceptedFiles?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];

        const matrix = XLSX.utils.sheet_to_json(sheet, {
          header: 1,  
          blankrows: false,
          defval: "",
          raw: false,
        });

        const cleaned = toPairs(matrix);

        if (cleaned.length === 0) {
          setRows([]);
          setError("No valid entries found.");
          return;
        }

        setRows(cleaned);
        onParsed?.(cleaned);
      } catch (err) {
        console.error(err);
        setError("Failed to parse file. Make sure it’s a valid CSV/XLSX.");
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onParsed]);
  
  //Configuration for useDropzone to manage drag and drop logic
  //Sets number/types of files accepted 
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
  });

  const preview = useMemo(() => rows.slice(0, 10), [rows]);

  let previewComponent;

    if(rows.length ===0 ){
        previewComponent = <p className="text-sm opacity-70">Upload a file to see a preview</p>
    }else {
        previewComponent = (
            <div className="overflow-auto max-h-80 rounded-md border">
            <table className="table table-sm">
              <thead className="bg-base-200 sticky top-0">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i} className="hover">
                    <td className="whitespace-nowrap">{r.name}</td>
                    <td className="whitespace-nowrap">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
    }


  const clear = () => {
    setRows([]);
    setFileName("");
    setError("");
  };

  // downloadable template for users
  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Vendor 1", "vendor1@example.com"],
      ["Vendor 2", "vendor2@example.com"],
      ["Vendor 3", "vendor3@example.com"],

    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exampleTemplate.xlsx");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Drag and drop/ select file */}
      <div
        {...getRootProps({
          className:
            "p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition bg-base-200 hover:bg-base-300",
        })}
      >
        <input {...getInputProps()} />
        <p className="font-medium">
          {isDragActive ? "Drop your file here…" : "Drag an XLSX here, or click to select"}
        </p>
        <ul className="text-left text-sm mt-3 space-y-1">
          <li><b>NOTE:</b></li>
          <li>- Remove header row</li>
          <li>- Column A = <b>Name</b></li>
          <li>- Column B = <b>Email</b></li>
          <li>- One row per stall</li>
          <li>Download the template below for referece</li>
        </ul>
        <div className="mt-3 flex justify-center gap-2">
          {fileName && (
            <button type="button" className="btn btn-sm btn-ghost" onClick={clear}>
              Clear
            </button>
          )}
        </div>
        {isDragReject && <p className="text-error mt-2">File type not accepted.</p>}
        {error && <p className="text-error mt-2">{error}</p>}
        {fileName && <p className="text-xs opacity-70 mt-2">Loaded: {fileName}</p>}
      </div>

      {/* RIGHT: preview */}
      <div className="p-4 border rounded-xl bg-base-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Preview</h3>
          <span className="text-xs opacity-70">
            Showing {Math.min(rows.length, 10)} of {rows.length} rows
          </span>
        </div>
        {previewComponent}
      </div>
          <div>
        <button type="button" className="btn btn-sm border border-base-content" onClick={downloadTemplate}>
            Download Template
        </button>
    </div>
    </div>

  );
};

export default ParseExcel;