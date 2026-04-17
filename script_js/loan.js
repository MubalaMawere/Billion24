document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loanApplicationForm");

  const loanAmountInput = document.getElementById("loanAmount");
  const loanTermSelect = document.getElementById("loanTerm");
  const occupationSelect = document.getElementById("occupation");
  const interestRateInput = document.getElementById("interestRate");

  const displayAmount = document.getElementById("displayAmount");
  const displayRate = document.getElementById("displayRate");
  const displayTotal = document.getElementById("displayTotal");
  const displayDueDate = document.getElementById("displayDueDate");

  const studentFields = document.getElementById("studentFields");
  const employmentFields = document.getElementById("employmentFields");

  const studentIdInput = document.getElementById("studentId");
  const institutionInput = document.getElementById("institution");
  const employerInput = document.getElementById("employer");
  const positionInput = document.getElementById("position");
  const employmentYearsInput = document.getElementById("employmentYears");

  const billionModal = document.getElementById("billionModal");
  const modalCloseBtn = document.getElementById("closeModal");
  const modalTitleEl = billionModal ? billionModal.querySelector(".modal-title") : null;
  const modalMessageEl = billionModal ? billionModal.querySelector(".modal-message") : null;
  const modalMessageSmEl = billionModal ? billionModal.querySelector(".modal-message-sm") : null;

  const steps = document.querySelectorAll(".form-step");
  const prevStepBtn = document.getElementById("prevStepBtn");
  const nextStepBtn = document.getElementById("nextStepBtn");
  const submitStepBtn = document.getElementById("submitStepBtn");
  const wizardProgressFill = document.getElementById("wizardProgressFill");
  const wizardStepText = document.getElementById("wizardStepText");
  const wizardStepTitle = document.getElementById("wizardStepTitle");
  const wizardStepIcon = document.getElementById("wizardStepIcon");

  const stepTitles = {
    1: { title: "Personal Information", icon: "fas fa-user" },
    2: { title: "Occupation Details", icon: "fas fa-briefcase" },
    3: { title: "Loan Details", icon: "fas fa-money-bill-wave" },
    4: { title: "Collateral Information", icon: "fas fa-shield-alt" },
    5: { title: "Review & Submit", icon: "fas fa-check-circle" }
  };

  let currentStep = 1;
  const totalSteps = 5;

  const loanTermRates = {
    "1": 13,
    "2": 20,
    "3": 30,
    "4": 35
  };

  // IMPORTANT: replace this after deploying Apps Script
  const scriptURL = "https://script.google.com/macros/s/AKfycbzZQWK1ei1oxFyAgJAXpruHVgxyNL9-lafB5XhHxGliAZpAwPPqSgWE_sPWcEQUjqjK/exec";

  function formatDueDate(date) {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function updateRepaymentSummary() {
    const loanAmount = parseFloat(loanAmountInput.value);
    const loanTerm = loanTermSelect.value;

    if (!loanAmount || !loanTerm) {
      displayAmount.textContent = "0";
      displayRate.textContent = "0";
      displayTotal.textContent = "0";
      if (displayDueDate) displayDueDate.textContent = "Not set";
      interestRateInput.value = "";
      return;
    }

    const interestRate = loanTermRates[loanTerm] || 0;
    const interest = (loanAmount * interestRate) / 100;
    const totalRepayment = loanAmount + interest;

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + parseInt(loanTerm, 10) * 7);

    interestRateInput.value = interestRate;
    displayAmount.textContent = loanAmount.toFixed(2);
    displayRate.textContent = interestRate;
    displayTotal.textContent = totalRepayment.toFixed(2);

    if (displayDueDate) {
      displayDueDate.textContent = formatDueDate(dueDate);
    }
  }

  function clearFields(container) {
    if (!container) return;
    const fields = container.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      field.value = "";
      field.required = false;
    });
  }

  function showFields(container) {
    if (!container) return;
    container.classList.add("show-fields");
  }

  function hideFields(container) {
    if (!container) return;
    container.classList.remove("show-fields");
    clearFields(container);
  }

  function resetEmploymentPlaceholders() {
    if (employerInput) employerInput.placeholder = "";
    if (positionInput) positionInput.placeholder = "";
  }

  function updateOccupationFields() {
    const occupation = occupationSelect.value;

    hideFields(studentFields);
    hideFields(employmentFields);
    resetEmploymentPlaceholders();

    if (occupation === "student") {
      showFields(studentFields);
      if (studentIdInput) studentIdInput.required = true;
      if (institutionInput) institutionInput.required = true;
      return;
    }

    if (["teacher", "government", "private"].includes(occupation)) {
      showFields(employmentFields);
      if (employerInput) employerInput.required = true;
      if (positionInput) positionInput.required = true;
      if (employmentYearsInput) employmentYearsInput.required = true;
      return;
    }

    if (occupation === "business") {
      showFields(employmentFields);
      if (employerInput) {
        employerInput.required = true;
        employerInput.placeholder = "Business Name";
      }
      if (positionInput) {
        positionInput.required = true;
        positionInput.placeholder = "Your Role in the Business";
      }
      if (employmentYearsInput) employmentYearsInput.required = true;
      return;
    }

    if (occupation === "freelancer") {
      showFields(employmentFields);
      if (employerInput) {
        employerInput.required = true;
        employerInput.placeholder = "Client / Brand / Business Name";
      }
      if (positionInput) {
        positionInput.required = true;
        positionInput.placeholder = "Specialization";
      }
      if (employmentYearsInput) employmentYearsInput.required = true;
    }
  }

  function openModal(title, message, smallMsg) {
    if (!billionModal) return;
    if (modalTitleEl) modalTitleEl.textContent = title || "";
    if (modalMessageEl) modalMessageEl.textContent = message || "";
    if (modalMessageSmEl) modalMessageSmEl.textContent = smallMsg || "";
    billionModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!billionModal) return;
    billionModal.style.display = "none";
    document.body.style.overflow = "";
  }

  function updateWizardUI() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index + 1 === currentStep);
    });

    const progressPercent = (currentStep / totalSteps) * 100;
    wizardProgressFill.style.width = `${progressPercent}%`;
    wizardStepText.textContent = `Step ${currentStep} of ${totalSteps}`;
    wizardStepTitle.textContent = stepTitles[currentStep].title;
    wizardStepIcon.innerHTML = `<i class="${stepTitles[currentStep].icon}"></i>`;

    prevStepBtn.style.display = currentStep === 1 ? "none" : "inline-flex";
    nextStepBtn.style.display = currentStep === totalSteps ? "none" : "inline-flex";
    submitStepBtn.style.display = currentStep === totalSteps ? "inline-flex" : "none";

    if (currentStep === 5) {
      populateReview();
    }
  }

  function validateStep(stepNumber) {
    const activeStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (!activeStep) return true;

    const requiredFields = activeStep.querySelectorAll("[required]");
    for (let field of requiredFields) {
      if (!field.value || !field.value.toString().trim()) {
        field.focus();
        return false;
      }
    }

    if (stepNumber === 3) {
      const occupation = occupationSelect.value;
      const loanAmount = parseFloat(loanAmountInput.value);

      if (occupation === "student" && loanAmount > 3000) {
        alert("As a student, the maximum loan you can acquire is K3,000. Visit BILLION24 for more information.");
        return false;
      }
    }

    return true;
  }

  function setReviewValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value && value.toString().trim() ? value : "—";
  }

  function populateReview() {
    setReviewValue("reviewFullName", document.getElementById("fullName").value);
    setReviewValue("reviewIdNumber", document.getElementById("idNumber").value);
    setReviewValue("reviewPhone", document.getElementById("phone").value);
    setReviewValue("reviewEmail", document.getElementById("email").value);
    setReviewValue("reviewOccupation", occupationSelect.value);
    setReviewValue("reviewStudentId", studentIdInput ? studentIdInput.value : "");
    setReviewValue("reviewInstitution", institutionInput ? institutionInput.value : "");
    setReviewValue("reviewEmployer", employerInput ? employerInput.value : "");
    setReviewValue("reviewPosition", positionInput ? positionInput.value : "");
    setReviewValue("reviewEmploymentYears", employmentYearsInput ? employmentYearsInput.value : "");
    setReviewValue("reviewLoanAmount", "K" + (document.getElementById("loanAmount").value || ""));
    setReviewValue("reviewLoanTerm", (document.getElementById("loanTerm").value || "") + " weeks");
    setReviewValue("reviewInterestRate", (document.getElementById("interestRate").value || "") + "%");
    setReviewValue("reviewTotalRepayment", "K" + (displayTotal.textContent || ""));
    setReviewValue("reviewDueDate", displayDueDate ? displayDueDate.textContent : "");
    setReviewValue("reviewCollateralType", document.getElementById("collateralType").value);
    setReviewValue("reviewCollateralValue", "K" + (document.getElementById("collateralValue").value || ""));
    setReviewValue("reviewCollateralDescription", document.getElementById("collateralDescription").value);
    setReviewValue("reviewLoanPurpose", document.getElementById("loanPurpose").value);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (billionModal) {
    billionModal.addEventListener("click", function (e) {
      if (e.target === billionModal) {
        closeModal();
      }
    });
  }

  nextStepBtn.addEventListener("click", function () {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      currentStep++;
      updateWizardUI();
    }
  });

  prevStepBtn.addEventListener("click", function () {
    if (currentStep > 1) {
      currentStep--;
      updateWizardUI();
    }
  });

  loanAmountInput.addEventListener("input", updateRepaymentSummary);
  loanTermSelect.addEventListener("change", updateRepaymentSummary);
  occupationSelect.addEventListener("change", updateOccupationFields);

  updateRepaymentSummary();
  updateOccupationFields();
  updateWizardUI();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    const formData = {
      fullName: document.getElementById("fullName").value,
      idNumber: document.getElementById("idNumber").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      occupation: occupationSelect.value,

      studentId: studentIdInput ? studentIdInput.value : "",
      institution: institutionInput ? institutionInput.value : "",
      employer: employerInput ? employerInput.value : "",
      position: positionInput ? positionInput.value : "",
      employmentYears: employmentYearsInput ? employmentYearsInput.value : "",

      loanAmount: document.getElementById("loanAmount").value,
      loanTerm: document.getElementById("loanTerm").value,
      interestRate: document.getElementById("interestRate").value,
      totalRepayment: displayTotal.textContent,
      dueDate: displayDueDate ? displayDueDate.textContent : "",

      collateralType: document.getElementById("collateralType").value,
      collateralValue: document.getElementById("collateralValue").value,
      collateralDescription: document.getElementById("collateralDescription").value,
      loanPurpose: document.getElementById("loanPurpose").value,
    };

   // Activate premium loading state
submitStepBtn.disabled = true;
submitStepBtn.classList.add("loading");
submitStepBtn.innerHTML = `
  <span class="loader"></span>
  Processing Application...
`;

fetch(scriptURL, {
  method: "POST",
  mode: "no-cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
})
.then(() => {
  // Small delay for smooth UX (feels intentional)
  setTimeout(() => {
    openModal(
      "Application Submitted",
      "Please bring your collateral item to the BILLION24 office for verification and collection of funds.",
      "Thank you for choosing BILLION24."
    );

    form.reset();
    displayAmount.textContent = "0";
    displayRate.textContent = "0";
    displayTotal.textContent = "0";
    if (displayDueDate) displayDueDate.textContent = "Not set";
    interestRateInput.value = "";

    updateOccupationFields();
    currentStep = 1;
    updateWizardUI();

    // Reset button
    submitStepBtn.disabled = false;
    submitStepBtn.classList.remove("loading");
    submitStepBtn.innerHTML = "Submit Application";
  }, 800);
})
.catch((error) => {
  console.error("Error:", error);
  alert("❌ Network error — please try again.");

  submitStepBtn.disabled = false;
  submitStepBtn.classList.remove("loading");
  submitStepBtn.innerHTML = "Submit Application";
});
  });
});