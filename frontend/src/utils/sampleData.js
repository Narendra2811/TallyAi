/**
 * Sample sales data that looks like a real Tally Prime sales register export.
 * Used when someone clicks "Use sample data" so they can try the product
 * without having a Tally export file handy.
 *
 * Based on a fictional electrical goods distributor in Ahmedabad.
 */

export const SAMPLE_CSV_TEXT = `Date,Voucher No,Party Name,Item,Qty,Rate,Amount,GST%,GST Amount,Total,Status
01-Apr-2024,SI-001,Mehta Traders,LED Bulbs (Pack 10),50,1200,60000,18,10800,70800,Paid
03-Apr-2024,SI-002,Shah Enterprises,Electric Cables,100,850,85000,18,15300,100300,Paid
07-Apr-2024,SI-003,Patel Electricals,MCB Switches,200,450,90000,18,16200,106200,Unpaid
10-Apr-2024,SI-004,Mehta Traders,LED Panels,30,2500,75000,18,13500,88500,Paid
15-Apr-2024,SI-005,Gupta & Sons,Wire Connectors,500,120,60000,18,10800,70800,Unpaid
18-Apr-2024,SI-006,Desai Corp,LED Bulbs (Pack 10),80,1200,96000,18,17280,113280,Paid
22-Apr-2024,SI-007,Shah Enterprises,MCB Switches,150,450,67500,18,12150,79650,Paid
25-Apr-2024,SI-008,Joshi Brothers,Electric Cables,60,850,51000,18,9180,60180,Unpaid
01-May-2024,SI-009,Mehta Traders,LED Panels,45,2500,112500,18,20250,132750,Paid
05-May-2024,SI-010,Patel Electricals,LED Bulbs (Pack 10),70,1200,84000,18,15120,99120,Paid
10-May-2024,SI-011,Gupta & Sons,Wire Connectors,300,120,36000,18,6480,42480,Paid
15-May-2024,SI-012,Desai Corp,Electric Cables,90,850,76500,18,13770,90270,Unpaid
20-May-2024,SI-013,Shah Enterprises,LED Panels,25,2500,62500,18,11250,73750,Paid
25-May-2024,SI-014,Joshi Brothers,MCB Switches,120,450,54000,18,9720,63720,Paid
01-Jun-2024,SI-015,Mehta Traders,LED Bulbs (Pack 10),100,1200,120000,18,21600,141600,Unpaid
05-Jun-2024,SI-016,Patel Electricals,Electric Cables,80,850,68000,18,12240,80240,Paid
12-Jun-2024,SI-017,Gupta & Sons,LED Panels,40,2500,100000,18,18000,118000,Paid
18-Jun-2024,SI-018,Desai Corp,MCB Switches,200,450,90000,18,16200,106200,Paid
22-Jun-2024,SI-019,Shah Enterprises,Wire Connectors,400,120,48000,18,8640,56640,Unpaid
28-Jun-2024,SI-020,Joshi Brothers,LED Bulbs (Pack 10),60,1200,72000,18,12960,84960,Paid`;

export const SAMPLE_FILENAME = "Sample_Sales_Apr-Jun_2024.csv";

/** Parse the sample CSV text into an array of row objects */
export function parseSampleData() {
  const lines = SAMPLE_CSV_TEXT.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = vals[i] ?? "";
    });
    return row;
  });
}
