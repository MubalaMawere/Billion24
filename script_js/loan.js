// BILLION24 Loan Page Script
document.addEventListener("DOMContentLoaded", function () {
    const loanAmountInput = document.getElementById("loanAmount");
    const loanTermSelect = document.getElementById("loanTerm");
    const occupationSelect = document.getElementById("occupation");
    const interestRateInput = document.getElementById("interestRate");
    const form = document.getElementById("loanApplicationForm");
  
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
  
    // Add repayment summary section dynamically if not in HTML
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
  
      // Get selected interest rate
      const interestRate = loanTermRates[loanTerm] || 0;
      const interest = (loanAmount * interestRate) / 100;
      const totalRepayment = loanAmount + interest;
  
      // Update UI
      interestRateInput.value = interestRate;
      displayAmount.textContent = loanAmount.toFixed(2);
      displayRate.textContent = interestRate;
      displayTotal.textContent = totalRepayment.toFixed(2);
    }
  
    loanAmountInput.addEventListener("input", updateRepaymentSummary);
    loanTermSelect.addEventListener("change", updateRepaymentSummary);
    
    // Google Sheets Integration
    const scriptURL = "https://script.google.com/macros/s/AKfycbxODRLvFqd5ihBkSSliRmwxOFb6B54O4YavS98vewj-qVHdIkmhVv57cAVyTWPbeyQ9RA/exec";
    
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      // Validation for students
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
        //occupation: occupation,
        //loanAmount: loanAmount,
        //loanTerm: loanTerm,
        interestRate: document.getElementById("interestRate").value,
        totalRepayment: document.getElementById("displayTotal").textContent,
        collateralType: document.getElementById("collateralType").value,
        collateralValue: document.getElementById("collateralValue").value,
        collateralDescription: document.getElementById("collateralDescription").value,
        loanPurpose: document.getElementById("loanPurpose").value,
      };

      e.target.querySelector("button[type='submit']").disabled = true;

      
      
      
        // WITH CORS MODE
      
     fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(() => {
          alert(
            " Loan application submitted successfully ✅!\n\nPlease bring your collateral item to BILLION24 office for verification and collection of your approved funds."
          );
          e.target.querySelector("button[type='submit']").disabled = false;

          form.reset();
          document.getElementById("displayAmount").textContent = "0";
          document.getElementById("displayRate").textContent = "0";
          document.getElementById("displayTotal").textContent = "0";
        })
        .catch((error) => {
          console.error("Error!", error);
          alert("❌ Network error — please check your connection and try again.");
          e.target.querySelector("button[type='submit']").disabled = false;
        });



        // WITHOUT CORS MODE
      
     /* fetch(scriptURL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then((response) => {
          alert(
            "Loan application submitted successfully ✅!\n\nPlease bring your collateral item to BILLION24 office for verification and collection of your approved funds."
          );
      
          form.reset();
          document.getElementById("displayAmount").textContent = "0";
          document.getElementById("displayRate").textContent = "0";
          document.getElementById("displayTotal").textContent = "0";
        })
        .catch((error) => {
          console.error("Error!", error);
          alert("❌ Network error — please try again.");
        });*/

    });
  });


 