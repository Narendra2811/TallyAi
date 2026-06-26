# Product Thinking — TallyAI

---

# Understanding the Problem

## Who are the target users?

The main users are small and medium businesses that use Tally to manage their accounts. In many of these businesses, the owner depends on an accountant whenever they need financial information.

There are mainly two types of users:

### Business Owner

The owner wants quick answers to business questions but usually doesn't know where those reports are inside Tally. They ask questions like:

- How much did we sell last month?
- Which customers haven't paid yet?
- Why is profit lower this month?

Most of the time, they have to wait for the accountant to generate reports.

### Accountant / Finance Executive

The accountant knows Tally well but spends a lot of time opening reports, exporting Excel files, filtering data, and preparing answers for the owner. This process is repetitive and takes time away from actual accounting work.

In the future, the same product can also help Chartered Accountants who manage multiple companies.

---

## What problems are they facing today?

The data already exists inside Tally, but getting answers is slower than it should be.

For example, if the owner wants to know which customers have unpaid invoices, the usual workflow looks like this:

1. Open Tally
2. Find the correct report
3. Select the date range
4. Export the report
5. Open it in Excel
6. Filter or sort the data
7. Share the result

Even for a simple question, several manual steps are required.

Questions like **"Why did profit decrease compared to last month?"** are even harder because users often need to compare multiple reports manually.

---

## Why is the current workflow inefficient?

I found three main reasons.

### 1. Finding the right report is difficult

Tally has many reports, but users need to know exactly where the required information is stored. Business owners usually don't know this, so they depend on accountants.

### 2. Every question repeats the same work

Whenever someone asks a question, the accountant has to generate reports again, export them, clean the data, and explain the result. The same process happens every day.

### 3. Reports provide data, not answers

Tally gives users reports, but users still have to analyze them themselves. If someone asks why sales dropped or which customers generate the highest revenue, the answer isn't available directly.

---

# MVP Definition

The goal of the first version is simple: let users upload Tally exports and get business answers in seconds.

## Must-have Features

- Upload CSV or Excel files exported from Tally
- View uploaded data
- Search uploaded records
- Ask questions in natural language
- Support common business questions such as:
  - Total Sales
  - Top Customers
  - Top Products
  - Outstanding Invoices
  - Monthly Sales Trend
  - GST Payable
- Show charts wherever useful
- Show source rows used to generate every answer for transparency

---

## Nice-to-have Features

- User login and saved sessions
- Multiple file uploads
- Compare reports across different months
- Automatic detection of different Tally export formats
- Export answers as PDF

---

## Future Features

- Direct Tally integration without manual exports
- WhatsApp chatbot for business queries
- Weekly AI-generated business summary
- Multi-company dashboard for Chartered Accountants
- GST filing assistant
- Predictive insights such as expected cash flow and low-stock alerts

---

## Why this prioritization?

I would start with file uploads because every Tally user already knows how to export Excel or CSV files. This lets us validate the main idea without spending time building a direct Tally integration.

If users find value in asking questions and getting instant answers, then features like login, multiple companies, and live Tally sync can be added later.

---

# Discovery Questions

Before building the product, I would speak with business owners and accountants to understand their current workflow and biggest pain points.

1. Walk me through the last time you needed a financial number urgently. What did you do?
2. What business questions do you ask most often?
3. Which Tally reports do you export regularly, and why?
4. How long does it usually take from asking a question to getting the answer?
5. Who usually prepares these reports—the owner, accountant, or someone else?
6. Which part of the process is the most frustrating or time-consuming?
7. When you export data from Tally, do you need to clean or modify it before using it?
8. If an AI answered your question instantly, what would make you trust that answer?
9. Do you manage more than one company in Tally? If yes, how do you compare them today?
10. What financial information do you check most frequently (daily or weekly)?
11. If this product saved you 30–60 minutes every day, would you pay for it? What price would feel reasonable?
12. If this product could solve only one problem for you, what would you choose?

---

**Prepared by:** Narendra Patel  
**Product Engineer Assessment – 199 Developments**