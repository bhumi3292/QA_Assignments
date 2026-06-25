import { test, expect } from "@playwright/test";
import { Signup } from "../Pages/signup";
import {getRandomFirstName,getRandomLastName,generateTestEmail,generateNewPassword,getRandomPhoneNumber} from "../Utils/signupPageTestData";
import Mailosaur from "mailosaur";
import dotenv from "dotenv";
dotenv.config();

test("Signup page", async ({ page }) => {
    test.setTimeout(120000);

    const signupPage = new Signup(page);

    const firstNameData = getRandomFirstName();
    const lastNameData  = getRandomLastName();
    const emailData     = generateTestEmail();
    const passwordData  = generateNewPassword();
    const phoneData     = getRandomPhoneNumber();

    //==================Navigation==========================
    await signupPage.goTo();
    await signupPage.clickGetStarted();
    await signupPage.termsandCondition();
    await signupPage.continue();

    //==================Account Details=====================
    await signupPage.fillAccountDetails(firstNameData, lastNameData, emailData, phoneData, passwordData);
    await signupPage.nextButton();

    //==============OTP=====================================
    await page.waitForSelector('input[autocomplete="one-time-code"]', {
        state: 'attached',
        timeout: 15000
    });

    const mailosaur = new Mailosaur(process.env.MAILOSAUR_API_KEY);
    let otpCode;

    try {
        const email = await mailosaur.messages.get(
            process.env.MAILOSAUR_SERVER_ID,
            { sentTo: emailData },
            { timeout: 30000 }
        );

        if (email.codes && email.codes.length > 0) {
            otpCode = email.codes[0].value;
            console.log(`OTP retrieved: ${otpCode}`);
        } else {
            const bodyText = email.text?.body ?? "";
            const match = bodyText.match(/\b\d{6}\b/);
            if (match) {
                otpCode = match[0];
                console.log(`OTP extracted from body: ${otpCode}`);
            }
        }
    } catch (error) {
        throw new Error(`Could not retrieve OTP: ${error.message}`);
    }

    if (!otpCode) throw new Error("OTP was not found in the email.");

    await signupPage.fillOTP(otpCode);
    await signupPage.clickVerify();

    //==================Agency Details======================
    await signupPage.Address.waitFor({ state: 'attached', timeout: 15000 });

    await signupPage.fillAgencyDetails(
        `${lastNameData} Tech Solutions`,
        "Manager",
        `agency.${emailData}`,
        "www.google.com",
        "Kathmandu, Nepal",
        "Australia"
    );

    await signupPage.clickAgencyNext();

    //==================Experience & Metrics================
    await signupPage.yearExperience.waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(500);

    await signupPage.fillExperienceMetrics(
        "1 year",
        "150",
        "Information Technology",
        "90",
        ["Career Counseling", "Admission Applications", "Visa Processing", "Test Prepration"]
    );

    //==================Verification & Preferences==========
    await signupPage.Registration_num.waitFor({ state: 'visible', timeout: 15000 });

    await signupPage.fillVerificationAndPreferences(
        "REG-2024-NP-001",
        "Australia",
        "Universities",      
        "ISO 9001 Certified",
        "Files/Document.txt" 
    );

    //==================Assertion=====================
    await expect(page).toHaveURL(/.*admin\/profile/, { timeout: 30000 });
    await expect(page.getByText('Registration completed!')).toBeVisible({ timeout: 30000 });
});