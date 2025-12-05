// BILLION24 Loan Page Script
document.addEventListener("DOMContentLoaded", function () {
  const loanAmountInput = document.getElementById("loanAmount");
  const loanTermSelect = document.getElementById("loanTerm");
  const occupationSelect = document.getElementById("occupation");
  const interestRateInput = document.getElementById("interestRate");
  const form = document.getElementById("loanApplicationForm");

  // Modal elements (actual IDs/classes from your HTML)
  const billionModal = document.getElementById("billionModal");
  const modalCloseBtn = document.getElementById("closeModal");
  const modalTitleEl = billionModal.querySelector(".modal-title");
  const modalMessageEl = billionModal.querySelector(".modal-message");
  const modalMessageSmEl = billionModal.querySelector(".modal-message-sm");

  // Close modal handler
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function () {
      billionModal.style.display = "none";
    });
  }

  // Helper to open modal with text
  function openModal(title, message, smallMsg) {
    if (!billionModal) return;
    if (modalTitleEl) modalTitleEl.textContent = title || "Success";
    if (modalMessageEl) modalMessageEl.textContent = message || "";
    if (modalMessageSmEl) modalMessageSmEl.textContent = smallMsg || "";
    // show modal (use flex so content centers nicely)
    billionModal.style.display = "flex";
  }

  // Repayment summary display elements
  const displayAmount = document.getElementById("displayAmount");
  const displayRate = document.getElementById("displayRate");
  const displayTotal = document.getElementById("displayTotal");

  // BILLION24 interest rates
  const interestRates = {
    "1week": 13,
    "2weeks": 20,
    "3weeks": 30,
    "4weeks": 35,
  };

  // Map loanTerm (weeks) to rates — adjust when you add week-based dropdown
  const loanTermRates = {
    "1": 13,
    "2": 20,
    "3": 30,
    "4": 35,
  };

  // Add repayment summary section dynamically if not in HTML (keeps your existing behavior)
  let repaymentDiv = document.getElementById("repaymentSummary");
  if (!repaymentDiv) {
    repaymentDiv = document.createElement("div");
    repaymentDiv.id = "repaymentSummary";
    repaymentDiv.classList.add("repayment-summary");
    repaymentDiv.innerHTML = `
      <h4>Repayment Summary</h4>
      <p><strong>Loan Amount:</strong> K<span id="displayAmount">0</span></p>
      <p><strong>Interest Rate:</strong> <span id="displayRate">0</span>%</p>
      <p><strong>Total Repayment:</strong> K<span id="displayTotal">0</span></p>
    `;
    const loanSection = loanTermSelect.closest(".loan-form");
    loanTermSelect.parentNode.insertAdjacentElement("afterend", repaymentDiv);
  }

  // Update repayment info when loan details change
  function updateRepaymentSummary() {
    const loanAmount = parseFloat(loanAmountInput.value);
    const loanTerm = loanTermSelect.value;

    if (!loanAmount || !loanTerm) return;

    const interestRate = loanTermRates[loanTerm] || 0;
    const interest = (loanAmount * interestRate) / 100;
    const totalRepayment = loanAmount + interest;

    interestRateInput.value = interestRate;
    displayAmount.textContent = loanAmount.toFixed(2);
    displayRate.textContent = interestRate;
    displayTotal.textContent = totalRepayment.toFixed(2);
  }

  loanAmountInput.addEventListener("input", updateRepaymentSummary);
  loanTermSelect.addEventListener("change", updateRepaymentSummary);

  // Google Sheets Integration
  const scriptURL = "https://script.google.com/macros/s/AKfycbxYllcwq06cQIzSA1EMi8FbuDmmeKqwyBNTZAWrwVsKT29nQOAS0YtgNmKsy369DmvJHw/exec";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const occupation = occupationSelect.value;
    const loanAmount = parseFloat(loanAmountInput.value);
    const loanTerm = loanTermSelect.value;

    if (!loanAmount || !loanTerm) {
      alert("Please fill in all loan details.");
      return;
    }

    if (occupation === "student" && loanAmount > 3000) {
      alert("As a student, the maximum loan you can acquire is K3,000. Visit BILLION24 for more information.");
      return;
    }

    const formData = {
      fullName: document.getElementById("fullName").value,
      idNumber: document.getElementById("idNumber").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      occupation: document.getElementById("occupation").value,
      loanAmount: document.getElementById("loanAmount").value,
      loanTerm: document.getElementById("loanTerm").value,
      interestRate: document.getElementById("interestRate").value,
      totalRepayment: document.getElementById("displayTotal").textContent,
      collateralType: document.getElementById("collateralType").value,
      collateralValue: document.getElementById("collateralValue").value,
      collateralDescription: document.getElementById("collateralDescription").value,
      loanPurpose: document.getElementById("loanPurpose").value,
    };

    // disable submit button
    const submitBtn = e.target.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    // Send to Google Apps Script (sheet logging)
    // NOTE: mode: "no-cors" keeps this working with simple script deployments
    fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => {
        // Show success modal (use actual modal element)
        openModal(
          "Loan Application Submitted Successfully",
          "Your loan application has been received. Please bring your collateral item to the BILLION24 office for verification and collection of your approved funds.",
          "Thank you for choosing BILLION24!"
        );

        // Fire-and-forget: send confirmation email via separate Apps Script (replace URL)
        try {
          fetch("YOUR_EMAIL_APPS_SCRIPT_URL_HERE", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName: formData.fullName,
              email: formData.email,
              loanAmount: formData.loanAmount,
              totalRepayment: formData.totalRepayment,
              loanTerm: formData.loanTerm
            })
          }).catch((err) => {
            // log but do not interrupt UX
            console.warn("Email send (fire-and-forget) failed:", err);
          });
        } catch (err) {
          console.warn("Email send error:", err);
        }

        // Re-enable button & reset UI
        if (submitBtn) submitBtn.disabled = false;
        form.reset();
        if (displayAmount) displayAmount.textContent = "0";
        if (displayRate) displayRate.textContent = "0";
        if (displayTotal) displayTotal.textContent = "0";
      })
      .catch((error) => {
        console.error("Fetch to Apps Script failed:", error);
        // This catch happens only on network failure (not when using no-cors)
        alert("❌ Network error — please check your connection and try again.");
        if (submitBtn) submitBtn.disabled = false;
      });
  });
});
