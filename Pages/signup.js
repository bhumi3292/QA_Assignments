export class Signup {
    constructor(page) {
        this.page = page;

    //=========================================locators=====================
        this.getStartedBtn = page.locator('button').filter({ hasText: 'Get Started' }).first();
        this.termsandCondition_check = page.getByRole('checkbox');
        this.continueButton = page.getByRole('button', { name: 'Continue' });

        //========Account setup pages locators==============
        this.firstName = page.getByLabel('First Name');
        this.lastName = page.getByLabel('Last Name');
        this.email = page.getByLabel('Email Address');
        this.phoneNo = page.getByLabel('Phone Number');
        this.password = page.locator('input[name="password"]');
        this.ConfirmPassword = page.locator('input[name="confirmPassword"]');
        this.NextButton = page.getByText('Next', { exact: true });

        //==========OTP Verification===============
        this.otpInput = page.locator('input[autocomplete="one-time-code"]');
        this.verifyCodeBtn = page.getByRole('button', { name: 'Verify Code' });

        //===========Agency Detail Page Locators=================
        this.name = page.getByRole('textbox', { name: 'Name' });
        this.roleInAgency = page.getByRole('textbox', { name: 'Role in Agency' });
        this.agencyEmail = page.getByRole('textbox', { name: 'Email Address' });
        this.website = page.getByRole('textbox', { name: 'Website' });
        this.Address = page.getByLabel('Address', { exact: true });
        this.regionDropdown = page.locator('button').filter({ hasText: 'Select Your Region of Operation' });

        this.getRegionOption = (regionName) =>
            page.getByRole('option', { name: regionName })
                .or(page.getByRole('button', { name: regionName }))
                .or(page.getByText(regionName, { exact: true }))
                .filter({ visible: true });

        this.Next_Btn = page.getByRole('button', { name: 'Next' });

        //===================Experience and Performance Metrics==================================
        this.yearExperience = page.locator('button').filter({ hasText: 'Select Your Experience Level' });
        this.anualStudentyrecruit = page.getByPlaceholder('Enter an approximate number.');
        this.focusArea = page.getByPlaceholder('E.g., Undergraduate admissions to Canada.');
        this.successMatrix = page.getByPlaceholder('E.g., 90%');
        this.Next_Btn_Final = page.getByRole('button', { name: 'Next' });

        //============================Verification and Preference Locators========================================
        this.Registration_num = page.getByRole('textbox', { name: 'Business Registration Number' });
        this.Prefered_Country = page.getByRole('combobox', { name: 'Preferred Countries' });
        this.countrySearchInput = page.locator('input[placeholder="Search..."]');
        this.getInstituteCheckbox = (type) => page.getByLabel(type);
        this.Certificate_Details = page.getByRole('textbox', { name: 'Certification Details (Optional)' });

        this.fileInputs = page.locator('input[type="file"]');
        this.Submit_Btn = page.getByRole('button', { name: 'Submit' });
    }

    async goTo() {
        await this.page.goto("https://authorized-partner.vercel.app/");
    }

    async clickGetStarted() {
        await this.getStartedBtn.click();
    }

    async termsandCondition() {
        await this.termsandCondition_check.check();
    }

    async continue() {
        await this.continueButton.click();
    }

    async fillAccountDetails(fName, lName, emailAddress, phone, pass) {
        await this.firstName.fill(fName);
        await this.lastName.fill(lName);
        await this.email.fill(emailAddress);
        await this.phoneNo.fill(phone);
        await this.password.fill(pass);
        await this.ConfirmPassword.fill(pass);
    }

    async nextButton() {
        await this.NextButton.click();
    }

    async fillOTP(otpCode) {
        await this.otpInput.fill(otpCode);
    }

    async clickVerify() {
        await this.verifyCodeBtn.click();
    }

    async fillAgencyDetails(agencyName, role, aEmail, webUrl, addr, region) {
        await this.name.fill(agencyName);
        await this.roleInAgency.fill(role);
        await this.agencyEmail.fill(aEmail);
        await this.website.fill(webUrl);
        await this.Address.fill(addr);

        await this.regionDropdown.click();
        const targetOption = this.getRegionOption(region).first();
        await targetOption.waitFor({ state: 'attached', timeout: 5000 });
        await targetOption.click();
    }

    async clickAgencyNext() {
        await this.Next_Btn.click();
    }

    //=======Experience Metrics Fill===========
    async fillExperienceMetrics(expYears, studentCount, focus, metrics, servicesArray = []) {
        await this.yearExperience.click();
        const targetExpOption = this.getRegionOption(expYears).first();
        await targetExpOption.click();

        await this.anualStudentyrecruit.fill(studentCount);
        await this.focusArea.fill(focus);
        await this.successMatrix.fill(metrics);

        const allLabels = await this.page.locator('label').allTextContents();
        console.log("All labels on page:", allLabels);

        for (const service of servicesArray) {
            const checkboxLabel = this.page
                .locator('label')
                .filter({ hasText: service });

            const count = await checkboxLabel.count();
            console.log(`Label count for "${service}": ${count}`);

            if (count === 0) {
                console.warn(`WARNING: Label "${service}" not found — skipping`);
                continue;
            }

            await checkboxLabel.first().click({ force: true });
            await this.page.waitForTimeout(200);
        }

        await this.Next_Btn_Final.waitFor({ state: 'visible' });
        await this.Next_Btn_Final.click();
    }

    //================Last Page========================================
    async fillVerificationAndPreferences(regNum, country, instituteType, certDetails, filePath) {
        await this.Registration_num.fill(regNum);

        // --- Country dropdown ---
        await this.Prefered_Country.click();
        await this.countrySearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.countrySearchInput.fill(country);
        await this.page.waitForTimeout(300);

        const dropdownContainer = this.page.locator('div').filter({ has: this.countrySearchInput }).first();
        const countryItem = dropdownContainer
            .locator('div, li, span')
            .filter({ hasText: new RegExp(`^${country}$`) })
            .first();

        await countryItem.waitFor({ state: 'visible', timeout: 8000 });
        await countryItem.click();
        await this.page.keyboard.press('Escape');

        // --- Institute type checkbox ---
        await this.getInstituteCheckbox(instituteType).check();

        // --- Certification details ---
        await this.Certificate_Details.fill(certDetails);

        // --- File upload ---
        const fileInputCount = await this.fileInputs.count();
        console.log(`Found ${fileInputCount} file input(s)`);

        if (fileInputCount > 0) {
            await this.page.evaluate(() => {
                const inputs = document.querySelectorAll('input[type="file"]');
                inputs.forEach(input => {
                    input.style.display  = 'block';
                    input.style.opacity  = '1';
                    input.style.position = 'relative';
                    input.style.width    = '100px';
                    input.style.height   = '30px';
                });
            });

            // Upload to first slot
            await this.fileInputs.nth(0).setInputFiles(filePath);
            await this.page.waitForTimeout(500);

            // If a second upload slot exists, upload the same file there too
            if (fileInputCount > 1) {
                await this.fileInputs.nth(1).setInputFiles(filePath);
                await this.page.waitForTimeout(500);
            }
        } else {
            throw new Error("No file input elements found on the page.");
        }

        await this.page.waitForTimeout(1000);

        // --- Submit ---
        await this.Submit_Btn.waitFor({ state: 'visible', timeout: 10000 });
        await this.Submit_Btn.click();
    }
}