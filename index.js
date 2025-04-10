const fs = require('fs');

const csv = fs.readFileSync('./Electric_Vehicle_Population_Data.csv', 'utf8');

// Convert CSV to JSON
function csvToJson(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((acc, header, index) => {
            acc[header.trim()] = values[index]?.trim();
            return acc;
        }, {});
    });
}

const jsonData = csvToJson(csv);

// Step 1: Remove duplicates by VIN
const uniqueByVIN = [];
const seenVINs = new Set();

for (const item of jsonData) {
    const vin = item['VIN (1-10)'];
    if (!seenVINs.has(vin)) {
        seenVINs.add(vin);
        uniqueByVIN.push(item);
    }
}

// Step 2: Remove duplicates by DOL Vehicle ID
const uniqueByDOL = [];
const seenDOLs = new Set();

for (const item of uniqueByVIN) {
    const dolId = item['DOL Vehicle ID'];
    if (!seenDOLs.has(dolId)) {
        seenDOLs.add(dolId);
        uniqueByDOL.push(item);
    }
}

// Step 3: Clean up each item (remove fields + rename VIN)
const cleanedData = uniqueByDOL.map(item => {
    const {
        'Electric Vehicle Type': EVT,
        'Clean Alternative Fuel Vehicle (CAFV) Eligibility': CAFV,
        'Postal Code': Postal_Code,
        'Electric Range': Electric_Range,
        'Model Year': Model_Year,
        'DOL Vehicle ID': ______,
        'VIN (1-10)': vin,
        'Vehicle Location': _,
        'Electric Utility': __,
        '2020 Census Tract': ___,
        'Legislative District': ____,
        'Base MSRP': _____,
        ...rest
    } = item;

    return {
        VIN: vin,
        EVT: EVT,
        CAFV: CAFV,
        Postal_Code: Postal_Code,
        Electric_Range: Electric_Range,
        Model_Year: Model_Year,
        ...rest
    };
});

console.log(cleanedData);
