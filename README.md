# QA_Assignments

End-to-end automated test for the Authorized Partner signup flow, written in Playwright with Mailosaur handling OTP email interception.

---

## How to Run the Script

**Step 1 — Install dependencies**
```bash
npm install
```

**Step 2 — Set up your environment variables**

Create a `.env` file in the project root:
```
MAILOSAUR_API_KEY=your_api_key_here
MAILOSAUR_SERVER_ID=your_server_id_here
```

**Step 3 — Run the test**
```bash
npx playwright test
```

**Step 4 — View the HTML report**
```bash
npx playwright show-report
```

---

## Environment / Setup

| Item                 | Detail |
|----------------------|--------|
| Language             | JavaScript (ES Modules) |
| Framework            | Playwright Test (`@playwright/test`) |
| Playwright Version   | `^1.61.0` |
| Node.js              | v18 or higher recommended |
| Extra Packages       | `mailosaur`, `dotenv` |
| Browser Drivers      | Downloaded automatically by Playwright on install |

---

## Project Structure

```
├── Pages/
│   └── signup.js                 # Page Object for the signup flow
├── Tests/
│   └── signup.spec.js            # Main test
├── Utils/
│   └── signupPageTestData.js     # Random test data generators
├── Files/
│   └── Document.txt              # Sample file used for upload step
├── .env                          # API keys — not committed to source control
└── playwright.config.js
```

---

## Test Data / Accounts

- All test data is randomly generated on each run inside `Utils/signupPageTestData.js` — first name, last name, email, password, and phone number are all unique per execution
- Emails follow the format `tester_<timestamp>.<SERVER_ID>@mailosaur.net` so Mailosaur can intercept them automatically
- The OTP is retrieved programmatically — no manual input needed at any step
- Sensitive values like API keys go in `.env` — never commit that file to GitHub
- No shared or reused test accounts; every run registers a fresh one

---

## Notes

- Test timeout is set to 120 seconds to give the OTP email enough time to arrive
- If the email does not arrive within 30 seconds, the test throws a clear error message
- File upload in the last step uses `Files/Document.txt` — make sure that file exists before running