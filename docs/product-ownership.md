# Product Ownership

# What I'd Focus on After the First 100 Companies

If 100 companies start using this product, I don't think my biggest challenge will be scaling the infrastructure. At this stage, my main goal would be to understand how people actually use the product.

Some assumptions I made while building the MVP will be right, and some will be wrong. The first 100 users will help me understand what needs to improve before adding more features.

---

# Problems I'd Expect First

## 1. Different Tally export formats

I expect this to be one of the first real problems.

Even if two companies use Tally Prime, their exported files may look different. Some may use **Party Name**, while others use **Customer Name**. Date formats, amount columns, and additional custom fields can also vary.

If the application maps these columns incorrectly, every answer after that becomes unreliable.

### What I'd do

Instead of trying to guess everything automatically, I'd ask the user to confirm a few important columns during upload.

For example:

> "We detected this as the Customer Name column. Is that correct?"

It's a small step, but it prevents many problems later.

---

## 2. Building trust in AI answers

Even if the answer is correct, users will still want to know where it came from.

If someone asks:

> "What is my GST payable?"

they will probably want to verify the calculation before acting on it.

### What I'd do

Every answer should include:

- Source records
- Related transactions
- Supporting tables

The goal isn't just to answer questions. It's to help users trust the answer.

---

## 3. Making the first upload easier

I think many users won't even reach the AI part if uploading data feels confusing.

Some users may not know:

- Which report to export
- Whether to choose CSV or Excel
- Which date range to select

### What I'd do

I'd add:

- A short "How to Export from Tally" guide
- Screenshots
- A sample file users can try before uploading their own data

If the first experience is smooth, users are much more likely to come back.

---

## 4. Performance on larger files

Some businesses may upload files with thousands of transactions.

I don't want the system to process the entire file every time someone asks a question.

### What I'd do

Process the uploaded file only once.

Store the searchable information in ChromaDB so future questions only search the relevant records instead of reading the complete file again.

This keeps responses fast even as the dataset grows.

---

## 5. Understanding real user behaviour

One thing I've learned while building software is that users rarely use a product exactly the way we expect.

Some features we think are important may never be used, while simple features might become everyone's favourite.

That's why I'd spend time understanding:

- What questions users ask most often
- Where they get stuck
- Which answers they don't trust
- Which tasks they repeat every day

That feedback would decide what I build next.

---

# My Top 5 Priorities

## 1. Improve data mapping

Everything depends on correct data.

If the uploaded file isn't understood correctly, every answer becomes unreliable.

This would be my first priority.

---

## 2. Make AI answers more trustworthy

I'd spend more time making answers explainable than adding new AI features.

Showing source records, calculations, and supporting tables will help users trust the product.

---

## 3. Save users from repeating work

Right now, users upload a file and ask questions.

The next improvement would be allowing them to upload once and continue working with the same data later.

That means adding login, saved sessions, and workspaces.

---

## 4. Learn before building

Instead of deciding the roadmap myself, I'd look at:

- Most common questions
- User feedback
- Failed searches
- Support requests

I'd rather build features based on real usage than assumptions.

---

## 5. Remove manual work

Once people find value in the product, I'd focus on removing the manual export step.

Direct Tally integration would make the experience much smoother, but I'd only build it after validating that users actually need it.

---

# How I'd Measure Success

Rather than looking only at technical metrics, I'd also measure whether the product is actually helping people.

I'd track things like:

- How many users successfully upload a file
- How long it takes to get the first answer
- Whether users return after their first session
- Which questions are asked most often
- How often users verify answers using the source records

These metrics would help me understand whether the product is creating real value.

---

# Bonus — Getting the First 50 Paying Customers

If I had no marketing budget, I'd focus on people who already work closely with Tally users.

### Chartered Accountants

A Chartered Accountant usually works with many businesses.

If the product genuinely saves them time, one CA can introduce it to several clients.

---

### Tally Partners and Resellers

Tally partners already have trusted relationships with business owners.

A simple referral program could help reach users without spending money on advertising.

---

### Practical Demo Videos

Instead of talking about AI, I'd show real business problems being solved.

For example:

- "Who hasn't paid me yet?"
- "Which products sold the most last month?"
- "Show my monthly sales trend."

Short demo videos on LinkedIn, YouTube, or WhatsApp would help users understand the value quickly because they can see the product solving real problems.

---

# Final Thoughts

For me, the first 100 customers are not about proving that the technology works.

They are about understanding whether the product fits naturally into someone's daily work.

If users trust the answers, keep coming back, and start depending on the product, then I know I'm solving a real problem. After that, scaling the product and adding more features becomes much easier.

---

**Prepared by:** Narendra Patel
**Product Engineer Assessment – 199 Developments**
